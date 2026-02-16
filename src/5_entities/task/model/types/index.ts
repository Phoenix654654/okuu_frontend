import type {IUser} from "@/5_entities/user";

export type TaskStatus = "draft" | "describing" | "review" | "published" | "closed";
export type DescriptionStatus = "pending" | "submitted" | "revision" | "approved" | "rejected";
export type AssignmentStatus = "pending" | "submitted" | "graded";

export interface IFile {
    id: number;
    original_name: string;
    file: string;
    size: number;
}

/** Краткая информация о задаче (возвращается в списках описаний/назначений) */
export interface ITaskListItem {
    id: number;
    teacher: IUser;
    title: string;
    status: TaskStatus;
    is_shared: boolean;
    created_at: string;
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
    deadline: string | null;
    has_submission: string;
    score: string;
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
    deadline: string | null;
    submission: ISubmissionInline | null;
    created_at: string;
}

/** Решение студента — список (для учителя) */
export interface ISubmission {
    id: number;
    student: string;
    task_title: string;
    submitted_at: string;
    score: number | null;
}

/** Решение студента — детали (для учителя — оценивание) */
export interface ISubmissionDetail {
    id: number;
    student: string | IUser;
    task: string | ITaskListItem;
    content: string;
    submitted_at: string;
    score: number | null;
    teacher_comment: string | null;
    files: IFile[];
}

/** Полная детализация задания (для учителя) */
export interface ITask {
    id: number;
    teacher: IUser;
    title: string;
    description?: string;
    status: TaskStatus;
    is_shared?: boolean;
    files?: IFile[];
    descriptions: ITaskDescriptionInline[];
    assignments: ITaskAssignmentInline[];
    approved_description: string | ITaskDescriptionInline | null;
    created_at: string;
    updated_at: string;
}

/** Информация о задаче внутри назначения студента (task inside TaskAssignmentDetail) */
export interface ITaskForAssignment extends ITask {}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    is_shared?: boolean;
    file_ids?: number[];
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
    deadline: string;
    group_ids?: number[];
    student_ids?: number[];
}

export interface SubmitSolutionRequest {
    content: string;
    file_ids: number[];
}

export interface GradeSubmissionRequest {
    score: number;
    comment: string;
}
