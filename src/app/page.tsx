
import Bannar from "./components/Home/Bannar"
import HowWork from "./components/Home/HowWork"
import Pricing from "./components/Home/Pricing"
import FAQSection from './components/Home/FAQ';
import ReviewSlider from './components/Home/ReviewSlider';

export default function Home() {
  return (
    <div>
      
      <Bannar />
      <HowWork/>
      <Pricing/>
      <FAQSection/>
      <ReviewSlider/>
    </div>
  );
}
