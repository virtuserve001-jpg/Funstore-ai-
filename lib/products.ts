export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  specs: string[];
}

export const products: Product[] = [
  {
    id: "tech-01",
    name: "Quantum Wireless Earbuds",
    price: 129.99,
    description: "Ultra-crisp active noise cancelling wireless earbuds with 36-hour battery life and spatial audio immersion.",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
    specs: ["Active Noise Cancellation", "36h Battery", "Bluetooth 5.3", "IPX4 Water Resistant"]
  },
  {
    id: "tech-02",
    name: "AeroGlow Smartwatch Series X",
    price: 249.99,
    description: "Premium titanium smartwatch featuring an edge-to-edge AMOLED display, advanced fitness tracking, and ECG monitoring.",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
    specs: ["AMOLED Display", "ECG & Heart Rate", "GPS Built-in", "7-day Battery"]
  },
  {
    id: "tech-03",
    name: "ProVision 4K Action Camera",
    price: 299.99,
    description: "Compact, rugged 4K action camera with gimbal-like hyper-stabilization and waterproof casing up to 10 meters.",
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800",
    specs: ["4K 120fps Video", "HyperSteady Stabilization", "Waterproof 10m", "Touchscreen"]
  },
  {
    id: "tech-04",
    name: "Apex Mechanical Gaming Keyboard",
    price: 149.99,
    description: "Hot-swappable mechanical keyboard with custom linear switches, per-key RGB lighting, and premium PBT keycaps.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800",
    specs: ["Hot-swappable switches", "RGB Backlighting", "Wireless/Wired modes", "Aluminum frame"]
  },
  {
    id: "tech-05",
    name: "NovaBeam Ultrawide Monitor Lightbar",
    price: 59.99,
    description: "Sleek monitor lightbar that eliminates screen glare, featuring adjustable color temperature and wireless desktop dial.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=800",
    specs: ["Auto-dimming sensor", "2700K-6500K Temp", "Wireless remote", "USB-C powered"]
  },
  {
    id: "tech-06",
    name: "Stealth Foldable Drone Pro",
    price: 499.99,
    description: "Lightweight foldable drone featuring an obstacle avoidance system, 48MP camera, and automated cinematic flight paths.",
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800",
    specs: ["48MP Photo / 4K Video", "34-min flight time", "Obstacle sensing", "Weight: 249g"]
  },
  {
    id: "tech-07",
    name: "SonicBoom Portable Speaker",
    price: 89.99,
    description: "Rich 360-degree sound with deep bass punch. Highly durable, waterproof, and equipped with PartyConnect pairing.",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1608223667507-787b768a4175?auto=format&fit=crop&q=80&w=800",
    specs: ["360° Surround Sound", "IP67 Waterproof", "20h Playtime", "Powerbank feature"]
  },
  {
    id: "tech-08",
    name: "GigaCharger 100W 4-Port GaN",
    price: 49.99,
    description: "Powerful yet pocket-sized GaN fast charger capable of charging a laptop, phone, tablet, and earbuds simultaneously.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800",
    specs: ["100W Max Output", "3 USB-C + 1 USB-A", "GaN II Tech", "Travel foldable prongs"]
  },
  {
    id: "tech-09",
    name: "ErgoCurve Vertical Mouse",
    price: 69.99,
    description: "Scientifically designed vertical mouse intended to reduce wrist pressure and enhance productivity with customizable buttons.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    specs: ["Ergonomic 57° angle", "Dual Bluetooth/2.4GHz", "Rechargeable", "4 DPI levels"]
  },
  {
    id: "tech-10",
    name: "EchoFrames Smart Audio Glasses",
    price: 199.99,
    description: "Stylish open-ear audio glasses allowing you to listen to music and take calls seamlessly while staying aware of your surroundings.",
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
    specs: ["Open-ear acoustics", "Voice assistant ready", "Polarized lenses", "8h continuous audio"]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
