import { createComponent, styleSet, sync, tree, typed, when, Wrapper } from "nine";
import Label from "../Label";
import Button from "../Button";
import { isWatching, removeWatching, toggleWatching, watchings } from "src/state/watch";
import ValueInput from "../ValueInput";
import { ScratchValue } from "src/api/variable";

export interface WrappedVariable {
    name: string;
    value: Wrapper<ScratchValue>;
    isList: boolean
}
export default createComponent({
    props: {
        data: {
            transform: typed<WrappedVariable>(),
            required: true
        },
        watching: {
            transform: Boolean,
            shadow: false
        }
    },
    styles: [
        styleSet(".var")
            .margin("5px 0")
            .marginLeft("10px")
            .alignItems("center")
            .display("flex")
            .flexDirection("row"),
        styleSet(".var:hover")
            .backgroundColor("rgba(0,0,0,0.05)"),
        styleSet(".var:active")
            .backgroundColor("rgba(0,0,0,0.1)"),
        styleSet(".indent")
            .width("10px")
            .height("2px")
            .backgroundColor("gray"),
        styleSet(".text")
            .textWrap("nowrap")
            .textWrapMode("nowrap"),
        styleSet(".right")
            .marginLeft("auto"),
        styleSet(".var-watcher")
            .display("flex")
            .flexDirection("column"),
        styleSet(".watcher"),
    ],
    uuid: "VariableTarget"
}, ({ data, watching }) => {
    return tree("div")
        .class("var-watcher")
        .append(
            tree("div")
                .class("var")
                .append(
                    tree("span").class("indent"),
                    Label({ text: data.get().isList ? "列表" : "变量" }),
                    tree("span").class("text").append(data.get().name),
                    when(
                        () => !watching.get(),
                        () => Button({
                            text: sync(() =>
                                isWatching(data) ? "🔪" : "👁️",
                                [watchings])
                        }).$
                            .class("right")
                            .on.stop("click", () => toggleWatching(data))
                        , [watching]
                    )
                ),
            when(
                watching,
                () =>
                    tree("div")
                        .class("watcher")
                        .append(ValueInput({ value: data.get().value as Wrapper<string> }))
            )
        ).on("click", () => {
            if (watching.get()) {
                removeWatching(data);
            }
        });
});