"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle, Tag } from 'lucide-react';
import { Product } from '@/lib/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  activeEmail: string;
}

export default function CartDrawer({ isOpen, onClose, items, onRemoveItem, onClearCart, activeEmail }: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const calculatedTotal = subtotal * (1 - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");

    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(0.10);
    } else if (promoCode.toUpperCase() === "SAVE15") {
      setDiscount(0.15);
    } else {
      setPromoError("Invalid code. Ask FunBot in the chat for a deal!");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    const emailToUse = activeEmail || "guest@funstore.local";

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email: emailToUse,
          total: calculatedTotal
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClearCart();
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      alert("Network error during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
                  <h3 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    Your order has been logged in Airtable CRM and a Brevo confirmation email is on its way! 🚀
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                  <ShoppingBag className="w-16 h-16 opacity-30" />
                  <p className="text-lg font-medium">Your cart is currently empty.</p>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Need recommendations? Ask FunBot in the bottom right corner!
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                      <p className="text-xs text-indigo-600 font-extrabold mt-1">${item.price} x {item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 hover:bg-rose-100 text-gray-400 hover:text-rose-600 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {!isSuccess && items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code (e.g. SAVE10)"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 uppercase font-semibold"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs font-bold text-emerald-600 flex items-center">
                      ✓ {discount * 100}% AI Negotiated Discount Applied!
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs font-bold text-rose-500">
                      {promoError}
                    </p>
                  )}
                </form>

                {/* Subtotals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({discount * 100}%)</span>
                      <span>-${(subtotal * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-900 font-extrabold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  disabled={isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow-xl shadow-indigo-100"
                >
                  <span>{isCheckingOut ? "Processing Order..." : "Proceed to Checkout"}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
