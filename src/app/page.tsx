import Hero from '@/components/shop/hero/Hero';
import FeaturedCollection from '@/components/shop/FeaturedCollection';
import TrustBadges from '@/components/shop/TrustBadges';
import Navbar from '@/components/shop/Navbar';
import Link from 'next/link';

export default function ShopHome() {
  return (
    <main className="bg-white dark:bg-black min-h-screen">
      <Navbar />
      <Hero />
      <TrustBadges />
      <FeaturedCollection />
      <footer className="py-24 border-t dark:border-gray-900 bg-white dark:bg-black text-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-black">D</span>
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic">Dropship Elite</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating the dropshipping experience with premium quality, curated products and lightning-fast global delivery.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest">Support</h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm font-bold">
              <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact Us</Link>
              <Link href="/track" className="hover:text-black dark:hover:text-white transition-colors">Track Order</Link>
              <Link href="/policies/refund" className="hover:text-black dark:hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest">Connect</h3>
            <div className="flex flex-col gap-3 text-gray-400 text-sm font-bold">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t dark:border-gray-900 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2026 Dropship Elite. All Rights Reserved.</p>
          <div className="flex gap-6 grayscale opacity-30">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" />
          </div>
        </div>
      </footer>
    </main>
  );
}
