import cls from "./RegisterPage.module.scss";
import {RegisterForm} from "@/4_features/auth";

const RegisterPage = () => {

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>Регистрация</h1>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
