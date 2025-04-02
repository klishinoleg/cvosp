import {ProjectListSchema} from "../project/Project.ts";

export interface JobSchema {
    id: number
    name: string;
    profession: string;
    description: string;
    startDate: string;
    endDate?: string;
    icon: string;
    site?: string;
    projects: ProjectListSchema[];
}
