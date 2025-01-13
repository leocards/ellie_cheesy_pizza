import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CONFIRMPASSWORDSCHEMA = z.object({
    password: z.string().min(1, ""),
});

type IFormConfirmPassword = z.infer<typeof CONFIRMPASSWORDSCHEMA>;

export default function ConfirmPassword() {
    const form = reactForm<IFormConfirmPassword>({
        resolver: zodResolver(CONFIRMPASSWORDSCHEMA),
        defaultValues: {
            password: "",
        },
    });

    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const { data, setData, post, processing, errors, reset } =
        useForm<IFormConfirmPassword>();

    const onSubmitForm = (formData: IFormConfirmPassword) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("password.confirm"), {
                onFinish: () => {
                    reset("password")
                    setIsSubmitForm(false)
                },
            });
        }
    }, [isSubmitForm]);

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-gray-600">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={form.handleSubmit(onSubmitForm)}>
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

                <div className="mt-4 flex items-center justify-end">
                    <Button className="ms-4" disabled={processing}>
                        Confirm
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
