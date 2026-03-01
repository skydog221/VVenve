import { wrap, Wrapper } from "nine";
import { WrappedVariable } from "src/components/target/VariableTarget";

export type ScratchValue = VM.ScratchCompatibleValue | VM.ScratchList;
export function wrapVariable(scratchVariable: VM.Variable): Wrapper<WrappedVariable> {
    const wrapper = wrap<ScratchValue>(scratchVariable.value);
    Object.defineProperty(scratchVariable, "value", {
        configurable: true,
        set(newValue) {
            wrapper.set(newValue);
        },
        get() {
            return wrapper.get();
        },
    });
    return wrap({
        name: scratchVariable.name,
        value: wrapper,
        isList: scratchVariable.type === "list"
    });
}