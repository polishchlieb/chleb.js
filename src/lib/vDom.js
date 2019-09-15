const renderNode = (vnode) => {
	if (typeof vnode === 'string') return document.createTextNode(vnode);

	let el;
	const { node, attributes, children, events, style } = vnode;

	if (typeof node === 'string') {
		el = document.createElement(node);

		for (let key in attributes)
			el.setAttribute(key, attributes[key]);
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

		el = renderNode(component.render(component.props, component.state));
		component.base = el;
	}

	// console.log(events);
	(events || []).forEach(event => el.addEventListener(event.name, event.callback));

	// recursively do this to all of its children
	(children || []).forEach(child => el.appendChild(renderNode(child)));

	for(let key in style || {})
		el.style[key] = style[key];

	return el;
}

export const renderComponent = (component) => {
	let rendered = component.render(component.props, component.state);
	component.base = diff(component.base, rendered);
}

export const diff = (dom, vnode, parent) => {
  	if (dom) {
    	if (typeof vnode === 'string') {
			dom.nodeValue = vnode;
			return dom;
    	}
    	if (typeof vnode.node === 'function') {
			const component = new vnode.node(vnode.attributes);
			const rendered = component.render(component.props, component.state);

			diff(dom, rendered);
			return dom;
    	}

		// Naive check for number of chilren of vNode and dom
		if (vnode.children.length !== dom.childNodes.length)
			dom.appendChild(
				// render only the last child
				renderNode(vnode.children[vnode.children.length - 1])
			);

    	// run diffing for children
		dom.childNodes.forEach((child, i) => diff(child, vnode.children[i]));

		let { attributes, style } = vnode;
		for (let key in attributes)
			dom.setAttribute(key, attributes[key]);

		for(let key in style || {})
			dom.style[key] = style[key];

    	return dom;
  	} else {
		const newDom = renderNode(vnode);
		parent.appendChild(newDom);
		return newDom;
  	}
}