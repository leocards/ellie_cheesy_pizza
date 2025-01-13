import Authenticated, { Title } from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmOrdersModal from "./ConfirmOrdersModal";
import { ADDEDORDERSTYPE, IFormCustomer, PRODUCT, ProductSizes } from "./type";
import { AvatarProfile } from "@/components/ui/avatar";
import ProductCard from "./ProductCard";
import CustomerDetails from "./CustomerDetails";
import { useToast } from "@/hooks/use-toast";
import ecp_logo from "@/assets/ecp_logo.svg"

type Props = {
    products: Array<PRODUCT>;
};

const NewOrder: React.FC<Props> = ({ products }) => {
    const [orders, setOrders] = useState<Array<ADDEDORDERSTYPE>>([]);
    const [customer, setCustomer] = useState<IFormCustomer | null>(null);
    const [showConfirmOrder, setShowConfirmOrder] = useState(false);
    const [showCustomerDetails, setShowCustomerDetails] = useState(
        !customer ? true : false
    );
    const { toast } = useToast()

    const onUpdateOrders = (
        order: ProductSizes,
        action: "add" | "remove" | "clear",
        productName: string
    ) => {
        if(customer) {
            let addedOrders = [...orders];
            let orderIndex = addedOrders.findIndex(({ id }) => order.id === id);

            // if the order exist in the order list, update th roder
            if (orderIndex != -1) {
                if (action === "add") {
                    // if the order is beyond the available stock, stop the add
                    if (
                        parseInt(order.stock_in) >=
                        addedOrders[orderIndex].quantity + 1
                    ) {
                        addedOrders[orderIndex].quantity =
                            addedOrders[orderIndex].quantity + 1;
                        addedOrders[orderIndex].total =
                            addedOrders[orderIndex].total + parseFloat(order.price);
                    }
                } else if (action === "remove") {
                    // if the quantity of the order is less than zero stop the remove action
                    if (addedOrders[orderIndex].quantity > 0) {
                        addedOrders[orderIndex].quantity =
                            addedOrders[orderIndex].quantity - 1;
                        addedOrders[orderIndex].total =
                            addedOrders[orderIndex].total - parseFloat(order.price);

                        // if the quantity is now zero, remove the order from the list
                        if (addedOrders[orderIndex].quantity === 0)
                            addedOrders.splice(orderIndex, 1);
                    }
                } else if (action === "clear") {
                    addedOrders.splice(orderIndex, 1);
                }

                setOrders(addedOrders);
            } else {
                if (action === "add")
                    setOrders([
                        ...orders,
                        {
                            id: order.id,
                            name: productName,
                            size: order.size,
                            quantity: 1,
                            total: parseFloat(order.price),
                            thumbnail: products.find(({name}) => productName === name)?.thumbnail||ecp_logo
                        },
                    ]);
            }
        } else {
            toast({
                title: <Title title="Unknown customer!" status="error" />,
                description: "Please fill customer details first."
            })
        }
    };

    const onUpdateOrdersOnConfirm = (id: number|null, action: "add" | "remove" | "clear") => {
        let addedOrders: Array<ADDEDORDERSTYPE> = []

        if(id) {
            addedOrders = [...orders];
            let orderIndex = addedOrders.findIndex((order) => order.id === id);
            let productOrder = [...products].find(
                (po) => po.name === addedOrders[orderIndex].name
            );
            let productPrice = productOrder?.products.find((p) => p.id === id);

            if (action === "add") {
                addedOrders[orderIndex].quantity =
                    addedOrders[orderIndex].quantity + 1;
                addedOrders[orderIndex].total =
                    addedOrders[orderIndex].total +
                    parseFloat(productPrice?.price ?? "0");
            } else {
                if (addedOrders[orderIndex].quantity > 0) {
                    addedOrders[orderIndex].quantity =
                        addedOrders[orderIndex].quantity - 1;
                    addedOrders[orderIndex].total =
                        addedOrders[orderIndex].total -
                        parseFloat(productPrice?.price ?? "0");

                    // if the quantity is now zero, remove the order from the list
                    if (addedOrders[orderIndex].quantity === 0)
                        addedOrders.splice(orderIndex, 1);
                }
            }
        }

        setOrders(addedOrders);
    };

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Orders / New Order
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="border border-border bg-background rounded-lg shadow-sm p-4">
                <div className="flex justify-between">
                    <Button
                        className="p-0"
                        variant={"link"}
                        onClick={() => router.get(route("orders"))}
                    >
                        <ArrowLeft />
                        Back
                    </Button>

                    <div className="flex items-ceter gap-3">
                        <Button
                            className="px-2"
                            variant="outline"
                            onClick={() => setShowCustomerDetails(true)}
                        >
                            <AvatarProfile className="size-8" />
                            <div>
                                {customer?.name ||
                                    "Please add customer details"}
                            </div>
                        </Button>

                        <Button
                            className=""
                            onClick={() => setShowConfirmOrder(true)}
                        >
                            <ShoppingCart className="" strokeWidth={2.5} />
                            <div className="max-sm:hidden">Ordered items</div>
                            <div>
                                (
                                {orders.reduce(
                                    (acc, orders) => acc + orders.quantity,
                                    0
                                )}
                                )
                            </div>
                        </Button>
                    </div>
                </div>

                <div className="mt-4"></div>

                <div className="mt-4 ">
                    <div className="flex items-center justify-between">
                        <Label className="font-bold">PRODUCTS</Label>
                        <Label>
                            Total Amount:
                            <span> Php </span>
                            <span className="text-base leading-3">
                                {Number(
                                    orders.reduce(
                                        (acc, orders) => acc + orders.total,
                                        0
                                    )
                                ).toLocaleString()}
                            </span>
                        </Label>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4 [&>div]:p-2 mt-4">
                        {products.map((product, index) => (
                            <ProductCard
                                key={index}
                                product={product}
                                orders={orders}
                                onUpdateOrders={onUpdateOrders}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmOrdersModal
                show={showConfirmOrder}
                onClose={setShowConfirmOrder}
                orders={orders}
                customer={customer}
                onUpdateOrders={onUpdateOrdersOnConfirm}
                onSuccessOrder={() => {
                    setCustomer(null)
                    setOrders([])
                }}
            />
            <CustomerDetails
                show={showCustomerDetails}
                customer={customer}
                onClose={setShowCustomerDetails}
                onSetCustomer={setCustomer}
            />
        </Authenticated>
    );
};

export default NewOrder;
