import type {TaskStatus, DescriptionStatus, AssignmentStatus} from "@/5_entities/task";

export const roleLabels: Record<string, string> = {
    Admin: "Администратор",
    Teacher: "Преподаватель",
    Student: "Студент",
};

export const roleColors: Record<string, string> = {
    Admin: "red",
    Teacher: "blue",
    Student: "green",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
    DRAFT: "Черновик",
    DESCRIBING: "На описании",
    REVIEW: "На проверке",
    PUBLISHED: "Опубликовано",
    CLOSED: "Закрыто",
};

export const taskStatusColors: Record<TaskStatus, string> = {
    DRAFT: "default",
    DESCRIBING: "processing",
    REVIEW: "warning",
    PUBLISHED: "success",
    CLOSED: "error",
};

export const descriptionStatusLabels: Record<DescriptionStatus, string> = {
    PENDING: "Ожидает",
    SUBMITTED: "Отправлено",
    REVISION: "На доработке",
    APPROVED: "Одобрено",
    REJECTED: "Отклонено",
};

export const descriptionStatusColors: Record<DescriptionStatus, string> = {
    PENDING: "default",
    SUBMITTED: "processing",
    REVISION: "warning",
    APPROVED: "success",
    REJECTED: "error",
};

export const assignmentStatusLabels: Record<AssignmentStatus, string> = {
    PENDING: "Ожидает решения",
    SUBMITTED: "Отправлено",
    GRADED: "Оценено",
};

export const assignmentStatusColors: Record<AssignmentStatus, string> = {
    PENDING: "default",
    SUBMITTED: "processing",
    GRADED: "success",
};
