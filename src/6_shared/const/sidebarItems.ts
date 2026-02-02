export interface SidebarChild {
    titleKey: string;
    to?: string;
    children?: SidebarChild[];
    permission?: string | string[];
}

export interface SidebarItem {
    icon: string;
    titleKey?: string;
    children?: SidebarChild[];
    permission?: string | string[];
}

export const sidebarItems: SidebarItem[] = []
