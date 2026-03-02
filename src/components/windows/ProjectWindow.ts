import { createComponent, styleSet, tree, wrap } from "nine";
import SubWindow from "../SubWindow";
import { projectShowing } from "src/state/window";
import vm from "$/vm";
import { download } from "src/util/data";
import Button from "../Button";

export default createComponent({}, () => {
    return SubWindow({ x: wrap(100), y: wrap(100), showing: projectShowing }, {
        title: () => "作品管理器",
        content: () =>
            tree("div")
                .use(styleSet().display("flex").flexDirection("column").alignItems("center"))
                .append(
                    Button({ text: "下载作品到本地" }).$
                        .on("click", async () => download(await vm?.saveProjectSb3() || "", "project.sb3")),
                    Button({ text: "下载舞台" }).$
                        .on("click", async () => {
                            for (const target of vm?.runtime.targets ?? []) {
                                if (target.isStage) {
                                    download(await vm?.exportSprite(target.id) || "", "舞台.sprite3");
                                }
                            }
                        }),
                    Button({ text: "下载所有角色" }).$
                        .on("click", async () => {
                            for (const target of vm?.runtime.targets ?? []) {
                                if (target.isOriginal && !target.isStage) {
                                    download(await vm?.exportSprite(target.id) || "", `${target.getName()}.sprite3`);
                                }
                            }
                        })
                )
    });
});