"use client";
import { FiEdit } from "react-icons/fi";
import { LiaHistorySolid } from "react-icons/lia";
import { PiMapPinThin } from "react-icons/pi";
import { CiHeart } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { useLogout } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function ProfileMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const name = 'John Week';
  const phone = '+48 884 826 064';

  const menuItems = [
    {
      label: t('profile.history'),
      href: '/profile/history',
      icon: <LiaHistorySolid size={20}  />
    },
    {
      label: t('profile.addresses'),
      href: '/profile/address',
      icon: <PiMapPinThin size={20}  />
    },
    {
      label: t('profile.likes'),
      href: '/profile/favorites',
      icon: <CiHeart size={20} />
    },
  ]
  const logout = useLogout(); 

  return (
    <>
      <div className="bg-white rounded-2xl p-5 flex flex-col">
        <div className="mb-3">
          <div className="flex items-center justify-between rubik text-lg font-semibold mb-3">
            {name}
            <Link href="/profile/edit">
              <FiEdit size={20}  className='text-gray'/>
            </Link>
          </div>
          <div>
            {phone}
          </div>
        </div>
        <div className="hidden md:flex flex-col">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.label}>
                <div className={cn(
                  "flex items-center gap-2 rubik text-sm font-medium  py-2.5 px-5 rounded hover:bg-orange/5",
                  isActive ? "text-orange bg-background" : "text-gray "
                )}>
                  <div className='size-9 bg-white flex items-center justify-center rounded'>{item.icon}</div>
                  {item.label}
                </div>
              </Link>
            );
          })}
          <div 
            onClick={() => logout.mutate()}
            className="flex items-center gap-2 rubik text-sm font-medium  py-2.5 hover:bg-orange/5 px-5 rounded text-gray cursor-pointer">
            <div className='size-9 bg-white flex items-center justify-center rounded'><IoIosLogOut size={20} /></div>
            {t('profile.logout')}
          </div>

        </div>
        <div className="flex md:hidden items-center gap-2 rubik text-sm font-medium  p-2.5 rounded text-gray cursor-pointer active:bg-orange/5 ">
          <div className='size-9 bg-white flex items-center justify-center rounded'><IoIosLogOut size={20} /></div>
          {t('profile.logout')}
        </div>
      </div>
      <div className="grid grid-cols-3 md:hidden bg-white p-2.5 rounded-2xl mt-5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <div className={cn(
                "flex flex-col text-center items-center gap-2 rubik text-sm font-medium  p-2  rounded-xl hover:bg-orange/5",
                isActive ? "text-orange bg-background" : "text-gray "
              )}>
                <div className='size-9 bg-white flex items-center justify-center rounded-lg'>{item.icon}</div>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}