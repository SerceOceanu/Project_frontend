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
    icon: <IoGridOutline size={14} />
  },
  {
    label: 'Банери',
    href: '/admin/dashboard/banners',
    icon: <IoImagesOutline size={14} />
  },
  {
    label: 'Спливаючі вікна',
    href: '/admin/dashboard/modals',
    icon: <BsWindowStack size={14} />
  },
];

function MobileMenu() {
  const pathname = usePathname();

  return (
    <div className="md:hidden bg-white shadow-sm border-b border-gray/10">
      <div className="flex overflow-x-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin/dashboard' 
            ? pathname === '/admin/dashboard'
            : pathname.startsWith(item.href);
          
          return (
            <Link 
              href={item.href} 
              key={item.label} 
              className={cn(
                'flex-1 min-w-0 flex items-center justify-center px-3 py-2 font-[600] text-xs transition-colors border-b-2',
                isActive 
                  ? 'border-blue text-blue bg-blue/5' 
                  : 'border-transparent text-gray hover:text-blue hover:bg-gray/5'
              )}
            >
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default memo(MobileMenu);
