import Modal, { ModalProps } from "@/components/Modal";
import React, { useEffect, useRef, useState } from "react";
import { CUSTOMERSCHEMA, IFormCustomer } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/NumberInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";

type Props = {
    onSetCustomer: (customer: IFormCustomer) => void;
    customer: IFormCustomer|null
} & ModalProps;

const CustomerDetails: React.FC<Props> = ({ show, customer, onClose, onSetCustomer }) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Array<IFormCustomer>>([])

    const form = reactForm<IFormCustomer>({
        resolver: zodResolver(CUSTOMERSCHEMA),
        values: {
            id: null,
            name: customer?.name??"",
            contact: customer?.contact??"",
            address: customer?.address??"",
        },
    });

    const debouncedName = useDebounce(form.getValues('name'), 750)

    const onSubmitForm = (formDate: IFormCustomer) => {
        onSetCustomer(formDate);
        onClose(false);
    };

    const onSelectUser = (customer: IFormCustomer) => {
        form.setValue('id', customer.id, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        form.setValue('name', customer.name, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        form.setValue('contact', customer.contact, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        form.setValue('address', customer.address, { shouldDirty: true, shouldTouch: true, shouldValidate: true })

        setShowDropDown(false)
        setLoading(false)
    }

    useEffect(() => {
        if(debouncedName) {
            window.axios
                .get(route('customer.json', [debouncedName]))
                .then((response) => {
                    setCustomers(response.data)
                })
                .finally(() => setLoading(false))
        }
    }, [debouncedName])

    return (
        <Modal
            show={show}
            onClose={() => onClose(false)}
            maxWidth="md"
            closeable={false}
            center
        >
            <div className="p-6 relative">

                <Button variant="ghost" size="icon" className="absolute top-2 right-2 size-8 rounded-full" onClick={() => onClose(false)}>
                    <X className="" />
                </Button>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)}>
                        <div className="bg-background rounded-md p-3">
                            <Label className="text-lg">Customer Details</Label>

                            <div className="grid grid-cols-1 gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                Name
                                            </FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onInput={(event) => {
                                                            let text = event.target as HTMLInputElement
                                                            if(text.value !== "") {
                                                                setLoading(true)
                                                                setShowDropDown(true)
                                                            } else {
                                                                setLoading(false)
                                                                setShowDropDown(false)
                                                            }
                                                        }}
                                                    />
                                                </FormControl>

                                                {showDropDown && (
                                                    <div
                                                        className="absolute w-full mt-px border border-border h-52 bg-background shadow-md rounded-lg flex flex-col"
                                                    >
                                                        <ScrollArea className="grow p-1.5">
                                                            {loading ? (
                                                                <div className="flex py-4">
                                                                    <span className="loading loading-spinner loading-sm mx-auto"></span>
                                                                </div>
                                                            ) : customers.length > 0 ? (
                                                                <div className="flex flex-col divide-y">
                                                                    {customers.map((cl: IFormCustomer, index) => (
                                                                        <button key={index} type="button" onClick={() => onSelectUser(cl)} className="text-left p-3 hover:bg-secondary transition duration-150">
                                                                            <div className="flex">
                                                                                <Label className="text-left p-0 m-0">{cl.name}</Label>
                                                                                <div className="text-xs ml-auto">Contact: {cl.contact}</div>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-center">No results found for "{debouncedName}"</div>
                                                            )}
                                                        </ScrollArea>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            className="h-7 w-16 my-1 mr-1 ml-auto"
                                                            onClick={() =>
                                                                setShowDropDown(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                Contact No.
                                            </FormLabel>
                                            <FormControl>
                                                <NumberInput
                                                    max={11}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required">
                                                Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end px-3 mt-7">
                            <Button className="w-28">Save</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

export default CustomerDetails;
