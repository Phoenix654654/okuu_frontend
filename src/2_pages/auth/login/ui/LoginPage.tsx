import { observer } from "mobx-react-lite";
import cls from "./LoginPage.module.scss";
import {LoginForm} from "@/4_features/auth";
import {useTranslation} from "react-i18next";

const LoginPage = observer(() => {
    const {t} = useTranslation("auth");

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>{t("login.title")}</h1>
                <LoginForm />
            </div>
        </div>
    );
});

export default LoginPage;
