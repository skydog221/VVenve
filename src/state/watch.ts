import { wrap } from "nine";
import { WrappedVariable } from "src/api/vm";

export const watchings = wrap<WrappedVariable[]>([]);

export function removeWatching(data: WrappedVariable) {
    watchings.set(watchings.get().filter(e => e !== data));
}
export function addWatching(data: WrappedVariable) {
    watchings.get().push(data);
}
export function isWatching(data: WrappedVariable) {
    return watchings.get().includes(data);
}
export function toggleWatching(data: WrappedVariable) {
    if (isWatching(data)) {
        removeWatching(data);
    } else {
        addWatching(data);
    }
}