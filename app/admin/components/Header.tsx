"use client";
import Image from "next/image";
import { IoIosLogOut } from "react-icons/io";
import { useAdminLogout } from "@/hooks/useAdminLogin";
import { memo } from "react";

function Header() {
  const { logout } = useAdminLogout();

  return (
      <header className="flex  bg-white p-2.5 shadow px-8">
        <Image 
          src="/assets/images/logo.svg" 
          alt="Cerce Oceanu" 
          width={50} 
          height={40} 
          className='mr-auto'
        />

        <button 
          onClick={logout}
          className='flex items-center gap-3 ml-10 cursor-pointer hover:opacity-70 transition-opacity'
        >
          <IoIosLogOut size={24} />
          Війти
        </button>
            
       
      </header>
  );
}

export default memo(Header);
