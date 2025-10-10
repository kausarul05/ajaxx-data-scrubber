import Navbar from './shaired/Navbar';
import Bannar from "./components/Home/Bannar"
import HowWork from "./components/Home/HowWork"
import Pricing from "./components/Home/Pricing"
import FAQSection from './components/Home/FAQ';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Bannar />
      <HowWork/>
      <Pricing/>
      <FAQSection/>
    </div>
  );
}
