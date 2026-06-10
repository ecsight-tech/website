import Image from "next/image";

import logo from "../../../public/logo.png";
import logoInline from "../../../public/logo-inline.png";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="Ecsight"
      className={`rounded-[22%] ${className}`}
    />
  );
}

export function LogoInline({ className = "h-7" }: { className?: string }) {
  return (
    <Image
      src={logoInline}
      alt="Ecsight"
      className={`w-auto ${className}`}
    />
  );
}
