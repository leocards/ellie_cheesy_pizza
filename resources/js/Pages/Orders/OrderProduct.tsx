import Modal, { ModalProps } from "@/components/Modal";

type Props = ModalProps & {
    product?: any
}

const OrderProduct: React.FC<Props> = ({ show, onClose }) => {
    return (
        <Modal show={show} onClose={() => onClose(false)}>
            <div className="p-6"></div>
        </Modal>
    );
};

export default OrderProduct;
