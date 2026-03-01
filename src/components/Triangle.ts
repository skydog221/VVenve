import { createComponent, styleSet, tree, when } from "nine";
import logo from "@asset/logo.svg";
import { mainShowing } from "src/state/window";

export default createComponent({
    styles: [
        styleSet(".ball")
            .width("50px")
            .height("50px")
            .borderRadius("50%")
            .display("flex")
            .alignItems("center")
            .justifyContent("center")
            .backgroundColor("rgb(176, 255, 221)")
            .border("2px solid transparent")
            .transition("all .2s ease-out"),
        styleSet(".ball:hover")
            .transform("rotate(180deg)")
            .borderColor("orange"),
        styleSet(".logo")
            .width("30px")
            .height("30px")
    ],
    uuid: "Triangle"
}, () => {
    return tree("div").append(
        when(() => !mainShowing.get(),
            () =>
                tree("div")
                    .on("click", () => mainShowing.set(true))
                    .class("ball")
                    .append(tree("img").class("logo").src(logo)),
            [mainShowing]
        )
    );
});