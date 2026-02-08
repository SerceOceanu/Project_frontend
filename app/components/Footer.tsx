'use client';
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { RiTelegram2Fill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa6";
export default function Footer() {
  const t = useTranslations(); 

  const nvItems = [
    {
      label: t('header.home'),
      href: '/'
    },
    {
      label: t('header.delivery'),
      href: '/delivery'
    },
    {
      label: t('header.catalogue'),
      href: '/catalogue',
      items:[
        {
          label: t('header.chilled'),
          href: '/catalogue?filter=chilled'
        },
        {
          label: t('header.frozen'),
          href: '/catalogue?filter=frozen'
        },
        {
          label: t('header.ready'),
          href: '/catalogue?filter=ready'
        },
        {
          label: t('header.marinated'),
          href: '/catalogue?filter=marinated'
        },
        {
          label: t('header.snacks'),
          href: '/catalogue?filter=snacks'
        },
      ]
    },

  ]
  return (
    <footer className="bg-[url('/assets/images/waves.png')] bg-cover bg-center bg-no-repeat pt-20 bg-white">
      <section className="container grid lg:grid-cols-5 mb-[50px] gap-6 ">
        <Image 
          className="col-span-1 w-[153px] h-[120px] mx-auto lg:mx-0"
          src="/assets/images/logo.png" 
          alt="logo" 
          width={153} 
          height={120} 
        />
        <div className="col-span-1 mx-auto lg:mx-0">
          <h3 className="text-light-gray mb-5 text-center lg:text-left">
            {t('header.navigation')}
          </h3>
          <ul className="flex flex-col gap-4 text-center lg:text-left">
            {nvItems.map((item) => (
              <li key={item.href} className="flex flex-col font-semibold gap-2">
                <Link href={item.href}>
                  {item.label}
                </Link>
                {item.items && (
                  <ul className="flex flex-col gap-2 font-[400]">
                    {item.items.map((item, index) => (
                      <Link href={item.href} key={index}>
                        <li className="hover:underline cursor-pointer" key={index}>
                          {item.label}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 mx-auto lg:mx-0">
          <h3 className="text-light-gray mb-5 text-center lg:text-left">
            {t('header.contact')}
          </h3>
          <ul className="flex flex-col gap-4 text-center lg:text-left">
            <li rel="tel:+48884826064" className="font-semibold">
              {t('header.phone')}
            </li>
            <li rel="mailto:info@serceoceanu.com.pl" className="font-semibold">
              {t('header.email')}
            </li>
          </ul>
        </div>
        <div className="col-span-1 mx-auto lg:mx-0">
          <h3 className="text-light-gray mb-5 text-center lg:text-left">
            {t('footer.work-time')}
          </h3>
          <ul className="flex flex-col text-center lg:text-left">
            <li className="text-light-gray">
              {t('header.work-hours-description')}
            </li>
            <li  className="font-semibold">
              10:00 - 22:00
            </li>
          </ul>
        </div>
        <div className="col-span-1 mx-auto lg:mx-0">
          <h3 className="text-light-gray mb-5 text-center lg:text-left">
            {t('footer.we-in-social-networks')}
          </h3>
          <ul className="flex gap-5 mb-10 justify-center lg:justify-start">
            <li className="">
              <a 
                href="https://www.instagram.com/serce.oceanu.pl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Image src="/assets/images/inst-icon.png" alt="Instagram" width={36} height={36} className="cursor-pointer size-10 hover:opacity-80 transition-opacity" />
              </a>
            </li>
            <li className="flex justify-center items-center">
              <a 
                href="https://www.tiktok.com/@serce_oceanu" 
                target="_blank" 
                rel="noopener noreferrer"
                className=""
              >
                <FaTiktok size={36} className="cursor-pointer size-8 hover:opacity-80 transition-opacity text-black " />
              </a>
            </li>
          </ul>
          <a 
            href="https://t.me/Serce_Oceanu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" className="w-full bg-[#1599DA] h-[48px] rounded-2xl text-lg font-light rubik flex items-center justify-center gap-3 mb-6 hover:opacity-90 transition-opacity">
              <RiTelegram2Fill size={20} />
              {t('header.support')}
            </Button>
          </a>
        </div>
      </section>
      <section className="container border-t py-8 px-4">
        <div className="flex justify-between">
          <span className="text-light-gray text-sm">
          © All rights reserved.
          </span>
          <Link href="/privacy-policy" className="text-light-gray text-sm hover:underline">
            Privacy Policy
          </Link>
        </div>
      </section>
    </footer>
  );
}