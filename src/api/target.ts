import { wrap } from "nine";
import { WrappedTarget } from "src/components/target/SpriteTarget";
import { wrapVariable } from "./variable";

export function wrapTarget(scratchTarget: VM.Target) {
    const wrapper = wrap<WrappedTarget>({
        name: scratchTarget.getName(),
        variables: Object.values(scratchTarget.variables).map(v => wrapVariable(v)),
        isStage: scratchTarget.isStage
    });
    scratchTarget.variables = new Proxy(scratchTarget.variables, {
        set(target, p, newValue, receiver) {
            const orig = Reflect.get(target, p, receiver);
            if (orig) {
                wrapper.get().variables = wrapper.get().variables.filter(e => e !== orig);
            }
            wrapper.get().variables.push(newValue);
            return Reflect.set(target, p, newValue, receiver);
        },
        deleteProperty(target, p) {
            const orig = Reflect.get(target, p);
            if (orig) {
                wrapper.get().variables = wrapper.get().variables.filter(e => e !== orig);
            }
            return Reflect.deleteProperty(target, p);
        },
    });
    return wrapper;
}