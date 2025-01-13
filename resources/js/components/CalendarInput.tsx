import { format } from "date-fns";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useState } from "react";

function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

const CalendarInput: React.FC<{
    form: any;
    name: string;
    label?: string | React.ReactNode;
    isRequired?: boolean;
    disabled?: boolean;
    className?: string;
    asInput?: boolean;
    withLabel?: boolean;
    placeholder?: string;
    align?: "center" | "end" | "start";
}> = ({
    form,
    name,
    label = "Date of birth",
    isRequired = true,
    disabled,
    className,
    asInput,
    withLabel = true,
    placeholder,
    align,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {withLabel && <FormLabel className={cn(isRequired && "required")}>
                        {label}
                    </FormLabel>}
                    <div className="flex relative">
                        {asInput && (
                            <FormControl>
                                <Input
                                    className="form-input pr-10"
                                    {...field}
                                    value={
                                        isValidDate(field.value)
                                            ? format(field.value, "P")
                                            : field.value
                                    }
                                    placeholder={placeholder??"mm/dd/yyyy"}
                                />
                            </FormControl>
                        )}
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger
                                asChild
                                className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                            >
                                {asInput ? (
                                    <Button
                                        type="button"
                                        variant={"ghost"}
                                        size={"icon"}
                                        className={cn(
                                            "shrink-0 !size-8 absolute top-1/2 -translate-y-1/2 right-1 data-[state=open]:!bg-accent"
                                        )}
                                        disabled={disabled}
                                    >
                                        <CalendarIcon className="size-4 opacity-50" />
                                    </Button>
                                ) : (
                                    <FormControl>
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-1 text-left font-normal before:!bg-transparent data-[state=open]:ring-2 ring-ring",
                                                !field.value &&
                                                    "text-muted-foreground",
                                                className
                                            )}
                                            disabled={disabled}
                                        >
                                            {field.value ? (
                                                <span>
                                                    {isValidDate(field.value)
                                                        ? format(
                                                              field.value,
                                                              "P"
                                                          )
                                                        : field.value}
                                                </span>
                                            ) : (
                                                <span>{placeholder??'mm/dd/yyyy'}</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-5 opacity-50" />
                                        </Button>
                                    </FormControl>
                                )}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align={align??"end"}>
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date);
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default CalendarInput
