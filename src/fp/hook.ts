import { LifecycleHooks, UploaderInstance } from './interface';

type CreateHookResult = (hook: () => any) => void;

export const injectHook = (
  type: LifecycleHooks,
  hook: Function & { __wrapperHook?: Function },
  target: UploaderInstance
): void => {
  const hooks = target[type] || (target[type] = []);

  const wrapperHook =
    hook.__wrapperHook ||
    (hook.__wrapperHook = (...args: unknown[]): unknown => {
      const res = hook(args);
      return res;
    });

  hooks.push(wrapperHook);
};

export const createHook = (
  type: LifecycleHooks,
  target: UploaderInstance
): CreateHookResult => {
  return (hook): void => {
    injectHook(type, hook, target);
  };
};

export const invokeHooks = (fns: Function[], arg?: any): void => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
