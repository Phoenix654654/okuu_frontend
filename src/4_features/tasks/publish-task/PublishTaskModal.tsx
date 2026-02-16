import {useCallback, useEffect, useState} from "react";
import {Modal, Select, Form, DatePicker, message, Spin} from "antd";
import type {Dayjs} from "dayjs";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";
import {userService} from "@/5_entities/user";
import type {IUser} from "@/5_entities/user";
import {useDebounce} from "@/6_shared/lib/hooks/useDebounce/useDebounce";

interface PublishTaskModalProps {
    open: boolean;
    taskId: number;
    onClose: () => void;
    onSuccess: () => void;
    defaultStudentIds?: number[];
}

export const PublishTaskModal = observer(({open, taskId, onClose, onSuccess, defaultStudentIds}: PublishTaskModalProps) => {
    const [studentIds, setStudentIds] = useState<number[]>([]);
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [loading, setLoading] = useState(false);

    const [students, setStudents] = useState<IUser[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const loadStudents = useCallback(async (search?: string) => {
        setStudentsLoading(true);
        try {
            const res = await userService.getStudents({limit: 50, offset: 0, search});
            setStudents(res.results);
        } catch {
            // ignore
        } finally {
            setStudentsLoading(false);
        }
    }, []);

    const debouncedSearch = useDebounce((value: string) => {
        loadStudents(value || undefined);
    }, 300);

    useEffect(() => {
        if (open) {
            loadStudents();
            setStudentIds(defaultStudentIds ?? []);
            setDeadline(null);
        }
    }, [open, loadStudents, defaultStudentIds]);

    const handlePublish = async () => {
        if (studentIds.length === 0) {
            message.warning("Добавьте хотя бы одного студента");
            return;
        }
        if (!deadline) {
            message.warning("Укажите дедлайн");
            return;
        }

        setLoading(true);
        const success = await TaskStore.publishTask(taskId, {
            deadline: deadline.format("YYYY-MM-DDTHH:mm:ssZ"),
            student_ids: studentIds,
        });
        setLoading(false);

        if (success) {
            message.success("Задание опубликовано");
            setStudentIds([]);
            setDeadline(null);
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при публикации");
        }
    };

    return (
        <Modal
            title="Опубликовать задание"
            open={open}
            onOk={handlePublish}
            onCancel={onClose}
            okText="Опубликовать"
            cancelText="Отмена"
            confirmLoading={loading}
            okButtonProps={{disabled: studentIds.length === 0 || !deadline}}
        >
            <Form layout="vertical">
                <Form.Item label="Студенты">
                    <Select
                        mode="multiple"
                        showSearch
                        value={studentIds}
                        onChange={setStudentIds}
                        onSearch={debouncedSearch}
                        filterOption={false}
                        placeholder="Поиск и выбор студентов..."
                        notFoundContent={studentsLoading ? <Spin size="small" /> : "Не найдено"}
                        options={students.map(s => ({
                            value: s.id,
                            label: `${s.full_name}${s.student_code ? ` (${s.student_code})` : ""}`,
                        }))}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <Form.Item label="Дедлайн">
                    <DatePicker
                        showTime
                        value={deadline}
                        onChange={setDeadline}
                        style={{width: "100%"}}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});
