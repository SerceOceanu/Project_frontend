'use client';
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations('privacy-policy');

  return (
    <div className='pt-[140px] md:pt-[160px] px-4 md:px-10 xl:px-[100px] container pb-[130px] w-full '>
      <div className="p-10 bg-gradient-to-r rubik from-[#111111] to-[#0C3462] rounded-xl text-white">
        <h1 className="text-[32px] mb-2  font-bold">{t('title')}</h1>
        <p className="">{t('subtitle')}</p>
        <p className="">{t('subtitle-2')}</p>
      </div>
      <section
        className="w-full max-w-[1100px] mx-auto py-7"
      >
        <h2 className="text-[24px] font-bold mb-2">{t('section1.title')}</h2>
        <p>{t('section1.text')}</p>
        <br/>
        <p>{t('section1.email')} <strong>info@serceoceanu.com.pl</strong> </p>
        <p>{t('section1.phone')} <strong>+48 884 826 064</strong></p>
        <p>{t('section1.nip')} <strong>9512619859.</strong></p>
        
        <p className="mb-2 mt-4"><strong>{t('section1.contact-title')}</strong></p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('section1.contact-1')}</li>
          <li>{t('section1.contact-2')}</li>
        </ul>
        
        <div className="space-y-4 my-6  border-b border-black pb-6">
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.user.title')}</strong></h3>
            <p>{t('section1.definitions.user.text')}</p>
          </div>
          
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.client.title')}</strong></h3>
            <p>{t('section1.definitions.client.text')}</p>
          </div>
          
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.shop.title')}</strong></h3>
            <p>{t('section1.definitions.shop.text')}</p>
          </div>
          
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.newsletter.title')}</strong></h3>
            <p>{t('section1.definitions.newsletter.text')}</p>
          </div>
          
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.account.title')}</strong></h3>
            <p>{t('section1.definitions.account.text')}</p>
          </div>
          
          <div>
            <h3 className="mb-2"><strong>{t('section1.definitions.rodo.title')}</strong></h3>
            <p>{t('section1.definitions.rodo.text')}</p>
          </div>
        </div>
        
      </section>
      
      <section
        className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6"
      >
        <h2 className="text-[24px] font-bold mb-4">{t('section2.title')}</h2>
        <p className="mb-4">{t('section2.intro')}</p>
        
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li className="mb-2">
            <strong>{t('section2.device-info.title')}</strong> {t('section2.device-info.text')}
          </li>
          <li className="mb-2">
            <strong>{t('section2.geolocation.title')}</strong> {t('section2.geolocation.text')}
          </li>
          <li className="mb-2">
            <strong>{t('section2.personal-data.title')}</strong> {t('section2.personal-data.text')}
          </li>
        </ul>
        
        <p className="mb-4">{t('section2.note-1')}</p>
        
        <p className="mb-4">{t('section2.note-2')}</p>
        
        <p>{t('section2.note-3')}</p>
      </section>
      
      <section
        className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6"
      >
        <h2 className="text-[24px] font-bold mb-4">{t('section3.title')}</h2>
        <p>{t('section3.text')}</p>
      </section>
      
      <section
        className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6"
      >
        <h2 className="text-[24px] font-bold mb-4">{t('section4.title')}</h2>
        <p>{t('section4.text')}</p>
      </section>
      
      <section
        className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6"
      >
        <h2 className="text-[24px] font-bold mb-4">{t('section5.title')}</h2>
        <p>{t('section5.text')}</p>
      </section>
      
      <section className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6">
        <h2 className="text-[24px] font-bold mb-4">{t('section6.title')}</h2>
        <p className="mb-4">{t('section6.intro')}</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('section6.rights.access')}</li>
          <li>{t('section6.rights.copy')}</li>
          <li>{t('section6.rights.rectification')}</li>
          <li>{t('section6.rights.deletion')}</li>
          <li>{t('section6.rights.limitation')}</li>
          <li>{t('section6.rights.portability')}</li>
          <li>{t('section6.rights.objection')}</li>
          <li>{t('section6.rights.withdrawal')}</li>
        </ul>
        <p>{t('section6.note')}</p>
      </section>
      
      <section className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6" >
        <h2 className="text-[24px] font-bold mb-4">{t('section7.title')}</h2>
        <p className="mb-4">{t('section7.intro')}</p>
        <p className="mb-2">{t('section7.contact-title')}</p>
        <ul className="list-disc list-inside space-y-2">
          <li>{t('section7.contact-1')}</li>
          <li>{t('section7.contact-2')}</li>
          <li>{t('section7.contact-3')}</li>
        </ul>
      </section>
      
      <section className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6" >
        <h2 className="text-[24px] font-bold mb-4">{t('section8.title')}</h2>
        <p className="mb-4">{t('section8.intro')}</p>
        <p className="mb-2">{t('section8.contact-title')}</p>
        <ul className="list-disc list-inside space-y-2">
          <li>{t('section8.contact-1')}</li>
          <li>{t('section8.contact-2')}</li>
        </ul>
      </section>
      
      <section className="w-full max-w-[1100px] mx-auto my-6  border-b border-black pb-6" >
        <h2 className="text-[24px] font-bold mb-4">{t('section9.title')}</h2>
        <p>{t('section9.text')}</p>
      </section>
      
      <section  className="w-full max-w-[1100px] mx-auto my-6">
        <h2 className="text-[24px] font-bold mb-4">{t('section10.title')}</h2>
        <p className="mb-4">{t('section10.intro')}</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('section10.methods.forms')}</li>
          <li>{t('section10.methods.logs')}</li>
        </ul>
        
        <p className="mb-4">{t('section10.storage')}</p>
        
        <p className="mb-4">{t('section10.consent')}</p>
        
        <p className="mb-4">{t('section10.no-consent')}</p>
        
        <p className="mb-4">{t('section10.types-title')}</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>{t('section10.types.session-name')}</strong> - {t('section10.types.session-desc')}</li>
          <li><strong>{t('section10.types.persistent-name')}</strong> - {t('section10.types.persistent-desc')}</li>
        </ul>
        
        <p>{t('section10.legal-basis')}</p>
      </section>
    </div>
  );
}
