import { $, createComponent, styleSet, sync, tree, when, wrap } from "nine";
import SubWindow from "../SubWindow";
import Logo from "../Logo";
import { isVMObtained, wrappedVM } from "../../state/vm";
import vm from "$/vm";
import SpriteTarget from "../target/SpriteTarget";
import Button from "../Button";
import { mainShowing, watcherShowing } from "src/state/window";

export default createComponent({
    styles: [
        styleSet(".sprites")
            .display("flex")
            .flexDirection("column")
            .maxWidth("50vw")
    ]
}, () => {
    return SubWindow({ x: wrap(100), y: wrap(100), showing: mainShowing }, {
        title: () => Logo(),
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
                            Button({ text: "设置为VVENVE" }).$.on("click", () => window.VVENVE = vm!),
                    ),
                    when(
                        isVMObtained,
                        () =>
                            tree("div")
                                .class("sprites")
                                .append(
                                    Button({ text: "视奸变量" }).$.on("click", () => watcherShowing.set(true)),
                                    $(sync(() => wrappedVM.targets.map(t => SpriteTarget({ data: t }))))
                                )
                    )
                )
    });
});