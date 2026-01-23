"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";

export default function Navigation() {
  const t = useTranslations();
  const pathname = usePathname();
  
  const navigation = [
    {
      label: t('header.home'),
      href: '/'
    },
    {
      label: t('header.delivery'),
      href: '/delivery'
    },
    {
      label: t('header.about-us'),
      href: '/about-us'
    },
    {
      label: t('header.catalogue'),
      href: '/catalogue'
    },
  ];

  const filters = [
    {
      image: '/assets/images/icon1.png',
      title: t('header.chilled'),
      value: 'cold'
    },
    {
      image: '/assets/images/icon2.png',
      title: t('header.frozen'),
      value: 'frozen'
    },
    {
      image: '/assets/images/icon3.png',
      title: t('header.ready'),
      value: 'ready'
    },
    {
      image: '/assets/images/icon4.png',
      title: t('header.marinated'),
      value: 'marinated'
    },
    {
      image: '/assets/images/icon5.png',
      title: t('header.snacks'),
      value: 'snacks'
    },
  ]

  return (
    <div className="hidden lg:flex items-center gap-2">
      <nav className="flex items-center ">
        {
          navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`relative px-2 xl:px-2.5 py-1 rubik text-sm ${isActive && 'text-blue font-medium' }`}
              >
                {item.label}
              </Link>
            );
          })
        }
      </nav>
      <div className="flex items-center gap-2 bg-orange/10 px-2.5 py-1 rounded">
        <span className="inter text-sm font-light text-orange">Phone</span>
        <a href="tel:+48884826064" className="inter text-sm font-medium">+48 884 826 064</a>
      </div>
    </div>
  );
}