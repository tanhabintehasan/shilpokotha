import mongoose from "mongoose";



const productSliderSchema = new mongoose.Schema({

  name: {

    type: String,

    required: [true, "Product name is required"],

    trim: true

  },

  imageURL: {

    type: String,

    required: [true, "Image is mandatory for sliders"]

  },

  link: {

    type: String,

    default: ""

  },

  description: {

    type: String,

    trim: true

  },

 

  // Table Data Fields

  price: {

    type: Number,

    default: 0,

    min: [0, "Price cannot be negative"]

  },

  category: {

    type: String,

    default: "General"

  },

  stock: {

    type: Number,

    default: 0,

    min: [0, "Stock cannot be negative"]

  },

 

  designType: {

    type: String,

    required: true,

    enum: [

      'homeslide',

      'homecatslide',

      'bannerslide',

      'productslide',

      'blog',

      'design',

      'product'

    ],

    default: 'product' // আপনি যেহেতু মেইন প্রোডাক্ট টেবিলের কথা বলছেন, ডিফল্ট 'product' রাখা ভালো

  },

 

  isActive: {

    type: Boolean,

    default: true

  }

}, {

  timestamps: true // এটি অটোমেটিক createdAt এবং updatedAt হ্যান্ডেল করবে

});



// কালেকশন নেম নিশ্চিত করা (যদি আপনার মেইন টেবিলের নাম 'Product' হয় তবে এখানেও সেটি দিতে পারেন)

export default mongoose.models.ProductSlider || mongoose.model("ProductSlider", productSliderSchema);