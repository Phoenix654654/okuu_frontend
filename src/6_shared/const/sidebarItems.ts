import {routes} from "@/6_shared";
import {BookOutlined, CheckSquareOutlined, EditOutlined, FileTextOutlined, HomeOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {createElement} from "react";

export const teacherItems = [
    {
        key: routes.groups,
        icon: createElement(TeamOutlined),
        label: "Группы",
    },
    {
        key: routes.tasks,
        icon: createElement(FileTextOutlined),
        label: "Задания",
    },
    {
        key: routes.submissions,
        icon: createElement(CheckSquareOutlined),
        label: "Решения",
    },
];

export const studentItems = [
    {
        key: routes.assignments,
        icon: createElement(BookOutlined),
        label: "Мои задания",
    },
    {
        key: routes.descriptions,
        icon: createElement(EditOutlined),
        label: "Мои описания",
    },
];

export const adminItems = [
    {
        key: routes.groups,
        icon: createElement(TeamOutlined),
        label: "Группы",
    },
    {
        key: routes.tasks,
        icon: createElement(FileTextOutlined),
        label: "Задания",
    },
    {
        key: routes.adminUsers,
        icon: createElement(UsergroupAddOutlined),
        label: "Пользователи",
    },
];

export const commonItems = [
    {
        key: routes.home,
        icon: createElement(HomeOutlined),
        label: "Главная",
    },
    {
        key: routes.profile,
        icon: createElement(UserOutlined),
        label: "Профиль",
    },
];
