import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FORGOTPASSWORDSCHEMA = z.object({
    email: z.string().email({ message: "Please provide valid email."}).optional(),
});

type IFormForgotPassword = z.infer<typeof FORGOTPASSWORDSCHEMA>;

export default function ForgotPassword({ status }: { status?: string }) {
    const form = reactForm<IFormForgotPassword>({
        resolver: zodResolver(FORGOTPASSWORDSCHEMA),
        defaultValues: {
            email: ""
        }
    });

    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const { data, setData, post, processing, errors } = useForm();

    const onSubmitForm = (formData: IFormForgotPassword) => {
        setData(formData)
        setIsSubmitForm(true)
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("password.email"), {
                onFinish: () => {
                    setIsSubmitForm(false)
                }
            });
        }
    }, [isSubmitForm]);

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitForm)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="mt-4 flex items-center justify-end">
                        <Button className="ms-4" disabled={processing}>
                            Email Password Reset Link
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
