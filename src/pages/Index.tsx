import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import DesignerCategories from '@/components/DesignerCategories';
import AIStyleAssistant from '@/components/AIStyleAssistant';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <DesignerCategories />
        <AIStyleAssistant />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
