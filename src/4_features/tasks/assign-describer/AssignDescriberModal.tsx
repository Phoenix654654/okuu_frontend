import {useCallback, useEffect, useState} from "react";
import {Modal, Form, DatePicker, Select, message, Spin} from "antd";
import type {Dayjs} from "dayjs";
import {observer} from "mobx-react-lite";
import {TaskStore} from "@/5_entities/task";
import {userService} from "@/5_entities/user";
import type {IUser} from "@/5_entities/user";
import {useDebounce} from "@/6_shared/lib/hooks/useDebounce/useDebounce";

interface AssignDescriberModalProps {
    open: boolean;
    taskId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const AssignDescriberModal = observer(({open, taskId, onClose, onSuccess}: AssignDescriberModalProps) => {
    const [describerId, setDescriberId] = useState<number | null>(null);
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
        }
    }, [open, loadStudents]);

    const handleOk = async () => {
        if (!describerId || !deadline) return;

        setLoading(true);
        const success = await TaskStore.assignDescriber(taskId, {
            describer_id: describerId,
            deadline: deadline.format("YYYY-MM-DDTHH:mm:ssZ"),
        });
        setLoading(false);

        if (success) {
            message.success("Описатель назначен");
            setDescriberId(null);
            setDeadline(null);
            onSuccess();
            onClose();
        } else {
            message.error("Ошибка при назначении описателя");
        }
    };

    return (
        <Modal
            title="Назначить описателя"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Назначить"
            cancelText="Отмена"
            confirmLoading={loading}
            okButtonProps={{disabled: !describerId || !deadline}}
        >
            <Form layout="vertical">
                <Form.Item label="Студент-описатель">
                    <Select
                        showSearch
                        value={describerId}
                        onChange={setDescriberId}
                        onSearch={debouncedSearch}
                        filterOption={false}
                        placeholder="Поиск студента..."
                        notFoundContent={studentsLoading ? <Spin size="small" /> : "Не найдено"}
                        options={students.map(s => ({
                            value: s.id,
                            label: `${s.full_name}${s.student_code ? ` (${s.student_code})` : ""}`,
                        }))}
                        style={{width: "100%"}}
                    />
                </Form.Item>
                <Form.Item label="Дедлайн описания">
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
