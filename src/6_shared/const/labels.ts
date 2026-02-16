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
    draft: "Черновик",
    describing: "На описании",
    review: "На проверке",
    published: "Опубликовано",
    closed: "Закрыто",
};

export const taskStatusColors: Record<TaskStatus, string> = {
    draft: "default",
    describing: "processing",
    review: "warning",
    published: "success",
    closed: "error",
};

export const descriptionStatusLabels: Record<DescriptionStatus, string> = {
    pending: "Ожидает",
    submitted: "Отправлено",
    revision: "На доработке",
    approved: "Одобрено",
    rejected: "Отклонено",
};

export const descriptionStatusColors: Record<DescriptionStatus, string> = {
    pending: "default",
    submitted: "processing",
    revision: "warning",
    approved: "success",
    rejected: "error",
};

export const assignmentStatusLabels: Record<AssignmentStatus, string> = {
    pending: "Ожидает решения",
    submitted: "Отправлено",
    graded: "Оценено",
};

export const assignmentStatusColors: Record<AssignmentStatus, string> = {
    pending: "default",
    submitted: "processing",
    graded: "success",
};
