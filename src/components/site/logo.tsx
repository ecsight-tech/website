export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-[28%] bg-primary font-heading font-bold italic text-primary-foreground ${className}`}
    >
      E
    </span>
  );
}
