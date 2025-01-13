import Modal, { ModalProps } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = ModalProps & {
    onConfirmCancel: () => void
}

const CancelOrderConfirmation: React.FC<Props> = ({
    show, onClose, onConfirmCancel
}) => {
    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="sm" center>
            <div className="p-6">

                <div className="text-center mt-4 mb-12">Are you sure to cancel the orders?</div>

                <div className="flex justify-between">
                    <Button variant={"outline"} type="button" className="px-12" onClick={() => onClose(false)}>
                        No
                    </Button>
                    <Button className="px-7" type="button" onClick={() => onConfirmCancel()}>
                        Yes, cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CancelOrderConfirmation;
