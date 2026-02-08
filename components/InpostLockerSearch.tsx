'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';
import { toast } from 'sonner';

interface InpostLockerSearchProps {
  value: string;
  onChange: (value: string, lockerData?: {
    id?: string;
    name: string;
    address: string;
    postalCode?: string;
    locality?: string;
  }) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    InPostGeowidget?: any;
  }
}

export default function InpostLockerSearch({ 
  value, 
  onChange, 
  placeholder, 
  className 
}: InpostLockerSearchProps) {
  const t = useTranslations('delivery-form');
  const locale = useLocale();
  const [displayValue, setDisplayValue] = useState(value);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const geowidgetRef = useRef<HTMLElement | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedPointRef = useRef<any>(null);

  useEffect(() => {
    // Если value изменился извне (автозаполнение) и это не полный адрес
    if (value && !value.includes(' - ')) {
      // Просто показываем значение как есть (название локера)
      setDisplayValue(value);
    } else if (value && selectedPointRef.current) {
      // Если есть сохраненная точка, форматируем с адресом
      const point = selectedPointRef.current;
      const address = `${point.address?.line1 || ''} ${point.address?.line2 || ''}`.trim();
      setDisplayValue(`${point.name} - ${address}`);
    } else if (!value) {
      setDisplayValue('');
    }
  }, [value]);

  useEffect(() => {
    const handlePointSelect = (event: CustomEvent) => {
      const point = event.detail;
      
      selectedPointRef.current = point;
      
      const address = `${point.address?.line1 || ''} ${point.address?.line2 || ''}`.trim();
      const displayText = `${point.name} - ${address}`;
      
      // Извлекаем ID локера (может быть в разных полях)
      const lockerId = point.locationId || point.id || point.name;
      
      // Извлекаем адресные данные
      const fullAddress = `${point.address?.line1 || ''} ${point.address?.line2 || ''}`.trim();
      const postalCode = point.address_details?.post_code || point.address?.postCode || '';
      const locality = point.address_details?.city || point.address?.city || '';
      
      setDisplayValue(displayText);
      
      // Отправляем ID локера и полные данные
      onChange(lockerId, {
        id: lockerId,
        name: point.name,
        address: fullAddress,
        postalCode,
        locality,
      });
      
      if (geowidgetRef.current) {
        geowidgetRef.current.remove();
        geowidgetRef.current = null;
      }
      setIsWidgetOpen(false);
    };

    document.addEventListener('inpost.geowidget.onpointselect', handlePointSelect as EventListener);

    return () => {
      document.removeEventListener('inpost.geowidget.onpointselect', handlePointSelect as EventListener);
    };
  }, [onChange]);

  const openWidget = () => {
    if (scriptError) {
      toast.error(t('post-box-loading-error'), {
        description: t('post-box-reload-message'),
        action: {
          label: t('post-box-reload-button'),
          onClick: () => window.location.reload(),
        },
      });
      return;
    }

    if (!scriptLoaded) {
      return;
    }

    if (typeof customElements === 'undefined' || !customElements.get('inpost-geowidget')) {
      toast.error(t('post-box-loading-error'), {
        description: t('post-box-reload-message'),
        action: {
          label: t('post-box-reload-button'),
          onClick: () => window.location.reload(),
        },
      });
      return;
    }

    if (geowidgetRef.current) {
      geowidgetRef.current.remove();
      geowidgetRef.current = null;
    }

    if (!widgetContainerRef.current) {
      return;
    }

    try {
      const geowidgetElement = document.createElement('inpost-geowidget');
      
      const inpostToken = process.env.NEXT_PUBLIC_INPOST_TOKEN || 'sandbox';
      
      geowidgetElement.setAttribute('onpoint', 'inpost.geowidget.onpointselect');
      geowidgetElement.setAttribute('token', inpostToken);
      geowidgetElement.setAttribute('language', locale === 'ua' ? 'uk' : locale);
      geowidgetElement.setAttribute('config', 'parcelCollect');
      
      geowidgetElement.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
      `;

      widgetContainerRef.current.appendChild(geowidgetElement);
      geowidgetRef.current = geowidgetElement;
      setIsWidgetOpen(true);
    } catch (error) {
      toast.error(t('post-box-loading-error'), {
        description: t('post-box-reload-message'),
        action: {
          label: t('post-box-reload-button'),
          onClick: () => window.location.reload(),
        },
      });
    }
  };

  const handleInputClick = () => {
    openWidget();
  };

  return (
    <>
      <link rel="stylesheet" href="https://geowidget.inpost.pl/inpost-geowidget.css" />
      <Script
        src="https://geowidget.inpost.pl/inpost-geowidget.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          setScriptError(false);
        }}
        onError={() => {
          setScriptError(true);
          setScriptLoaded(false);
          toast.error(t('post-box-loading-error'), {
            description: t('post-box-reload-message'),
            action: {
              label: t('post-box-reload-button'),
              onClick: () => window.location.reload(),
            },
          });
        }}
      />
      
      <div className="relative w-full">
        <Input
          type="text"
          value={displayValue}
          readOnly
          placeholder={placeholder || t('post-box-search')}
          className={cn(
            'w-full cursor-pointer',
            scriptError && 'opacity-50 cursor-not-allowed',
            !scriptLoaded && 'cursor-wait',
            className
          )}
          onClick={handleInputClick}
          disabled={scriptError}
          title={scriptError ? t('post-box-loading-error') : scriptLoaded ? t('post-box-description') : t('loading')}
        />
        
        {isWidgetOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[9998]" 
            onClick={() => {
              if (geowidgetRef.current) {
                geowidgetRef.current.remove();
                geowidgetRef.current = null;
              }
              setIsWidgetOpen(false);
            }}
          />
        )}
        
        <div 
          ref={widgetContainerRef}
          className={cn(
            "absolute top-full left-0 mt-2 w-full h-[600px] bg-white rounded-lg shadow-xl z-[9999] border border-gray-200",
            !isWidgetOpen && "hidden"
          )}
        />
      </div>
    </>
  );
}
