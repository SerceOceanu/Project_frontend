import NoAddresses from "./components/NoAddresses";
import { useTranslations } from "next-intl";
import { PiMapPinThin } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";

export default function Address() {
  const t = useTranslations();


  if(addresses.length === 0) return <NoAddresses /> 



  return (
    <div className="relative grid gap-5">
      <p className=" absolute md:-top-10 -top-2 left-0  roboto text-gray text-xs lg:text-base">
        {t('profile.address-warning')}
      </p>
      <div className='gap-2.5 grid mt-8 md:mt-0'>
        {addresses.map((address) => (
          <div key={address} className='flex flex-col lg:flex-row  p-5 bg-white rounded-2xl'>
            <div className='flex gap-2 lg:gap-5'>
              <PiMapPinThin size={24} className='text-orange' />
              <p>{address}</p>
            </div>
            <div className='text-gray flex items-center gap-2.5 ml-auto cursor-pointer hover:text-orange mt-2 lg:mt-0'>
              <BsTrash3 size={18}/> {t('delete')}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
} 

const addresses = [
  'ul. Nowy Świat 15/17, 00-029 Warszawa',
  'al. Jerozolimskie 123, 02-017 Warszawa',
  'ul. Marszałkowska 84/92, 00-514 Warszawa',
  'ul. Chmielna 73, 00-801 Warszawa',
  'ul. Złota 59, 00-120 Warszawa'
];