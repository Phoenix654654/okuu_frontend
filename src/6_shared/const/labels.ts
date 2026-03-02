import type {TaskStatus, DescriptionStatus, AssignmentStatus} from "@/5_entities/task";
import i18next from "i18next";

export const getRoleLabels = () => ({
    Admin: i18next.t("roles.Admin"),
    Teacher: i18next.t("roles.Teacher"),
    Student: i18next.t("roles.Student"),
});

export const getTaskStatusLabels = () => ({
    draft: i18next.t("taskStatus.draft"),
    describing: i18next.t("taskStatus.describing"),
    review: i18next.t("taskStatus.review"),
    published: i18next.t("taskStatus.published"),
    closed: i18next.t("taskStatus.closed"),
});

export const getDescriptionStatusLabels = () => ({
    pending: i18next.t("descriptionStatus.pending"),
    submitted: i18next.t("descriptionStatus.submitted"),
    revision: i18next.t("descriptionStatus.revision"),
    approved: i18next.t("descriptionStatus.approved"),
    rejected: i18next.t("descriptionStatus.rejected"),
});

export const getAssignmentStatusLabels = () => ({
    pending: i18next.t("assignmentStatus.pending"),
    submitted: i18next.t("assignmentStatus.submitted"),
    graded: i18next.t("assignmentStatus.graded"),
});

export const roleColors: Record<string, string> = {
    Admin: "red",
    Teacher: "blue",
    Student: "green",
};

export const taskStatusColors: Record<TaskStatus, string> = {
    draft: "default",
    describing: "processing",
    review: "warning",
    published: "success",
    closed: "error",
};

export const descriptionStatusColors: Record<DescriptionStatus, string> = {
    pending: "default",
    submitted: "processing",
    revision: "warning",
    approved: "success",
    rejected: "error",
};

export const assignmentStatusColors: Record<AssignmentStatus, string> = {
    pending: "default",
    submitted: "processing",
    graded: "success",
};
