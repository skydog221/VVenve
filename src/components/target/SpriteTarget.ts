import { $, createComponent, styleSet, sync, tree, typed, when, wrap, Wrapper } from "nine";
import VariableTarget, { WrappedVariable } from "./VariableTarget";
import Label from "../Label";

export interface WrappedTarget {
    name: string;
    variables: Wrapper<WrappedVariable>[];
    isStage: boolean;
}
export default createComponent({
    props: {
        data: {
            transform: typed<WrappedTarget>(),
            required: true
        }
    },
    styles: [
        styleSet(".sprite")
            .borderRadius("5px")
            .padding("5px"),
        styleSet(".sprite:hover")
            .backgroundColor("rgba(0,0,0,0.05)")
    ]
}, ({ data }) => {
    const showing = wrap(false);

    return tree("div")
        .on("click", () => showing.set(!showing.get()))
        .class("sprite")
        .append(
            Label({ text: data.get().isStage ? "全局变量" : "角色" }),
            tree("span")
                .append(sync(() => `${data.get().isStage ? "舞台" : data.get().name} ${showing.get() ? "▣" : "▢"}`, [showing])),
            when(showing, () =>
                tree("div")
                    .append($(sync(
                        () => Object.values(data.get().variables).map(v => VariableTarget({ data: v })),
                        [data]
                    ))))
        );
});