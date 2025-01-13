import * as React from "react";
import { buttonVariants } from "./button";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "./menubar";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    fromYear = 1960,
    toYear = 2040,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            fromYear={1950}
            toYear={2040}
            captionLayout="dropdown-buttons"
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                caption_dropdowns: "flex justify-center gap-1",
                nav: "space-x-1 flex items-center justify-between ml-auto gap-2 pointer-events-none",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto"
                ),
                vhidden: "vhidden hidden",
                nav_button_previous: "absolute right-8",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-0.5",
                cell: "size-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent"
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Dropdown: ({
                    value,
                    onChange,
                    children,
                    ...props
                }: DropdownProps) => {
                    const options = React.Children.toArray(
                        children
                    ) as React.ReactElement<
                        React.HTMLProps<HTMLOptionElement>
                    >[];
                    const selected = options.find(
                        (child) => child.props.value === value
                    );
                    const handleChange = (value: string) => {
                        const changeEvent = {
                            target: { value },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChange?.(changeEvent);
                    };
                    return (
                        <Menubar className="p-0 h-8">
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm p-0 h-full px-2 gap-1">
                                    <span>{selected?.props?.children}</span>
                                    <ChevronDown className="size-4" />
                                </MenubarTrigger>
                                <MenubarContent
                                    className="min-w-32"
                                    align="center"
                                >
                                    <ScrollArea className="h-72">
                                        {options.map((option, id: number) => (
                                            <MenubarItem
                                                onClick={() =>
                                                    handleChange(
                                                        option.props.value?.toString() ??
                                                            ""
                                                    )
                                                }
                                                key={`${option.props.value}-${id}`}
                                            >
                                                {option.props.children}
                                            </MenubarItem>
                                        ))}
                                    </ScrollArea>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    );
                },
                IconLeft: ({ ...props }) => (<ChevronLeft className="h-4 w-4" />),
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" />
                ),
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
