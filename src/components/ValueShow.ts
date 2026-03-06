import { Wrapper, createComponent, styleSet, sync, tree, typed } from "nine";
import { ScratchValue } from "src/api/vm";
import { wrappedVM } from "src/state/vm";

const toDisplayText = (value: ScratchValue) => {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    return String(value ?? "");
};

const parseInput = (raw: string, current: ScratchValue, isList: boolean) => {
    if (isList || Array.isArray(current)) {
        if (raw.trim().length === 0) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw) as unknown;
            if (Array.isArray(parsed)) {
                return parsed as ScratchValue;
            }
        } catch {
            // ignore
        }
        return raw.split(",").map((item) => item.trim());
    }
    if (typeof current === "number") {
        const num = Number(raw);
        return Number.isNaN(num) ? raw : num;
    }
    if (typeof current === "boolean") {
        return raw.toLowerCase() === "true";
    }
    return raw;
};

export default createComponent({
    props: {
        value: {
            transform: typed<Wrapper<ScratchValue>>()
        },
        target: {
            transform: String
        },
        name: {
            transform: String
        },
        locked: {
            transform: typed<Wrapper<boolean>>()
        },
        isList: {
            transform: typed<Wrapper<boolean>>()
        }
    },
    styles: [
        styleSet(".txt")
            .maxWidth("40vw")
            .maxHeight("30vh")
            .overflowY("auto")
            .padding("5px")
            .borderRadius("5px")
            .border("2px solid gray")
            .wordBreak("break-all")
            .outline("none"),
        styleSet(".txt:disabled")
            .opacity("0.7")
            .cursor("not-allowed")
    ]
}, ({ value, target, name, locked, isList }) => {
    const valueRef = value.get();
    const getCurrentValue = () => {
        if (valueRef && typeof (valueRef as Wrapper<ScratchValue>).get === "function") {
            return (valueRef as Wrapper<ScratchValue>).get();
        }
        return valueRef as unknown as ScratchValue;
    };
    const display = sync(() => toDisplayText(getCurrentValue() ?? ""), [valueRef]);
    const lockedRef = locked.get();
    const isListRef = isList.get();
    const getLockedValue = () => {
        if (lockedRef && typeof (lockedRef as Wrapper<boolean>).get === "function") {
            return (lockedRef as Wrapper<boolean>).get();
        }
        return Boolean(lockedRef);
    };
    const getIsListValue = () => {
        if (isListRef && typeof (isListRef as Wrapper<boolean>).get === "function") {
            return (isListRef as Wrapper<boolean>).get();
        }
        return Boolean(isListRef);
    };

    return tree("input")
        .class("txt")
        .type("text")
        .value(display)
        .disabled(sync(() => getLockedValue(), [lockedRef]))
        .on("input", (event) => {
            if (getLockedValue()) return;
            if (!valueRef) return;
            const currentTarget = target.get();
            const currentName = name.get();
            if (!currentTarget || !currentName) return;
            const raw = (event.target as HTMLInputElement).value;
            const parsed = parseInput(raw, getCurrentValue(), getIsListValue());
            wrappedVM?.get().setVariable(currentTarget, currentName, parsed);
        });
});