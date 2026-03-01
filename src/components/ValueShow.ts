import { createComponent, styleSet, tree } from "nine";

export default createComponent({
    props: {
        value: {
            transform: String
        }
    },
    styles: [
        styleSet(".txt")
            .maxWidth("40vw")
            .maxHeight("30vh")
            .overflowY("scroll")
            .padding("5px")
            .borderRadius("5px")
            .border("2px solid gray")
            .wordBreak("break-all")
    ]
}, ({ value }) =>
    tree("div")
        .class("txt")
        .append(value)
);