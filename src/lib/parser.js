export default class Parser {
    parser = new DOMParser();
    
    // constructor(components) {
    //     this.components = components;
    // }

    parse(string) {
        let { children } = this.parser.parseFromString(string, 'text/html').body;
        if(children.length != 1)
            throw new Error('There should be only one parent element');

        const [ parent ] = children;
        
        return this.parseNode(parent);
    }

    parseNode(parent) {
        let node = parent.nodeName.toLowerCase();
        // if(Object.keys(this.components).includes(node))
        
        let attributes = {};
        let events = [];
        let children = [];

        for (let attr of parent.attributes) {
            let { nodeName, nodeValue } = attr;

            if(nodeName.startsWith('on'))
                events.push({ name: nodeName.substring(2), callback: eval(nodeValue) });
            attributes[nodeName] = nodeValue;
        }

        if (parent.children.length > 0 )
            for (let child of parent.children)
                children.push(parseNode(child));
        else if (parent.innerText)
            children.push(parent.innerText);

        return {
            node,
            attributes,
            events,
            children: []
        };
    }
}