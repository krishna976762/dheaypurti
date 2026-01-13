import Header from '../components/Header';
import BatchInfo from '../components/BatchInfo';
import LoginOptions from '../components/LoginOptions';
import About from '../components/About';
import Achievements from '../components/Achievements';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BatchInfo />
      {/* <LoginOptions /> */}
      <About />
      <Achievements />
      <Footer />
    </div>
  );
}
