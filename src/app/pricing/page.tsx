import React from 'react'
import Pricing from '../components/Home/Pricing'
import ReviewSlider from '../components/Home/ReviewSlider'
import FAQSection from '../components/Home/FAQ'

export default function page() {
  return (
    <div className='pt-[100px] bg-[#0A2131]'>
        <Pricing/>
        <FAQSection/>
        <ReviewSlider/>
    </div>
  )
}
