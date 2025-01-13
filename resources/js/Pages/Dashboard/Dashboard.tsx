import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import StatisticsCard from "./StatisticsCard";
import { TrendingDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import Chart from "./Chart";

type Props = {
    sales: { year: number, month: string, total_sales: number }[],
    sold: number,
    products: number,
    raw: number,
    stocks: {
        product: Array<{ id: number; name: string; size: "small" | "large" | "medium"; stock_in: string }>
        raw: Array<{ id: number; name: string; stock_in: string }>
    }
}

export default function Dashboard({ sales, sold, products, raw, stocks }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-3 gap-4 mt-4">
                <StatisticsCard
                    label="Sold items"
                    data={sold.toString()}
                    footer="Total number of items sold"
                    type="sold"
                />
                <StatisticsCard
                    label="Products"
                    data={products.toString()}
                    footer="Total number of products"
                    type="products"
                />
                <StatisticsCard
                    label="Raw materials"
                    data={raw.toString()}
                    footer="Total number of raw materials"
                    type="raw"
                />
            </div>

            <div className="bg-white rounded-md border mt-4 shadow-sm">
                <div className="border-b py-3 px-4 uppercase flex items-center gap-3">
                    <TrendingDown className="size-5 text-rose-700" />
                    <div className="font-semibold">Nearly out of stock items</div>
                </div>

                <div className="grid grid-cols-2 divide-x min-h-32">
                    <div className="py-3 px-4">
                        <Label className="!text-base text-rose-700 font-semibold">Products</Label>
                        <div className="[&>div]:py-2.5 [&>div]:flex [&>div]:items-center [&>div]:justify-between divide-y">
                            {stocks?.product?.map((product, index) => (
                                <div className="" key={index}>
                                    <div>{product.name} | <span className="capitalize">{product.size}</span></div>
                                    <div>{product.stock_in}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="py-3 px-4">
                        <Label className="!text-base text-rose-700 font-semibold">Raw materials</Label>
                        <div className="[&>div]:py-2.5 [&>div]:flex [&>div]:items-center [&>div]:justify-between divide-y">
                            {stocks?.raw?.map((product, index) => (
                                <div className="" key={index}>
                                    <div>{product.name}</div>
                                    <div>{product.stock_in}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Chart data={sales} />
            </div>
        </AuthenticatedLayout>
    );
}
