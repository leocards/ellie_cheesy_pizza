import React, { PropsWithChildren } from "react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
    filter: string | Date | null;
} & PropsWithChildren;

const FilterButton: React.FC<Props> = ({ filter, children }) => {
    return (
        <Menubar className="shadow-sm p-0">
            <MenubarMenu>
                <MenubarTrigger className="shadow-sm h-full py-0 w-44 !rounded-md cursor-pointer relative">
                    <Filter className="size-4" />
                    <div
                        className={cn(
                            "border-l grow h-full ml-3 flex items-center pl-3 capitalize",
                            !filter && "text-foreground/60"
                        )}
                    >
                        {!filter && "filter"}
                        {filter && !(filter instanceof Date) && filter}
                        {filter &&
                            filter instanceof Date &&
                            format(filter, "PP")}
                    </div>

                    {filter && (
                        <div className="absolute top-1 right-1 size-2.5 bg-primary rounded-full"></div>
                    )}
                </MenubarTrigger>

                <MenubarContent align="start" alignOffset={-1}>
                    {children}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default FilterButton;
