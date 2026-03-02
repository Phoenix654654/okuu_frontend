import {type FormEvent, useState} from 'react';
import {AppInput} from "@/6_shared/ui/input/AppInput.tsx";
import {AppButton} from "@/6_shared/ui/button/AppButton.tsx";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "@/6_shared";
import {UserStore} from "@/5_entities/user";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import cls from "./LoginForm.module.scss";

export const LoginForm = observer(() => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loading = UserStore.currentUser$.loading;
    const isDisabled = !email || !password || loading;

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        const success = await UserStore.login({ email, password });

        if (success) {
            navigate(routes.home);
        } else {
            setError(t("login.error"));
        }
    };

    return (
        <form className={cls.form} onSubmit={onSubmit}>
            <AppInput
                placeholder={t("login.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AppInput
                type="password"
                placeholder={t("login.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className={cls.error}>{error}</div>}
            <AppButton
                type="primary"
                htmlType="submit"
                disabled={isDisabled}
                loading={loading}
            >
                {t("login.submit")}
            </AppButton>
            <div className={cls.link}>
                {t("login.noAccount")} <Link to={routes.register}>{t("login.register")}</Link>
            </div>
        </form>
    );
});
