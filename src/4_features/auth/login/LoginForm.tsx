import {type FormEvent, useState} from 'react';
import {AppInput} from "@/6_shared/ui/input/AppInput.tsx";
import {AppButton} from "@/6_shared/ui/button/AppButton.tsx";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "@/6_shared";
import {UserStore} from "@/5_entities/user";
import {observer} from "mobx-react-lite";
import cls from "./LoginForm.module.scss";

export const LoginForm = observer(() => {
    const navigate = useNavigate();
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
            setError("Неверный email или пароль");
        }
    };

    return (
        <form className={cls.form} onSubmit={onSubmit}>
            <AppInput
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AppInput
                type="password"
                placeholder="Пароль"
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
                Войти
            </AppButton>
            <div className={cls.link}>
                Нет аккаунта? <Link to={routes.register}>Зарегистрироваться</Link>
            </div>
        </form>
    );
});
