import {ImageSchema} from "./Image.ts";
import {SkillSchema} from "../skill/Skill.ts";

export interface ProjectSchema {
    id: number
    name: string;
    description: string;
    icon: string;
    site?: string;
    images: ImageSchema[]
    skills: SkillSchema[]
}


export interface ProjectListSchema {
    id: number
    name: string
    thumb: string;
}