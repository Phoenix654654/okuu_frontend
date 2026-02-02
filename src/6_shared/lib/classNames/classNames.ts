export type Mods = Record<string, boolean | string | undefined>;

export function classNames(
    cls: string,
    mods: Mods = {},
    additional: Array<string | undefined> = []
): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            .filter(([_, value]: [string, boolean | string | undefined]) =>
                Boolean(value)
            )
            .map(
                ([className]: [string, boolean | string | undefined]) =>
                    className
            ),
    ].join(" ");
}
