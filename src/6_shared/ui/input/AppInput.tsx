import { Input } from "antd";
import type { InputProps } from "antd/lib";
import {memo} from "react";

interface AppInputProps extends InputProps {
    type?: "text" | "password";
}

export const AppInput = memo((props: AppInputProps) => {
    const { type = "text" } = props;

    return (
        <>
            {type === "password" ? <Input.Password
                {...props}
            /> : <Input
                {...props}
            />}
        </>
    );
});

