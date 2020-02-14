import Component from './Component';

interface VNodeObject {
    type: string | typeof Component;
    attributes: Object;
    children: (VNodeObject | string)[];
    component?: Component;
}

export default VNodeObject;