import {useEffect} from "react";
import {Card, Statistic, Row, Col} from "antd";
import {TeamOutlined, FileTextOutlined, BookOutlined, EditOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {UserStore} from "@/5_entities/user";
import {GroupStore} from "@/5_entities/group";
import {TaskStore} from "@/5_entities/task";
import {routes} from "@/6_shared";
import cls from "./HomePage.module.scss";

const HomePage = observer(() => {
    const navigate = useNavigate();
    const user = UserStore.currentUser$.value;
    const role = user?.role;

    useEffect(() => {
        if (role === "Teacher") {
            GroupStore.fetchGroups();
            TaskStore.fetchTasks();
            TaskStore.fetchSubmissions();
        } else if (role === "Student") {
            TaskStore.fetchAssignments();
            TaskStore.fetchDescriptions();
        }
    }, [role]);

    return (
        <div className={cls.page}>
            <h1>Добро пожаловать, {user?.full_name}!</h1>

            {role === "Teacher" && (
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card hoverable onClick={() => navigate(routes.groups)}>
                            <Statistic
                                title="Группы"
                                value={GroupStore.list$.total}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable onClick={() => navigate(routes.tasks)}>
                            <Statistic
                                title="Задания"
                                value={TaskStore.list$.total}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable onClick={() => navigate(routes.tasks)}>
                            <Statistic
                                title="Решения"
                                value={TaskStore.submissions$.total}
                                prefix={<BookOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {role === "Student" && (
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card hoverable onClick={() => navigate(routes.assignments)}>
                            <Statistic
                                title="Мои задания"
                                value={TaskStore.assignments$.total}
                                prefix={<BookOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable onClick={() => navigate(routes.descriptions)}>
                            <Statistic
                                title="Мои описания"
                                value={TaskStore.descriptions$.total}
                                prefix={<EditOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
});

export default HomePage;
