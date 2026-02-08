"use client";
import Image from "next/image";
import Language from "./header/Language";
import { useTranslations } from "next-intl";
import Navigation from "./header/Navigation";
import Basket from "./header/Basket";
import MobileMenu from "./header/MobileMenu";
import { Link } from "@/lib/navigation";
import SubMenu from "./header/SubMenu";
import LoginForm from "./header/auth/LoginForm";
import { useStatesStore } from "@/store/useStatesStore";


export default function Header() {
  const { isLoginOpen } = useStatesStore();
  const t = useTranslations(); 
  return (
      <header className="fixed top-1 left-0 right-0 flex flex-col justify-center gap-1 !px-2.5 z-40 container mx-auto  ">
        <div className={`${card} w-full max-w-[1420px]`}>
            <div className="flex items-center justify-between ">
              <Link href="/" className="flex items-center mr-2 xl:mr-[30px] ml-2.5">
                <Image 
                  src="/assets/images/logo.png" 
                  alt={t('name')} 
                  width={50} 
                  height={40} 
                />
              </Link>
              <div className="hidden lg:block">
                <Language />
              </div>
              <div className="hidden lg:block">
                <p className="roboto text-xs font-light">{t('header.work-hours')}</p>
                <div className="flex items-center gap-2">
                  <p className="roboto">{t('header.work-hours-description')}</p>
                  <p className="roboto ">10:00 - 22:00</p>
                </div>
              </div>
            </div>
            <Navigation />
            <div className="flex items-center gap-2">
              <Basket />
              <MobileMenu />
            </div>
          </div>
        <SubMenu />
        {isLoginOpen && <LoginForm />}
      </header>
  );
}

const card = 'flex items-center rounded-2xl justify-between bg-white mx-auto p-2.5 shadow'