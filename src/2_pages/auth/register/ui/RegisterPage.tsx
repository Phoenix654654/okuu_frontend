import { useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import { UserStore } from "@/5_entities/user";
import { routes } from "@/6_shared";
import { AppInput } from "@/6_shared/ui/input/AppInput";
import { AppButton } from "@/6_shared/ui/button/AppButton";
import cls from "./RegisterPage.module.scss";

const RegisterPage = observer(() => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isDisabled = !email || !fullName || !phone || !password || !passwordConfirm || loading;

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            setError("Пароли не совпадают");
            return;
        }

        setLoading(true);

        const success = await UserStore.register({
            email,
            full_name: fullName,
            phone,
            role: "Student",
            password,
            password_confirm: passwordConfirm,
        });

        setLoading(false);

        if (success) {
            navigate(`${routes.verifyOtp}?purpose=Account_verify&email=${encodeURIComponent(email)}`);
        } else {
            setError("Ошибка при регистрации");
        }
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>Регистрация</h1>
                <form className={cls.form} onSubmit={onSubmit}>
                    <AppInput
                        placeholder="ФИО"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <AppInput
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <AppInput
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <AppInput
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <AppInput
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    {error && <div className={cls.error}>{error}</div>}
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        disabled={isDisabled}
                        loading={loading}
                    >
                        Зарегистрироваться
                    </AppButton>
                    <div className={cls.link}>
                        Уже есть аккаунт? <Link to={routes.login}>Войти</Link>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default RegisterPage;
