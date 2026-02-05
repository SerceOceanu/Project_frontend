"use client";
import { cn } from "@/lib/utils";
import { IoGridOutline } from "react-icons/io5";
import { IoImagesOutline } from "react-icons/io5";
import { BsWindowStack } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const menuItems = [
  {
    label: 'Товари',
    href: '/admin/dashboard',
    icon: <IoGridOutline size={20} />
  },
  {
    label: 'Банери',
    href: '/admin/dashboard/banners',
    icon: <IoImagesOutline size={20} />
  },
  {
    label: 'Спливаючі вікна',
    href: '/admin/dashboard/modals',
    icon: <BsWindowStack size={20} />
  },
];

function Menu() {
  const pathname = usePathname();

  return (
    <div className='w-full max-w-[240px] flex flex-col pt-3 px-4 bg-white shadow flex-1' >
      <div className='flex flex-col gap-2.5'>
        {menuItems.map((item) => {
          // Для вкладки "Товари" (/admin/dashboard) - активна только на точном пути
          // Для остальных вкладок - активна если путь начинается с href
          const isActive = item.href === '/admin/dashboard' 
            ? pathname === '/admin/dashboard'
            : pathname.startsWith(item.href);
          
          return (
            <Link 
              href={item.href} 
              key={item.label} 
              className={cn(
                'p-3 rounded-lg font-[600] text-sm hover:bg-gray/10 transition-colors',
                isActive && 'bg-blue text-white'
              )}
            >
              <div className='flex items-center gap-4'>
                {item.icon}
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Menu);