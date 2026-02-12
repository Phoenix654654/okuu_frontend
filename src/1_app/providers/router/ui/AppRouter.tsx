import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginPage} from "@/2_pages/auth/login";
import {RegisterPage} from "@/2_pages/auth/register";
import {VerifyOtpPage} from "@/2_pages/auth/verify_otp";
import { MainLayout } from "@/1_app/providers/router/layouts";
import ProtectedRoute from "@/1_app/providers/router/router_provider/ProtectedRoute";
import {routes} from "@/6_shared";
import { HomePage } from "@/2_pages/home";
import { GroupsPage } from "@/2_pages/groups";
import { TasksPage } from "@/2_pages/tasks";
import { TaskDetailPage } from "@/2_pages/task_detail";
import { AssignmentsPage } from "@/2_pages/assignments";
import { AssignmentDetailPage } from "@/2_pages/assignment_detail";
import { DescriptionsPage } from "@/2_pages/descriptions";
import { DescriptionDetailPage } from "@/2_pages/description_detail";
import { ProfilePage } from "@/2_pages/profile";
import { UsersPage } from "@/2_pages/admin/users";
import { UserDetailPage as AdminUserDetailPage } from "@/2_pages/admin/user_detail";
import { NotFoundPage } from "@/2_pages/not_found";

const router = createBrowserRouter(
    [
        {
            element: <ProtectedRoute page={<MainLayout />} />,
            children: [
                {
                    path: routes.home,
                    element: <HomePage />,
                },
                // Teacher
                {
                    path: routes.groups,
                    element: <GroupsPage />,
                },
                {
                    path: routes.tasks,
                    element: <TasksPage />,
                },
                {
                    path: routes.taskDetail,
                    element: <TaskDetailPage />,
                },
                // Student
                {
                    path: routes.assignments,
                    element: <AssignmentsPage />,
                },
                {
                    path: routes.assignmentDetail,
                    element: <AssignmentDetailPage />,
                },
                {
                    path: routes.descriptions,
                    element: <DescriptionsPage />,
                },
                {
                    path: routes.descriptionDetail,
                    element: <DescriptionDetailPage />,
                },
                // Admin
                {
                    path: routes.adminUsers,
                    element: <UsersPage />,
                },
                {
                    path: routes.adminUserDetail,
                    element: <AdminUserDetailPage />,
                },
                // Common
                {
                    path: routes.profile,
                    element: <ProfilePage />,
                },
                {
                    path: "*",
                    element: <NotFoundPage />,
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
