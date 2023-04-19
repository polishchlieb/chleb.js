import renderNode, { updateFunctionalComponent } from './renderNode';

// TODO: Clean up the arguments
function diff(
  $oldNode,
  old_vNode,
  new_vNode,
  $parent,
  unmountedParent = false
) {
  if (!$oldNode && new_vNode)
    return $parent.appendChild(renderNode(new_vNode));

  if (!new_vNode) {
    if (!unmountedParent) $parent.removeChild($oldNode);

    if (old_vNode.component) {
      const { component } = old_vNode;
      delete component.vPrevious;
      delete component.$base;
      delete component.$parent;
    } else if (typeof old_vNode === 'object') {
      for (const i in old_vNode.children)
        diff(
          $oldNode.childNodes[i],
          old_vNode.children[i],
          null,
          $oldNode,
          true
        );
    }
    return;
  }

  if (typeof old_vNode !== typeof new_vNode) {
    const $newNode = renderNode(new_vNode);
    $parent.replaceChild($newNode, $oldNode);
    return $newNode;
  }

  // assume that old_vNode is also type of string here
  if (typeof new_vNode === 'string') {
    if (old_vNode !== new_vNode) $oldNode.nodeValue = new_vNode;
    return $oldNode;
  }

  if (new_vNode.type !== old_vNode.type) {
    const $newNode = renderNode(new_vNode);
    $parent.replaceChild($newNode, $oldNode);
    return $newNode;
  }

  if (typeof new_vNode.type === 'function') {
    const { component } = old_vNode;
    new_vNode.component = component;

    updateFunctionalComponent(
      component, new_vNode
    );
  }

  const attributes = Object.assign(
    {},
    old_vNode.attributes,
    new_vNode.attributes
  );
  for (const attribute in attributes) {
    if (attribute.startsWith('on') && new_vNode.attributes[attribute] !== old_vNode.attributes[attribute]) {
      $oldNode.removeEventListener(
        attribute.substring(2),
        old_vNode.attributes[attribute]
      );
      $oldNode.addEventListener(
        attribute.substring(2),
        new_vNode.attributes[attribute]
      );
      continue;
    }

    if (attribute === 'ref')
      continue;

    const newValue = new_vNode.attributes[attribute];
    const oldValue = old_vNode.attributes[attribute];
    if (attribute === 'style') {
      let changed = false;
      const data = {};

      for (const key in newValue)
        if (newValue[key] !== oldValue[key]) {
          data[key] = newValue[key];
          if (!changed) changed = true;
        }

      if (changed) Object.assign($oldNode.style, data);
      continue;
    }

    if (newValue !== oldValue)
      $oldNode.setAttribute(attribute, newValue);
  }

  for (const i in new_vNode.children) {
    diff(
      $oldNode.childNodes[i],
      old_vNode.children[i],
      new_vNode.children[i],
      $oldNode
    );
  }

  return $oldNode;
}

export default diff;