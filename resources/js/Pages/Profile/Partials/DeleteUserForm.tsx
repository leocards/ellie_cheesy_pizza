import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { z } from "zod";

const DELETEUSERSCHEMA = z.object({
    password: z.string().min(1, ""),
});

type IFormDelete = z.infer<typeof DELETEUSERSCHEMA>;

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const form = reactForm<IFormDelete>({
        resolver: zodResolver(DELETEUSERSCHEMA),
        defaultValues: {
            password: "",
        },
    });

    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const onDeleteUser = (formData: IFormDelete) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    useEffect(() => {
        if (isSubmitForm) {
            destroy(route("profile.destroy"), {
                preserveScroll: true,
                onSuccess: (page) => {
                    let { status } = page.props.flash;
                    if (status != "error") {
                        closeModal();
                    } else {
                        form.setError("password", {
                            type: "custom",
                            message: "Invalid password.",
                        });
                    }
                },
                onError: () => {
                    form.setError("password", {
                        type: "custom",
                        message: "Invalid password.",
                    });
                },
                onFinish: () => reset(),
            });
        }
    }, [isSubmitForm]);

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <Button onClick={confirmUserDeletion} className="">Delete Account</Button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onDeleteUser)}
                        className="p-6"
                    >
                        <h2 className="text-lg font-medium text-gray-900">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm you would like to
                            permanently delete your account.
                        </p>

                        <div className="mt-6">
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

                        <div className="mt-6 flex justify-end">
                            <Button type="button" variant={"secondary"} onClick={closeModal}>
                                Cancel
                            </Button>

                            <Button
                                className="ms-3 bg-red-400"
                                disabled={processing}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </form>
                </Form>
            </Modal>
        </section>
    );
}
