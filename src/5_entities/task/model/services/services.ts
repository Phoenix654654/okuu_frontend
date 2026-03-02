import {api} from "@/6_shared";
import type {PaginatedResponse, PaginationParams} from "@/6_shared";
import type {
    AssignDescriberRequest,
    CreateTaskRequest,
    GradeSubmissionRequest,
    ISubmission,
    ITask,
    ITaskDescription,
    ITaskAssignment,
    TaskListVisibility,
    PublishTaskRequest,
    UpdateTaskRequest,
} from "@/5_entities/task";

type ApiMessage = { message: string; extra?: Record<string, unknown> };

export const taskService = {
    // === Задания (Teacher) ===

    getList(params: PaginationParams & { group_id?: number; visibility?: TaskListVisibility }): Promise<PaginatedResponse<ITask>> {
        return api.getPaginated<ITask>("/tasks/", params);
    },

    getById(id: number): Promise<ITask> {
        return api.get<ITask>(`/tasks/${id}/`);
    },

    create(data: CreateTaskRequest): Promise<ApiMessage> {
        return api.post("/tasks/", data);
    },

    update(id: number, data: UpdateTaskRequest): Promise<ApiMessage> {
        return api.patch(`/tasks/${id}/`, data);
    },

    delete(id: number): Promise<ApiMessage> {
        return api.delete(`/tasks/${id}/`);
    },

    assignDescriber(taskId: number, data: AssignDescriberRequest): Promise<ApiMessage> {
        return api.post(`/tasks/${taskId}/assign_describer/`, data);
    },

    assignDescriberToDescription(descriptionId: number, data: AssignDescriberRequest): Promise<ApiMessage> {
        return api.post(`/tasks/descriptions/${descriptionId}/assign_describer/`, data);
    },

    approveDescription(taskId: number, descId: number): Promise<ApiMessage> {
        return api.post(`/tasks/${taskId}/descriptions/${descId}/approve/`);
    },

    revisionDescription(taskId: number, descId: number, comment: string): Promise<ApiMessage> {
        return api.post(`/tasks/${taskId}/descriptions/${descId}/revision/`, { comment });
    },

    publish(taskId: number, data: PublishTaskRequest): Promise<ApiMessage> {
        return api.post(`/tasks/${taskId}/publish/`, data);
    },

    close(taskId: number): Promise<ApiMessage> {
        return api.post(`/tasks/${taskId}/close/`);
    },

    // === Описания (Student-описатель) ===

    getDescriptions(params: PaginationParams): Promise<PaginatedResponse<ITaskDescription>> {
        return api.getPaginated<ITaskDescription>("/tasks/descriptions/", params);
    },

    getDescriptionsByTask(taskId: number): Promise<ITaskDescription[]> {
        return api.get<ITaskDescription[]>(`/tasks/descriptions/by-task/${taskId}/`);
    },

    getDescription(id: number): Promise<ITaskDescription> {
        return api.get<ITaskDescription>(`/tasks/descriptions/${id}/`);
    },

    submitDescription(id: number, data: { description: string; file_ids: number[] }): Promise<ApiMessage> {
        return api.post(`/tasks/descriptions/${id}/submit/`, data);
    },

    // === Назначения (Student) ===

    getAssignments(params: PaginationParams): Promise<PaginatedResponse<ITaskAssignment>> {
        return api.getPaginated<ITaskAssignment>("/tasks/assignments/", params);
    },

    getAssignment(id: number): Promise<ITaskAssignment> {
        return api.get<ITaskAssignment>(`/tasks/assignments/${id}/`);
    },

    submitSolution(id: number, data: { content: string; file_ids: number[] }): Promise<ApiMessage> {
        return api.post(`/tasks/assignments/${id}/submit/`, data);
    },

    // === Решения (Teacher — оценивание) ===

    getSubmissions(params: PaginationParams & { task_id?: number; student_id?: number }): Promise<PaginatedResponse<ISubmission>> {
        return api.getPaginated<ISubmission>("/tasks/submissions/", params);
    },

    getSubmission(id: number): Promise<ISubmission> {
        return api.get<ISubmission>(`/tasks/submissions/${id}/`);
    },

    gradeSubmission(id: number, data: GradeSubmissionRequest): Promise<ApiMessage> {
        return api.post(`/tasks/submissions/${id}/grade/`, data);
    },
};
