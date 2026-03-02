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
import {Suspense} from "react";
import {Spin} from "antd";

// Обертка для ленивой загрузки переводов на странице
function withTranslationSuspense<P extends object>(
    Component: React.ComponentType<P>
) {
    return function TranslatedComponent(props: P) {
        return (
            <Suspense fallback={<Spin size="large" />}>
                <Component {...props} />
            </Suspense>
        );
    };
}

const router = createBrowserRouter(
    [
        {
            element: <ProtectedRoute page={<MainLayout />} />,
            children: [
                {
                    path: routes.home,
                    element: withTranslationSuspense(<HomePage />),
                },
                // Teacher
                {
                    path: routes.groups,
                    element: withTranslationSuspense(<GroupsPage />),
                },
                {
                    path: routes.groupDetail,
                    element: withTranslationSuspense(<GroupDetailPage />),
                },
                {
                    path: routes.tasks,
                    element: withTranslationSuspense(<TasksPage />),
                },
                {
                    path: routes.taskDetail,
                    element: withTranslationSuspense(<TaskDetailPage />),
                },
                {
                    path: routes.submissions,
                    element: withTranslationSuspense(<SubmissionsPage />),
                },
                {
                    path: routes.submissionDetail,
                    element: withTranslationSuspense(<SubmissionDetailPage />),
                },
                // Student
                {
                    path: routes.assignments,
                    element: withTranslationSuspense(<AssignmentsPage />),
                },
                {
                    path: routes.assignmentDetail,
                    element: withTranslationSuspense(<AssignmentDetailPage />),
                },
                {
                    path: routes.descriptions,
                    element: withTranslationSuspense(<DescriptionsPage />),
                },
                {
                    path: routes.descriptionDetail,
                    element: withTranslationSuspense(<DescriptionDetailPage />),
                },
                // Admin
                {
                    path: routes.adminUsers,
                    element: withTranslationSuspense(<UsersPage />),
                },
                {
                    path: routes.adminUserDetail,
                    element: withTranslationSuspense(<AdminUserDetailPage />),
                },
                // Common
                {
                    path: routes.profile,
                    element: withTranslationSuspense(<ProfilePage />),
                },
                {
                    path: "*",
                    element: withTranslationSuspense(<NotFoundPage />),
                },
            ]
        },
        {
            path: routes.login,
            element: <LoginPage />,
        },
        {
            path: routes.register,
            element: <RegisterPage />,
        },
        {
            path: routes.verifyOtp,
            element: <VerifyOtpPage />,
        }
    ]
);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
