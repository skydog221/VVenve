import { wrap, Wrapper } from "nine";
import { patchArray } from "src/state/patch/array";

export interface WrappedVM {
    targets: WrappedTarget[];
}
export interface WrappedTarget {
    name: string;
    variables: WrappedVariable[];
    isStage: boolean;
}
export type ScratchValue = VM.ScratchCompatibleValue | VM.ScratchList;
export interface WrappedVariable {
    name: string;
    value: ScratchValue;
    isList: boolean
}

export function wrapVM(scratchVM: VM): Wrapper<WrappedVM> {
    const cast = (scratchTargets: VM.Target[]) => {
        wrappedVM.get().targets = scratchTargets.map((scratchTarget: VM.Target): WrappedTarget => {
            const wrappedTarget: WrappedTarget = {
                name: scratchTarget.getName(),
                variables: Object.values(scratchTarget.variables).map((scratchVariable: VM.Variable): WrappedVariable => {
                    const wrappedVariable: WrappedVariable = {
                        name: scratchVariable.name,
                        value: scratchVariable.value,
                        isList: scratchVariable.type === "list"
                    };
                    Object.defineProperty(scratchVariable, "value", {
                        configurable: true,
                        set(newValue) {
                            wrappedVariable.value = newValue;
                        },
                        get() {
                            return wrappedVariable.value;
                        },
                    });
                    Object.defineProperty(scratchVariable, "name", {
                        configurable: true,
                        set(newValue) {
                            wrappedVariable.name = newValue;
                            wrappedVM.updateOnly();
                        },
                        get() {
                            return wrappedVariable.name;
                        },
                    });
                    return wrappedVariable;
                }),
                isStage: scratchTarget.isStage
            };
            scratchTarget.variables = new Proxy(scratchTarget.variables, {
                set(target, p, newValue, receiver) {
                    const orig = Reflect.get(target, p, receiver);
                    if (orig) {
                        wrappedTarget.variables = wrappedTarget.variables.filter(e => e !== orig);
                    }
                    wrappedTarget.variables.push(newValue);
                    wrappedVM.updateOnly();
                    return Reflect.set(target, p, newValue, receiver);
                },
                deleteProperty(target, p) {
                    const orig = Reflect.get(target, p);
                    if (orig) {
                        wrappedTarget.variables = wrappedTarget.variables.filter(e => e !== orig);
                        wrappedVM.updateOnly();
                    }
                    return Reflect.deleteProperty(target, p);
                },
            });
            return wrappedTarget;
        });
    };
    const wrappedVM = wrap<WrappedVM>({
        targets: []
    });
    cast(scratchVM.runtime.targets);
    const { hooks, patched } = patchArray(scratchVM.runtime, "targets");
    scratchVM.runtime = patched;
    hooks.updated.subcribe(cast);
    return wrappedVM;
}