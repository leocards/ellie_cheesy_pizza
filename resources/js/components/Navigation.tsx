import React from "react";
import ecp_logo from "@/assets/ecp_logo.svg"
import { Link, router, usePage } from "@inertiajs/react";
import NavLink from "./NavLink";
import { Blocks, ChevronLeft, ClipboardList, LayoutGrid, LogOut, PanelLeftClose, ShoppingBasket, UsersRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { User } from "@/types";

type Props = {
    user: User
    showNavigation: boolean,
    setShowNavigation: (show: boolean) => void
}

const Navigation: React.FC<Props> = ({ user, showNavigation, setShowNavigation}) => {
    const { url } = usePage()

    return (
        <div
            className={cn(
                "lg:block fixed inset-y-0 left-0 max-lg:p-2 max-lg:bg-black/30 w-full lg:w-72 overflow-hidden z-10",
                !showNavigation && "hidden"
            )}>
            <div className="bg-rose-700 w-72 h-full lg:h-screen flex flex-col max-lg:ring-1 max-lg:ring-rose-600 max-lg:rounded-lg max-lg:shadow-md relative">
                <Button className="mr-3 lg:hidden absolute -right-14" variant="outline" size="icon" onClick={() => setShowNavigation(false)}>
                    <PanelLeftClose className="!size-5" />
                </Button>

                <div className="h-16 px-4 flex items-center bo rder-b border-rose-500 gap-3 shrink-0">
                    <Link href="/dashboard" className="bg-white size-12 rounded-full flex items-center justify-center">
                        <img src={ecp_logo} alt="logo" className="size-10" />
                    </Link>

                    <div className="uppercase text-primary-foreground font-bold text-lg">Ellie's Cheesy Pizza</div>
                </div>

                <div className="flex flex-col px-4 py-6 gap-2 grow">
                    <NavLink href="/dashboard" active={url.startsWith('/dashboard')}>
                        <LayoutGrid className="size-5" />
                        <div>Dashboard</div>
                    </NavLink>
                    {user.role === "admin" && (
                        <NavLink href="/users" active={url.startsWith('/users')}>
                            <UsersRound className="size-5" />
                            <div>Users</div>
                        </NavLink>
                    )}
                    <NavLink href={route('inventory.finish')} active={url.startsWith('/inventory')}>
                        <ClipboardList className="size-5" />
                        <div>Inventory</div>
                    </NavLink>
                    <NavLink href={route('manage.inventory.finish')} active={url.startsWith('/stocks')}>
                        <Blocks className="size-5" />
                        <div>Manage stocks</div>
                    </NavLink>
                    {user.role === "admin" && (
                        <NavLink href={route('orders')} active={url.startsWith('/orders')}>
                            <ShoppingBasket className="size-5" />
                            <div>Orders</div>
                        </NavLink>
                    )}

                    <NavLink href={route('logout')} active={false} className="mt-auto">
                        <LogOut className="size-5" />
                        <div>Logout</div>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
