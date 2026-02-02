import {memo, type ReactNode} from 'react';
import {Button} from "antd";
import type {ButtonProps} from "antd/es/button/Button";

interface AppButtonProps extends ButtonProps {
    children: ReactNode;
}

export const AppButton = memo((props: AppButtonProps) => {
    const { children } = props;

    return (
        <Button
            {...props}
        >
            {children}
        </Button>
    );
});

