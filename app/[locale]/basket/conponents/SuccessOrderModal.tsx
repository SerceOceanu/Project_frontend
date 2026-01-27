'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { CheckCircle2 } from 'lucide-react';

interface SuccessOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SuccessOrderModal({ open, onOpenChange }: SuccessOrderModalProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    router.push('/');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-black">
              {t('order-success-title')}
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-center text-gray-600 text-sm">
            {t('order-success-description')}
          </p>
          
          <Button 
            onClick={handleClose}
            className="bg-orange hover:bg-orange/90 text-white w-full h-12 text-lg rounded-lg"
          >
            {t('order-success-button')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
