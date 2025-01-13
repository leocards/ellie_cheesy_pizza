import { forwardRef } from "react";
import { Input, InputProps } from "./ui/input";

interface NumberInputProps extends InputProps {
    isAmount?: boolean | null;
    max?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({ isAmount, ...props}, ref) => {
        const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;

            const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

            if (isAmount && props.max && parseFloat(sanitizedValue) > props.max) {
                e.currentTarget.value = props.max.toString(); // Limit to max if exceeded
            } else if (props.max && sanitizedValue.length > props.max) {
                e.currentTarget.value = sanitizedValue.slice(0, props.max); // Limit length
            } else {
                e.currentTarget.value = sanitizedValue;
            }
        };

        const onBlur = (e: React.FormEvent<HTMLInputElement>) => {
            if(isAmount) {
                const { value } = e.currentTarget;
                const formattedValue = parseFloat(value).toFixed(2);
                e.currentTarget.value = formattedValue ? Number(formattedValue).toLocaleString() : "";
            }
        }

        const onFocus = (e: React.FormEvent<HTMLInputElement>) => {
            if(isAmount) {
                const { value } = e.currentTarget;
                e.currentTarget.value = value.replace(/,/g, '') ?? "";
            }
        }

        return <Input {...props} ref={ref} onInput={handleInput} onBlur={onBlur} onFocus={onFocus} />;
    }
);

export default NumberInput
