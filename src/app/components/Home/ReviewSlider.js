// components/ReviewSlider.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { apiRequest } from '@/app/lib/api';


export default function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  // const assessToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const assessToken = localStorage.getItem('authToken');
        const data = await apiRequest("GET", "/service/review/?page=1&page_size=5");
        setReviews(data.results);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        // Fallback to empty array if API fails
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Convert star rating string to number for display
  const getRatingNumber = (ratingString) => {
    const starCount = (ratingString.match(/⭐/g) || []).length;
    return starCount || 5; // Default to 5 if no stars found
  };

  // Get reviewer name with fallback
  const getReviewerName = (review) => {
    return review.reviewer_name || `User${review.reviewer}`;
  };

  if (loading) {
    return (
      <div ref={ref} className='w-full bg-custom pb-[100px] text-white'>
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
        <div className="flex justify-center items-center">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className='w-full bg-custom pb-[100px] text-white'>
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
        loop={reviews.length > 0}
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
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <SwiperSlide key={item.id}>
              <div className='bg-[#0D314B] border border-[#007ED6] text-white rounded-lg p-5 shadow-md'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm uppercase'>
                    {getReviewerName(item)[0]}
                  </div>
                  <span className='text-sm font-semibold'>{getReviewerName(item)}</span>
                </div>

                <p className='text-xs leading-relaxed mb-4'>{item.body}</p>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: getRatingNumber(item.rating) }).map((_, i) => (
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
          ))
        ) : (
          // Fallback display if no reviews
          <SwiperSlide>
            <div className='bg-[#0D314B] border border-[#007ED6] text-white rounded-lg p-5 shadow-md'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm uppercase'>
                  U
                </div>
                <span className='text-sm font-semibold'>User</span>
              </div>
              <p className='text-xs leading-relaxed mb-4'>No reviews available at the moment.</p>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
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
        )}
      </Swiper>
    </div>
  )
}