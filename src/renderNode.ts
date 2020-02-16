import setAttribute from './setAttribute';
import VNodeObject from './VNode';
import Component from './Component';

function renderNode(
    vNode: VNodeObject | string,
    component?: Component
): HTMLElement | Text {
    if (typeof vNode === 'string')
        return document.createTextNode(vNode);

    if (typeof vNode.type === 'function') {
        const instance = new vNode.type();
        instance.props = vNode.attributes;
        const rendered = instance.render();
        vNode.component = instance;
        instance.vPrevious = rendered;
        const $node = renderNode(rendered, instance);
        instance.$base = <HTMLElement>$node;
        const timer = setInterval(() => {
            if ($node.parentNode) {
                instance.mounted();
                instance.$parent = <HTMLElement>$node.parentNode;
                clearInterval(timer);
            }
        });
        return $node;
    }

    const $node = document.createElement(vNode.type);
    const { children, attributes } = vNode;

    for (const attribute in attributes) {
        if (attribute[0] === 'o' && attribute[1] === 'n')
            component && $node.addEventListener(
                attribute.substring(2),
                attributes[attribute].bind(component)
            );
        else if (attribute === 'ref')
            attributes[attribute].current = $node;
        else if (attribute === 'style')
            Object.assign($node.style, attributes[attribute]);
        else
            setAttribute($node, attribute, attributes[attribute]);
    }
    
    for (const child of children)
        $node.appendChild(renderNode(child, component));

    return $node;
}

export default renderNode;