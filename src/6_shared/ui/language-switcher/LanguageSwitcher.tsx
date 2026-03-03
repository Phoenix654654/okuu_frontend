import {Select} from "antd";
import {useTranslation} from "react-i18next";
import {GlobalOutlined} from "@ant-design/icons";
import cls from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
    const {i18n, t} = useTranslation("layout");

    const options = [
        {value: "ru", label: t("language.ru")},
        {value: "kg", label: t("language.kg")},
    ];

    const handleChange = (lng: string) => {
        i18n.changeLanguage(lng);
        window.dispatchEvent(new Event('languageChanged'));
    };

    return (
        <Select
            className={cls.languageSwitcher}
            value={i18n.language}
            onChange={handleChange}
            options={options}
            prefixCls={cls.select}
            suffixIcon={<GlobalOutlined />}
            size="large"
        />
    );
};
