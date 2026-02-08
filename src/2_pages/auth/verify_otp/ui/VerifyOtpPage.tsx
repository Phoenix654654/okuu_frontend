import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserStore } from "@/5_entities/user";
import type { OtpPurpose } from "@/5_entities/user";
import { routes } from "@/6_shared";
import { AppInput } from "@/6_shared/ui/input/AppInput";
import { AppButton } from "@/6_shared/ui/button/AppButton";
import cls from "./VerifyOtpPage.module.scss";

const PURPOSE_LABELS: Record<OtpPurpose, string> = {
    Account_verify: "Подтверждение аккаунта",
    Reset_password: "Сброс пароля",
    Change_email: "Смена email",
};

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const purpose = (searchParams.get("purpose") ?? "Account_verify") as OtpPurpose;
    const email = searchParams.get("email") ?? "";

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await UserStore.verifyOtp({ email, code, purpose });

        setLoading(false);

        if (success) {
            navigate(routes.login);
        } else {
            setError("Неверный код");
        }
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <h1 className={cls.title}>{PURPOSE_LABELS[purpose]}</h1>
                <p className={cls.subtitle}>Введите код, отправленный на вашу почту</p>
                <form className={cls.form} onSubmit={onSubmit}>
                    <AppInput
                        placeholder="Код подтверждения"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    {error && <div className={cls.error}>{error}</div>}
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        disabled={!code || loading}
                        loading={loading}
                    >
                        Подтвердить
                    </AppButton>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
