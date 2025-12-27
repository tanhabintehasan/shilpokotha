import axios from 'axios';

const API_URL = "http://localhost:5000/api/categories/add";

const categoriesData = [
  // --- 1. FASHION ---
  { name: "Fashion", parent: "None", icon: "👕", description: "Clothing and apparel for all ages." },
  { name: "Men", parent: "Fashion", icon: "👨", description: "Men's apparel" },
  { name: "Women", parent: "Fashion", icon: "👩", description: "Women's apparel" },
  { name: "Boys", parent: "Fashion", icon: "👦", description: "Boys' apparel" },
  { name: "Girls", parent: "Fashion", icon: "👧", description: "Girls' apparel" },

  // --- 2. BAGS ---
  { name: "Bags", parent: "None", icon: "👜", description: "Handbags, backpacks and more." },
  { name: "Hand Bags", parent: "Bags", icon: "👛", description: "Stylish handbags" },
  { name: "Tote Bags", parent: "Bags", icon: "🛍️", description: "Spacious tote bags" },
  { name: "Jute Bags", parent: "Bags", icon: "🌾", description: "Eco-friendly jute bags" },
  { name: "Backpacks", parent: "Bags", icon: "🎒", description: "Travel and school backpacks" },

  // --- 3. FOOTWEAR ---
  { name: "Footwear", parent: "None", icon: "👟", description: "Shoes, sandals, and ethnic footwear." },
  { name: "Traditional Footwear", parent: "Footwear", icon: "👞", description: "Ethnic shoes" },
  { name: "Leather Sandals", parent: "Footwear", icon: "👡", description: "Premium leather" },
  { name: "Sneakers", parent: "Footwear", icon: "👟", description: "Casual sneakers" },

  // --- 4. BEAUTY ---
  { name: "Beauty", parent: "None", icon: "💄", description: "Natural and local beauty products." },
  { name: "Multani Mati", parent: "Beauty", icon: "🌿", description: "Fuller's earth packs" },
  { name: "Herbal Soaps", parent: "Beauty", icon: "🧼", description: "Handmade organic soaps" },
  { name: "Natural Face Packs", parent: "Beauty", icon: "🎭", description: "Organic face care" },

  // --- 5. JEWELLERY ---
  { name: "Jewellery", parent: "None", icon: "💍", description: "Gold, silver, and handmade ornaments." },
  { name: "Gold Jewellery", parent: "Jewellery", icon: "✨", description: "22K and 24K gold" },
  { name: "Silver Jewellery", parent: "Jewellery", icon: "🥈", description: "Sterling silver items" },
  { name: "Handmade Jewellery", parent: "Jewellery", icon: "🎨", description: "Artisan crafted" },

  // --- 6. WELLNESS ---
  { name: "Wellness", parent: "None", icon: "🧘", description: "Herbal remedies and natural teas." },
  { name: "Herbal Oils", parent: "Wellness", icon: "🫙", description: "Essential and hair oils" },
  { name: "Natural Teas", parent: "Wellness", icon: "🍵", description: "Organic leaf teas" },

  // --- 7. HOME DECOR ---
  { name: "Home Decor", parent: "None", icon: "🏺", description: "Traditional and handcrafted home items." },
  { name: "Bamboo & Cane Products", parent: "Home Decor", icon: "🎋", description: "Eco-friendly furniture" },
  { name: "Pottery & Clay Items", parent: "Home Decor", icon: "🧱", description: "Handmade clay decor" },
  { name: "Brass & Bell Metal Items", parent: "Home Decor", icon: "🔔", description: "Traditional metal craft" }
];

async function seedDB() {
  console.log("🚀 Starting Seeding (ESM Mode)...");
  
  for (const category of categoriesData) {
    try {
      const response = await axios.post(API_URL, category);
      console.log(`✅ Created: ${category.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${category.name} - ${error.response?.data?.message || error.message}`);
    }
  }
  
  console.log("✨ Seeding Completed!");
}

seedDB();