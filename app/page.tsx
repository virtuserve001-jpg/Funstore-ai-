"use client";

import React, { useState } from 'react';
import { products, Product } from '@/lib/products';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onAddToCart?: (product: Product) => void;
  currency?: string;
}

export default function HomePage({ onAddToCart, currency = "USD" }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", "Audio", "Wearables", "Cameras", "Accessories"];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Helper to show approximate currency symbol
  const getCurrencySymbol = (cur: string) => {
    switch(cur) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'NGN': return '₦';
      default: return '$';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Autonomous AI Business Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">FunStore</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated catalog of next-generation tech gadgets. Have questions or want a deal? Chat with FunBot instantly!
          </p>
        </div>
      </div>

      {/* Product Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-10 overflow-x-auto py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm">
                  {product.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-extrabold text-lg text-indigo-600">
                      {getCurrencySymbol(currency)}{product.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.specs.slice(0, 3).map((spec, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onAddToCart && onAddToCart(product)}
                  className="w-full py-3 bg-gray-900 hover:bg-indigo-600 text-white font-medium rounded-xl transition flex items-center justify-center space-x-2 group/btn"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
