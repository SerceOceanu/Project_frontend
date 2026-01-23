import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function NoAddresses() {
  const t = useTranslations();

  return (
    <div 
      style={{
        backgroundImage: "url('/assets/images/image-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative bg-white rounded-[40px] mb-[130px] "
    >
      <div className='absolute top-0 left-0 w-full h-full bg-white/80 rounded-[40px]' />
      <div className='flex flex-col lg:flex-row bg-transparent relative z-10 p-10 items-center gap-5  md:gap-[50px]'>
        <Image src="/assets/images/no-addresses.svg" alt="image" 
          width={182} 
          height={218} 
          className="rounded-[16px] size-[60px] md:size-auto object-cover" 
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-[24px] text-base/6 font-semibold rubik text-center lg:text-left ">
            {t('profile.no-addresses')}
          </h2>
          <p className=" text-gray text-center lg:text-left">
            {t('profile.no-addresses-text')}
          </p>
        </div>
      </div>
    </div>
  );
} 