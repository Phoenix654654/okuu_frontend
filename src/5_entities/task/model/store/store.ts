import {makeAutoObservable} from "mobx";
import {createAsyncState} from "@/6_shared/lib/helpers/async-state";
import {createListState} from "@/6_shared/lib/helpers/list-state";
import {taskService} from "@/5_entities/task";
import type {
    AssignDescriberRequest,
    CreateTaskRequest,
    GradeSubmissionRequest,
    ISubmission,
    ISubmissionDetail,
    ITask,
    ITaskAssignment,
    ITaskDescription,
    TaskListVisibility,
    PublishTaskRequest,
    UpdateTaskRequest,
} from "@/5_entities/task";

class TaskStore {
    // Teacher
    list$ = createListState<ITask, { group_id?: number; visibility?: TaskListVisibility }>();
    current$ = createAsyncState<ITask>();
    submissions$ = createListState<ISubmission, { task_id?: number; student_id?: number }>();
    currentSubmission$ = createAsyncState<ISubmissionDetail>();

    // Student — описания
    descriptions$ = createListState<ITaskDescription>();
    currentDescription$ = createAsyncState<ITaskDescription>();

    // Student — назначения
    assignments$ = createListState<ITaskAssignment>();
    currentAssignment$ = createAsyncState<ITaskAssignment>();

    constructor() {
        makeAutoObservable(this);
    }

    // === Teacher ===

    fetchTasks = async () => {
        await this.list$.run((params) => taskService.getList(params));
    };

    fetchTask = async (id: number) => {
        await this.current$.run(() => taskService.getById(id));
    };

    createTask = async (data: CreateTaskRequest): Promise<boolean> => {
        try {
            await taskService.create(data);
            return true;
        } catch {
            return false;
        }
    };

    updateTask = async (id: number, data: UpdateTaskRequest): Promise<boolean> => {
        try {
            await taskService.update(id, data);
            return true;
        } catch {
            return false;
        }
    };

    deleteTask = async (id: number): Promise<boolean> => {
        try {
            await taskService.delete(id);
            return true;
        } catch {
            return false;
        }
    };

    assignDescriber = async (taskId: number, data: AssignDescriberRequest): Promise<boolean> => {
        try {
            await taskService.assignDescriber(taskId, data);
            return true;
        } catch {
            return false;
        }
    };

    assignDescriberToDescription = async (descriptionId: number, data: AssignDescriberRequest): Promise<boolean> => {
        try {
            await taskService.assignDescriberToDescription(descriptionId, data);
            return true;
        } catch {
            return false;
        }
    };

    approveDescription = async (taskId: number, descId: number): Promise<boolean> => {
        try {
            await taskService.approveDescription(taskId, descId);
            return true;
        } catch {
            return false;
        }
    };

    revisionDescription = async (taskId: number, descId: number, comment: string): Promise<boolean> => {
        try {
            await taskService.revisionDescription(taskId, descId, comment);
            return true;
        } catch {
            return false;
        }
    };

    publishTask = async (taskId: number, data: PublishTaskRequest): Promise<boolean> => {
        try {
            await taskService.publish(taskId, data);
            return true;
        } catch {
            return false;
        }
    };

    closeTask = async (taskId: number): Promise<boolean> => {
        try {
            await taskService.close(taskId);
            return true;
        } catch {
            return false;
        }
    };

    fetchSubmissions = async () => {
        await this.submissions$.run((params) => taskService.getSubmissions(params));
    };

    fetchSubmission = async (id: number) => {
        await this.currentSubmission$.run(() => taskService.getSubmission(id));
    };

    gradeSubmission = async (id: number, data: GradeSubmissionRequest): Promise<boolean> => {
        try {
            await taskService.gradeSubmission(id, data);
            return true;
        } catch {
            return false;
        }
    };

    // === Student — описания ===

    fetchDescriptions = async () => {
        await this.descriptions$.run((params) => taskService.getDescriptions(params));
    };

    fetchDescription = async (id: number) => {
        await this.currentDescription$.run(() => taskService.getDescription(id));
    };

    submitDescription = async (id: number, data: { description: string; file_ids: number[] }): Promise<boolean> => {
        try {
            await taskService.submitDescription(id, data);
            return true;
        } catch {
            return false;
        }
    };

    // === Student — назначения ===

    fetchAssignments = async () => {
        await this.assignments$.run((params) => taskService.getAssignments(params));
    };

    fetchAssignment = async (id: number) => {
        await this.currentAssignment$.run(() => taskService.getAssignment(id));
    };

    submitSolution = async (id: number, data: { content: string; file_ids: number[] }): Promise<boolean> => {
        try {
            await taskService.submitSolution(id, data);
            return true;
        } catch {
            return false;
        }
    };
}

export default new TaskStore();
