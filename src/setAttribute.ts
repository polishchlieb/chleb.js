function setAttribute($node: HTMLElement, name: string, value: any) {
    if (name === 'className') name = 'class';
    $node.setAttribute(name, value);
}

export default setAttribute;