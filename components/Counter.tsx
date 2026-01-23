import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button";
  
export default function Counter({ count, setCount, handleRemove }: { count: number, setCount: (count: number) => void, handleRemove: () => void }) {
  return (
    <div className='flex gap-1 items-center inter text-[28px] font-bold h-[48px]'>
      <Button size="icon" className='text-2xl flex items-center justify-center' onClick={handleRemove}>-</Button>
      <span className="w-8 text-center">{count}</span>
      <Button size="icon" className=' flex items-center justify-center' onClick={() => setCount(count + 1)}>
      <FaPlus className="text-white  size-5" />
      </Button>
    </div>
  )
} 