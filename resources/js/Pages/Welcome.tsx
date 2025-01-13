import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import ecp_logo from "@/assets/ecp_logo.svg";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-rose-700 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="bg-gray-50 p-9 pb-12 max-w-lg mx-auto rounded-lg relative">
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-50 rounded-full p-5">
                                <img src={ecp_logo} className="size-36" />
                            </div>

                            <div className="text-rose-800 font-semibold text-xl text-center mt-16">Select user type</div>

                            <div className="flex gap-8 justify-center mt-10">
                                <Link href={route('login', ['admin'])}>
                                    <div className="rounded-md shadow-md flex flex-col items-center justify-center w-36 h-28 hover:shadow-lg transition duration-200">
                                        <UserCircleIcon className="size-14 text-rose-800" />

                                        <div>Administrator</div>
                                    </div>
                                </Link>

                                <Link href={route('login', ['staff'])}>
                                    <div className="rounded-md shadow-md flex flex-col items-center justify-center w-36 h-28 hover:shadow-lg transition duration-200">
                                        <UserGroupIcon className="size-14 text-rose-800" />

                                        <div>Staff</div>
                                    </div>
                                </Link>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
