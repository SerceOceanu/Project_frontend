"use client";
import { useState } from "react";
import NoAddresses from "./components/NoAddresses";
import { useTranslations } from "next-intl";
import { PiMapPinThin } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import { useDeliveryAddresses, useDeleteDeliveryAddress } from "@/hooks/useDeliveryAddress";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function Address() {
  const t = useTranslations();
  const { data: addressesData, isLoading } = useDeliveryAddresses({ limit: 10, offset: 0 });
  const { mutate: deleteAddress } = useDeleteDeliveryAddress();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (addressId: string) => {
    console.log('🔴 handleDelete called with addressId:', addressId);
    setDeletingId(addressId);
    deleteAddress(addressId, {
      onSuccess: (data) => {
        console.log('✅ handleDelete onSuccess:', { addressId, data });
        toast.success(t('profile.address-deleted') || 'Адресу видалено успішно');
        setOpenPopoverId(null);
        setDeletingId(null);
      },
      onError: (error: any) => {
        console.error('❌ handleDelete onError:', {
          addressId,
          error,
          message: error?.message,
          status: error?.status,
          stack: error?.stack,
        });
        toast.error(error.message || t('error'));
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray">{t('loading')}</p>
      </div>
    );
  }

  const addresses = addressesData?.items || [];

  if (addresses.length === 0) {
    return <NoAddresses />;
  }

  const formatAddress = (address: typeof addresses[0]) => {
    const parts = [
      address.address,
      address.postalCode,
      address.locality,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="relative grid gap-5">
      <p className="absolute md:-top-10 -top-2 left-0 roboto text-gray text-xs lg:text-base">
        {t('profile.address-warning')}
      </p>
      <div className='gap-2.5 grid mt-8 md:mt-0'>
        {addresses.map((address) => {
          const isDeleting = deletingId === address.id;
          const isOpen = openPopoverId === address.id;
          
          return (
            <div key={address.id} className='flex flex-col lg:flex-row p-5 bg-white rounded-2xl'>
              <div className='flex gap-2 lg:gap-5'>
                <PiMapPinThin size={24} className='text-orange' />
                <p>{formatAddress(address)}</p>
              </div>
              <Popover open={isOpen} onOpenChange={(open) => !isDeleting && setOpenPopoverId(open ? address.id : null)}>
                <PopoverTrigger asChild>
                  <div 
                    className={`text-gray flex items-center gap-2.5 ml-auto cursor-pointer hover:text-orange mt-2 lg:mt-0 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <BsTrash3 size={18}/> {t('delete')}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="end">
                  <p className="text-sm mb-4">{t('profile.delete-address-confirm')}</p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? t('deleting') : t('delete')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenPopoverId(null)}
                      disabled={isDeleting}
                    >
                      {t('no')}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        })}
      </div>
    </div>
  );
}