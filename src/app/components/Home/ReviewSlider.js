// components/ReviewSlider.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function ReviewSlider() {
  const reviews = [
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    },
    {
      name: 'Rakib',
      text: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
      rating: 5
    }
  ]

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className='w-full bg-custom pb-[100px]'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className=' text-[40px] font-semibold text-center mb-3'>
          <span className='text-[#007ED6]'>Trust</span> & Results Focused
        </h1>
        <p className='mb-14 text-center'>
          Real stories from people who took back control of their personal data.
        </p>
      </motion.div>

      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 2500 }}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1
          },
          640: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 4
          }
        }}
        className='w-full'
      >
        {reviews.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className='bg-[#0D314B] border border-[#007ED6] text-white rounded-lg p-5 shadow-md'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm uppercase'>
                  {item.name[0]}
                </div>
                <span className='text-sm font-semibold'>{item.name}</span>
              </div>

              <p className='text-xs leading-relaxed mb-4'>{item.text}</p>

              <div className='flex items-center gap-1'>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Image
                    key={i}
                    src='https://upload.wikimedia.org/wikipedia/commons/4/44/Plain_Yellow_Star.png'
                    alt='star'
                    width={80}
                    height={40}
                    className='w-4 h-4'
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}