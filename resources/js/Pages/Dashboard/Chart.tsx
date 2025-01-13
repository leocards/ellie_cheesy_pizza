import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartConfig = {
    sale: {
        label: "Sale",
        color: "#e11d48",
    }
} satisfies ChartConfig;

type Props = {
    data: Array<{ year: number, month: string, total_sales: number }>
}

export default function Chart({ data }: Props) {

    const chartData = useMemo(() => {
        let months = [
            { month: "Jan", sale: 0 },
            { month: "Feb", sale: 0 },
            { month: "Mar", sale: 0 },
            { month: "Apr", sale: 0 },
            { month: "May", sale: 0 },
            { month: "Jun", sale: 0 },
            { month: "Jul", sale: 0 },
            { month: "Aug", sale: 0 },
            { month: "Sep", sale: 0 },
            { month: "Oct", sale: 0 },
            { month: "Nov", sale: 0 },
            { month: "Dec", sale: 0 },
        ];

        return months.map((sale) => ({
            ...sale,
            sale: data.find((d) => d.month === sale.month)?.total_sales||0
        }))
    }, [data])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly sales</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-[300px] w-full" config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis width={30} className="font-medium text-[10px]" />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <defs>
                            <linearGradient
                                id="fillSale"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-sale)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-sale)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="sale"
                            type="natural"
                            fill="url(#fillSale)"
                            fillOpacity={0.4}
                            stroke="var(--color-sale)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
