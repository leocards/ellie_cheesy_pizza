import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";

const UPDATEPASSWORDSCHEMA = z.object({
    current_password: z
        .string()
        .min(1, "The current password field is required."),
    password: z.string().min(1, "The password field is required."),
    password_confirmation: z
        .string()
        .min(1, "The password confirmation field is required."),
});

type IFormUpdatePassword = z.infer<typeof UPDATEPASSWORDSCHEMA>;

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const form = reactForm<IFormUpdatePassword>({
        resolver: zodResolver(UPDATEPASSWORDSCHEMA),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });
    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm<IFormUpdatePassword>();

    const onUpdatePassword = (formData: IFormUpdatePassword) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            put(route("password.update"), {
                preserveScroll: true,
                onSuccess: () => reset(),
                onError: (errors) => {
                    if (errors.password) {
                        reset("password", "password_confirmation");
                        passwordInput.current?.focus();
                    }

                    if (errors.current_password) {
                        reset("current_password");
                        currentPasswordInput.current?.focus();
                    }
                },
            });
        }
    }, [isSubmitForm]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onUpdatePassword)}
                    className="mt-6 space-y-6"
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Current Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} placeholder="Password" />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} placeholder="Password" />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="password_confirmation"
                                        className="sr-only"
                                    >
                                        Confirm Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} placeholder="Confirm Password" />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing} variant="outline" className="px-8 shadow-sm">Save</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </Form>
        </section>
    );
}
