export { taskService } from "./model/services/services";

import TaskStore from "./model/store/store";
export { TaskStore };

export type {
    TaskStatus,
    DescriptionStatus,
    AssignmentStatus,
    TaskListVisibility,
    IFile,
    ITask,
    ITaskListItem,
    ITaskForAssignment,
    ITaskDescriptionInline,
    ITaskAssignmentInline,
    ISubmissionInline,
    ITaskDescription,
    ITaskAssignment,
    ISubmission,
    ISubmissionDetail,
    CreateTaskRequest,
    UpdateTaskRequest,
    AssignDescriberRequest,
    SubmitDescriptionRequest,
    PublishTaskRequest,
    SubmitSolutionRequest,
    GradeSubmissionRequest,
} from "./model/types";
