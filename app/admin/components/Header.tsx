"use client";
import Image from "next/image";
import { IoIosLogOut } from "react-icons/io";
import { useAdminLogout } from "@/hooks/useAdminLogin";
import { memo } from "react";

function Header() {
  const { logout } = useAdminLogout();

  return (
      <header className="flex items-center bg-white p-2.5 shadow px-4 md:px-8">
        <Image 
          src="/assets/images/logo.svg" 
          alt="Cerce Oceanu" 
          width={50} 
          height={40} 
          className='mr-auto'
        />

        <button 
          onClick={logout}
          className='flex items-center gap-2 md:gap-3 ml-4 md:ml-10 cursor-pointer hover:opacity-70 transition-opacity text-sm md:text-base'
        >
          <IoIosLogOut size={20} className="md:w-6 md:h-6" />
          <span className="hidden sm:inline">Війти</span>
        </button>
      </header>
  );
}

export default memo(Header);
