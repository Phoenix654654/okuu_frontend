import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginPage} from "@/2_pages/auth/login";
import {RegisterPage} from "@/2_pages/auth/register";
import {VerifyOtpPage} from "@/2_pages/auth/verify_otp";
import { MainLayout } from "@/1_app/providers/router/layouts";
import ProtectedRoute from "@/1_app/providers/router/router_provider/ProtectedRoute";
import {routes} from "@/6_shared";
import { HomePage } from "@/2_pages/home";
import { GroupsPage } from "@/2_pages/groups";
import { GroupDetailPage } from "@/2_pages/group_detail";
import { TasksPage } from "@/2_pages/tasks";
import { TaskDetailPage } from "@/2_pages/task_detail";
import { AssignmentsPage } from "@/2_pages/assignments";
import { AssignmentDetailPage } from "@/2_pages/assignment_detail";
import { DescriptionsPage } from "@/2_pages/descriptions";
import { DescriptionDetailPage } from "@/2_pages/description_detail";
import { SubmissionsPage } from "@/2_pages/submissions";
import { SubmissionDetailPage } from "@/2_pages/submission_detail";
import { ProfilePage } from "@/2_pages/profile";
import { UsersPage } from "@/2_pages/admin/users";
import { UserDetailPage as AdminUserDetailPage } from "@/2_pages/admin/user_detail";
import { NotFoundPage } from "@/2_pages/not_found";
import {Suspense, type ReactElement} from "react";
import {Spin} from "antd";
import i18n from "@/6_shared/config/i18n/i18n";

// Обертка для ленивой загрузки переводов на странице
function withTranslationSuspense(element: ReactElement) {
    return (
        <Suspense fallback={<Spin size="large" />}>
            {element}
        </Suspense>
    );
}

const createNamespacesLoader = (namespaces: string[]) => async () => {
    await i18n.loadNamespaces(namespaces);
    return null;
};

const router = createBrowserRouter(
    [
        {
            element: <ProtectedRoute page={<MainLayout />} />,
            loader: createNamespacesLoader(["layout"]),
            children: [
                {
                    path: routes.home,
                    element: withTranslationSuspense(<HomePage />),
                    loader: createNamespacesLoader(["home"]),
                },
                // Teacher
                {
                    path: routes.groups,
                    element: withTranslationSuspense(<GroupsPage />),
                    loader: createNamespacesLoader(["groups"]),
                },
                {
                    path: routes.groupDetail,
                    element: withTranslationSuspense(<GroupDetailPage />),
                    loader: createNamespacesLoader(["groupDetail"]),
                },
                {
                    path: routes.tasks,
                    element: withTranslationSuspense(<TasksPage />),
                    loader: createNamespacesLoader(["tasks"]),
                },
                {
                    path: routes.taskDetail,
                    element: withTranslationSuspense(<TaskDetailPage />),
                    loader: createNamespacesLoader(["taskDetail"]),
                },
                {
                    path: routes.submissions,
                    element: withTranslationSuspense(<SubmissionsPage />),
                    loader: createNamespacesLoader(["submissions"]),
                },
                {
                    path: routes.submissionDetail,
                    element: withTranslationSuspense(<SubmissionDetailPage />),
                    loader: createNamespacesLoader(["submissionDetail"]),
                },
                // Student
                {
                    path: routes.assignments,
                    element: withTranslationSuspense(<AssignmentsPage />),
                    loader: createNamespacesLoader(["assignments"]),
                },
                {
                    path: routes.assignmentDetail,
                    element: withTranslationSuspense(<AssignmentDetailPage />),
                    loader: createNamespacesLoader(["assignmentDetail"]),
                },
                {
                    path: routes.descriptions,
                    element: withTranslationSuspense(<DescriptionsPage />),
                    loader: createNamespacesLoader(["descriptions"]),
                },
                {
                    path: routes.descriptionDetail,
                    element: withTranslationSuspense(<DescriptionDetailPage />),
                    loader: createNamespacesLoader(["descriptionDetail"]),
                },
                // Admin
                {
                    path: routes.adminUsers,
                    element: withTranslationSuspense(<UsersPage />),
                    loader: createNamespacesLoader(["users"]),
                },
                {
                    path: routes.adminUserDetail,
                    element: withTranslationSuspense(<AdminUserDetailPage />),
                    loader: createNamespacesLoader(["userDetail"]),
                },
                // Common
                {
                    path: routes.profile,
                    element: withTranslationSuspense(<ProfilePage />),
                    loader: createNamespacesLoader(["profile"]),
                },
                {
                    path: "*",
                    element: withTranslationSuspense(<NotFoundPage />),
                    loader: createNamespacesLoader(["notFound"]),
                },
            ]
        },
        {
            path: routes.login,
            element: <LoginPage />,
            loader: createNamespacesLoader(["auth"]),
        },
        {
            path: routes.register,
            element: <RegisterPage />,
            loader: createNamespacesLoader(["auth"]),
        },
        {
            path: routes.verifyOtp,
            element: <VerifyOtpPage />,
            loader: createNamespacesLoader(["auth"]),
        }
    ]
);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
