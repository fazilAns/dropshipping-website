import Navbar from '@/components/shop/Navbar';

export default function PolicyPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-12">Refund & Return <br /><span className="text-gray-400">Policy</span></h1>

                <div className="prose prose-lg dark:prose-invert space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-widest">30-Day Money Back Guarantee</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            At DROPSHIP Elite, we stand by the quality of our products. If you're not completely satisfied with your purchase, you can return it within 30 days of receiving your order for a full refund or exchange.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-widest">How to Start a Return</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            Starting a return is simple. Please contact our support team at <span className="font-black text-black dark:text-white">returns@yourstore.com</span> or use our contact form. Provide your Order ID and the reason for the return.
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-2xl font-black uppercase tracking-widest">Return Eligibility</h2>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-medium">
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded flex-shrink-0 flex items-center justify-center font-black text-xs">1</div>
                                Items must be in their original packaging.
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded flex-shrink-0 flex items-center justify-center font-black text-xs">2</div>
                                Items must be unwashed and unused.
                            </li>
                            <li className="flex gap-4">
                                <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded flex-shrink-0 flex items-center justify-center font-black text-xs">3</div>
                                Proof of purchase (Order ID) is required.
                            </li>
                        </ul>
                    </section>

                    <section className="p-10 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-700">
                        <h2 className="text-xl font-black uppercase mb-4 tracking-widest text-center">Need Help with a Return?</h2>
                        <p className="text-center text-gray-500 mb-8">Click the button below to message our returns specialists directly.</p>
                        <div className="flex justify-center">
                            <a href="/contact" className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform">
                                Contact for Returns
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
