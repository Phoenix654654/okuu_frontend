import type {IUser} from "@/5_entities/user";
import type {IGroup} from "@/5_entities/group";

export type TaskStatus = "DRAFT" | "DESCRIBING" | "REVIEW" | "PUBLISHED" | "CLOSED";
export type DescriptionStatus = "PENDING" | "SUBMITTED" | "REVISION" | "APPROVED" | "REJECTED";
export type AssignmentStatus = "PENDING" | "SUBMITTED" | "GRADED";

export interface IFile {
    id: number;
    original_name: string;
    file: string;
    size: number;
}

/** Краткая информация о задаче (возвращается в списках описаний/назначений) */
export interface ITaskListItem {
    id: number;
    title: string;
    status: TaskStatus;
    deadline: string | null;
    created_at: string;
}

/** Информация о задаче внутри назначения студента (включает approved_description) */
export interface ITaskForAssignment {
    id: number;
    teacher: IUser;
    group: IGroup;
    title: string;
    status: TaskStatus;
    deadline: string | null;
    approved_description: string | null;
    created_at: string;
    updated_at: string;
}

/** Inline-описание внутри TaskDetail (для учителя) */
export interface ITaskDescriptionInline {
    id: number;
    describer: IUser;
    description: string;
    status: DescriptionStatus;
    deadline: string;
    revision_comment: string | null;
    files: IFile[];
    created_at: string;
}

/** Inline-назначение внутри TaskDetail (для учителя) */
export interface ITaskAssignmentInline {
    id: number;
    student: IUser;
    status: AssignmentStatus;
    has_submission: boolean;
    score: number | null;
}

/** Inline-решение внутри TaskAssignmentDetail (для студента) */
export interface ISubmissionInline {
    id: number;
    content: string;
    submitted_at: string;
    score: number | null;
    teacher_comment: string | null;
    files: IFile[];
}

/** Описание задания (для студента-описателя) */
export interface ITaskDescription {
    id: number;
    task: ITaskListItem;
    describer: IUser;
    description: string;
    status: DescriptionStatus;
    files: IFile[];
    deadline: string;
    revision_comment: string | null;
    created_at: string;
    updated_at: string;
}

/** Назначение задания (для студента) */
export interface ITaskAssignment {
    id: number;
    task: ITaskForAssignment;
    student: IUser;
    status: AssignmentStatus;
    submission: ISubmissionInline | null;
    created_at: string;
    updated_at: string;
}

/** Решение студента (для учителя — оценивание) */
export interface ISubmission {
    id: number;
    student: string;
    task_title: string;
    content: string;
    submitted_at: string;
    files: IFile[];
    score: number | null;
    teacher_comment: string | null;
}

/** Полная детализация задания (для учителя) */
export interface ITask {
    id: number;
    teacher: IUser;
    group: IGroup;
    title: string;
    status: TaskStatus;
    deadline: string | null;
    descriptions: ITaskDescriptionInline[];
    assignments: ITaskAssignmentInline[];
    approved_description: string | null;
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
