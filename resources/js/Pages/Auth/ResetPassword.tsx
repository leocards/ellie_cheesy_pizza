import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RESETPASSWORDSCHEMA = z.object({
    email: z.string().email(),
    token: z.string(),
    password: z.string().min(1, "The password field is required."),
    password_confirmation: z
        .string()
        .min(1, "The password confirmation field is required.")
})

type IFormResetPassword = z.infer<typeof RESETPASSWORDSCHEMA>

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const form = reactForm<IFormResetPassword>({
        resolver: zodResolver(RESETPASSWORDSCHEMA),
        defaultValues: {
            email: email,
            token: token,
            password: "",
            password_confirmation: ""
        },
    });

    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const { setData, post, processing, reset } = useForm<IFormResetPassword>();

    const onSubmitForm = (formData: IFormResetPassword) => {
        setData(formData)
        setIsSubmitForm(true)
    };

    useEffect(() => {
        if(isSubmitForm) {
            post(route('password.store'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    }, [isSubmitForm])

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitForm)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="email"
                                        className="sr-only"
                                    >
                                        Email
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-4">
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

                    <div className="mt-4">
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

                    <div className="mt-4 flex items-center justify-end">
                        <Button className="ms-4" disabled={processing}>
                            Reset Password
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
