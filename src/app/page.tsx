"use client";

import Image  from 'next/image';
import Link   from 'next/link';
import { useTranslations } from 'next-intl';
import Logo from '../components/ui/logo';
import Header from '../components/landing/header';
import Swiper from '../components/landing/swiper';

export default function Landing() {
  const t = useTranslations('Landing');
  return (
    <main className="overflow-hidden">

    {/* Header */}
    <div className="absolute top-0 left-0 w-full p-5 z-50">
      <Header />
    </div>

    {/* Title */}
    <div className="flex h-[1000px]">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-[1000px] object-cover z-0"
      >
        <source src="/videos/landing.mp4" type="video/mp4" />
      </video>

      <div className='relative flex flex-col justify-center items-center h-fit m-auto z-10'>
        <div className="scale-150">
          <Logo />
        </div>
        <p className="text-6xl font-extrabold mt-20 w-[800px] text-center 
          text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          {t('title')}
        </p>
        <p className="text-5xl  font-caveat font-extrabold mt-16 w-[800px] text-center 
          text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          {t('subtitle')}
        </p>
      <button className="bg-blue-500 font-caveat hover:bg-blue-700 text-white 
      font-bold py-4 px-6 rounded-[20px] mt-14 text-5xl ">
        {t('launch')}
      </button>
      </div>
    </div>

    {/* Features */}
    <div className="flex p-20 flex-col justify-center items-center z-10 w-screen" 
      style={{ backgroundImage: "url('/img/barcelona.jpg')", backgroundSize: 'cover', backgroundPosition: 'bottom', width: '100vw' }}>
      <Swiper />
    </div>
    </main>
  );
}