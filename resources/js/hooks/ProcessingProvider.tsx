import { PropsWithChildren, createContext, useContext, useState } from "react";

type ProcessingState = {
    processing: boolean;
    setProcessing: (is_process: boolean) => void

    label: string;
    setLabel: (label: string) => void;

    backdrop: boolean
    setBackdrop: (bool: boolean) => void
}

type ProviderProps = {} & PropsWithChildren

const InitialState: ProcessingState = {
    processing: false,
    setProcessing: () => {},

    label: "Loading...",
    setLabel: () => {},

    backdrop: true,
    setBackdrop: () => {}
}

const ProcessingContextProvider = createContext<ProcessingState>(InitialState)

const ProcessingProvider: React.FC<ProviderProps> = ({ children }) => {
    const [processing, setProcessing] = useState(false)
    const [label, setLabel] = useState("Loading...")
    const [backdrop, setBackdrop] = useState(true)

    const value = {
        processing,
        setProcessing,

        label,
        setLabel,

        backdrop,
        setBackdrop
    }

    return (
        <ProcessingContextProvider.Provider value={value}>
            {children}
        </ProcessingContextProvider.Provider>
    )
}

const useProcessing = () => {
    const context = useContext(ProcessingContextProvider);

    if (context === undefined)
        throw new Error("useProcessing must be used within a ProcessingProvider");

    return context;
}

export {
    useProcessing,
    ProcessingProvider,
}
