import renderNode from './renderNode';
import setAttribute from './setAttribute';
import VNodeObject from './VNode';

function diff(
    $oldNode: HTMLElement,
    old_vNode: VNodeObject | string,
    new_vNode: VNodeObject | string,
    $parent: HTMLElement
): HTMLElement | Text {
    if (!$oldNode && new_vNode)
        return $parent.appendChild(renderNode(new_vNode));

    if (!new_vNode) {
        $parent.removeChild($oldNode);
        return;
    }

    if (typeof old_vNode !== typeof new_vNode) {
        const $newNode = renderNode(new_vNode);
        $parent.replaceChild($newNode, $oldNode);
        return $newNode;
    }

    // assume that old_vNode is also type of string here
    if (typeof new_vNode === 'string') {
        if (old_vNode !== new_vNode)
            $oldNode.nodeValue = new_vNode;
        return $oldNode;
    }

    // previous condition returns, so we can have some kind of assumption
    old_vNode = old_vNode as VNodeObject;

    if (new_vNode.type !== old_vNode.type) {
        const $newNode = renderNode(new_vNode);
        $parent.replaceChild($newNode, $oldNode);
        return $newNode;
    }

    if (typeof new_vNode.type === 'function') {
        new_vNode.component = old_vNode.component;
        const { component } = new_vNode;
        component.props = new_vNode.attributes;
        const rendered = component.render();
        return diff($oldNode, component.vPrevious, rendered, $parent);
    }

    const attributes = Object.assign({}, old_vNode.attributes, new_vNode.attributes);
    for (const attribute in attributes) {
        if ((attribute[0] === 'o' && attribute[1] === 'n') || attribute === 'ref')
            continue;

        const newValue = new_vNode.attributes[attribute];
        const oldValue = old_vNode.attributes[attribute];
        if (attribute === 'style') {
            let changed = false;
            const data = {};

            for (const key in newValue)
                if (newValue[key] !== oldValue[key]) {
                    data[key] = newValue[key];
                    if (!changed)
                        changed = true;
                }

            if (changed)
                Object.assign($oldNode.style, data);
            continue;
        }
        
        if (newValue !== oldValue)
            setAttribute($oldNode, attribute, newValue);
    }

    for (const i in new_vNode.children) {
        diff(
            <HTMLElement>$oldNode.childNodes[i],
            old_vNode.children[i],
            new_vNode.children[i],
            $oldNode
        );
    }

    return $oldNode;
}

export default diff;