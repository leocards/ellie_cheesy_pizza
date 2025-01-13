import { Box, Boxes, HandCoins } from "lucide-react";
import { Label } from "@/components/ui/label";

const StatisticsCard: React.FC<{
    label: string;
    data: string;
    footer: string;
    type: "sold" | "products" | "raw";
}> = ({ label, data, footer, type}) => {
    const icon = {
        sold: (
            <div className="size-12 bg-lime-100 rounded-full flex items-center justify-center">
                <HandCoins className="size-6 text-lime-700" />
            </div>
        ),
        products: (
            <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Boxes className="size-6 text-purple-700" />
            </div>
        ),
        raw: (
            <div className="size-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Box className="size-6 text-yellow-700" />
            </div>
        ),
    }[type];

    return (
        <div className="p-4 py-3 border rounded-md min-h-28 bg-white shadow-sm">
            <div className="flex items-start gap-4">
                {icon}
                <div className="">
                    <Label className="!text-base uppercase text-foreground/60">
                        {label}
                    </Label>
                    <div className="text-3xl">{data}</div>
                    <div className="text-sm text-foreground/60 font-medium mt-1">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsCard
