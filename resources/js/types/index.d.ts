export interface User {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    sex: "male" | "female";
    birthdate: string;
    role: "admin" | "staff";
    address: string;
    mobile: string;
    email: string;
    avatar: string;
    username: string;
}

export interface flashProps {
    message: string;
    status: "success" | "message" | "error";
    title: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: flashProps
};

export interface PAGINATEDDATA<T> {
    current_page: number,
    data: Array<T>,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Array<{active: boolean; label: StaticRange; url: string|null}>,
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number
}

export type PRODUCTSIZES = 'small' | 'medium' | 'large';
