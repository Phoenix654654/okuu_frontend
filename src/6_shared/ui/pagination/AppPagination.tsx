import {memo} from "react";
import {Flex, Pagination} from "antd";
import type {PaginationProps} from "antd";
import type {CSSProperties} from "react";

type Align = 'left' | 'center' | 'right';

interface AppPaginationProps extends Omit<PaginationProps, 'current' | 'pageSize' | 'total' | 'onChange' | 'align'> {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    align?: Align;
    style?: CSSProperties;
}

const alignMap: Record<Align, 'flex-start' | 'center' | 'flex-end'> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
};

export const AppPagination = memo(({page, pageSize, total, onChange, align = 'right', style, ...rest}: AppPaginationProps) => {
    return (
        <Flex justify={alignMap[align]} style={style}>
            <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showTotal={(t) => `Всего: ${t} записей`}
                onChange={onChange}
                {...rest}
            />
        </Flex>
    );
});
