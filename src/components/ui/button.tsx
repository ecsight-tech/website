import { forwardRef } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

// Shared look, lifted from the hero buttons: pill shape, raised shadow with a
// 1px top highlight.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium text-primary-foreground shadow-lg inset-shadow-[0_1px_0_rgb(255_255_255/0.25)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";

// CSS-driven hover. Applied only to the static (non-animated) buttons — kept
// off the Motion path so the browser doesn't re-ease the opacity/transform
// that Motion is already keyframing on entrance (that fight caused the
// double-blink). Motion buttons get whileHover instead.
const cssInteractive =
  "transition-transform duration-300 hover:scale-105 hover:opacity-90";

const variants: Record<Variant, string> = {
  primary: "bg-linear-to-br from-10% from-[#195EDD] to-primary shadow-primary/30",
  secondary: "bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-base",
  md: "px-7 py-3.5 text-base",
  lg: "px-8 py-4 text-xl tracking-wide",
};

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
};

// Renders an <a> when `href` is provided, otherwise a <button>.
export type ButtonProps =
  | (ButtonBaseProps &
      Omit<React.ComponentPropsWithoutRef<"a">, "ref"> & { href: string })
  | (ButtonBaseProps &
      Omit<React.ComponentPropsWithoutRef<"button">, "ref"> & {
        href?: undefined;
      });

function makeButton(withCssHover: boolean) {
  return forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
    function Button(
      { variant = "primary", size = "md", className, ...props },
      ref,
    ) {
      const cls = cn(
        base,
        variants[variant],
        sizes[size],
        withCssHover && cssInteractive,
        className,
      );

      if (props.href !== undefined) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={cls}
            {...(props as React.ComponentPropsWithoutRef<"a">)}
          />
        );
      }

      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={cls}
          {...(props as React.ComponentPropsWithoutRef<"button">)}
        />
      );
    },
  );
}

export const Button = makeButton(true);

// Motion owns hover (and entrance) so nothing CSS-transitions the same props.
const MotionBase = motion.create(makeButton(false));

export const MotionButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  React.ComponentProps<typeof MotionBase>
>(function MotionButton(props, ref) {
  return (
    <MotionBase
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    />
  );
});
