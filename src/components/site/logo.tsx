export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <img src="/logo.png" alt="Ecsight" className={`rounded-[22%] ${className}`} />
  );
}

export function LogoInline({ className = "h-7" }: { className?: string }) {
  return (
    <img src="/logo-inline.png" alt="Ecsight" className={`w-auto ${className}`} />
  );
}
