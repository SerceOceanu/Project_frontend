import { cn } from "@/lib/utils";
import { Filter } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Item({
  item, 
  filter, 
  setFilter,
  className,
  href,
  onClick
}: {
  item: {image: string, title: string, value: Filter},
  filter: Filter,
  setFilter: (filter: Filter) => void,
  className?: string
  href: string
  onClick: () => void
}) {
  return (
    <Link href={href} onClick={onClick} className="h-full"> 
      <Button 
        className={cn(
          button, 
          "cursor-pointer gap-2",
          item.value === filter && ' text-orange border-orange',
          className
        )}
        onClick={() => setFilter(item.value as Filter)}
      >
        <Image src={item.image} alt={item.title} width={24} height={24} />
        <span className="rubik text-sm font-light text-start whitespace-normal break-words">{item.title}</span> 
      </Button>
  
    </Link>
  )
}
const button = 'w-full h-full flex items-center text-center rubik text-sm text-gray py-3 px-3 rounded-2xl bg-white border border-transparent';