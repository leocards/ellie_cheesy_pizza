import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Children,
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Check } from "lucide-react";

type SelectOptionState = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selected: string;
    setSelected: (select: string) => void;
    width: number;
    setWidth: CallableFunction;
};

const initialState: SelectOptionState = {
    isOpen: false,
    setIsOpen: () => {},
    selected: "",
    setSelected: () => {},
    width: 0,
    setWidth: () => {},
};

type SelectOptionProps = {
    children: ReactNode;
    initialValue?: string;
};

const SelectOptionContext = createContext<SelectOptionState>(initialState);

const SelectOptionProvider = ({ children, initialValue = "", ...props }: SelectOptionProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>(initialValue);
    const [width, setWidth] = useState<number>(0);

    const value = {
        isOpen: isOpen,
        setIsOpen: (isOpen: boolean) => {
            setIsOpen(isOpen);
        },
        selected: selected,
        setSelected: (select: string) => {
            setSelected(select);
        },
        width,
        setWidth: (width: number) => {
            setWidth(width);
        },
    };

    useEffect(() => {

    }, [])

    return (
        <SelectOptionContext.Provider value={value} {...props}>
            {children}
        </SelectOptionContext.Provider>
    );
};

const useSelectOption = () => {
    const context = useContext(SelectOptionContext);

    if (context === undefined) {
        console.error(
            "useSelectOption must be used within an SelectOptionProvider"
        );
        throw new Error(
            "useSelectOption must be used within an SelectOptionProvider"
        );
    }

    return context;
};

const SelectOptionRoot: React.FC<{ children: ReactNode; initialValue?: string; }> = ({ children, initialValue }) => {
    return <SelectOptionProvider initialValue={initialValue}>{children}</SelectOptionProvider>;
};

const SelectOptionMain: React.FC<
    SelectOptionProps & { onChange: (value: string) => void }
> = ({ children, onChange }) => {
    const { isOpen, selected, setIsOpen } = useSelectOption();

    useEffect(() => {
        onChange(selected);
    }, [selected]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            {children}
        </Popover>
    );
};

const SelectOption: React.FC<{
    children: ReactNode;
    initialValue?: string;
    onChange: (value: string) => void;
}> = ({ children, initialValue, onChange }) => {
    return (
        <SelectOptionRoot initialValue={initialValue}>
            <SelectOptionMain children={children} onChange={onChange} />
        </SelectOptionRoot>
    );
};

const SelectOptionContent: React.FC<{
    children: ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const { width } = useSelectOption();

    return (
        <PopoverContent className={cn("p-1", className)} align="start" style={{width: `${width}px`}}>
            {children}
        </PopoverContent>
    );
};

const SelectOptionItem: React.FC<{
    value: string;
    onSelect?: (option: string) => void;
    children?: ReactNode;
    className?: string;
}> = ({ value, onSelect, children, className }) => {
    const { selected, setIsOpen, setSelected } = useSelectOption();

    const handleSelect = () => {
        onSelect && onSelect(value);
        setSelected(value);
        setIsOpen(false);
    };

    return (
        <div
            onClick={handleSelect}
            className={cn(
                "p-1.5 hover:bg-secondary transition cursor-pointer rounded flex items-center gap-1.5",
                className
            )}
        >
            <div className="size-4">
                {selected === value && <Check className="size-4" />}
            </div>
            {children ?? value}
        </div>
    );
};

const SelectOptionTrigger: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const ref = useRef(null);
    const { setWidth } = useSelectOption();

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setWidth(entries[0].target.clientWidth);
            }
        });

        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <PopoverTrigger
            asChild
            className="hover:!bg-transparent aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
            ref={ref}
        >
            {children}
        </PopoverTrigger>
    );
};

export {
    SelectOption,
    SelectOptionItem,
    SelectOptionTrigger,
    SelectOptionContent,
};
