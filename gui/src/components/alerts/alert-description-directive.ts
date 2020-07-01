import { DirectiveOptions } from "vue";

const createURL = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url: string) => {
        return "<a href=" + url + " target='_blank'>" + url + "</a>";
    });
};

const alertTblDescriptionDirective: DirectiveOptions = {
    bind: (el, binding, vnode) => {
        let content = "--";
        if (binding.value) {
            const descContent = binding.value.split("-;");
            if (descContent.length === 2) {
                content = createURL(descContent[1]) + "<br />" + descContent[0];
            } else {
                content = descContent[0];
            }
        }
        el.innerHTML = content;
    }
};

const alertDetailDescriptionDirective: DirectiveOptions = {
    bind: (el, binding, vnode) => {
        let content = "--";
        if (binding.value) {
            const descContent = binding.value.split("-;");
            if (descContent.length === 2) {
                content = createURL(descContent[1]) + "<br />Reason: " + descContent[0];
            } else {
                content = "Reason: " + descContent[0];
            }
        }
        el.innerHTML = content;
    }
};

export {
    alertTblDescriptionDirective,
    alertDetailDescriptionDirective
};
