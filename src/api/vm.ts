import { wrap, Wrapper } from "nine";
import { wrapVariable } from "./variable";
import { WrappedTarget } from "src/components/target/SpriteTarget";
import { wrapTarget } from "./target";
import { patchArray } from "src/state/patch/array";

export interface WrappedVM {
    targets: Wrapper<WrappedTarget>[];
}
export function wrapVM(scratchVM: VM): Wrapper<WrappedVM> {
    const cast = (targets: VM.Target[]): Wrapper<WrappedTarget>[] => targets.map(wrapTarget);
    const wrapper = wrap<WrappedVM>({
        targets: cast(scratchVM.runtime.targets)
    });
    const { hooks, patched } = patchArray(scratchVM.runtime, "targets");
    scratchVM.runtime = patched;
    hooks.updated.subcribe(newTargets => wrapper.get().targets = cast(newTargets));
    return wrapper;
}