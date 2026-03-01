import { createComponent, styleSet, sync, tree, typed, when } from "nine";
import Label from "../Label";
import { isWatching, removeWatching, toggleWatching, watchings } from "src/state/watch";
import ValueInput from "../ValueInput";
import { WrappedVariable } from "src/api/vm";

export default createComponent({
    props: {
        data: {
            transform: typed<WrappedVariable>(),
            required: true,
        },
        watching: {
            transform: Boolean,
            shadow: false
        }
    },
    styles: [
        styleSet(".var")
            .padding("5px")
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
                .on.stop("click", () => toggleWatching(data.get()))
                .append(
                    tree("span").class("indent"),
                    Label({ text: data.get().isList ? "列表" : "变量" }),
                    tree("span").class("text").append(sync(() => data.get().name, [data])),
                    when(
                        () => !watching.get(),
                        () => tree("span")
                            .class("right")
                            .append(
                                sync(
                                    () => isWatching(data.get()) ? "🔪" : "👁️",
                                    [watchings]
                                )
                            )
                        , [watching]
                    )
                ),
            when(
                watching,
                () =>
                    tree("div")
                        .class("watcher")
                        .append(ValueInput({ value: "just test" }))
            )
        ).on("click", () => {
            if (watching.get()) {
                removeWatching(data.get());
            }
        });
});