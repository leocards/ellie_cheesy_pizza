import Processing from "@/components/Processing";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";

const LOGINSCHEMA = z.object({
    username: z.string().min(1, "The username field is required."),
    password: z.string().min(1, "The password field is required."),
    remember: z.boolean().default(false),
    auth_as: z.string(),
});

type IFormLogin = z.infer<typeof LOGINSCHEMA>;

export default function Login({
    status,
    login_as,
}: {
    status?: string;
    login_as: string;
}) {
    const form = reactForm<IFormLogin>({
        resolver: zodResolver(LOGINSCHEMA),
        defaultValues: {
            username: "",
            password: "",
            remember: false,
            auth_as: login_as
        },
    });

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [isViewPassword, setIsViewPassword] = useState<boolean>(false);

    const { setData, post, processing, errors } = useForm<IFormLogin>();
    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const submit = (formData: IFormLogin) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("login.auth"), {
                onFinish: () => setIsSubmitForm(false),
            });
        }
    }, [isSubmitForm]);

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                    <div className="font-semibold text-xl text-rose-800 text-center capitalize my-3">
                        {login_as}
                    </div>

                    {errors.hasOwnProperty(0) && (
                        <div className="my-3 text-center text-primary">{(errors as Record<number, string>)[0]}</div>
                    )}

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Username
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Password
                                    </FormLabel>

                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                ref={(e) => {
                                                    field.ref(e);
                                                    if (e)
                                                        passwordRef.current = e;
                                                }}
                                            />
                                        </FormControl>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            className="absolute top-1/2 -translate-y-1/2 right-[6px] size-9 gap-0 !p-0 hover:!bg-transparent opacity-60 hover:opacity-100"
                                            onClick={() => {
                                                if (
                                                    passwordRef.current
                                                        ?.type === "password"
                                                ) {
                                                    passwordRef.current.type =
                                                        "text";
                                                    setIsViewPassword(true);
                                                } else if (
                                                    passwordRef.current
                                                        ?.type === "text"
                                                ) {
                                                    passwordRef.current.type =
                                                        "password";
                                                    setIsViewPassword(false);
                                                }
                                            }}
                                        >
                                            {!isViewPassword ? (
                                                <Eye className="!size-5" />
                                            ) : (
                                                <EyeOff className="!size-5" />
                                            )}
                                        </Button>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Remember me</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button className="w-full mt-7">
                        {processing ? (
                            <span className="loading loading-dots loading-sm"></span>
                        ) : "Login"}
                    </Button>

                    <div className="w-fit mx-auto mt-3">
                        <Button
                            className=""
                            variant={"link"}
                            onClick={() => router.get("/")}
                            type="button"
                        >
                            <Undo2 />
                            <div>Back</div>
                        </Button>
                    </div>
                </form>
            </Form>

            <Processing />
        </GuestLayout>
    );
}
