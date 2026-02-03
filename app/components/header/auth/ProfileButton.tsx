'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsPerson, BsFillPersonFill } from "react-icons/bs";
import { useStatesStore } from "@/store/useStatesStore";
import { useUser } from "@/hooks/useAuth";
import { usePathname } from '@/lib/navigation';
import { useRouter } from '@/lib/navigation';
import { useBasketStore } from "@/store/useBasketStore";

export default function ProfileButton() {
  const { data: user } = useUser();
  const { isLoginOpen, setIsLoginOpen } = useStatesStore();
  const { setValue } = useBasketStore();
  const pathname = usePathname();
  const router = useRouter();

  const isOnProfilePage = pathname?.startsWith('/profile') || pathname?.match(/^\/(ua|pl)\/profile/);

  const handleClick = () => {
    setValue('isBasketModalOpen', false);
    
    if (!user) {
      setIsLoginOpen(!isLoginOpen);
    } else {
      router.push('/profile/history');
    }
  };

  const showFilledIcon = (isOnProfilePage && user) || (isLoginOpen && !user);

  return (
    <Button 
      className={cn(
        isLoginOpen && !user && ' text-orange border-orange',
        isOnProfilePage && user && ' text-orange border-orange',
        "flex items-center gap-2 shadow-none rounded-2xl ", 
      )} 
      onClick={handleClick}
      variant="outline" 
      size="icon-lg"
    >
      {showFilledIcon ? <BsFillPersonFill size={20} /> : <BsPerson size={20} />}
    </Button>
  )
}