"use client";
import SearchInput from "@/components/SearchInput";
import CustomSelect from "@/components/CustomSelect";
import { useTranslations } from "next-intl";
import { useCatalogueStore } from "@/store/useCatalogue";


export default function Searching({category}: {category?: string}) {
  const { setFilter, setSearching, search, filter } = useCatalogueStore();
  const t = useTranslations();
  const header = category ? t(`header.${category}`) : t(`catalogue.assortment`);

  return (
    <div className='flex flex-col md:flex-row items-center justify-between gap-5 mb-10 md:gap-10'>
      <div className="flex items-center gap-5 flex-1 w-full md:w-auto">
        <h1 className="hidden lg:block header flex-shrink-0">{header}</h1>
        <SearchInput search={search} setSearch={(search) => setSearching(search)} />
      </div>
      <div className="flex items-center gap-5 w-full md:w-auto">
        <CustomSelect 
          className="w-full md:w-auto"
          options={[{ label: t('catalogue.cheap-products'), value: 'cheap' }, { label: t('catalogue.expensive-products'), value: 'expensive' }]} 
          placeholder={t('catalogue.cheap-products')} 
          value={filter} 
          onChange={(value) => setFilter(value as 'cheap' | 'expensive')} 
        />
      </div>
    </div>
  );
}