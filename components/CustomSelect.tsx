import React from 'react'
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from './ui/select'
import { cn } from '@/lib/utils'
import Image from 'next/image'
function CustomSelect({
  className,
  options,
  placeholder,
  value,
  onChange,

}: {
  className?: string
  options: { label: string, value: string }[]
  placeholder: string
  value: string
  onChange: (value: string) => void

}) {

  return (
    <Select value={value} onValueChange={onChange} >
      <SelectTrigger className={cn("w-[180px] bg-white border-0 !h-[48px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CustomSelect