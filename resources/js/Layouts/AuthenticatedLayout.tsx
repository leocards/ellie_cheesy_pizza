import Navigation from "@/components/Navigation";
import Processing from "@/components/Processing";
import { AvatarProfile } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useProcessing } from "@/hooks/ProcessingProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link, router, usePage } from "@inertiajs/react";
import { Bell, Info, Menu, PartyPopper, TriangleAlert } from "lucide-react";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const Title: React.FC<{ status: "success" | "message" | "error"; title: string; }> = ({
    status, title
}) => {
    const icon = {
        error: <TriangleAlert className="size-3.5"/>,
        message: <Info className="size-3.5"/>,
        success: <PartyPopper className="size-3.5" />,
    }[status]

    const color = {
        error: "text-red-500",
        message: "text-blue-500",
        success: "text-green-500",
    }[status]

    return (
        <div className={cn("flex gap-1 items-center", color)}>
            {status && icon}
            <div>{title}</div>
        </div>
    )
};

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user
    const { toast } = useToast()
    const { setProcessing } = useProcessing()
    const [showNavigation, setShowNavigation] = useState(false)

    useEffect(() => {
        let removeStartEventListener = router.on('start', () => setProcessing(true))
        let removeFinishEventListener = router.on("finish", () => setProcessing(false))

        let removeSuccessEventListener = router.on("success", (event) => {
            let { message, status, title } = event.detail.page.props.flash
            if(message)
                toast({
                    variant: "default",
                    title: <Title status={status} title={title} />,
                    description: message,
                });
        });

        return () => {
            removeStartEventListener()
            removeFinishEventListener()
            removeSuccessEventListener()
        }
    }, [])

    return (
        <div className="relative isolate min-h-svh w-full flex flex-col">

            <Navigation user={user} showNavigation={showNavigation} setShowNavigation={setShowNavigation} />

            <div className="lg:pl-72 relative flex flex-col grow">
                <div className="bg-white shadow-sm h-48 w-full lg:w-[calc(100%-18rem)] absolute top-0 left-0 lg:left-72 -z-[1]"></div>
                <div className="w-full h-16 border-b flex items-center px-3">
                    <Button className="mr-3 lg:hidden" variant="ghost" size="icon" onClick={() => setShowNavigation(true)}>
                        <Menu className="!size-5" />
                    </Button>
                    <div className="[&_h2]:max-lg:!text-lg">
                        {header}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center gap-3 p-1.5 hover:bg-secondary rounded-md px-3" onClick={() => router.get(route('profile.edit'))} role="button">
                            <AvatarProfile className="size-9" src={user.avatar} />
                            <div className="max-lg:hidden">
                                <div className="text-sm font-medium">{`${user.first_name} ${user.last_name}`}</div>
                                <div className="text-sm leading-4 font-medium text-foreground/70">{`${user.email}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="grow flex flex-1 flex-col">
                    <div className="p-5 lg:p-8 h-auto">
                        <div className="mx-auto max-w-6xl">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {createPortal(<Toaster />, document.body)}

            <Processing />
        </div>
    );
}
