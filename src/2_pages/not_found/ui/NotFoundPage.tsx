import {Result, Button} from "antd";
import {useNavigate} from "react-router-dom";
import {routes} from "@/6_shared";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="404"
            subTitle="Страница не найдена"
            extra={
                <Button type="primary" onClick={() => navigate(routes.home)}>
                    На главную
                </Button>
            }
        />
    );
};

export default NotFoundPage;
