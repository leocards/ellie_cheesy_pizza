import React from "react"
import {
    Minus,
    Plus,
    Trash2,
} from "lucide-react";
import { useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ADDEDORDERSTYPE, PRODUCT, ProductSizes } from "./type";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ecp_logo from "@/assets/ecp_logo.svg"

type CardProps = {
    product: PRODUCT;
    orders: Array<ADDEDORDERSTYPE>;
    onUpdateOrders: (
        order: ProductSizes,
        action: "add" | "remove" | "clear",
        productName: string
    ) => void;
};

const ProductCard: React.FC<CardProps> = ({
    product,
    orders,
    onUpdateOrders,
}) => {
    const stocks = product.products.reduce(
        (acc, p) => acc + (parseInt(p.stock_in) || 0),
        0
    );

    const tottalOrdered = useMemo(() => {
        let productOrdered = orders.filter(({ name }) => name === product.name)
        return productOrdered.reduce((acc, p) => acc + p.quantity, 0)
    }, [orders])


    return (
        <Sheet>
            <SheetTrigger asChild>
                <div
                    className="border border-border rounded-md shadow-sm flex items-center gap-2 relative hover:bg-secondary transition duration-150"
                    role="button"
                >
                    {!!(tottalOrdered) && <div className="min-w-5 px-1 py-0.5 flex items-center justify-center font-medium rounded text-xs absolute bottom-1 right-1 bg-primary text-primary-foreground shadow-md">
                        {tottalOrdered}
                    </div>}
                    <div className="size-[3.25rem] shrink-0 rounded overflow-hidden">
                        <img
                            src={product.thumbnail??ecp_logo}
                            alt=""
                            className="size-full object-cover"
                        />
                    </div>
                    <div>
                        <Label className="line-clamp-2 pointer-events-none">
                            {product.name}
                        </Label>
                        <Label className="!m-0 text-foreground/50 pointer-events-none">
                            Stock: {stocks}
                        </Label>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent className="min-w-[27rem] flex flex-col p-0 border-none">
                <SheetHeader className="p-5 pb-0">
                    <SheetTitle>{product.name}</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="px-5 space-y-2">
                    {product.products.map((prod, index) => (
                        <div
                            key={index}
                            className="border border-border shadow-sm rounded-md p-2"
                        >
                            <div className="flex justify-between">
                                <Label className="uppercase">{prod.size}</Label>
                                <Label className="">
                                    Php {parseFloat(prod.price).toFixed(2)}
                                </Label>
                            </div>
                            <SheetDescription className="">
                                Availabbility: {prod.stock_in ?? "Out of stock"}
                            </SheetDescription>

                            <div className="flex items-end justify-between">
                                <div className="flex items-center gap-2">
                                    Php
                                    <div>
                                        {Number(
                                            orders.find(
                                                ({ id }) => id === prod.id
                                            )?.total || "0"
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mt-1.5 flex gap-2 justify-end">
                                    <Button
                                        size="icon"
                                        className="size-8"
                                        variant="ghost"
                                        onClick={() => {
                                            onUpdateOrders(prod, "clear", product.name);
                                        }}
                                        disabled={
                                            !orders.find(
                                                ({ id }) => prod.id === id
                                            )
                                        }
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            onUpdateOrders(prod, "remove", product.name);
                                        }}
                                        disabled={
                                            !orders.find(
                                                ({ id }) => prod.id === id
                                            )
                                        }
                                    >
                                        <Minus className="size-4" />
                                    </Button>

                                    <div className="size-8 flex items-center justify-center">
                                        {orders.find(({ id }) => id === prod.id)
                                            ?.quantity || 0}
                                    </div>

                                    <Button
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            onUpdateOrders(prod, "add", product.name);
                                        }}
                                        disabled={
                                            !prod.stock_in ||
                                            parseInt(prod.stock_in) <
                                                (orders.find(
                                                    ({ id }) => id === prod.id
                                                )?.quantity || 0) +
                                                    1
                                        }
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto bg-primary text-primary-foreground px-5 py-4">
                    Total Amount:{" "}
                    <span className="text-lg">
                        Php{" "}
                        {Number(
                            orders.reduce((acc, order) => acc + order.total, 0)
                        ).toLocaleString()}
                    </span>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ProductCard
