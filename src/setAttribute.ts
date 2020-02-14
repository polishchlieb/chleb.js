function setAttribute($node: HTMLElement, name: string, value: any) {
    if (name === 'className') name = 'class';
    else if (name === 'style') return Object.assign($node.style, value);
    $node.setAttribute(name, value);
}

export default setAttribute;