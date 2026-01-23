'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsPerson } from "react-icons/bs";
import { useStatesStore } from "@/store/useStatesStore";
import { useUser } from "@/hooks/useAuth";
import { usePathname } from '@/lib/navigation';
import { useRouter } from '@/lib/navigation';

export default function ProfileButton() {
  const { data: user } = useUser();
  const { isLoginOpen, setIsLoginOpen } = useStatesStore();
  const pathname = usePathname();
  const router = useRouter();

  // Проверяем находимся ли мы точно на странице /profile (не на вложенных роутах)
  const isOnProfilePage = pathname?.match(/^\/(ua|pl)?\/profile$/) || pathname === '/profile';

  const handleClick = () => {
    if (!user) {
      // Если нет пользователя - открываем форму логина
      setIsLoginOpen(!isLoginOpen);
    } else {
      // Если пользователь есть - редирект на профиль
      router.push('/profile');
    }
  };

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
      <BsPerson size={20} />
    </Button>
  )
}