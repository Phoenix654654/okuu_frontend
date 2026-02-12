import {useState, useEffect} from "react";
import {Card, Descriptions, Tag, Form, message} from "antd";
import {observer} from "mobx-react-lite";
import {UserStore, userService} from "@/5_entities/user";
import {AppInput} from "@/6_shared/ui/input/AppInput";
import {AppButton} from "@/6_shared/ui/button/AppButton";
import {roleLabels} from "@/6_shared";
import cls from "./ProfilePage.module.scss";

const ProfilePage = observer(() => {
    const user = UserStore.currentUser$.value;
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setEmail(user.email);
            setPhone(user.phone);
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            await userService.updateUser(user.id, {
                full_name: fullName,
                email,
                phone,
            });
            await UserStore.fetchCurrentUser();
            message.success("Профиль обновлён");
            setEditing(false);
        } catch {
            message.error("Ошибка при обновлении");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className={cls.page}>
            <h1>Профиль</h1>

            {!editing ? (
                <>
                    <Card>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="ФИО">{user.full_name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Телефон">{user.phone}</Descriptions.Item>
                            <Descriptions.Item label="Роль">
                                <Tag color="blue">{roleLabels[user.role] || user.role}</Tag>
                            </Descriptions.Item>
                            {user.student_code && (
                                <Descriptions.Item label="Код студента">
                                    <Tag>{user.student_code}</Tag>
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Дата регистрации">
                                {new Date(user.created_at).toLocaleDateString("ru-RU")}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                    <AppButton type="primary" onClick={() => setEditing(true)}>
                        Редактировать
                    </AppButton>
                </>
            ) : (
                <Card title="Редактирование профиля">
                    <Form layout="vertical" onFinish={handleSave}>
                        <Form.Item label="ФИО">
                            <AppInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Email">
                            <AppInput value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Телефон">
                            <AppInput value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Item>
                        <div className={cls.actions}>
                            <AppButton onClick={() => setEditing(false)}>Отмена</AppButton>
                            <AppButton type="primary" htmlType="submit" loading={saving}>
                                Сохранить
                            </AppButton>
                        </div>
                    </Form>
                </Card>
            )}
        </div>
    );
});

export default ProfilePage;
