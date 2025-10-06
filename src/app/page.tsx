import Navbar from './shaired/Navbar';
import Bannar from "./components/Home/Bannar"
import HowWork from "./components/Home/HowWork"
import Pricing from "./components/Home/Pricing"

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Bannar />
      <HowWork/>
      <Pricing/>
    </div>
  );
}
