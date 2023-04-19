import { componentInfo } from './hooks';

function useState(defaultValue) {
  if (componentInfo.firstRender) {
    const hook = { type: 'state', value: defaultValue };

    const { update } = componentInfo; // need to dereference
    hook.callback = (value) => {
      hook.value = value;
      update();
    }

    componentInfo.hooks.push(hook);
    return [hook.value, hook.callback];
  } else {
    const hook = componentInfo.hooks[componentInfo.hook];
    componentInfo.hook++;

    return [hook.value, hook.callback];
  }
}

export default useState;