import AccordionItemCard from "@/components/AccordionItemCard";
import PaginationButton from "@/components/PaginationButton";
import Search from "@/components/Search";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PAGINATEDDATA, PRODUCTSIZES } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Printer } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import PrintProduct from "./PrintProduct";
import FilterButton from "@/components/FilterButton";
import { MenubarItem, MenubarSeparator } from "@/components/ui/menubar";

export type PRODUCTS = {
    id: number;
    name: string;
    size: PRODUCTSIZES;
    stock_in: string | null;
    opening_stock: string;
    updated_at: string;
    sold: number;
    product_stock: Array<{
        id: number;
        finish_product_id: number;
        quantity: string;
        created_at: string;
    }>;
};

type Props = {
    products: PAGINATEDDATA<PRODUCTS>;
};

const App: React.FC<Props> = (props) => {
    return (
        <PaginateProvider
            endPoint="inventory.finish.json"
            initialValue={props.products}
        >
            <Index {...props} />
        </PaginateProvider>
    );
};

const Index: React.FC<Props> = () => {
    const [filter, setFilterData] = useState<
        "small" | "medium" | "large" | null
    >(null);
    const {
        paginate,
        loading,
        hasRendered,
        search,
        setFilter,
        setLoading,
        setSearch,
    } = usePagination<PRODUCTS>();
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
                        "border-b-2 border-primary bg-rose-100 text-rose-700"
                    )}
                    role="button"
                    onClick={() => router.get(route("inventory.finish"))}
                >
                    Finished Products
                </div>
                <div
                    className={cn(
                        "p-2 px-3 pb-2.5 font-medium",
                        "border-b-2 border-transparent hover:border-gray-400 hover:bg-accent transition duration-200 ease-in-out"
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
                        setSearch(search)
                    }}
                    className="shadow-sm"
                />

                <FilterButton filter={filter}>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("small");
                            setFilter("small");
                        }}
                    >
                        <Checkbox
                            checked={filter === "small"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Small</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("medium");
                            setFilter("medium");
                        }}
                    >
                        <Checkbox
                            checked={filter === "medium"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Medium</div>
                    </MenubarItem>
                    <MenubarItem
                        className="cursor-pointer gap-3"
                        onClick={() => {
                            setFilterData("large");
                            setFilter("large");
                        }}
                    >
                        <Checkbox
                            checked={filter === "large"}
                            className="border-border shadow-sm bg-white"
                        />
                        <div>Large</div>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                        className="cursor-pointer gap-3 w-fit ml-auto rounded-full px-5"
                        disabled={!filter}
                        onClick={() => {
                            if (filter) {
                                setFilterData(null)
                                setFilter(null)
                            };
                        }}
                    >
                        Clear
                    </MenubarItem>
                </FilterButton>

                <Button className="gap-3 px-6 ml-auto" onClick={() => setPrint(true)}>
                    <Printer />
                    Print
                </Button>
            </div>

            <div className="bg-background rounded-md shadow-sm mt-3">
                <div className="rounded-t-md bg-primary font-medium border border-rose-500 grid grid-cols-[1fr,repeat(3,6rem),10rem,8rem,4rem] text-primary-foreground [&>div]:p-2 [&>div]:py-3">
                    <div>Product Name</div>
                    <div className="text-center">Size</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Sold</div>
                    <div className="text-center">Re-Stock Level</div>
                    <div className="text-center">Date Added</div>
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

                    {paginate.data.map((product, index) => (
                        <AccordionItemCard
                            key={index}
                            value={"item" + index}
                            layoutGrid="grid grid-cols-[1fr,repeat(3,6rem),10rem,8rem,4rem]"
                            header={
                                <>
                                    <div className="line-clamp-1 text-left pl-2">
                                        {product.name}
                                    </div>
                                    <div className="text-center capitalize">
                                        {product.size}
                                    </div>
                                    <div className="text-center">
                                        {product.stock_in ?? 0}
                                    </div>
                                    <div className="text-center">
                                        {product.sold ?? 0}
                                    </div>
                                    <div className="text-center">
                                        {product.opening_stock}
                                    </div>
                                    <div className="text-center">
                                        {moment(product.updated_at).format(
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
                                {(!product.product_stock ||
                                    (product.product_stock &&
                                        product.product_stock.length ===
                                            0)) && (
                                    <div className="pl-5 text-foreground/60">
                                        No stock added.
                                    </div>
                                )}
                                {product.product_stock?.map((stock, index) => (
                                    <div
                                        key={index}
                                        className="flex px-5 [&>div]:py-1"
                                    >
                                        <div className="w-52">
                                            {moment(stock.created_at).format(
                                                "LL"
                                            )}
                                        </div>
                                        <div className="w-52">
                                            {stock.quantity}
                                        </div>
                                    </div>
                                ))}
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

            <PrintProduct show={print} onClose={setPrint} />
        </Authenticated>
    );
};

export default App;
