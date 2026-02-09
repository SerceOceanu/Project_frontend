'use client';
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Image from "next/image";
import { usePopups } from "@/hooks/usePopups";
import { usePathname } from "@/lib/navigation";

export default function Warning() {
  const t = useTranslations('warning');
  const pathname = usePathname();
  const { data: popups, isLoading, isError } = usePopups();

  // Check if we're on admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // Find active popup
  const activePopup = popups?.find(popup => popup.active);

  // Don't show popup on admin routes, while loading, on error, or if no active popup
  if (isAdminRoute || isLoading || isError || !activePopup) {
    return null;
  }

  useEffect(() => {
    // Add backdrop blur to overlay
    const addBlurToOverlay = () => {
      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      if (overlay) {
        overlay.classList.add('backdrop-blur-md');
        overlay.classList.add('bg-black/60');
      }
    };
    
    // Try immediately
    addBlurToOverlay();
    
    // Also try after a short delay in case overlay is rendered later
    const timeout = setTimeout(addBlurToOverlay, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (

        <div className="fixed inset-0 backdrop-blur-xs  rounded-2xl z-50 flex items-center justify-center">
          <div className="relative mx-2 overflow-hidden flex flex-col w-full max-w-xl bg-[url('/assets/images/waves.png')] bg-cover bg-center bg-no-repeat bg-white p-10 rounded-xl">
            <h2 className="text-2xl font-bold mb-5 text-black">
              {activePopup.title}
            </h2>
            <p className="text-base text-black mb-6 leading-relaxed w-4/5 text-start self-start">
              {activePopup.description}
            </p>
            
            {/* Warning Image */}
            <div className="absolute -bottom-2 -right-5 w-full flex justify-end mt-4">
              <Image
                src="/assets/images/warning.webp"
                alt="Warning illustration"
                width={150}
                height={150}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        

  );
}
