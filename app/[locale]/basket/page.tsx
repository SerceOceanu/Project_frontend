'use client';
import OrdersCard from "./conponents/OrdersCard";
import Form from "./conponents/Form";
import SuccessOrderModal from "./conponents/SuccessOrderModal";
import { useState } from "react";
import OrdersCardMobile from "./conponents/OrdersCardMobile";
import TotalMobile from "./conponents/TotalMobile";
import { useBasketStore } from "@/store/useBasketStore";

export default function Basket() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { basket } = useBasketStore();
  
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pt-25 md:pt-30 px-4 md:px-10 xl:px-[100px] container pb-[130px]'>
        <OrdersCardMobile/>
        {basket.length > 0 && <Form />}
        <TotalMobile setIsSuccessModalOpen={setIsSuccessModalOpen} />
        <OrdersCard 
          type="page" 
          setIsSuccessModalOpen={setIsSuccessModalOpen}
        />
      </div>
      <SuccessOrderModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
    </>
  );
}
