import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-right"
            toastOptions={{
                classNames: {
                    toast: 'rounded-base! border-2! border-border! bg-secondary-background! text-foreground! font-base! shadow-shadow!',
                    title: 'font-heading! text-foreground!',
                    description: 'text-foreground/70!',
                    actionButton:
                        'bg-main! text-main-foreground! border-2! border-border! rounded-base! font-base! shadow-shadow! hover:translate-x-boxShadowX! hover:translate-y-boxShadowY! hover:shadow-none!',
                    cancelButton:
                        'bg-secondary-background! text-foreground! border-2! border-border! rounded-base! font-base!',
                    closeButton:
                        'border-2! border-border! bg-secondary-background! text-foreground!',
                    success: 'border-border!',
                    error: 'bg-black! text-white! border-border!',
                    warning: 'border-border!',
                    info: 'border-border!',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
