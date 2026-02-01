import ProfileMenu from "./components/ProfileMenu";
import { requireAuth } from "@/lib/auth-server";
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div className="pt-[140px] md:pt-[190px] px-4 md:px-10 xl:px-[100px] container pb-[130px]">
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-x-0 md:gap-x-6'>
        <div className='col-span-1'> 
          <ProfileMenu />
        </div>
        <div className='lg:col-span-3 col-span-1'>
          {children}
        </div>
      </div>
    </div>
  );
}