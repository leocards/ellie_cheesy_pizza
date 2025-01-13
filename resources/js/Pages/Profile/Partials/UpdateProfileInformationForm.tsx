import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as reactForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { calculateAge, IFormUser, USERSCHEMA } from "@/Pages/Users/types";
import { ChevronDown, Undo2, Upload, X } from "lucide-react";
import CalendarInput from "@/components/CalendarInput";
import { cn } from "@/lib/utils";
import {
    SelectOption,
    SelectOptionContent,
    SelectOptionItem,
    SelectOptionTrigger,
} from "@/components/SelectOption";
import { Label } from "@/components/ui/label";
import NumberInput from "@/components/NumberInput";

const PROFILESCHEMA = USERSCHEMA.omit({
    password: true,
    avatar: true,
    role: true,
});

type UserType = Omit<IFormUser, "password" | "avatar" | "role">;

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const form = reactForm<UserType>({
        resolver: zodResolver(PROFILESCHEMA),
        defaultValues: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            middle_name: user?.middle_name || "",
            birthdate: new Date(user?.birthdate) || null,
            sex: user?.sex || undefined,
            address: user?.address || "",
            mobile: user?.mobile || "",
            email: user?.email || "",
            username: user?.username || "",
        },
    });
    const watchBirthday = form.watch("birthdate");

    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const { setData, patch, processing, recentlySuccessful } =
        useForm<UserType>();

    const onUpdateProfile = (formData: UserType) => {
        setData(formData);
        setIsSubmitForm(true);
    };

    useEffect(() => {
        if (isSubmitForm) {
            patch(route("profile.update"));
        }
    }, [isSubmitForm]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onUpdateProfile)}
                    className="mt-6 space-y-6"
                >
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
                                    calculateAge(new Date(watchBirthday))}
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
                                        <NumberInput {...field} max={11} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
