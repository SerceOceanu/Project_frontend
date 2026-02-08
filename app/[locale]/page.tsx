import SliderSection from "../components/home-page/SliderSection";
import CategorySection from "../components/home-page/CategorySection";
import { getTranslations } from "next-intl/server";
import { getBanners } from "@/services/getBanners";

export default async function Home() {
  const t = await getTranslations();
  const banners = await getBanners();
  console.log(banners, 'banners');
  return (
    <>
      <div className="px-4 pt-[140px] md:pt-[160px] lg:pt-0 lg:px-0 mb-10 lg:mb-20">
        <SliderSection banners={banners} />
      </div>
      <div className='flex flex-col  pb-[120px] gap-[60px]'>
        <CategorySection category="chilled" title={t('header.chilled')} href="/catalogue?category=chilled" />
        <CategorySection category="frozen" title={t('header.frozen')} href="/catalogue?category=frozen" />
        <CategorySection category="ready" title={t('header.ready')} href="/catalogue?category=ready" />
        <CategorySection category="marinated" title={t('header.marinated')} href="/catalogue?category=marinated" />
        <CategorySection category="snacks" title={t('header.snacks')} href="/catalogue?category=snacks" />
      </div>
    </> 
  );
}

