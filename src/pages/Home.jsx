import Seo from '../components/common/Seo.jsx';
import Hero from '../components/home/Hero.jsx';
import CategoryDoors from '../components/home/CategoryDoors.jsx';
import ProductRail from '../components/product/ProductRail.jsx';
import CollectionBanner from '../components/home/CollectionBanner.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import InstagramStrip from '../components/home/InstagramStrip.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import { getNewArrivals, getBestSellers } from '../utils/productService.js';

export default function Home() {
  const newArrivals = getNewArrivals(8);
  const bestSellers = getBestSellers(8);

  return (
    <>
      <Seo
        title="Dress Your Everyday"
        description="UrbanVibe Clothing — premium everyday fashion for women, men and kids. Shop new arrivals, best sellers and curated collections."
      />
      <Hero />
      <CategoryDoors />

      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow="Just In" title="New Arrivals" />
        <ProductRail products={newArrivals} />
      </section>

      <CollectionBanner />

      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-4">
        <SectionHeading eyebrow="Customer Favorites" title="Best Sellers" />
        <ProductRail products={bestSellers} />
      </section>

      <Testimonials />
      <InstagramStrip />
    </>
  );
}
