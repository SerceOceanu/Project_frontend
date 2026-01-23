'use client';
import Image from "next/image";
import { useTranslations } from "next-intl";
export default function AboutUs() {
  const t = useTranslations();

  const cards =[
    {
      title: t('about-us.card1.title'),
      description: t('about-us.card1.description'),
      image: '/assets/images/values-1.svg',
    },
    {
      title: t('about-us.card2.title'),
      description: t('about-us.card2.description'),
      image: '/assets/images/values-2.svg',
    },
    {
      title: t('about-us.card3.title'),
      description: t('about-us.card3.description'), 
      image: '/assets/images/values-3.svg',
    },
    {
      title: t('about-us.card4.title'),
      description: t('about-us.card4.description'),
      image: '/assets/images/values-4.svg',
    },
    {
      title: t('about-us.card5.title'),
      description: t('about-us.card5.description'),
      image: '/assets/images/values-5.svg',
    },
  ]
  return (
    <div className='pt-[140px] md:pt-[160px] px-4 md:px-10 xl:px-[100px] container pb-[130px]'>
      
      <div 
        style={{
          backgroundImage: "url('/assets/images/image-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="relative bg-white rounded-[40px] mb-[130px] "
      >
        <div className='absolute top-0 left-0 w-full h-full bg-white/80 rounded-[40px] z-10' />
        <div className='bg-transparent flex flex-col lg:flex-row justify-between relative z-10'>
          <div className="flex flex-col p-5 lg:p-[60px] justify-between flex-1">
            <Image src="/assets/images/logo.png" alt="logo" width={84} height={70} className="hidden lg:block size-[84px] h-[70px]" />
            <div>
              <h1 className="text-[32px] font-bold rubik text-orange mb-5">
                {t('header.about-us')}
              </h1>
              <p className='rubik text-gray '>
                <span className="font-bold text-black">{t('name')}</span> - {t('about-us.description')}
              </p>
            </div>

          </div>
          <div className="w-full h-[300px] lg:w-[430px] lg:h-[430px] xl:w-[490px] xl:h-[490px] flex-shrink-0 p-5 lg:p-0">
            <Image src="/assets/images/image-about-us.png" alt="about-us" width={490} height={490} className="rounded-[16px] w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-10 mb-[130px]'>
        <h2 className="header ">
          {t('about-us.our')} <Span title={t('about-us.values')} />
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {cards.map((card, index) => (
            <Card key={card.title} {...card} className={index ===4 ? 'col-span-1 md:col-span-2' : 'col-span-1'} />
          ))}

        </div>
      </div>

      <div className='flex flex-col gap-10'>
        <h2 className="header ">
          {t('about-us.our2')} <Span title={t('about-us.history')} />
        </h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
          <div className='flex flex-col gap-5 rubik text-gray col-span-1'> 
            <p>
              <span className="font-bold text-black">{t('about-us.trust.title')}</span><br/>
              {t('about-us.trust.p1')}
            </p>
            <p className='rubik text-gray'>
              {t('about-us.trust.p2')}
            </p>
            <p className='rubik text-gray'>
              {t('about-us.trust.p31')} <span className="font-bold text-black">{t('about-us.trust.span1')}</span> {t('about-us.trust.p32')} <span className="font-bold text-black">{t('about-us.trust.span2')}</span> {t('about-us.trust.p33')}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2  pt-[10px] gap-10'>
              <div className='flex flex-col col-span-1 gap-5'>
                <div className='header text-black'>42 000+</div>
                <p className='rubik text-gray'>{t('about-us.trust.statistics1')}</p>
              </div>
              <div className='flex flex-col col-span-1 gap-5'>
                <div className='header text-black'>4.02.2025</div>
                <p className='rubik text-gray'>{t('about-us.trust.statistics2')}</p>
              </div>
            </div>
          </div>

          <div className='col-span-1 grid grid-cols-1 md:grid-cols-2 gap-3 '>
            <Image src="/assets/images/history-1.png" alt="about-us" width={335} height={467} className="rounded-[16px] object-cover h-[225px] md:h-full w-full" />
            <div className='flex flex-col gap-5'>
              <Image src="/assets/images/history-2.png" alt="about-us" width={335} height={223} className="rounded-[16px] object-cover h-full w-full max-h-[223px] md:max-h-full" />
              <Image src="/assets/images/history-3.png" alt="about-us" width={335} height={223} className="rounded-[16px] object-cover h-full w-full max-h-[223px] md:max-h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const Span = ({ title }: { title: string }) => {
  return (
    <span className="text-orange">
      {title}
    </span>
  )
} 

const Card = ({ title, description, image, className }: { title: string, description: string, image: string, className: string }) => {
  return (
    <div className={`flex flex-col gap-5 p-5 rounded-[16px] bg-white items-start ${className}`}>
      <Image
        className='h-[116px] w-auto '
        src={image} alt={title} width={116} height={116} />
      <h3 className="text-[24px] font-bold rubik text-black">{title}</h3>
      <p className='rubik text-gray'>{description}</p>
    </div>
  )
}