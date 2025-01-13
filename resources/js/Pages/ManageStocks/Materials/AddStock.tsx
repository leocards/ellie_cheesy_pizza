import Modal, { ModalProps } from "@/components/Modal";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { STOCKS } from "./Index";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/NumberInput";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";

const ADDSTOCK = z.object({
    rawId: z.number().nullable(),
    quantity: z.string().min(1, "The quantity field is required.")
})

type IFormAddStock = z.infer<typeof ADDSTOCK>

type Props = ModalProps & {
    material: STOCKS | null
}

const AddStock: React.FC<Props> = ({ show, material, onClose }) => {
    const [productName, setProductName] = useState(material?.name)
    const form = reactForm<IFormAddStock>({
        resolver: zodResolver(ADDSTOCK),
        defaultValues: {
            rawId: material?.id||null,
            quantity: ""
        }
    })

    const watchQuantity = form.watch('quantity')

    const { setData, post, reset } = useForm<IFormAddStock>()
    const [isSubmitForm, setIsSubmitForm] = useState(false)

    const onSubmitForm = (formData: IFormAddStock) => {
        setData(formData)
        setIsSubmitForm(true)
    }

    useEffect(() => {
        if(isSubmitForm) {
            post(route('manage.inventory.raw.add_stock', [material?.id]), {
                onSuccess: () => {
                    form.reset()
                    onClose(false)
                },
                onError: (error) => console.log(error),
                onFinish: () => {
                    setIsSubmitForm(false)
                    reset()
                }
            })
        }
    }, [isSubmitForm])

    useEffect(() => {
        if((parseInt(watchQuantity) > parseInt(material?.closing_stock||"0"))) {
            form.setError('quantity', {message: "The quantity must not exceed to closing stock of "+material?.closing_stock+"."}, {
                shouldFocus: true
            })
        } else if((parseInt(material?.stock_in||"0") + parseInt(watchQuantity)) > parseInt(material?.closing_stock||"0")) {
            form.setError('quantity', {message: "The closing stock is "+material?.closing_stock+"."}, {
                shouldFocus: true
            })
        } else {
            form.clearErrors('quantity')
        }
    }, [watchQuantity])

    useEffect(() => {
        if(show) {
            setProductName(material?.name)
        }
    }, [show])

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="sm" center={true}>
            <div className="p-6">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)}>
                        <div className="mb-4 text-center">
                            <Label className="text-base">{productName}</Label>
                        </div>

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">Quantity</FormLabel>
                                    <FormControl>
                                        <NumberInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between mt-5">
                            <Button variant={"ghost"} className="px-6" type="button" onClick={() => onClose(false)}>
                                Cancel
                            </Button>
                            <Button>
                                Add stock
                            </Button>
                        </div>

                    </form>
                </Form>

            </div>
        </Modal>
    );
};

export default AddStock;
