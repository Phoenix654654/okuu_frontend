import cls from "./RegisterPage.module.scss";
import {RegisterForm} from "@/4_features/auth";
import {useTranslation} from "react-i18next";

const RegisterPage = () => {
    const {t} = useTranslation("auth");

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>{t("register.title")}</h1>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
