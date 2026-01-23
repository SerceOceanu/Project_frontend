"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTranslations } from "next-intl";

// Координаты Варшавы
const defaultCenter = {
  lat: 52.2297, 
  lng: 21.0122  
};

export default function MapWindow({width = "100%", height = "580px", center = defaultCenter }: {width?: string, height?: string, center?: {lat: number, lng: number}}) {
  const t = useTranslations();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  return (
    <div style={{width, height, position: "relative"}} > 
      <div className='hidden md:block absolute py-5 px-6 top-[30px] left-[30px] z-100 bg-white rounded-[16px] shadow-lg'>
        <h3 className="text-[18px] font-bold rubik text-black" >
          {t('delivery.work-time')}
        </h3>
        <p className="rubik text-gray text-sm">
          {t('week-days')} 9:00 - 18:00
        </p>  
        <p className="rubik text-gray text-sm">
          {t('weekend-days')} 9:00 - 15:00
        </p>
      </div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{
            width: width,
            height: height,
            borderRadius: "30px"
          }}
          center={center}
          zoom={11}
          options={{
            mapId: "map",
            disableDefaultUI: true,
            zoomControl: false, 
            streetViewControl: false, 
            mapTypeControl: false, 
            fullscreenControl: true,
            gestureHandling: "cooperative", 
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <div style={{width, height}} className="text-white text-center flex items-center justify-center">Loading map...</div>
      )}

      <div className=' md:hidden py-5 px-6  z-100 bg-white rounded-[16px] shadow-lg mt-4'>
        <h3 className="text-[18px] font-bold rubik text-black" >
          {t('delivery.work-time')}
        </h3>
        <div className="flex items-center justify-between">
          <p className="rubik text-gray text-sm">
            {t('week-days')} 9:00 - 18:00
          </p>  
          <p className="rubik text-gray text-sm">
            {t('weekend-days')} 9:00 - 15:00
          </p>

        </div>
      </div>
    </div>
  );
}