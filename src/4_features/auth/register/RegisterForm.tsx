import {AppInput} from "@/6_shared/ui/input/AppInput.tsx";
import {AppButton} from "@/6_shared/ui/button/AppButton.tsx";
import {Link, useNavigate} from "react-router-dom";
import {routes} from "@/6_shared";
import {type FormEvent, useEffect, useState} from "react";
import {UserStore} from "@/5_entities/user";
import {groupService} from "@/5_entities/group";
import type {IGroup} from "@/5_entities/group";
import {Select} from "antd";
import {useTranslation} from "react-i18next";
import cls from "./RegisterForm.module.scss";
import {observer} from "mobx-react-lite";

export const RegisterForm = observer(() => {
    const navigate = useNavigate();
    const {t} = useTranslation("auth");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [groupId, setGroupId] = useState<number | null>(null);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        groupService.getList({limit: 100, offset: 0}).then((res) => {
            setGroups(res.results);
        });
    }, []);

    const isDisabled = !email || !fullName || !phone || !password || !passwordConfirm || !groupId || loading;

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            setError(t("register.passwordMismatch"));
            return;
        }

        if (!groupId) {
            setError(t("register.selectGroup"));
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
            group: groupId,
        });

        setLoading(false);

        if (success) {
            navigate(`${routes.verifyOtp}?purpose=Account_verify&email=${encodeURIComponent(email)}`);
        } else {
            setError(t("register.error"));
        }
    };

    return (
        <form className={cls.form} onSubmit={onSubmit}>
            <AppInput
                placeholder={t("register.fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <AppInput
                placeholder={t("register.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AppInput
                placeholder={t("register.phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Select
                placeholder={t("register.group")}
                value={groupId}
                onChange={setGroupId}
                options={groups.map((g) => ({value: g.id, label: g.name}))}
            />
            <AppInput
                type="password"
                placeholder={t("register.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <AppInput
                type="password"
                placeholder={t("register.passwordConfirm")}
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
                {t("register.submit")}
            </AppButton>
            <div className={cls.link}>
                {t("register.haveAccount")} <Link to={routes.login}>{t("register.login")}</Link>
            </div>
        </form>
    );
});
