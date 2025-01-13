import { PAGINATEDDATA } from "@/types";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

type PaginationParameters = Record<string, unknown>;

interface PaginationContextType<T> {
    paginate: PAGINATEDDATA<T>;
    loading: boolean;
    hasRendered: boolean;
    search: string;
    setPage: (page: number) => void;
    setLoading: (isLoading: boolean) => void;
    setSearch: (search: string|null) => void;
    setFilter: (filter: string|null) => void;
}

const PaginationContext = createContext<PaginationContextType<any> | undefined>(undefined)

type Props<T> = {
    endPoint: string;
    initialValue: PAGINATEDDATA<T>
} & PropsWithChildren;

const PaginateProvider = <T,>({ endPoint, children, initialValue }: Props<T>) => {
    const [paginate, setPaginate] = useState<PAGINATEDDATA<T>>(initialValue)
    const [paginateParameters, setPaginateParameters] = useState<PaginationParameters>({ page: 1 })
    const [loading, setLoading] = useState(false)
    const [hasRendered, setHasRendered] = useState(false)
    const [search, setSearch] = useState("")

    const fetchPageData = useCallback(async () => {
        if(hasRendered) {
            setLoading(true)
        }
        try {
            const response = await window.axios.get<PAGINATEDDATA<T>>(route(endPoint, { _query: paginateParameters }))

            setPaginate(response.data)

            setLoading(false)
        } catch (error) {
            console.error('Error fetching paginated data:', error)
            setLoading(false)
        }
    }, [paginateParameters])

    const setPage = (_query: PaginationParameters) => {
        setPaginateParameters(_query)
    }

    useEffect(() => {
        if(initialValue)
            setPaginate(initialValue)
    }, [initialValue])

    useEffect(() => {
        fetchPageData()
    }, [paginateParameters])

    useEffect(() => {
        setTimeout(() => setHasRendered(true), 800)
    }, [])

    return (
        <PaginationContext.Provider
            value={{
                paginate,
                loading,
                hasRendered,
                search,
                setLoading,
                setPage: (page: number) => {
                    setPage({ ...paginateParameters, page })
                },
                setSearch: (search: string|null) => {
                    setSearch(search??"")
                    if(!search) {
                        delete paginateParameters.search

                        setPage({ ...paginateParameters })
                    } else {
                        setPage({ ...paginateParameters, search })
                    }
                },
                setFilter: (filter: string|null) => {
                    if(!filter) {
                        delete paginateParameters.filter

                        setPage({ ...paginateParameters })
                    } else {
                        setPage({ ...paginateParameters, filter })
                    }
                },
            }}
        >
            {children}
        </PaginationContext.Provider>
    )
}

export const usePagination = <T,>(): PaginationContextType<T> => {
    const context = useContext(PaginationContext);

    if (!context) {
      throw new Error('usePagination must be used within a PaginateProvider');
    }
    return context;
};

export default PaginateProvider
