import AccordionItemCard from "@/components/AccordionItemCard";
import PaginationButton from "@/components/PaginationButton";
import Search from "@/components/Search";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PAGINATEDDATA } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Edit, Filter, Plus, Printer } from "lucide-react";
import React, { useState } from "react";
import NewMaterial from "./NewMaterial";
import moment from "moment";
import { format } from "date-fns";
import AddStock from "./AddStock";
import PrintMaterials from "./PrintMaterials";
import FilterButton from "@/components/FilterButton";
import { MenubarItem, MenubarSeparator } from "@/components/ui/menubar";
import CalendarPickerModal from "@/components/CalendarPickerModal";

export type STOCKS = {
    id: number;
    name: string;
    stock_in: string;
    opening_stock: string;
    closing_stock: string;
    raw_material_stocks: Array<{
        id: number;
        raw_material_id: number;
        quantity: string;
        created_at: string;
    }>;
    created_at: string;
};

type Props = {
    stocks: PAGINATEDDATA<STOCKS>;
};

const App: React.FC<Props> = (props) => {
    return (
        <PaginateProvider endPoint="manage.inventory.raw.json" initialValue={props.stocks}>
            <Index {...props} />
        </PaginateProvider>
    );
};

const Index: React.FC<Props> = ({ stocks }) => {
    const { user } = usePage().props.auth;

    const [filter, setFilterData] = useState<
        "today" | "yesterday" | "7d" | "30d" | Date | null
    >(null);
    const [rawMaterial, setRawMaterial] = useState<STOCKS | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showAddStock, setShowAddStock] = useState(false);
    const {
        paginate,
        loading,
        hasRendered,
        search,
        setFilter,
        setLoading,
        setSearch,
    } = usePagination<STOCKS>();
    const [showCalendar, setShowCalendar] = useState(false);
    const [print, setPrint] = useState(false)

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Inventory
                </h2>
            }
        >
            <Head title="Inventory" />

            <div className="flex items-center gap-2">
                <div
                    className={cn(
                        "p-2 px-3 pb-2.5 font-medium",
                        "border-b-2 border-transparent hover:border-gray-400 hover:bg-accent transition duration-200 ease-in-out"
                    )}
                    role="button"
                    onClick={() => router.get(route("manage.inventory.finish"))}
                >
                    Finished Products
                </div>
                <div
                    className={cn(
                        "p-2 px-3 pb-2.5 font-medium",
                        "border-b-2 border-primary bg-rose-100 text-rose-700"
                    )}
                    role="button"
                    onClick={() =>
                        router.get(route("manage.inventory.materials"))
                    }
                >
                    Raw Materials
                </div>
            </div>

            <div className="border border-border rounded-md bg-background shadow-sm mt-3 flex items-center p-2 gap-2">
                <Search
                    onInput={() => hasRendered && setLoading(true)}
                    onSearch={(search) => {
                        setSearch(search)
                    }}
                    className="shadow-sm"
                />

                <FilterButton
                    filter={
                        filter === "7d"
                            ? "Last 7 days"
                            : filter === "30d"
                            ? "Last 30 days"
                            : filter
                    }
                >
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("today");
                            setFilter("today");
                        }}
                    >
                        <Checkbox
                            checked={filter === "today"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Today</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("yesterday");
                            setFilter("yesterday");
                        }}
                    >
                        <Checkbox
                            checked={filter === "yesterday"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Yesterday</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("7d");
                            setFilter("7d");
                        }}
                    >
                        <Checkbox
                            checked={filter === "7d"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Last 7 days</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("30d");
                            setFilter("30d");
                        }}
                    >
                        <Checkbox
                            checked={filter === "30d"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Last 30 days</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setShowCalendar(true);
                        }}
                    >
                        <Checkbox
                            checked={filter instanceof Date}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>
                            {filter instanceof Date
                                ? moment(filter).format("ll")
                                : "Pick a date"}
                        </div>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                        className="cursor-pointer gap-3 w-fit ml-auto rounded-full px-5"
                        disabled={!filter}
                        onClick={() => {
                            if (filter) {
                                setFilter(null);
                                setFilterData(null);
                            }
                        }}
                    >
                        Clear
                    </MenubarItem>
                </FilterButton>

                <Button className="gap-3 px-6 ml-auto" onClick={() => setPrint(true)}>
                    <Printer />
                    Print
                </Button>

                {user.role === "admin" && (
                    <Button
                        className="gap-3 px-6 ml-2"
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus />
                        Add
                    </Button>
                )}
            </div>

            <div className="bg-background rounded-md shadow-sm mt-3">
                <div className="rounded-t-md bg-primary font-medium border border-rose-500 grid grid-cols-[1fr,10rem,6rem,10rem,8rem,3rem] text-primary-foreground [&>div]:p-2 [&>div]:py-3">
                    <div>Raw Materials</div>
                    <div className="text-center">Opening Stock</div>
                    <div className="text-center">Stock-In</div>
                    <div className="text-center">Closing Stock</div>
                    <div className="text-center">Date</div>
                </div>

                <Accordion
                    type="multiple"
                    className="border border-t-0 border-border rounded-b-md divide-y overflow-hidden relative"
                >
                    {paginate.data.length === 0 && search ? (
                        <div className="text-center py-6">No results found for "{search}"</div>
                    ) : (paginate.data.length === 0 && !search) && (
                        <div className="text-center py-6">No raw material available.</div>
                    )}

                    {paginate.data.map((stock, index) => (
                        <AccordionItemCard
                            key={index}
                            value={"item" + index}
                            layoutGrid="grid grid-cols-[1fr,10rem,6rem,10rem,8rem,3rem]"
                            header={
                                <>
                                    <div className="line-clamp-1 text-left pl-2">
                                        {stock.name}
                                    </div>
                                    <div className="text-center">
                                        {stock.opening_stock}
                                    </div>
                                    <div className="text-center">
                                        {stock.stock_in ?? 0}
                                    </div>
                                    <div className="text-center">
                                        {stock.closing_stock}
                                    </div>
                                    <div className="text-center">
                                        {moment(stock.created_at).format("ll")}
                                    </div>
                                </>
                            }
                        >
                            <div className="flex gap-2 justify-end">
                                <Button
                                    className="h-9"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAdd(true)
                                        setRawMaterial(stock)
                                    }}
                                >
                                    <Edit />
                                    Edit stock
                                </Button>
                                <Button
                                    className="h-9"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddStock(true)
                                        setRawMaterial(stock)
                                    }}
                                >
                                    <Plus />
                                    Add stock
                                </Button>
                            </div>
                            <div className="flex font-semibold px-5 bg-secondary py-1 mt-2 rounded">
                                <div className="w-52">Stock-In Date</div>
                                <div className="w-52">Quantity</div>
                            </div>
                            <div className="divide-y space-y-1 mt-1">
                                {stock.raw_material_stocks.map(
                                    (raw_stock, index) => (
                                        <div
                                            key={index}
                                            className="flex px-5 [&>div]:py-1"
                                        >
                                            <div className="w-52">
                                                {moment(
                                                    raw_stock.created_at
                                                ).format("LL")}
                                            </div>
                                            <div className="w-52">
                                                {raw_stock.quantity}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </AccordionItemCard>
                    ))}

                    {loading && (
                        <div className="ring-1 flex items-center justify-center gap-3 py-6 absolute top-0 left-0 w-full h-full bg-black/35">
                            <span className="loading loading-spinner loading-md bg-gray-50"></span>
                            <div className="text-gray-50">Loading...</div>
                        </div>
                    )}
                </Accordion>
            </div>

            <PaginationButton />

            <NewMaterial
                show={showAdd}
                onClose={() => {
                    setShowAdd(false);
                    setTimeout(() => setRawMaterial(null), 300);
                }}
                material={rawMaterial}
            />

            <AddStock
                show={showAddStock}
                onClose={() => {
                    setShowAddStock(false)
                    setTimeout(() => setRawMaterial(null), 300)
                }}
                material={rawMaterial}
            />

            <PrintMaterials show={print} onClose={setPrint} />

            <CalendarPickerModal
                show={showCalendar}
                onClose={setShowCalendar}
                selected={filter instanceof Date ? filter : undefined}
                onSelect={(date: Date) => {
                    setFilterData(date);
                    setShowCalendar(false);
                    setFilter(moment(date).format("Y-M-DD"));
                }}
            />

        </Authenticated>
    );
};

export default App;
