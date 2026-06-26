"use client";

import React, { useState, createContext, useContext } from 'react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ChatInterface from '@/components/ChatInterface';
import { Product } from '@/lib/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  activeEmail: string;
  setActiveEmail: (email: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  openCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a ClientWrapper");
  }
  return context;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [activeEmail, setActiveEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const value: CartContextType = {
    activeEmail,
    setActiveEmail,
    currency,
    setCurrency,
    cartItems,
    onAddToCart: handleAddToCart,
    onRemoveItem: handleRemoveItem,
    onClearCart: handleClearCart,
    openCart: () => setIsCartOpen(true)
  };

  return (
    <CartContext.Provider value={value}>
      <Navbar 
        activeEmail={activeEmail}
        setActiveEmail={setActiveEmail}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
      />

      <main>{children}</main>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        activeEmail={activeEmail}
      />

      <ChatInterface 
        activeEmail={activeEmail}
        currency={currency}
      />
    </CartContext.Provider>
  );
}
