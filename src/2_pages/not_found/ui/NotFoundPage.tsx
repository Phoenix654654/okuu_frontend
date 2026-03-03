import {Result, Button} from "antd";
import {useNavigate} from "react-router-dom";
import {routes} from "@/6_shared";
import {useTranslation} from "react-i18next";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const {t} = useTranslation("notFound");

    return (
        <Result
            status="404"
            title="404"
            subTitle={t("subtitle")}
            extra={
                <Button type="primary" onClick={() => navigate(routes.home)}>
                    {t("backHome")}
                </Button>
            }
        />
    );
};

export default NotFoundPage;
