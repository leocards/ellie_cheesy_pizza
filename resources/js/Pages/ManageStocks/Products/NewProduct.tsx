import Modal, { ModalProps } from "@/components/Modal";
import { z } from "zod";
import { useForm } from "@inertiajs/react";
import { useForm as reactForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import NumberInput from "@/components/NumberInput";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/components/SelectOption";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Upload, X } from "lucide-react";
import { PRODUCT } from "./Index";
import { allowedMimeTypes } from "@/Pages/Users/types";
import ecp_logo from "@/assets/ecp_logo.svg"

const NEWPRODUCTSCHEMA = z.object({
    name: z.string().min(1, "The name field is required."),
    size: z.enum(["small", "medium", "large"]),
    price: z.string().min(1, "The price field is required."),
    opening_stock: z.string().min(1, "The opening stock field is required."),
    closing_stock: z.string().min(1, "The opening stock field is required."),
    thumbnail: z
        .instanceof(File, { message: "Please choose a file." })
        .optional()
        .nullable()
        .refine(
            (file) => {
                if (file) {
                    if (!allowedMimeTypes.includes(file.type)) return false;
                }
                return true;
            },
            {
                message: "Only JPEG, JPG, and PNG files are allowed.",
            }
        )
        .refine(
            (file) => {
                if (file) {
                    if (parseFloat((file.size / (1024*1024)).toFixed(2)) > 10) return false;
                }

                return true;
            },
            {
                message: "File size should not exceed 10MB",
            }
        ),
});

type IFormNewProduct = z.infer<typeof NEWPRODUCTSCHEMA>;

type Props = ModalProps & {
    product: PRODUCT | null;
};

const NewProduct: React.FC<Props> = ({ show, product, onClose }) => {
    const form = reactForm<IFormNewProduct>({
        resolver: zodResolver(NEWPRODUCTSCHEMA),
        defaultValues: {
            name: "",
            size: undefined,
            price: "",
            opening_stock: "",
            closing_stock: "",
        },
    });

    const watchThumbnail = form.watch("thumbnail");
    const thumbnailRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { setData, post, reset } = useForm<IFormNewProduct>();
    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const onSubmitForm = (formData: IFormNewProduct) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("inventory.create", [product?.id || null]), {
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
        if (show && product) {
            let size = product.size;
            form.setValue("name", product.name, {
                shouldTouch: true,
                shouldDirty: true,
                shouldValidate: true,
            });
            form.setValue("price", product.price, {
                shouldTouch: true,
                shouldDirty: true,
                shouldValidate: true,
            });
            form.setValue("opening_stock", product.opening_stock, {
                shouldTouch: true,
                shouldDirty: true,
                shouldValidate: true,
            });
            form.setValue("closing_stock", product.closing_stock, {
                shouldTouch: true,
                shouldDirty: true,
                shouldValidate: true,
            });
            setTimeout(() => {
                form.setValue("size", size, {
                    shouldTouch: true,
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }, 10);
        }

        if (show) {
            setTimeout(() => {
                form.clearErrors([
                    "name",
                    "closing_stock",
                    "opening_stock",
                    "size",
                ]);
            }, 0);
        }
    }, [show, product]);

    useEffect(() => {
        // set preview for avatar
        if (watchThumbnail instanceof File) {
            const previewUrl = URL.createObjectURL(watchThumbnail);
            setPreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
        if (!watchThumbnail) {
            setPreview(null);
        }
    }, [watchThumbnail]);

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="lg">
            <div className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitForm)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/jpg,image/jpeg,image/png"
                                            className="form-input !hidden"
                                            onBlur={field.onBlur}
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                console.log(file);
                                                if (file) {
                                                    if (
                                                        [
                                                            "image/jpg",
                                                            "image/jpeg",
                                                            "image/png",
                                                        ].includes(file.type)
                                                    )
                                                        field.onChange(file);
                                                }
                                            }}
                                            name={field.name}
                                            ref={(el) => {
                                                field.ref(el);
                                                thumbnailRef.current = el;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mx-auto h-32 w-40 shadow-md border border-border rounded-md relative overflow-hidden flex">
                            <div
                                className={cn(
                                    "absolute h-10 bottom-0 left-0 w-full bg-gradient-to-t from-black/60 z-10 flex justify-center items-end gap-2 p-1",

                                )}>
                                {preview && <Button
                                    type="button"
                                    className="size-7"
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => form.setValue('thumbnail', null)}
                                >
                                    <X className="size-4" />
                                </Button>}
                                <Button
                                    type="button"
                                    className="size-7"
                                    size="icon"
                                    variant="secondary"
                                    onClick={() =>
                                        thumbnailRef.current?.click()
                                    }
                                >
                                    <Upload className="size-4" />
                                </Button>
                            </div>
                            <img src={(preview??product?.thumbnail)??ecp_logo} className={cn("object-cover", preview?"size-full":"size-28 mx-auto my-auto")} alt="" />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required">
                                        Poduct Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">
                                            Size
                                        </FormLabel>
                                        <SelectOption onChange={field.onChange}>
                                            <SelectOptionTrigger>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-1 !justify-start font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring ",
                                                            "disabled:!opacity-100 disabled:text-foreground/40 disabled:!cursor-not-allowed disabled:!pointer-events-auto",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="capitalize">
                                                            {field.value
                                                                ? field.value
                                                                : "Select"}
                                                        </span>
                                                        <ChevronDown className="size-4 ml-auto" />
                                                    </Button>
                                                </FormControl>
                                            </SelectOptionTrigger>
                                            <SelectOptionContent>
                                                <SelectOptionItem
                                                    value="small"
                                                    className="capitalize"
                                                />
                                                <SelectOptionItem
                                                    value="medium"
                                                    className="capitalize"
                                                />
                                                <SelectOptionItem
                                                    value="large"
                                                    className="capitalize"
                                                />
                                            </SelectOptionContent>
                                        </SelectOption>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">
                                            Price
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput {...field} isAmount />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>


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
                                {product ? "Update" : "Create"} Product
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};

export default NewProduct;
