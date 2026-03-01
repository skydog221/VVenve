import { $, createComponent, styleSet, sync, tree, typed, when } from "nine";
import VariableTarget from "./VariableTarget";
import Label from "../Label";
import { WrappedTarget } from "src/api/vm";

export default createComponent({
    props: {
        data: {
            transform: typed<WrappedTarget>(),
            required: true,
        },
        showing: {
            transform: Boolean,
            required: true,
            uploadable: true
        }
    },
    styles: [
        styleSet(".sprite")
            .borderRadius("5px")
            .padding("10px 5px"),
        styleSet(".sprite:hover")
            .backgroundColor("rgba(0,0,0,0.05)")
    ]
}, ({ data, showing }) => {
    return tree("div")
        .on("click", () => showing.set(!showing.get()))
        .class("sprite")
        .append(
            Label({ text: data.get().isClone ? "克隆体" : data.get().isStage ? "全局变量" : "角色" }),
            tree("span")
                .append(sync(() => `${data.get().isStage ? "舞台" : data.get().name} ${showing.get() ? "▣" : "▢"}`, [showing])),
            when(showing, () =>
                tree("div")
                    .append($(sync(
                        () =>
                            data.get().variables.length > 0
                                ? data.get().variables.map(v => VariableTarget({ data: v }))
                                : VariableTarget({ isAir: true }),
                        [data]
                    ))))
        );
});