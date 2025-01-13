import PaginationButton from "@/components/PaginationButton";
import Search from "@/components/Search";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PAGINATEDDATA } from "@/types";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Filter, Printer } from "lucide-react";
import { useState } from "react";
import FilterButton from "@/components/FilterButton";
import { MenubarItem, MenubarSeparator } from "@/components/ui/menubar";
import CalendarPickerModal from "@/components/CalendarPickerModal";
import AccordionItemCard from "@/components/AccordionItemCard";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import PrintMaterial from "./PrintMaterial";

export type RAWMATERIALS = {
    id: number;
    name: string;
    stock_in: string;
    opening_stock: string;
    raw_material_stocks: Array<{
        id: number;
        raw_material_id: number;
        quantity: string;
        isStockOut: number;
        created_at: string;
    }>;
    created_at: string;
};

type Props = {
    rawMaterials: PAGINATEDDATA<RAWMATERIALS>;
};

const App: React.FC<Props> = (props) => {
    return (
        <PaginateProvider
            endPoint="manage.inventory.raw.json"
            initialValue={props.rawMaterials}
        >
            <Index {...props} />
        </PaginateProvider>
    );
};

const Index: React.FC<Props> = () => {
    const [filter, setFilterData] = useState<
        "today" | "yesterday" | "7d" | "30d" | Date | null
    >(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const {
        paginate,
        loading,
        hasRendered,
        search,
        setFilter,
        setLoading,
        setSearch,
    } = usePagination<RAWMATERIALS>();
    const [processStockOut, setProcessStockOut] = useState(false);
    const { toast } = useToast();
    const [printer, setPrinter] = useState(false)

    const setStockOut = (id: number) => {
        console.log(id);
        setProcessStockOut(true);
        router.post(
            route("inventory.material.stock_out", [id]),
            {},
            {
                onSuccess: ({ props }) => {
                    toast({
                        title: "Change of mind?",
                        description: "Undo stock out.",
                        action: (
                            <ToastAction
                                altText="Undo"
                                onClick={() => {
                                    router.post(
                                        route("inventory.material.stock_out", [
                                            id,
                                        ]),
                                        {},
                                        {}
                                    );
                                }}
                            >
                                Undo
                            </ToastAction>
                        ),
                    });
                },
                onFinish: () => setProcessStockOut(false),
            }
        );
    };

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
                    onClick={() => router.get(route("inventory.finish"))}
                >
                    Finished Products
                </div>
                <div
                    className={cn(
                        "p-2 px-3 pb-2.5 font-medium",
                        "border-b-2 border-primary bg-rose-100 text-rose-700"
                    )}
                    role="button"
                    onClick={() => router.get(route("inventory.materials"))}
                >
                    Raw Materials
                </div>
            </div>

            <div className="border border-border rounded-md bg-background shadow-sm mt-3 flex items-center p-2 gap-2">
                <Search
                    onInput={() => hasRendered && setLoading(true)}
                    onSearch={(search) => {
                        setSearch(search);
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

                <Button className="gap-3 px-6 ml-auto" onClick={() => setPrinter(true)}>
                    <Printer />
                    Print
                </Button>
            </div>

            <div className="bg-background rounded-md shadow-sm mt-3">
                <div className="rounded-t-md bg-primary font-medium border border-rose-500 grid grid-cols-[1fr,6rem,10rem,8rem,3rem] text-primary-foreground [&>div]:p-2 [&>div]:py-3">
                    <div>Raw Materials</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Re-Stock Level</div>
                    <div className="text-center">Date Added</div>
                    <div className="text-center"></div>
                </div>
                <Accordion
                    type="multiple"
                    className="border border-t-0 border-border rounded-b-md divide-y overflow-hidden relative"
                >
                    {paginate.data.length === 0 && search ? (
                        <div className="text-center py-6">
                            No results found for "{search}"
                        </div>
                    ) : (
                        paginate.data.length === 0 &&
                        !search && (
                            <div className="text-center py-6">
                                No raw material available.
                            </div>
                        )
                    )}

                    {paginate.data.map((material, index) => (
                        <AccordionItemCard
                            key={index}
                            value={"item" + index}
                            layoutGrid="grid grid-cols-[1fr,6rem,10rem,8rem,3rem]"
                            header={
                                <>
                                    <div className="line-clamp-1 text-left pl-2">
                                        {material.name}
                                    </div>
                                    <div className="text-center">
                                        {material.stock_in}
                                    </div>
                                    <div className="text-center">
                                        {material.opening_stock}
                                    </div>
                                    <div className="text-center">
                                        {moment(material.created_at).format(
                                            "ll"
                                        )}
                                    </div>
                                </>
                            }
                        >
                            <div className="flex font-semibold px-5 bg-secondary py-1 mt-2 rounded">
                                <div className="w-52">Stock-In Date</div>
                                <div className="w-52">Quantity</div>
                            </div>
                            <div className="divide-y space-y-1 mt-1">
                                {material.raw_material_stocks.map(
                                    (stocks, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center px-5 [&>div]:py-1"
                                        >
                                            <div className="w-52">
                                                {moment(
                                                    stocks.created_at
                                                ).format("LL")}
                                            </div>
                                            <div className="w-52">
                                                {stocks.quantity}
                                            </div>
                                            <div className="ml-auto">
                                                <Button
                                                    variant={
                                                        stocks.isStockOut
                                                            ? "ghost"
                                                            : "default"
                                                    }
                                                    className="rounded-full h-9 w-28"
                                                    disabled={
                                                        !!stocks.isStockOut ||
                                                        processStockOut
                                                    }
                                                    onClick={() =>
                                                        setStockOut(stocks.id)
                                                    }
                                                >
                                                    {processStockOut ? (
                                                        <span className="loading loading-dots loading-sm"></span>
                                                    ) : (
                                                        "Stock Out"
                                                    )}
                                                </Button>
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

            <PrintMaterial show={printer} onClose={setPrinter} />
        </Authenticated>
    );
};

export default App;
