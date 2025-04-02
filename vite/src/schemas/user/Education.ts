export interface EducationSchema {
    id: number
    name: string;
    profession: string;
    description: string;
    startDate: string;
    endDate?: string;
    icon: string;
    site?: string;
}
