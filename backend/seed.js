const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['1.1.1.1']);

dotenv.config();

const Customer = require('./models/customer.model');
const Product = require('./models/product.model');

const sampleProducts = [
  // --- MANGA & GRAPHIC NOVELS ---
  {
    name: "Berserk Deluxe Edition Vol. 1",
    description: "The acclaimed adult fantasy manga now in 7x10 deluxe hardcover editions, collecting volumes 1-3.",
    price: 3199,
    category: "Manga",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500",
    stock: 12,
  },
  {
    name: "Chainsaw Man Box Set (Vols 1-11)",
    description: "Complete Phase 1 manga set of Tatsuki Fujimoto's dark supernatural action masterpiece.",
    price: 6499,
    category: "Manga",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500",
    stock: 8,
  },
  {
    name: "Vagabond Vizbig Edition Vol. 1",
    description: "Real-life story of legendary swordsman Miyamoto Musashi, written and illustrated by Takehiko Inoue.",
    price: 1899,
    category: "Manga",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    stock: 15,
  },

  // --- AUDIO & ELECTRONICS ---
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "High-quality over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 10,
  },
  {
    name: "RGB Mechanical Gaming Keyboard",
    description: "Customizable RGB mechanical keyboard with tactile blue switches and durable aluminum frame.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    stock: 6,
  },
  {
    name: "Ultra-Wide Curved Gaming Monitor 34\"",
    description: "144Hz 1ms curved gaming monitor with HDR400 and ultra-narrow bezel display.",
    price: 28999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    stock: 4,
  },

  // --- DESK & WORKSPACE GEAR ---
  {
    name: "Minimalist Felt Desk Pad",
    description: "Extra large wool felt desk mat to protect your tabletop and optimize mouse tracking.",
    price: 1299,
    category: "Workspace",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
    stock: 25,
  },
  {
    name: "Ergonomic Aluminium Laptop Stand",
    description: "Elevated desktop cooling holder compatible with MacBook and laptops up to 17 inches.",
    price: 1799,
    category: "Workspace",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    stock: 18,
  },

  // --- FASHION & LIFESTYLE ---
  {
    name: "Minimalist Leather Watch",
    description: "Classic analog watch with a genuine leather strap and water-resistant stainless steel casing.",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 20,
  },
  {
    name: "Ergonomic Running Shoes",
    description: "Lightweight breathable mesh running shoes designed for maximum comfort and durability.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 0, // Out of stock item to test out-of-stock UI states!
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    // 1. Wipe old legacy collections to clean out missing fields
    await Customer.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing customers and products.');

    // 2. Insert valid sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${insertedProducts.length} valid products successfully.`);

    console.log('Database reset complete. Exiting seed script.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();