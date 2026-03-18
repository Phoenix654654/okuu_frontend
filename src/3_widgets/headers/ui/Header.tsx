import {Button} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {LanguageSwitcher} from "@/6_shared/ui/language-switcher";
import cls from "./Header.module.scss";

type HeaderProps = {
    showMenuButton?: boolean;
    onToggleSidebar?: () => void;
};

export const Header = observer(({showMenuButton = false, onToggleSidebar}: HeaderProps) => {
    return (
        <div className={cls.header}>
            {showMenuButton && (
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    size="large"
                    className={cls.menuBtn}
                    aria-label="Menu"
                    onClick={onToggleSidebar}
                />
            )}

            <div className={cls.spacer} />
            <div className={cls.actions}>
                <LanguageSwitcher />
            </div>
        </div>
    );
});
