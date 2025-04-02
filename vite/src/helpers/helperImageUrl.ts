import {SERVER_URL} from "../constanst/vars.ts";

export const helperImageUrl = (url: string | undefined) => {
    if (!url) {
        return undefined;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    } else {
        return `${SERVER_URL}${url}`;
    }
};
