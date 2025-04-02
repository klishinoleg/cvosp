import {GenderEnum} from "../../constanst/enums/gender.ts";
import {KeyQualitySchema} from "./KeyQuality.ts";
import {UserSkillSchema} from "../skill/UserSkill.ts";
import {ProfileSchema} from "./Profile.ts";
import {JobSchema} from "./Job.ts";
import {EducationSchema} from "./Education.ts";
import {UserContactSchema} from "../contact/UserContact.ts";

export interface UserSchema {
    id: number
    firstName: string
    lastName: string
    description: string
    childrenDesc?: string
    text?: string
    username: string
    isSuperuser: boolean
    picture: string
    location: string
    thumbnail: string
    birthday?: string
    gender?: GenderEnum
    married: boolean
    keyQualities: KeyQualitySchema[]
    skills: UserSkillSchema[]
    profiles: ProfileSchema[]
    jobs: JobSchema[],
    educations: EducationSchema[],
    contacts: UserContactSchema[]
}
