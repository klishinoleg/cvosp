import {API_URL} from "../constanst/vars.ts";
import i18n from "i18next";

export class Api {
    async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(`${API_URL}${url}`, {
                headers: {"Accept-Language": i18n.language},
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            return await response.json() as T;
        } catch (e) {
            throw new Error(`API GET error: ${e}`);
        }
    }
}
