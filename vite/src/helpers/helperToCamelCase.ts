function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function convertSnakeToCamel<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map((item) => convertSnakeToCamel(item)) as T;
    } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const camelKey = toCamelCase(key);
            acc[camelKey] = convertSnakeToCamel(value);
            return acc;
        }, {} as any);
    }
    return obj;
}
