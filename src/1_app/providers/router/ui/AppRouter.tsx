import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {LoginPage} from "@/2_pages/login";
import {routes} from "@/6_shared";
import {HomePage} from "@/2_pages/home";
import {MainLayout} from "../layout/main_layout/MainLayout";
import {AvansPage} from "@/2_pages/monitoring/avans";
import {AvansBuhPage} from "@/2_pages/monitoring/avans_buh";
import {BcPage} from "@/2_pages/monitoring/bc";
import {GrantsPage} from "@/2_pages/monitoring/grants";
import {ZakupkiPage} from "@/2_pages/monitoring/zakupki";
import {SspPage} from "@/2_pages/monitoring/ssp";
import {KontragentPage} from "@/2_pages/monitoring/kontragent";
import {TrqPage} from "@/2_pages/monitoring/trq";
import {SmetaRashodovPage} from "@/2_pages/monitoring/smeta_rashodov";
import {DebetCreditPage} from "@/2_pages/monitoring/debet";
import {UserPage} from "@/2_pages/admin/user";
import {RolePage} from "@/2_pages/admin/role";
import {AuditsPageAsync} from "@/2_pages/audits";
import {AuditFormPageAsync} from "@/2_pages/AuditFormPage";

export const AppRouter = () => {

    const router = createBrowserRouter(
        [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: routes.home,
                        element: <HomePage />,
                    },
                    {
                        path: routes.monitoringAvans,
                        element: <AvansPage />,
                    },
                    {
                        path: routes.monitoringAvansBuh,
                        element: <AvansBuhPage />,
                    },
                    {
                        path: routes.monitoringBc,
                        element: <BcPage />,
                    },
                    {
                        path: routes.monitoringGrants,
                        element: <GrantsPage />,
                    },
                    {
                        path: routes.monitoringZakupki,
                        element: <ZakupkiPage />,
                    },
                    {
                        path: routes.monitoringSsp,
                        element: <SspPage />,
                    },
                    {
                        path: routes.monitoringKontragent,
                        element: <KontragentPage />,
                    },
                    {
                        path: routes.monitoringTrq,
                        element: <TrqPage />,
                    },
                    {
                        path: routes.monitoringSmetaRashodov,
                        element: <SmetaRashodovPage />,
                    },
                    {
                        path: routes.monitoringDebetCredit,
                        element: <DebetCreditPage />,
                    },
                    {
                        path:routes.adminUsers,
                        element: <UserPage/>
                    },
	                {
		                path:routes.audits,
		                element: <AuditsPageAsync/>
	                },
	                {
						path: routes.createAudit,
		                element: <AuditFormPageAsync/>
	                },
	                {
		                path: routes.updateAudit,
		                element: <AuditFormPageAsync/>,
	                },
                    {
                        path:routes.adminRoles,
                        element: <RolePage/>
                    },
                ]
            },
            {
                path: routes.login,
                element: <LoginPage />,
            }
        ]
    );

    return <RouterProvider router={router} />;
};
