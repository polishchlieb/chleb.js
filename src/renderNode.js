import { componentInfo } from './hooks';
import diff from './diff';

export function updateFunctionalComponent(component, vNode) {
  componentInfo.firstRender = false;
  componentInfo.hooks = component.hooks;
  componentInfo.hook = 0;
  componentInfo.update = updateFunctionalComponent.bind(null, component, vNode);

  component.$base = diff(
    component.$base,
    component.vPrevious,
    component.vPrevious = vNode.type(vNode.attributes),
    component.$parent
  );
}

function renderNode(vNode) {
  if (typeof vNode === 'string')
    return document.createTextNode(vNode);

  if (typeof vNode.type === 'function') {
    const component = {
      hooks: []
    };
    vNode.component = component;

    componentInfo.firstRender = true;
    componentInfo.hooks = component.hooks;
    componentInfo.hook = 0;
    componentInfo.update = updateFunctionalComponent.bind(null, component, vNode);

    const rendered = vNode.type(vNode.attributes);
    component.vPrevious = rendered;

    const $node = renderNode(rendered);
    component.$base = $node;

    const timer = setInterval(() => {
      if ($node.parentNode) {
        component.$parent = $node.parentNode;
        clearInterval(timer);
      }
    });

    return $node;
  }

  const $node = document.createElement(vNode.type);
  const { children, attributes } = vNode;

  for (const attribute in attributes) {
    if (attribute.startsWith('on')) {
      $node.addEventListener(
        attribute.substring(2),
        attributes[attribute]
      );
    } else if (attribute === 'ref') {
      attributes[attribute].current = $node;
    } else if (attribute === 'style') {
      Object.assign($node.style, attributes[attribute]);
    } else {
      $node.setAttribute(attribute, attributes[attribute]);
    }
  }
  
  for (const child of children)
    $node.appendChild(renderNode(child));

  return $node;
}

export default renderNode;