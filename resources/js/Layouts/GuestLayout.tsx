import { PropsWithChildren } from "react";
import ecp_logo from "@/assets/ecp_logo.svg";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-rose-700 pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full bg-background p-9 shadow-md sm:max-w-md sm:rounded-lg relative pt-16">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-background rounded-full p-5">
                    <img src={ecp_logo} className="size-28" />
                </div>
                {children}
            </div>
        </div>
    );
}
