import Modal, { ModalProps } from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useForm as reactForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import NumberInput from "@/components/NumberInput";
import { Button } from "@/components/ui/button";
import { STOCKS } from "./Index";

const MATERIALSCHEMA = z.object({
    name: z.string().min(1, "The name field is required."),
    opening_stock: z.string().min(1, "The opening stock field is required."),
    closing_stock: z.string().min(1, "The opening stock field is required."),
});

type IFormNewMaterial = z.infer<typeof MATERIALSCHEMA>;

type Props = {
    material: STOCKS|null;
} & ModalProps;

const NewMaterial: React.FC<Props> = ({ show, onClose, material }) => {
    const form = reactForm<IFormNewMaterial>({
        resolver: zodResolver(MATERIALSCHEMA),
        values: {
            name: material?.name||"",
            opening_stock: material?.opening_stock||"",
            closing_stock: material?.closing_stock||"",
        },
    });

    const { setData, post, reset } = useForm<IFormNewMaterial>();
    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const onSubmitForm = (formData: IFormNewMaterial) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("inventory.material.create", [material?.id || null]), {
                onSuccess: ({ props }) => {
                    if (props.flash.status != "error") {
                        onClose(false);
                        form.reset();
                    }
                },
                onError: (error) => console.log(error),
                onFinish: () => {
                    reset();
                    setIsSubmitForm(false);
                },
            });
        }
    }, [isSubmitForm]);

    useEffect(() => {
        if(show) {
            setTimeout(() => {
                form.clearErrors(['name', 'closing_stock', 'opening_stock']);
            }, 0);
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md">
            <div className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Raw Material Name
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
                            name="opening_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Opening Stock
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="closing_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Closing Stock
                                    </FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                            <Button
                                variant={"ghost"}
                                className="px-6"
                                type="button"
                                onClick={() => onClose(false)}
                            >
                                Cancel
                            </Button>
                            <Button>
                                {material ? "Update" : "Create"} Raw Material
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

export default NewMaterial;
