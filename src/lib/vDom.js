const renderNode = (vNode) => {
	if (typeof vNode === 'string') return document.createTextNode(vNode);

	let $el;
	const { node, attributes, children, events, style } = vNode;

	if (typeof node === 'string') {
		$el = document.createElement(node);

		for (let key in attributes)
			$el.setAttribute(key, attributes[key]);
	} else if (typeof node === 'function') {
    	const component = new node(attributes);

		Object.keys(component.data).forEach(key => {
			Object.defineProperty(component, key, {
				get() {
					return component.data[key];
				},
				set(value) {
					component.data[key] = value;
					renderComponent(component);
				}
			});
		});

		$el = renderNode(component.render(component.props, component.state));
		component.base = $el;
	}

	(events || []).forEach(event => $el.addEventListener(event.name, event.callback));
	(children || []).forEach(child => $el.appendChild(renderNode(child)));

	for(let key in style || {})
		$el.style[key] = style[key];

	return $el;
}

export const renderComponent = (component) => {
	let rendered = component.render(component.props, component.state);
	component.base = diff(component.base, rendered);
}

export const diff = ($node, vNode, parent) => {
  	if ($node) {
    	if (typeof vNode === 'string') {
			$node.nodeValue = vNode;
			return $node;
    	}
    	if (typeof vNode.node === 'function') {
			const component = new vNode.node(vNode.attributes);
			const rendered = component.render(component.props, component.state);

			diff($node, rendered);
			return $node;
    	}

		// Naive check for number of chilren of vNode and dom
		if (vNode.children.length !== $node.childNodes.length)
			$node.appendChild(
				// render only the last child
				renderNode(vNode.children[vNode.children.length - 1])
			);

    	// run diffing for children
		$node.childNodes.forEach((child, i) => diff(child, vNode.children[i]));

		let { attributes, style } = vNode;
		for (let key in attributes)
			$node.setAttribute(key, attributes[key]);

		for(let key in style || {})
			$node.style[key] = style[key];

    	return $node;
  	} else {
		const newDom = renderNode(vNode);
		parent.appendChild(newDom);
		return newDom;
  	}
}