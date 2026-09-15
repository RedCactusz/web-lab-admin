export interface MenuItem {
    id: number;
    label: string;
    path?: string;
    children?: MenuItem[];
}