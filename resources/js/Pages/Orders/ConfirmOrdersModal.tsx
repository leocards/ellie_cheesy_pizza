import Modal, { ModalProps } from "@/components/Modal";
import React, { useState } from "react";
import { ADDEDORDERSTYPE, IFormCustomer } from "./type";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { router } from "@inertiajs/react";
import CancelOrderConfirmation from "./CancelOrderConfirmation";

type Props = ModalProps & {
    orders: Array<ADDEDORDERSTYPE>;
    customer: IFormCustomer | null;
    onUpdateOrders: (
        id: number | null,
        action: "add" | "remove" | "clear"
    ) => void;
    onSuccessOrder: () => void;
};

const ConfirmOrdersModal: React.FC<Props> = ({
    show,
    orders,
    customer,
    onClose,
    onUpdateOrders,
    onSuccessOrder,
}) => {
    const [isShowCancel, setIsShowCancel] = useState(false);

    const onPayOrders = () => {
        router.post(
            route("orders.pay"),
            {
                customer: customer,
                orders: orders,
            },
            {
                onSuccess: ({ props }) => {
                    const { status } = props.flash;

                    if (status != "error") {
                        onClose(false);
                        onSuccessOrder();
                    }
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="lg">
            <div className="p-6 relative">
                <Button
                    type="button"
                    className="absolute top-2 right-2 size-7"
                    size="icon"
                    variant={"outline"}
                    onClick={() => onClose(false)}
                >
                    <X className="size-4" strokeWidth={2.5} />
                </Button>
                <Label className="uppercase text-base">
                    {customer?.name || "lorem ipsum dolor est"}
                </Label>

                <div className="mt-4 space-y-1.5">
                    {orders.map((order, index) => (
                        <Card
                            key={index}
                            order={order}
                            onUpdateOrder={onUpdateOrders}
                        />
                    ))}
                    {orders.length === 0 && (
                        <div className="text-foreground/70 text-center py-5">
                            No orders made yet.
                        </div>
                    )}
                </div>

                <div className="mt-3 bg-secondary p-2 rounded-md flex items-center">
                    <Label>Total Amount:</Label>

                    <div className="ml-auto">
                        Php{" "}
                        {Number(
                            orders.reduce((acc, o) => acc + o.total, 0)
                        ).toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setIsShowCancel(true)}
                    >
                        Cancel
                    </Button>
                    <Button className="px-7" onClick={onPayOrders}>
                        Pay order
                    </Button>
                </div>

                <CancelOrderConfirmation
                    show={isShowCancel}
                    onClose={setIsShowCancel}
                    onConfirmCancel={() => {
                        onUpdateOrders(null, "clear");
                        setIsShowCancel(false);
                        setTimeout(() => onClose(false), 100);
                    }}
                />
            </div>
        </Modal>
    );
};

type CardProps = {
    order: ADDEDORDERSTYPE;
    onUpdateOrder: (id: number, action: "add" | "remove") => void;
};

const Card: React.FC<CardProps> = ({ order, onUpdateOrder }) => {
    return (
        <div className="border border-border shadow-sm rounded-md p-2 h-[4.5rem] flex items-center gap-3">
            <div className="size-[3.25rem] shrink-0 rounded overflow-hidden">
                <img src={order.thumbnail} alt="" className="size-full" />
            </div>
            <div className="flex flex-col justify-center gap-1 grow">
                <div className="flex items-center justify-between">
                    <Label className="text-base leading-4 line-clamp-1">
                        {order.name}
                    </Label>

                    <div className="leading-3 ml-auto text-foreground/70 capitalize">
                        {order.size}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center h-fit">
                        <Button
                            size="icon"
                            className="size-6 m-0"
                            onClick={() => onUpdateOrder(order.id, "remove")}
                            disabled={false}
                        >
                            <Minus className="size-4" />
                        </Button>
                        <div className="size-8 flex items-center justify-center leading-3">
                            {order.quantity}
                        </div>
                        <Button
                            size="icon"
                            className="size-6 m-0"
                            onClick={() => onUpdateOrder(order.id, "add")}
                            disabled={false}
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    <div className="ml-auto text-sm">
                        Php <span>{Number(order.total).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrdersModal;
