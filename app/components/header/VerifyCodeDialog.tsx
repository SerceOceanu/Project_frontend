'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VerifyCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  phoneNumber: string;
}

export function VerifyCodeDialog({
  open,
  onClose,
  onVerify,
  phoneNumber,
}: VerifyCodeDialogProps) {
  const t = useTranslations();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (code.length !== 6) {
      setError(t('validation.code-invalid'));
      setLoading(false);
      return;
    }

    try {
      await onVerify(code);
      setCode('');
      onClose();
    } catch (err: any) {
      setError(err.message || t('validation.code-invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('verify-code-title')}</DialogTitle>
          <DialogDescription>
            {t('verify-code-description', { phone: phoneNumber })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-orange text-white"
          >
            {loading ? t('verifying') : t('verify-button')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

