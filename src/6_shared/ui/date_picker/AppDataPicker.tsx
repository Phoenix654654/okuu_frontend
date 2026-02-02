import {memo} from "react";
import {DatePicker} from "antd";
import type {DatePickerProps} from "antd";
import type {Dayjs} from "dayjs";

type AppDatePickerProps = DatePickerProps<Dayjs, false>;

export const AppDataPicker = memo((props: AppDatePickerProps) => {
    return <DatePicker {...props} />;
});
