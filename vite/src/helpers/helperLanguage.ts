import {helperLocalStorage} from "./helperLocalStorage";

export const helperLanguage = (defaultLanguage: string): [string, (value: string) => void, () => string | null] => {
    const browserLanguage = navigator.language.split("-")[0]
    return helperLocalStorage("language", browserLanguage || defaultLanguage);
};
