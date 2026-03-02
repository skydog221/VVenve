import { $, createComponent, styleSet, sync, tree, when, wrap, Wrapper } from "nine";
import SubWindow from "../SubWindow";
import { isVMObtained, wrappedVM } from "../../state/vm";
import vm from "$/vm";
import Button from "../Button";
import { mainShowing, projectShowing, watcherShowing } from "src/state/window";
import SpriteTarget from "../target/SpriteTarget";

export default createComponent({
    styles: [
        styleSet(".sprites")
            .display("flex")
            .flexDirection("column")
            .maxWidth("50vw")
    ]
}, () => {
    const targetShowing: Record<string, Wrapper<boolean>> = {};

    return SubWindow({ x: wrap(100), y: wrap(100), showing: mainShowing }, {
        title: (title) => tree("img").class("logo").src(title),
        content: () =>
            tree("div")
                .append(
                    "已获取VM：", isVMObtained,
                    when(
                        isVMObtained,
                        () =>
                            Button({ text: "打印到控制台" }).$.on("click", () => console.log(vm)),
                    ),
                    when(
                        isVMObtained,
                        () =>
                            Button({ text: "设置为__VVENVE__" }).$.on("click", () => window.__VVENVE__ = vm!),
                    ),
                    when(
                        isVMObtained,
                        () =>
                            tree("div")
                                .class("sprites")
                                .append(
                                    Button({ text: "项目管理器" }).$.on("click", () => projectShowing.set(true)),
                                    Button({ text: "视奸变量" }).$.on("click", () => watcherShowing.set(true)),
                                    $(sync(
                                        () => wrappedVM!.get().targets.map(t => {
                                            if (!targetShowing[t.name]) targetShowing[t.name] = wrap(false);
                                            return SpriteTarget({
                                                data: t,
                                                showing: targetShowing[t.name]
                                            });
                                        }),
                                        [wrappedVM]
                                    ))
                                )
                    )
                )
    });
});