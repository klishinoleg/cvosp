import {ContactInfoSchema} from "./ContactInfo.ts";

export interface UserContactSchema {
    id: number
    title: string
    link: string
    contactInfo: ContactInfoSchema
}
