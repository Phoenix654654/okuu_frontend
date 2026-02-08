import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginPage} from "@/2_pages/auth/login";
import {RegisterPage} from "@/2_pages/auth/register";
import {VerifyOtpPage} from "@/2_pages/auth/verify_otp";
import { MainLayout } from "@/1_app/providers/router/layouts";
import ProtectedRoute from "@/1_app/providers/router/router_provider/ProtectedRoute";
import {routes} from "@/6_shared";
import { HomePage } from "@/2_pages/home";

export const AppRouter = () => {

    const router = createBrowserRouter(
        [
            {
                element: <ProtectedRoute page={<MainLayout />} />,
                children: [
                    {
                        path: routes.home,
                        element: <HomePage />,
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

    return <RouterProvider router={router} />;
};
