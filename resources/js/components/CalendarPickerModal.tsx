import React from "react";
import Modal, { ModalProps } from "./Modal";
import { Matcher } from "react-day-picker";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";

type Props = {
    selected?: Date
    onSelect: CallableFunction
} & ModalProps

const CalendarPickerModal: React.FC<Props> = ({ selected, show, onSelect, onClose }) => {
    return (
        <Modal
            show={show}
            onClose={() => onClose(false)}
            maxWidth="fit"
            center
        >
            <div className="p-4">
                <div className="flex px-0 justify-end">
                    <Button variant="outline" className="h-8" onClick={() => onClose(false)}>Close</Button>
                </div>

                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                        onSelect(date)
                    }}
                    className="border rounded-md mt-3"
                />
            </div>
        </Modal>
    );
};

export default CalendarPickerModal;
