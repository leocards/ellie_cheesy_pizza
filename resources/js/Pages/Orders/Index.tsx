import AccordionItemCard from "@/components/AccordionItemCard";
import PaginationButton from "@/components/PaginationButton";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PAGINATEDDATA } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import moment from "moment";
import React from "react";

export type ORDER = {
    id: number;
    customer: { id: number; name: string };
    orders: Array<{
        id: number;
        quantity: string;
        total_amount: string;
        created_at: string;
        product: {
            id: number;
            name: string;
            size: string;
        };
    }>;
    created_at: string;
};

type Props = {
};

const App: React.FC<Props & {orders: PAGINATEDDATA<ORDER>}> = (props) => {
    return (
        <PaginateProvider endPoint="orders.json" initialValue={props.orders}>
            <Index   />
        </PaginateProvider>
    );
};

const Index: React.FC<Props> = ({}) => {
    const { paginate } = usePagination<ORDER>();

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="flex">
                <Button
                    className="ml-auto shadow"
                    onClick={() => router.get(route("orders.create"))}
                >
                    <Plus />
                    New Order
                </Button>
            </div>

            <div className="overflow-hidden rounded-md mt-4 shadow-sm bg-background">
                <div className="bg-primary grid grid-cols-[1fr,10rem,1fr,3rem] font-medium text-primary-foreground border border-rose-500 [&>div]:px-2 [&>div]:py-3 [&>div:not(:first-child)]:text-center">
                    <div>Customer Name</div>
                    <div>Total Amount</div>
                    <div>Order Date</div>
                </div>
                <Accordion
                    type="multiple"
                    className="border border-t-0 border-border rounded-b-md divide-y overflow-hidden"
                >
                    {paginate.data.map((order, index) => (
                        <AccordionItemCard
                            key={index}
                            value={"" + index}
                            layoutGrid="grid grid-cols-[1fr,10rem,1fr,3rem]"
                            header={
                                <>
                                    <div className="text-left px-2">
                                        {order.customer.name}
                                    </div>
                                    <div>Php {Number(order.orders.reduce((acc, o) => acc + parseFloat(o.total_amount), 0)).toLocaleString()}</div>
                                    <div>{moment(order.created_at).format("lll")}</div>
                                </>
                            }
                        >
                            <div>
                                <div className="grid grid-cols-[1fr,6rem,6rem,10rem,13rem] font-medium py-1 rounded [&>div]:pl-2 bg-secondary">
                                    <div>Product Name</div>
                                    <div>Quantity</div>
                                    <div>Size</div>
                                    <div>Amount</div>
                                    <div>Date</div>
                                </div>

                                {order.orders.map((items, index) => (
                                    <div key={index} className="grid grid-cols-[1fr,6rem,6rem,10rem,13rem] border-b py-2 [&>div]:pl-2">
                                        <div>{items.product.name}</div>
                                        <div>{items.quantity}</div>
                                        <div className="capitalize">{items.product.size}</div>
                                        <div>{items.total_amount}</div>
                                        <div>{moment(items.created_at).format("lll")}</div>
                                    </div>
                                ))}

                                <div className="grid grid-cols-[1fr,6rem,6rem,10rem,13rem]">
                                    <div className="col-start-[3] col-span-3 py-2 flex items-center bg-accent [&>div]:pl-2">
                                        <div className="font-bold w-24">
                                            Total:{" "}
                                        </div>
                                        <div>Php {Number(order.orders.reduce((acc, o) => acc + parseFloat(o.total_amount), 0)).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </AccordionItemCard>
                    ))}
                </Accordion>
            </div>

            <PaginationButton />
        </Authenticated>
    );
};

export default App;
