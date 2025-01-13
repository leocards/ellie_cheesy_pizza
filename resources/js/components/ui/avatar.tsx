import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import avatarProfile from "@/assets/profile.png";

import { cn } from "@/lib/utils"
import { UserRound } from "lucide-react"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const AvatarProfile: React.FC<{ src?: string; className?: string, fallbackSize?: number, active?: boolean, activeStatusPosition?: string; }> =
({ src, className, fallbackSize = 16, active, activeStatusPosition }) => {
	return (
		<div className={cn("size-fit", active && 'relative')}>
            <Avatar className={cn(className)}>
                <AvatarImage src={src?src:avatarProfile} alt="profile" />
                <AvatarFallback>
                    <UserRound size={fallbackSize} />
                </AvatarFallback>
            </Avatar>
            {active && (<span className={cn("absolute size-2 bg-green-500 z-10 rounded-full ring ring-background", activeStatusPosition??"bottom-0 right-px")} />)}
        </div>
	);
};

export { Avatar, AvatarImage, AvatarFallback,AvatarProfile }
