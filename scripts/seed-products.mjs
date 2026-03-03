/**
 * Product Seed Script
 * Run with: node scripts/seed-products.mjs
 * 
 * Seeds the database with realistic products across multiple categories.
 * Uses high-quality product images from Unsplash.
 */

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/dropshipping-db';

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        images: { type: [String], default: [] },
        category: { type: String, required: true },
        stock: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
    // ═══════════════════════════════════════════
    // ELECTRONICS
    // ═══════════════════════════════════════════
    {
        name: 'Wireless Bluetooth Earbuds Pro',
        description: 'Premium true wireless earbuds with active noise cancellation, 30-hour battery life with charging case, IPX5 water resistance, and crystal-clear audio. Features touch controls, voice assistant support, and seamless pairing with all devices. Perfect for workouts, commuting, and everyday listening.',
        price: 2499,
        images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80',
            'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
        ],
        category: 'Electronics',
        stock: 150,
        isFeatured: true,
    },
    {
        name: 'Smart Watch Ultra Fitness Tracker',
        description: 'Advanced smartwatch with 1.9" AMOLED display, heart rate monitor, SpO2 tracking, GPS, and 100+ sport modes. Water-resistant up to 50 meters. Supports call notifications, music control, and 7-day battery life. Compatible with iOS and Android.',
        price: 3999,
        images: [
            'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        ],
        category: 'Electronics',
        stock: 80,
        isFeatured: true,
    },
    {
        name: 'Portable Bluetooth Speaker 20W',
        description: 'Powerful 20W portable speaker with deep bass, 360° surround sound, and 12-hour playtime. IPX7 waterproof rating makes it perfect for pool parties and outdoor adventures. Features built-in microphone for hands-free calling and TWS pairing.',
        price: 1799,
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
            'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80',
        ],
        category: 'Electronics',
        stock: 200,
        isFeatured: false,
    },
    {
        name: 'USB-C Fast Charging Power Bank 20000mAh',
        description: 'Ultra-slim 20000mAh power bank with 65W PD fast charging. Charges laptops, tablets, and phones simultaneously with 3 output ports. LED display shows remaining battery. Airline-safe and pocket-friendly design.',
        price: 1499,
        images: [
            'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
        ],
        category: 'Electronics',
        stock: 300,
        isFeatured: false,
    },

    // ═══════════════════════════════════════════
    // FASHION
    // ═══════════════════════════════════════════
    {
        name: 'Classic Leather Crossbody Bag',
        description: 'Handcrafted premium leather crossbody bag with adjustable strap, multiple compartments, and antique brass hardware. Perfect for daily use — fits phone, wallet, keys, and essentials. Available in black, brown, and tan.',
        price: 1299,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        ],
        category: 'Fashion',
        stock: 60,
        isFeatured: true,
    },
    {
        name: 'Polarized Aviator Sunglasses UV400',
        description: 'Premium polarized aviator sunglasses with UV400 protection, ultra-lightweight metal frame, and anti-glare lenses. Reduces eye strain and enhances color contrast. Comes with premium carrying case and cleaning cloth.',
        price: 899,
        images: [
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        ],
        category: 'Fashion',
        stock: 250,
        isFeatured: true,
    },
    {
        name: 'Premium Cotton Crew Neck T-Shirt',
        description: '100% organic cotton crew neck t-shirt with a relaxed fit. Pre-washed for softness, double-stitched seams for durability. Available in 12 colors. Perfect layering piece or standalone casual wear.',
        price: 599,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
        ],
        category: 'Fashion',
        stock: 500,
        isFeatured: false,
    },
    {
        name: 'Minimalist Analog Wrist Watch',
        description: 'Elegant minimalist watch with genuine leather strap, Japanese quartz movement, and scratch-resistant sapphire crystal. 40mm case diameter, 30m water resistance. The perfect accessory for both casual and formal occasions.',
        price: 2199,
        images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
        ],
        category: 'Fashion',
        stock: 45,
        isFeatured: true,
    },

    // ═══════════════════════════════════════════
    // HOME & KITCHEN
    // ═══════════════════════════════════════════
    {
        name: 'Ceramic Pour-Over Coffee Dripper Set',
        description: 'Artisan-crafted ceramic coffee dripper with reusable stainless steel filter, borosilicate glass server (500ml), and bamboo stand. Brews smooth, full-bodied coffee without paper filters. Dishwasher safe.',
        price: 1899,
        images: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
        ],
        category: 'Home & Kitchen',
        stock: 75,
        isFeatured: true,
    },
    {
        name: 'Stainless Steel Insulated Water Bottle 750ml',
        description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid with one-hand operation. Powder-coated exterior prevents condensation. Available in 8 colors.',
        price: 699,
        images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
        ],
        category: 'Home & Kitchen',
        stock: 400,
        isFeatured: false,
    },
    {
        name: 'Bamboo Desk Organizer with Wireless Charger',
        description: 'Multi-functional desk organizer made from sustainable bamboo with built-in 15W Qi wireless charging pad. Features compartments for phone, pens, cards, and supplies. Clean cable management with hidden routing channels.',
        price: 1599,
        images: [
            'https://images.unsplash.com/photo-1587467512961-120760940315?w=800&q=80',
        ],
        category: 'Home & Kitchen',
        stock: 90,
        isFeatured: false,
    },
    {
        name: 'Aromatherapy Essential Oil Diffuser 300ml',
        description: 'Ultrasonic cool mist diffuser with 7 LED color modes, timer settings, and whisper-quiet operation. Covers up to 300 sq ft. Auto shut-off when water runs out. Perfect for bedroom, office, or yoga studio. BPA-free.',
        price: 999,
        images: [
            'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800&q=80',
        ],
        category: 'Home & Kitchen',
        stock: 120,
        isFeatured: false,
    },

    // ═══════════════════════════════════════════
    // FITNESS & SPORTS
    // ═══════════════════════════════════════════
    {
        name: 'Resistance Bands Set - 5 Levels',
        description: 'Professional-grade latex resistance bands in 5 resistance levels (10-50 lbs). Includes door anchor, ankle straps, handles, and carrying bag. Perfect for home workouts, physical therapy, and travel fitness.',
        price: 799,
        images: [
            'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',
        ],
        category: 'Fitness & Sports',
        stock: 350,
        isFeatured: false,
    },
    {
        name: 'Non-Slip Yoga Mat 6mm Premium TPE',
        description: 'Eco-friendly TPE yoga mat with double-sided non-slip texture, alignment lines, and 6mm cushioning. Lightweight (1.8 lbs) and comes with carrying strap. Free from PVC, latex, and toxic chemicals. 72" x 26" size.',
        price: 1199,
        images: [
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        ],
        category: 'Fitness & Sports',
        stock: 180,
        isFeatured: true,
    },

    // ═══════════════════════════════════════════
    // BOOKS & STATIONERY
    // ═══════════════════════════════════════════
    {
        name: 'Leather-Bound Dotted Journal A5',
        description: 'Premium A5 journal with genuine leather cover, 200 pages of 120gsm dot-grid paper, lay-flat binding, and ribbon bookmark. Acid-free paper prevents bleed-through. Includes pen loop and inner pocket. Ideal for bullet journaling.',
        price: 599,
        images: [
            'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        ],
        category: 'Books & Stationery',
        stock: 220,
        isFeatured: false,
    },
    {
        name: 'Mechanical Pencil Set - Japanese Precision',
        description: 'Professional drafting pencil set featuring 0.3mm, 0.5mm, and 0.7mm mechanical pencils with metal bodies, retractable tips, and ergonomic grips. Includes 90 replacement leads (HB, 2B, 4B) and 3 erasers.',
        price: 449,
        images: [
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80',
        ],
        category: 'Books & Stationery',
        stock: 160,
        isFeatured: false,
    },
];

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        // Clear existing products
        const existing = await Product.countDocuments();
        if (existing > 0) {
            console.log(`🗑  Clearing ${existing} existing products...`);
            await Product.deleteMany({});
        }

        // Insert new products
        console.log(`📦 Inserting ${products.length} products...\n`);
        const created = await Product.insertMany(products);

        console.log('✅ Products seeded successfully!\n');
        console.log('────────────────────────────────────────');
        created.forEach((p) => {
            console.log(`  📌 ${p.name} — ₹${p.price} [${p.category}]`);
        });
        console.log('────────────────────────────────────────');
        console.log(`\n🎉 Total: ${created.length} products added.\n`);
        console.log('Now run: npm run dev');
        console.log('Then visit: http://localhost:3000\n');
    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
