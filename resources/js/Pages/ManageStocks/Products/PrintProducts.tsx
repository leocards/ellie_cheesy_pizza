import Modal, { ModalProps } from "@/components/Modal";
import PrinterModal from "@/components/PrinterModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Undo, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ecp_logo from "@/assets/ecp_logo.svg";
import { PRODUCT } from "./Index";
import Processing from "@/components/Processing";
import { useProcessing } from "@/hooks/ProcessingProvider";
import moment from "moment";

type Props = {} & ModalProps;

const PrintProducts: React.FC<Props> = ({ show, onClose }) => {
    const contentRef = useRef(null)
    const handlePrint = useReactToPrint({ contentRef });
    const { processing, setProcessing, setBackdrop } = useProcessing()

    const [data, setData] = useState<Array<PRODUCT>|null>(null)

    useEffect(() => {
        if(show) {
            setBackdrop(false)
            setProcessing(true)
            window.axios
                .get<Array<PRODUCT>>(route('manage.inventory.finish.json', {
                    _query: {
                        paginate: true
                    }
                }))
                .then((response) => {
                    let data = response.data

                    setData(data)
                })
                .finally(() => setProcessing(false))
        }

        return () => setBackdrop(true)
    }, [show])


    return (
        <PrinterModal maxWidth="fit" show={show} onClose={() => onClose(false)} closeable={false}>
            {processing && show ? (
                <div />
            ) : (
                <div className="h-fit w-full flex flex-col relative">
                    <div className="flex gap-3 p-3 bg-black/15 backdrop-bl ur sticky top-0 z-10">
                        <Button className="text-primary-foreground rounded-full" variant="ghost" size="icon" onClick={() => onClose(false)}>
                            <ArrowLeft className="!size-6" />
                        </Button>
                        <Button className="ml-auto text-base" onClick={() => handlePrint()}>
                            <Printer className="!size-5" />
                            Print
                        </Button>
                    </div>
                    <div className="mx-auto w-fit h-fit pt-5 pb-8">
                        <div ref={contentRef} className="bg-white w-[8.5in] print:pb-0 pb-10">
                            <style>
                                {`
                                    @media print {
                                        body {
                                            overflow: hidden;
                                            height: fit-content;
                                            margin: 0px !important;
                                        }

                                        @page {
                                            size: portrait;
                                            margin-top: 1.95rem;
                                            margin-bottom: 0.88rem;
                                        }
                                    }

                                `}
                            </style>

                            <div className="grid grid-cols-[5rem,1fr,5rem] mx-auto w-fit gap-3 pt-10 print:pt-0">
                                <div>
                                    <img src={ecp_logo} className="size-full" />
                                </div>
                                <div className="text-center self-center">
                                    <div className="uppercase">Ellie's Cheesy Pizza</div>
                                    <div className="">Villarosa, New Visayas, Panabo City</div>
                                </div>
                                <div></div>
                            </div>

                            <div className="mt-5">
                                <table className="table border border-black [&>thead_th]:border-black [&>tbody_td]:border-black [&>tbody_tr]:border-black mx-auto w-fit">
                                    <thead className="">
                                        <tr className="divide-x border-black text-black">
                                            <th className="w-60 px-1">Product Name</th>
                                            <th className="w-16 px-1">Size</th>
                                            <th className="w-28 px-1 text-center">Opening Stock</th>
                                            <th className="w-20 px-1 text-center">Stock In</th>
                                            <th className="w-28 px-1 text-center">Closing Stock</th>
                                            <th className="w-28 px-1 text-center">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {data && data.map((product, index) => (
                                            <tr key={index} className="divide-x">
                                                <td className="w-60 p-1">{product.name}</td>
                                                <td className="w-16 p-1 capitalize">{product.size}</td>
                                                <td className="w-28 p-1 text-center">{product.opening_stock}</td>
                                                <td className="w-20 p-1 text-center">{product.stock_in??0}</td>
                                                <td className="w-28 p-1 text-center">{product.closing_stock}</td>
                                                <td className="w-28 p-1 text-center">{moment(product.updated_at).format('ll')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </PrinterModal>
    );
};

export default PrintProducts;
