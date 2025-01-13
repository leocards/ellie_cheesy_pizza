import { useProcessing } from "@/hooks/ProcessingProvider";
import { cn } from "@/lib/utils";
import { Dialog } from "@headlessui/react";

const Processing = ({
}) => {
    const { label, backdrop, processing } = useProcessing()

    return (
        <Dialog
            open={processing}
            as="div"
            onClose={() => null}
            className={cn("fixed inset-0 inline-flex overflow-y-auto px-4 py-6 sm:px-0 z-50 transform transition-all max-h-screen outline-none", backdrop && "bg-black/50")}
        >
            <div className="mx-auto my-auto flex items-center gap-4 text-white">
                <span className="loading loading-spinner loading-md bg-gray-50"></span>
                <span>{label}</span>
            </div>
        </Dialog>
    );
};

export default Processing
