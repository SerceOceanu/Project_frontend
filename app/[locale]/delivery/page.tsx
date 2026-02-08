"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import MapComponent from "../../components/MapComponent";
import { useState, useEffect } from "react";

export default function Delivery() {
  const t = useTranslations();
  const [mapHeight, setMapHeight] = useState("580px");

  useEffect(() => {
    const updateMapHeight = () => {
      if (window.innerWidth < 768) {
        setMapHeight("337px");
      } else if (window.innerWidth < 1024) {
        setMapHeight("400px");
      } else {
        setMapHeight("580px");
      }
    };

    updateMapHeight();
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, []);

  const cards = [
    {
      title: t('delivery.card1.title'),
      description: t('delivery.card1.description'),
      image: '/assets/images/delivery-1.svg',
    },
    {
      title: t('delivery.card2.title'),
      description: t('delivery.card2.description'),
      image: '/assets/images/delivery-2.svg',
    },
    {
      title: t('delivery.card3.title'),
      description: t('delivery.card3.description'),
      image: '/assets/images/delivery-3.svg',
    },  
    {
      title: t('delivery.card4.title'),
      description: t('delivery.card4.description'),
      image: '/assets/images/delivery-4.svg',
    },

  ]
  return (
    <div className=' pt-[140px] md:pt-[160px] px-4 md:px-10 xl:px-[100px] container pb-[130px]'>
      


      <div className='flex flex-col gap-6 lg:gap-10 mb-10 md:mb-20 lg:mb-[130px]'>
        <h1 className="header text-orange ">
          {t('header.delivery')}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {cards.map((card, index) => (
            <Card key={card.title} {...card} className={index ===4 ? 'col-span-2' : 'col-span-1'} />
          ))}

        </div>
      </div>

      <div className='flex flex-col gap-10'>
        <h2 className="header ">  
          {t('delivery.map-title')}
        </h2>
        <MapComponent height={mapHeight} />
      </div>


    </div>
  );
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