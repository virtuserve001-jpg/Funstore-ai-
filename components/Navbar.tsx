"use client";

import React from 'react';
import { ShoppingBag, Sparkles, User, DollarSign, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  activeEmail: string;
  setActiveEmail: (email: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  cartCount: number;
  openCart: () => void;
}

export default function Navbar({ activeEmail, setActiveEmail, currency, setCurrency, cartCount, openCart }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">FunStore</span>
          </Link>

          {/* Controls & Simulators */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Admin Dashboard Link */}
            <Link 
              href="/admin" 
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
            >
              <ShieldAlert className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">AI Analytics</span>
            </Link>

            {/* Currency Selector */}
            <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="NGN">NGN (₦)</option>
              </select>
            </div>

            {/* CRM Customer Simulation Switcher */}
            <div className="flex items-center space-x-1 bg-indigo-50 border border-indigo-100 rounded-xl px-2 py-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <select 
                value={activeEmail} 
                onChange={(e) => setActiveEmail(e.target.value)}
                className="bg-transparent text-xs font-bold text-indigo-700 focus:outline-none cursor-pointer"
              >
                <option value="">Guest User</option>
                <option value="alice@vip-tech.com">Alice (VIP)</option>
                <option value="bob@newbie.org">Bob (New)</option>
              </select>
            </div>

            {/* Cart Button */}
            <button 
              onClick={openCart}
              className="relative p-2.5 bg-gray-900 hover:bg-indigo-600 text-white rounded-xl transition shadow-md flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
