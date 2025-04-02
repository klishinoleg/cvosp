export const helperLocalStorage = (key: string, defaultValue: string): [string, (value: string) => void, () => string | null] => {
    const setValue = (value: string): void => {
        localStorage.setItem(key, value);
    };

    const getValue = (): string => {
        return localStorage.getItem(key) || defaultValue;
    };

    const value: string = getValue();

    return [value, setValue, getValue];
};
