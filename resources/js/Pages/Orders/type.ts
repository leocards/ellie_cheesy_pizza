import { PRODUCTSIZES } from "@/types";
import { z } from "zod";

const CUSTOMERSCHEMA = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "The name field is required."),
    contact: z.string().min(1, "The contact no. field is required."),
    address: z.string().min(1, "The address field is required."),
})

type IFormCustomer = z.infer<typeof CUSTOMERSCHEMA>

type ProductSizes = {
    id: number;
    size: PRODUCTSIZES;
    stock_in: string;
    price: string;
};

type PRODUCT = {
    name: string;
    thumbnail: string;
    products: Array<ProductSizes>;
};

type ADDEDORDERSTYPE = {
    id: number;
    name: string;
    size: string;
    quantity: number;
    total: number;
    thumbnail: string;
};

export {
    CUSTOMERSCHEMA,

    type IFormCustomer,
    type ProductSizes,
    type PRODUCT,
    type ADDEDORDERSTYPE,
}
