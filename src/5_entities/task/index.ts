export { taskService } from "./model/services/services";

import TaskStore from "./model/store/store";
export { TaskStore };

export type {
    TaskStatus,
    DescriptionStatus,
    AssignmentStatus,
    IFile,
    ITask,
    ITaskDescription,
    ITaskAssignment,
    ISubmission,
    CreateTaskRequest,
    UpdateTaskRequest,
    AssignDescriberRequest,
    SubmitDescriptionRequest,
    PublishTaskRequest,
    SubmitSolutionRequest,
    GradeSubmissionRequest,
} from "./model/types";
