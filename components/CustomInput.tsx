import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { UseFormRegister } from "react-hook-form";

export default function CustomInput({ 
  label, 
  placeholder, 
  className, 
  error,
  register,
  name,
  type = "text",
}: { 
  label: string, 
  placeholder: string, 
  className?: string, 
  error?: string, 
  register: UseFormRegister<any>,
  name: string,
  type?: string,
}) {
  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-sm text-gray">
        {label.split('*').map((part, index, array) => (
          index === array.length - 1 ? part : (
            <span key={index}>
              {part}
              <span className="text-red-500">*</span>
            </span>
          )
        ))}
      </label>
      <Input 
        id={name}
        type={type}
        placeholder={placeholder} 
        {...register(name)} 
        className={cn(error && "!border-red text-red focus:border-red !ring-red/20 !focus:ring-red ")} 
      />
      {error && <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{error}</p>}
    </div>
  )
}