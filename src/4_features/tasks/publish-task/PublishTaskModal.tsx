import {useCallback, useEffect, useState} from "react";
import {Modal, Select, message, Spin} from "antd";
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
}

export const PublishTaskModal = observer(({open, taskId, onClose, onSuccess}: PublishTaskModalProps) => {
    const [studentIds, setStudentIds] = useState<number[]>([]);
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
            setStudentIds([]);
        }
    }, [open, loadStudents]);

    const handlePublish = async () => {
        if (studentIds.length === 0) {
            message.warning("Добавьте хотя бы одного студента");
            return;
        }

        setLoading(true);
        const success = await TaskStore.publishTask(taskId, {student_ids: studentIds});
        setLoading(false);

        if (success) {
            message.success("Задание опубликовано");
            setStudentIds([]);
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
            okButtonProps={{disabled: studentIds.length === 0}}
        >
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
        </Modal>
    );
});
