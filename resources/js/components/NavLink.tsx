import { cn } from '@/lib/utils';
import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={cn(
                "inline-flex items-center gap-2 h-fit rounded-md font-medium leading-5 transition duration-150 ease-in-out focus:outline-none p-2.5",
                active ?
                    "bg-rose-500/80 text-primary-foreground" :
                    "text-primary-foreground/80 hover:text-primary-foreground",
                className
            )}
        >
            {children}
        </Link>
    );
}
