import AccordionItemCard from "@/components/AccordionItemCard";
import PaginationButton from "@/components/PaginationButton";
import Search from "@/components/Search";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { ChevronDown, Edit, Filter, Plus, Printer } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddStock from "./AddStock";
import NewProduct from "./NewProduct";
import { PAGINATEDDATA, PRODUCTSIZES, User } from "@/types";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import moment from "moment";
import { useDebounce } from "@/hooks/useDebounce";
import PrintProducts from "./PrintProducts";

export type PRODUCT = {
    id: number;
    name: string;
    size: PRODUCTSIZES;
    price: string;
    stock_in: string | null;
    opening_stock: string;
    closing_stock: string;
    updated_at: string;
    product_stock: Array<{
        id: number;
        finish_product_id: number;
        quantity: string;
        created_at: string;
    }>;
    thumbnail: string;
};

type Props = {
    products: PAGINATEDDATA<PRODUCT>;
};

const App: React.FC<Props> = (props) => {
    return (
        <PaginateProvider
            endPoint="manage.inventory.finish.json"
            initialValue={props.products}
        >
            <Index {...props} />
        </PaginateProvider>
    );
};

const Index: React.FC<Omit<Props, "products">> = ({}) => {
    const { user } = usePage().props.auth;

    const [filter, setFilterData] = useState<
        "small" | "medium" | "large" | null
    >(null);
    const [product, setProduct] = useState<PRODUCT | null>(null);
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
    } = usePagination<PRODUCT>();
    const [popover, setPopover] = useState(false);
    const [print, setPrint] = useState(false);

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
                    onClick={() => router.get(route("manage.inventory.finish"))}
                >
                    Finished Products
                </div>
                <div
                    className={cn(
                        "p-2 px-3 pb-2.5 font-medium",
                        "border-b-2 border-transparent hover:border-gray-400 hover:bg-accent transition duration-200 ease-in-out"
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
                        setSearch(search);
                    }}
                    className="shadow-sm"
                />

                <Popover open={popover} onOpenChange={setPopover}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="!py-0 pl-3 w-40 shadow-sm relative"
                        >
                            <Filter />
                            <div
                                className={cn(
                                    "border-l grow h-full ml-1 flex items-center pl-3 capitalize",
                                    !filter && "text-foreground/60"
                                )}
                            >
                                {filter ?? "filter"}
                            </div>
                            {filter && (
                                <div className="absolute top-1 right-1 size-2.5 bg-primary rounded-full"></div>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-48 p-1.5">
                        <div
                            role="button"
                            className="h-8 !justify-start !pl-2 w-full rounded flex items-center gap-2 hover:bg-secondary transition duration-150 ease-in"
                            onClick={() => {
                                setFilterData("small");
                                setFilter("small");
                                setPopover(false);
                            }}
                        >
                            <Checkbox
                                checked={filter === "small"}
                                className="border-border shadow-sm bg-white"
                            />
                            <div>Small</div>
                        </div>
                        <div
                            role="button"
                            className="h-8 !justify-start !pl-2 w-full rounded flex items-center gap-2 hover:bg-secondary transition duration-150 ease-in"
                            onClick={() => {
                                setFilterData("medium");
                                setFilter("medium");
                                setPopover(false);
                            }}
                        >
                            <Checkbox
                                checked={filter === "medium"}
                                className="border-border shadow-sm bg-white"
                            />
                            <div>Medium</div>
                        </div>
                        <div
                            role="button"
                            className="h-8 !justify-start !pl-2 w-full rounded flex items-center gap-2 hover:bg-secondary transition duration-150 ease-in"
                            onClick={() => {
                                setFilterData("large");
                                setFilter("large");
                                setPopover(false);
                            }}
                        >
                            <Checkbox
                                checked={filter === "large"}
                                className="border-border shadow-sm bg-white"
                            />
                            <div>Large</div>
                        </div>
                        <hr className="my-1" />
                        <div className="flex justify-end">
                            <Button
                                variant={"ghost"}
                                className="h-8 w-fit !justify-start rounded-full"
                                onClick={() => {
                                    if (filter) {
                                        setFilter(null);
                                        setFilterData(null);
                                        setPopover(false);
                                    }
                                }}
                                disabled={!filter}
                            >
                                Clear
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button
                    className="gap-3 px-6 ml-auto"
                    onClick={() => setPrint(true)}
                >
                    <Printer />
                    Print
                </Button>
                {user.role === "admin" && (
                    <Button
                        className="gap-3 px-6 ml-1.5"
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus />
                        Add
                    </Button>
                )}
            </div>

            <div className="bg-background rounded-md shadow-sm mt-3">
                <div className="rounded-t-md bg-primary font-medium border border-rose-500 grid grid-cols-[1fr,6rem,10rem,6rem,10rem,8rem,3rem] text-primary-foreground [&>div]:p-2 [&>div]:py-3">
                    <div>Product Name</div>
                    <div className="text-center">Size</div>
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
                        <div className="text-center py-6">
                            No results found for "{search}"
                        </div>
                    ) : (
                        paginate.data.length === 0 &&
                        !search && (
                            <div className="text-center py-6">
                                No product available.
                            </div>
                        )
                    )}

                    {paginate.data.map((item, index) => (
                        <DataListCard
                            key={index}
                            value={"item" + index}
                            role={user.role}
                            product={item}
                            onAddStock={(product) => {
                                setProduct(product);
                                setShowAddStock(true);
                            }}
                            onEditProduct={(product) => {
                                setProduct(product);
                                setShowAdd(true);
                            }}
                        />
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

            <AddStock
                show={showAddStock}
                onClose={() => {
                    setShowAddStock(false);
                    setProduct(null);
                }}
                product={product}
            />

            <NewProduct
                show={showAdd}
                onClose={() => {
                    setProduct(null);
                    setShowAdd(false);
                }}
                product={product}
            />

            <PrintProducts show={print} onClose={setPrint} />
        </Authenticated>
    );
};

const DataListCard: React.FC<{
    role: "admin" | "staff";
    value: string;
    product: PRODUCT;
    onAddStock: (product: PRODUCT) => void;
    onEditProduct: (product: PRODUCT) => void;
}> = ({ value, role, product, onAddStock, onEditProduct }) => {
    return (
        <AccordionItemCard
            value={value}
            layoutGrid="grid grid-cols-[1fr,6rem,10rem,6rem,10rem,8rem,3rem]"
            header={
                <>
                    <div className="line-clamp-1 text-left pl-2">
                        {product.name}
                    </div>
                    <div className="text-center capitalize">{product.size}</div>
                    <div className="text-center">{product.opening_stock}</div>
                    <div className="text-center">{product.stock_in ?? 0}</div>
                    <div className="text-center">{product.closing_stock}</div>
                    <div className="text-center">
                        {moment(product.updated_at).format("ll")}
                    </div>
                </>
            }
        >
            <div className="flex gap-2 justify-end">
                {role === "admin" && (
                    <Button
                        className="h-9"
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                    >
                        <Edit />
                        Edit
                    </Button>
                )}
                <Button
                    className="h-9"
                    variant="outline"
                    onClick={() => onAddStock(product)}
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
                {product.product_stock.length === 0 && (
                    <div className="pl-5 text-foreground/60">
                        No stock added.
                    </div>
                )}
                {product.product_stock.map((stock, index) => (
                    <div key={index} className="flex px-5 [&>div]:py-1">
                        <div className="w-52">
                            {moment(stock.created_at).format("LL")}
                        </div>
                        <div className="w-52">{stock.quantity}</div>
                    </div>
                ))}
            </div>
        </AccordionItemCard>
    );
};

export default App;
