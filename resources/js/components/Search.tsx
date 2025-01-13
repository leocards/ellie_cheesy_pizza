import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { X, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
    // State and setter for debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup the timer if the value changes or the component unmounts
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-run the effect only if value or delay changes

    return debouncedValue;
}

type Props = {
    className?: string;
    placeholder?: string;
    onInput: (search: string) => void;
    onSearch: (search: string) => void;
};

const Search: React.FC<Props> = ({ placeholder = "Search", onSearch, onInput, className }) => {
    const searchRef = useRef<HTMLInputElement | null>(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);

    const onSearchButtonClick = () => {
        if (search) {
            setSearch("");
        }
        searchRef.current?.focus();
    };

    useEffect(() => {
        onInput(search)
    }, [search])

    useEffect(() => {
        onSearch(debouncedSearch)
    }, [debouncedSearch])

    return (
        <div className={cn("relative w-64 border border-border rounded-md overflow-hidden focus-within:border-rose-500", className)}>
            <input
                ref={searchRef}
                type="text"
                placeholder={placeholder}
                value={search}
                className="h-[39px] !ring-0 outline-none w-full border-none"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            />
            <Button
                size={"icon"}
                variant={"outline"}
                className="size-8 absolute top-[3.5px] right-[3px] !rounded"
                onClick={onSearchButtonClick}
            >
                {search ? (
                    <X className="size-5" />
                ) : (
                    <SearchIcon className="size-5" />
                )}
            </Button>
        </div>
    );
};

export default Search;
