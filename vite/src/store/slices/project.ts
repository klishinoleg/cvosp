import {BaseState, getSlice} from "./baseSlice.ts";
import {ProjectSchema} from "../../schemas/project/Project.ts";


export interface ProjectState extends BaseState<ProjectSchema> {
    error: string | null,
    project: ProjectSchema | null
}

const initialState: ProjectState = {
    error: null,
    project: null as ProjectSchema | null,
}

export const {
    slice: projectSlice,
    load: loadProject,
    clearError: clearProjectError,
    selectItem: selectProject,
    clearItem: clearProject,
    selectError: selectProjectError,
} = getSlice<ProjectSchema>(
    "project", "project", initialState, "projects"
)

export default projectSlice.reducer;
