import { cn } from "@/lib/utils";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

const AccordionItemCard: React.FC<{
    value: string;
    header: React.ReactNode;
    children: React.ReactNode;
    layoutGrid: string;
}> = ({
    value, header, children, layoutGrid
}) => {
    return (
        <AccordionItem value={value}>
            <AccordionTrigger className={cn("[&[data-state=open]]:bg-rose-500/20 [&[data-state=open]]:text-primary [&_svg]:ml-auto [&_svg]:mr-4 py-3 hover:bg-secondary hover:no-underline", layoutGrid)}>
                {header}
            </AccordionTrigger>
            <AccordionContent className="p-4 border-t">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
}

export default AccordionItemCard;
