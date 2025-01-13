import PaginationButton from "@/components/PaginationButton";
import Search from "@/components/Search";
import { AvatarProfile } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PaginateProvider, { usePagination } from "@/hooks/PaginateProvider";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PAGINATEDDATA, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Eye, UserRoundPen, UserRoundPlus } from "lucide-react";

type Props = {
    users: PAGINATEDDATA<User>;
}

const App: React.FC<Props> = (props) => {
    return (
        <PaginateProvider endPoint="users.json" initialValue={props.users}>
            <Users />
        </PaginateProvider>
    )
}

const Users = ({ }) => {
    const { paginate, search, loading, hasRendered, setSearch, setLoading } = usePagination<User>()

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="border bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-14 flex items-center justify-end px-2 gap-3">
                    <Search
                        onInput={() => hasRendered && setLoading(true)}
                        onSearch={(search) => {
                            setSearch(search);
                        }}
                        className="shadow-sm"
                    />
                    <Button className="h- shadow-sm" variant={"default"} onClick={() => router.get(route('users.create'))}>
                        <UserRoundPlus className="!size-5" />
                        <div>Add user</div>
                    </Button>
                </div>

                <div className="grid grid-cols-[repeat(2,1fr),10rem,6rem] [&>div]:p-2 font-semibold border-b bg-prim ary text-pri mary-foreground">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div className="text-center"></div>
                </div>

                <div className="relative divide-y">
                    {paginate.data.length === 0 && search ? (
                        <div className="text-center py-6">No results found for "{search}"</div>
                    ) : (paginate.data.length === 0 && !search) && (
                        <div className="text-center py-6">No product available.</div>
                    )}
                    {paginate.data.map((user, index) => (
                        <div key={index} className="grid grid-cols-[repeat(2,1fr),10rem,6rem] [&>div]:p-2 [&>div]:flex [&>div]:items-center">
                            <div className="gap-2">
                                <AvatarProfile src={user.avatar} className="size-8" />
                                <div className="line-clamp-1">{`${user.first_name} ${user.last_name}`}</div>
                            </div>
                            <div>
                                <div className="line-clamp-1">{user.email}</div>
                            </div>
                            <div>
                                <div className="line-clamp-1 capitalize">{user.role}</div>
                            </div>
                            <div className="flex justify-center gap-3">
                                <Button variant={"outline"} size={"icon"} className="size-8 shadow-sm" onClick={() => router.get(route('users.create', [user.id]))}>
                                    <UserRoundPen className="!size-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center justify-center gap-3 py-6 absolute top-0 left-0 w-full h-full bg-black/35">
                            <span className="loading loading-spinner loading-md bg-gray-50"></span>
                            <div className="text-gray-50">Loading...</div>
                        </div>
                    )}
                </div>
            </div>

            <PaginationButton />

        </AuthenticatedLayout>
    );
};

export default App;
