import {SkillSchema} from "./Skill.ts";

export interface UserSkillSchema {
    id: number
    name: string
    competitionLevel: number
    group: number
    ordering: number
    skill: SkillSchema
}
