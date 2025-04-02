export const API_URL = import.meta.env.VITE_API_URL;
export const DEBUG = !!import.meta.env.VITE_DEBUG;
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE;
export const LANGUAGES = import.meta.env.VITE_LANGUAGES?.split("|") || ["en"];
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

