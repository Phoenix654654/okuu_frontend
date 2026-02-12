import type {IUser} from "@/5_entities/user";
import type {IGroup} from "@/5_entities/group";

export type TaskStatus = "DRAFT" | "DESCRIBING" | "REVIEW" | "PUBLISHED" | "CLOSED";
export type DescriptionStatus = "PENDING" | "SUBMITTED" | "REVISION" | "APPROVED" | "REJECTED";
export type AssignmentStatus = "PENDING" | "SUBMITTED" | "GRADED";

export interface IFile {
    id: number;
    url: string;
}

export interface ITaskDescription {
    id: number;
    task: number;
    describer: IUser;
    description: string;
    status: DescriptionStatus;
    files: IFile[];
    deadline: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
}

export interface ITaskAssignment {
    id: number;
    task: number;
    student: IUser;
    status: AssignmentStatus;
    created_at: string;
    updated_at: string;
}

export interface ISubmission {
    id: number;
    assignment: number;
    student: IUser;
    content: string;
    files: IFile[];
    score: number | null;
    comment: string | null;
    created_at: string;
    updated_at: string;
}

export interface ITask {
    id: number;
    group: IGroup;
    title: string;
    status: TaskStatus;
    deadline: string;
    descriptions: ITaskDescription[];
    assignments: ITaskAssignment[];
    created_at: string;
    updated_at: string;
}

export interface CreateTaskRequest {
    group: number;
    title: string;
    deadline: string;
}

export interface UpdateTaskRequest {
    title?: string;
    deadline?: string;
}

export interface AssignDescriberRequest {
    describer_id: number;
    deadline: string;
}

export interface SubmitDescriptionRequest {
    description: string;
    file_ids: number[];
}

export interface PublishTaskRequest {
    student_ids: number[];
}

export interface SubmitSolutionRequest {
    content: string;
    file_ids: number[];
}

export interface GradeSubmissionRequest {
    score: number;
    comment: string;
}
