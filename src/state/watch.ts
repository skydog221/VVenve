import { wrap, Wrapper } from "nine";
import { WrappedVariable } from "src/components/target/VariableTarget";

export const watchings = wrap<Wrapper<WrappedVariable>[]>([]);

export function removeWatching(data: Wrapper<WrappedVariable>) {
    watchings.set(watchings.get().filter(e => e !== data));
}
export function addWatching(data: Wrapper<WrappedVariable>) {
    watchings.get().push(data);
    data.get().value.event.subcribe(console.log);
}
export function isWatching(data: Wrapper<WrappedVariable>) {
    return watchings.get().includes(data);
}
export function toggleWatching(data: Wrapper<WrappedVariable>) {
    if (isWatching(data)) {
        removeWatching(data);
    } else {
        addWatching(data);
    }
}