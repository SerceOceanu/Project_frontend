"use client";
import CustomSelect from "@/components/CustomSelect";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import NoOrders from "./components/NoOrders";
import OrderItem from "./components/OrderItem";
import Paggination from "@/components/Paggination";
import { useOrders } from "@/hooks/useOrders";

export default function History() {
  const t = useTranslations();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled'>('all');
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 5;
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { data: ordersData, isLoading, error, refetch } = useOrders({
    limit: itemsPerPage,
    offset: page * itemsPerPage,
    status: statusFilter,
  });

  useEffect(() => {
    if (mounted) {
      refetch();
    }
  }, [mounted, refetch]);

  const selectOptions = useMemo(() => [
    { label: t('all'), value: 'all' },
    { label: t('pending'), value: 'pending' },
    { label: t('confirmed'), value: 'confirmed' },
    { label: t('preparing'), value: 'preparing' },
    { label: t('in_delivery'), value: 'in_delivery' },
    { label: t('delivered'), value: 'delivered' },
    { label: t('cancelled'), value: 'cancelled' }
  ], [t]);
  
  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value as 'all' | 'pending' | 'confirmed' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled');
    setPage(0);
  }, []);
  
  const orders = useMemo(() => {
    if (!ordersData?.items) return [];
    
    return ordersData.items.map(order => {
      const date = new Date(order.created);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
      
      return {
        id: order.id,
        date: formattedDate,
        total: order.totalAmount,
        status: order.status,
        products: order.items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.totalPrice,
          weight: item.product.gramsPerServing,
          maxWeight: item.product.maxGramsPerServing,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
      };
    });
  }, [ordersData]);

  const totalCount = ordersData?.metadata?.total ?? 0;
  const pageCount = Math.ceil(totalCount / itemsPerPage);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[482px]">
        <p className="text-gray">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <CustomSelect
        options={selectOptions}
        placeholder={t('select-status')}
        value={statusFilter}
        onChange={handleStatusChange}
      />
      <div className="flex flex-col gap-2.5 min-h-[482px]">
        {error ? (
          <div className="flex items-center justify-center min-h-[482px]">
            <p className="text-red-500">{t('error')}: {error.message}</p>
          </div>
        ) : orders.length === 0 ? (
          <NoOrders />
        ) : (
          <>
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
            {pageCount > 1 && (
              <Paggination 
                currentPage={page}
                setCurrentPage={setPage}
                pageCount={pageCount}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
