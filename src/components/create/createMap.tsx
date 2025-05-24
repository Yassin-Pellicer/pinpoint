"use client";
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const DynamicMapContainer = dynamic(
  () => import('./mapContainerComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function MapComponent() {
  return <DynamicMapContainer />;
}