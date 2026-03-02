import {routes} from "@/6_shared";
import {BookOutlined, CheckSquareOutlined, EditOutlined, FileTextOutlined, HomeOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {createElement} from "react";
import i18next from "i18next";

const getT = () => i18next.t;

export const getTeacherItems = () => [
    {
        key: routes.groups,
        icon: createElement(TeamOutlined),
        label: getT()("sidebar.groups"),
    },
    {
        key: routes.tasks,
        icon: createElement(FileTextOutlined),
        label: getT()("sidebar.tasks"),
    },
    {
        key: routes.submissions,
        icon: createElement(CheckSquareOutlined),
        label: getT()("sidebar.submissions"),
    },
];

export const getStudentItems = () => [
    {
        key: routes.assignments,
        icon: createElement(BookOutlined),
        label: getT()("sidebar.assignments"),
    },
    {
        key: routes.descriptions,
        icon: createElement(EditOutlined),
        label: getT()("sidebar.descriptions"),
    },
];

export const getAdminItems = () => [
    {
        key: routes.groups,
        icon: createElement(TeamOutlined),
        label: getT()("sidebar.groups"),
    },
    {
        key: routes.tasks,
        icon: createElement(FileTextOutlined),
        label: getT()("sidebar.tasks"),
    },
    {
        key: routes.adminUsers,
        icon: createElement(UsergroupAddOutlined),
        label: getT()("sidebar.users"),
    },
];

export const getCommonItems = () => [
    {
        key: routes.home,
        icon: createElement(HomeOutlined),
        label: getT()("sidebar.home"),
    },
    {
        key: routes.profile,
        icon: createElement(UserOutlined),
        label: getT()("sidebar.profile"),
    },
];
