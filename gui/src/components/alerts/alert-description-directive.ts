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
        if (binding.value.support_message) {
            content = createURL(binding.value.support_message);
        }
        if (binding.value.description) {
            if (binding.value.support_message) {
                content = binding.value.description + "<br />" + content;
            } else {
                content = binding.value.description;
            }
        }
        el.innerHTML = content;
    }
};

export {
    alertTblDescriptionDirective
};
