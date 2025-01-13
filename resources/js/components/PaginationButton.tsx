import { Button } from "@/components/ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/PaginateProvider";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const generateSequentialArray = (length: number) => Array.from({ length }, (_, i) => i + 1);

const getVisiblePages = (pages: Array<number>, current_page: number, pagesPerSet = 3) => {
    // Calculate the index of the first page in the current set
    const startIndex = Math.floor((current_page - 1) / pagesPerSet) * pagesPerSet;
    // Slice the array to get the current set of pages
    return pages.slice(startIndex, startIndex + pagesPerSet);
}

const PaginationButton = () => {
    const { paginate, setPage } = usePagination<any>()
    const lastPage = paginate.last_page

    const setOfPages = useMemo(() => {
        return getVisiblePages(generateSequentialArray(paginate.last_page), paginate.current_page)
    }, [paginate])

    return (
        <Pagination className="mt-5">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        disabled={!!!(paginate.prev_page_url)}
                        className="shadow-sm"
                        onClick={() => {
                            let pageNumber = paginate.current_page;
                            if (paginate.current_page != 1) {
                                setPage(pageNumber -= 1)
                            }
                        }}
                    />
                </PaginationItem>

                {
                    setOfPages.map((page, index) => (
                        <PaginationItem key={index} role="button">
                            <PaginationLink
                                isActive={paginate.current_page === page}
                                className={cn("shadow-sm")}
                                onClick={() => setPage(page)}
                            >
                                <span>{page}</span>
                            </PaginationLink>
                        </PaginationItem>
                    ))
                }

                {
                    lastPage > 3 && (
                        <PaginationItem>
                            <Menubar className="px-0 shadow-sm max-sm:size-7">
                                <MenubarMenu>
                                    <MenubarTrigger className="!p-0 h-[2.4rem] rounded-md cursor-pointer hover:bg-secondary max-sm:!h-[1.63rem] max-sm:size-7">
                                        <PaginationEllipsis className="size-4 max-sm:mx-auto sm:size-10" />
                                    </MenubarTrigger>
                                    <MenubarContent align="center" className="!p-0.5">
                                        <div
                                            className={cn(
                                                "grid grid-cols-[repeat(5,2.5rem)] gap-0.5 max-h-32 overflow-y-auto p-0.5",
                                                "[&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400"
                                            )}
                                        >
                                            {Array.from({ length: paginate.last_page }).map((_, index) => (
                                                <MenubarItem key={index} className="hover:!bg-transparent p-0">
                                                    <PaginationLink
                                                        isActive={paginate.current_page == ++index}
                                                        onClick={() => setPage(++index)}
                                                    >
                                                        <span>{index}</span>
                                                    </PaginationLink>
                                                </MenubarItem>
                                            ))}
                                        </div>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </PaginationItem>
                    )
                }

                <PaginationItem>
                    <PaginationNext
                        disabled={!!!(paginate.next_page_url)}
                        className="shadow-sm"
                        onClick={() => {
                            let pageNumber = paginate.current_page || 1;
                                if ((paginate.last_page || 1) > (paginate.current_page || 1))
                                    setPage((pageNumber += 1));
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationButton;
