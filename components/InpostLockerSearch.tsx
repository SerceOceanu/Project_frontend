'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';

interface InpostLockerSearchProps {
  value: string;
  onChange: (value: string) => void;
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
    if (value && selectedPointRef.current) {
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
      console.log('📍 Point selected:', point);
      
      selectedPointRef.current = point;
      
      const address = `${point.address?.line1 || ''} ${point.address?.line2 || ''}`.trim();
      const displayText = `${point.name} - ${address}`;
      
      setDisplayValue(displayText);
      onChange(point.name);
      
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
      alert(t('post-box-loading-error'));
      return;
    }

    if (!scriptLoaded) {
      alert(t('post-box-loading-error') + ' ' + t('loading'));
      return;
    }

    if (typeof customElements === 'undefined' || !customElements.get('inpost-geowidget')) {
      console.error('InPost Geowidget web component not available');
      alert(t('post-box-loading-error'));
      return;
    }

    if (geowidgetRef.current) {
      geowidgetRef.current.remove();
      geowidgetRef.current = null;
    }

    if (!widgetContainerRef.current) {
      console.error('Widget container not found');
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
      console.error('Error creating InPost widget:', error);
      alert(t('post-box-loading-error'));
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
          console.log('✅ InPost script loaded');
          setScriptLoaded(true);
          setScriptError(false);
        }}
        onError={() => {
          console.error('❌ Failed to load InPost script');
          setScriptError(true);
          setScriptLoaded(false);
        }}
      />
      
      <div className="relative w-full">
        <Input
          type="text"
          value={displayValue}
          readOnly
          placeholder={placeholder || t('post-box-search')}
          className={cn('w-full cursor-pointer', className)}
          onClick={handleInputClick}
          disabled={scriptError}
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
