import { PropsWithChildren } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { cn } from '@/lib/utils';

export type ModalProps = {
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
}

export default function PrinterModal({
    children,
    dialogStyle,
    show = false,
    center = false,
    maxWidth = '2xl',
    closeable = true,
    isFullScreen,
    onClose = () => {},
}: PropsWithChildren<{
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'fit';
    center?: boolean|string;
    dialogStyle?: string;
    isFullScreen?: boolean;
} & ModalProps>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        '7xl': 'sm:max-w-7xl',
        'fit': 'sm:max-w-fit',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                data-state={show?'open':'close'}
                className={cn(
                    "fixed inline-flex inset-0 outline-none z-50 transform transition-all max-h-screen bg-black/50 backdrop-blur-[1px] overflow-y-auto",
                )}
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 "
                    enterTo="opacity-100 translate-y-0 "
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 "
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 "
                >
                    <DialogPanel className="transform transition-all w-full">
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
