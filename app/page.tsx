import HeroSection from '@/components/home/HeroSection';
import CountersSection from '@/components/home/CountersSection';
import ServicosSection from '@/components/home/ServicosSection';
import ProcessoSection from '@/components/home/ProcessoSection';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import DepoimentosSection from '@/components/home/DepoimentosSection';
import DiferenciaisSection from '@/components/home/DiferenciaisSection';
import CTASection from '@/components/home/CTASection';
import ContatoSection from '@/components/contato/ContatoSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CountersSection />
      <ServicosSection />
      <ProcessoSection />
      <PortfolioPreview />
      <DepoimentosSection />
      <DiferenciaisSection />
      <CTASection />
      <ContatoSection />
    </>
  );
}
