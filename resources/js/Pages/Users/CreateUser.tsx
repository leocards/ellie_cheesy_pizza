import { AvatarProfile } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { ChevronDown, Undo2, Upload, X } from "lucide-react";
import { useForm as reactForm } from "react-hook-form";
import { calculateAge, IFormUser, InitialValues, USERSCHEMA } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CalendarInput from "@/components/CalendarInput";
import { cn } from "@/lib/utils";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/components/SelectOption";
import NumberInput from "@/components/NumberInput";
import { User } from "@/types";

type Props = {
    user: User;
};

const CreateUser: React.FC<Props> = ({ user }) => {
    const form = reactForm<IFormUser>({
        resolver: zodResolver(USERSCHEMA),
        values: InitialValues(user),
    });

    const watchBirthday = form.watch("birthdate");
    const watchAvatar = form.watch("avatar");

    const avatarRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const { setData, post, reset } = useForm<IFormUser>();

    const onSubmitForm = (formData: IFormUser) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            post(route("users.store", [user?.id]), {
                onError: (error) => {
                    console.log(error);
                },
                onFinish: () => {
                    setIsSubmitForm(false);
                    reset();
                },
            });
        }
    }, [isSubmitForm]);

    useEffect(() => {
        // set preview for avatar
        if (watchAvatar instanceof File) {
            const previewUrl = URL.createObjectURL(watchAvatar);
            setPreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
        if (!watchAvatar) {
            setPreview(null);
        }
    }, [watchAvatar]);

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Users / Add new user
                </h2>
            }
        >
            <Head title="Users" />

            <div className="rounded-lg shadow-sm">
                <div className="bg-primary p-1.5 border-b border-primary rounded-t-lg">
                    <Button
                        className="text-primary-foreground hover:text-secon dary-foreground hover:bg-rose-500/60"
                        variant={"ghost"}
                        onClick={() => router.get(route("users"))}
                    >
                        <Undo2 strokeWidth={2.7} />
                        Back
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)}>
                        <div className="min-h-72 bg-background flex divide-x border border-border rounded-b-lg">
                            <div className="w-60">
                                <div className="flex flex-col items-center p-5">
                                    <AvatarProfile
                                        className="size-36"
                                        src={
                                            !preview
                                                ? user?.avatar || ""
                                                : preview ?? ""
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="avatar"
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
                                                                e.target
                                                                    .files?.[0];
                                                            console.log(file);
                                                            if (file) {
                                                                if (
                                                                    [
                                                                        "image/jpg",
                                                                        "image/jpeg",
                                                                        "image/png",
                                                                    ].includes(
                                                                        file.type
                                                                    )
                                                                )
                                                                    field.onChange(
                                                                        file
                                                                    );
                                                            }
                                                        }}
                                                        name={field.name}
                                                        ref={(el) => {
                                                            field.ref(el);
                                                            avatarRef.current =
                                                                el;
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            className="mt-5 shadow-sm"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => form.reset()}
                                            disabled={!!!preview}
                                            type="button"
                                        >
                                            <X />
                                        </Button>
                                        <Button
                                            className="mt-5 shadow-sm"
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                                avatarRef.current?.click()
                                            }
                                            type="button"
                                        >
                                            <Upload />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 grow space-y-4">
                                <div className="grid grid-cols-3 gap-3 w-full">
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    First Name
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
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Last Name
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
                                        name="middle_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="">
                                                    Middle Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3 w-full">
                                    <CalendarInput
                                        form={form}
                                        name="birthdate"
                                        label="Birthdate"
                                    />

                                    <div>
                                        <Label>Age</Label>
                                        <div className="h-10 border border-border rounded-md shadow-sm mt-2 flex items-center px-3">
                                            {watchBirthday &&
                                                calculateAge(
                                                    new Date(watchBirthday)
                                                )}
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="sex"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel className="required">
                                                    Sex
                                                </FormLabel>
                                                <SelectOption
                                                    onChange={field.onChange}
                                                >
                                                    <SelectOptionTrigger>
                                                        <FormControl>
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
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
                                                            value="male"
                                                            className="capitalize"
                                                        />
                                                        <SelectOptionItem
                                                            value="female"
                                                            className="capitalize"
                                                        />
                                                    </SelectOptionContent>
                                                </SelectOption>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="">
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

                                <div className="grid grid-cols-3 gap-3 w-full">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Email
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
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Mobile No.
                                                </FormLabel>
                                                <FormControl>
                                                    <NumberInput
                                                        {...field}
                                                        max={11}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel className="required">
                                                    Role
                                                </FormLabel>
                                                <SelectOption
                                                    onChange={field.onChange}
                                                >
                                                    <SelectOptionTrigger>
                                                        <FormControl>
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
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
                                                            value="admin"
                                                            className="capitalize"
                                                        />
                                                        <SelectOptionItem
                                                            value="staff"
                                                            className="capitalize"
                                                        />
                                                    </SelectOptionContent>
                                                </SelectOption>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="required">
                                                    Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={!!user} />
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
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        disabled={!!user}
                                                        className={cn(!!user && "text-secondary-foreground/0 !select-none")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="!mt-7 flex justify-end">
                                    <Button className="px-8" variant={"ghost"} type="button" onClick={() => router.get(route('users'))}>
                                        Cancel
                                    </Button>
                                    <Button className="px-8 ml-4">Save</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </Authenticated>
    );
};

export default CreateUser;
