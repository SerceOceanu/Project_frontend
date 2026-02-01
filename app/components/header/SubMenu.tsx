import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
export default function SubMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  // Show submenu only on home page and catalogue pages (including product pages)
  const isHomePage = pathname === '/' || pathname?.match(/^\/(ua|pl)?$/);
  const isCataloguePage = pathname === '/catalogue';
  const shouldShow = isHomePage || isCataloguePage;
  
  if (!shouldShow) return null;
  const items = [
    {
      image: '/assets/images/icon1.png',
      title: t('header.chilled'),
      value: 'chilled',
      href: '/catalogue?category=chilled'
    },
    {
      image: '/assets/images/icon2.png',
      title: t('header.frozen'),
      value: 'frozen',
      href: '/catalogue?category=frozen'
    },
    {
      image: '/assets/images/icon3.png',
      title: t('header.ready'),
      value: 'ready',
      href: '/catalogue?category=ready'
    },
    {
      image: '/assets/images/icon4.png',
      title: t('header.marinated'),
      value: 'marinated',
      href: '/catalogue?category=marinated'
    },
    {
      image: '/assets/images/icon5.png',
      title: t('header.snacks'),
      value: 'snacks',
      href: '/catalogue?category=snacks'
    },
  ]

  return (
  <>
    <div className="absolute top-17 left-1/2 -translate-x-1/2 hidden items-stretch rounded-2xl md:flex bg-white px-5 py-2.5 shadow">
        {items.map((item) => (
            <Link href={item.href} key={item.value} className="flex-1">
              <div className={cn(
                "flex items-center justify-center rounded-lg gap-2 px-5 py-2.5 cursor-pointer text-gray h-full w-full",
                category === item.value && "bg-dark-blue/[0.06]"
              )}>
                <Image src={item.image} alt={item.title} width={24} height={24} />
                <span className="rubik text-sm font-light leading-none text-gray">{item.title}</span>
              </div>
      </Link>))}
            </div>

    <div className="flex items-center md:hidden overflow-x-auto gap-1 w-full pb-1 px-5 scrollbar-hide items-stretch">
      {items.map((item) => (
        <Link href={item.href} key={  item.value} className={cn(
          "flex items-center rounded-lg bg-white gap-2 px-5 py-2.5 cursor-pointer flex-shrink-0 max-w-[160px] text-gray",
          category === item.value && "bg-dark-blue/[0.06]"
        )}>
          <Image src={item.image} alt={item.title} width={24} height={24} />
          <span className="rubik text-sm font-light leading-none text-gray ">{item.title}</span>
        </Link>
        ))} 
    </div>
  </>
  );
}