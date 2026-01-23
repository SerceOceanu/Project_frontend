'use client';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import Image from 'next/image'

export default function RadioGroupComponent({ 
  items, 
  value, 
  onChange, 
  title
}: { items: { value: string | number, label: string, type?: 'Visa' | 'PayUGo' | 'Blik' }[], value: string | number, onChange: (value: string | number) => void, title?: string }) {
  const groupId = useId();
  
  const images = {
    'PayUGo': '/assets/images/payment-pay.svg',
    'Blik': '/assets/images/payment-blik.svg',
    'Visa': '/assets/images/payment-visa.svg'
  }

  return (
    <RadioGroup value={value.toString()} onValueChange={onChange} className="flex flex-col gap-4">
      {title && <h3 className="font-bold w-full rubik text-[24px]"> {title} </h3>}
      {items.map((item) => {
        const uniqueId = `${groupId}-${item.value}`;
        return (
          <div key={uniqueId} className="flex items-center gap-2">
            <RadioGroupItem value={item.value.toString()} id={uniqueId} />
            <Label htmlFor={uniqueId} className="text-sm inter font-[400] cursor-pointer"> 
              {item.label} 
              {item.type && <Image src={images[item.type]} alt={item.label} width={100} height={24} className="h-[24px] w-auto" />} 
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  )
}