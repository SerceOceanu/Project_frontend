import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinkItem({ item, className, onClick }: { item: { href: string, label: string }, className?: string, onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className={cn(button, "w-full mb-2",pathname === item.href && ' text-orange border-orange',className)}
    >
      {item.label}
    </Link>
  )
}

const button = 'w-full flex items-center text-center justify-center rubik text-sm text-gray py-3 px-3 rounded-2xl bg-white border border-transparent';