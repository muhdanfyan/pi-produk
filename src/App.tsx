import { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Star, ArrowRight, ShieldCheck, 
  Trash2, X, Plus, Minus, Package, Laptop, BookOpen, Shirt
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  category: 'software' | 'book' | 'merch';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  salesCount: number;
  desc: string;
  features: string[];
  image: string;
  isDigital: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  const products: Product[] = [
    {
      id: 1,
      title: "PiSantri Multi-Tenant School ERP",
      category: "software",
      categoryLabel: "Software Source Code",
      price: 1500000,
      originalPrice: 3000000,
      rating: 4.9,
      salesCount: 42,
      desc: "Source code lengkap sistem manajemen pesantren & sekolah multi-tenant siap pakai. Termasuk modul Akademik, Tahfidz, Keuangan SPP, dan Presensi Santri.",
      features: [
        "Frontend React + Vite + Tailwind CSS",
        "Backend Laravel 11 REST API",
        "Dukungan Multi-Tenant Subdomain Otomatis",
        "Dokumentasi Deployment Docker & Nginx",
        "Free Konsultasi Instalasi 1 Bulan"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 2,
      title: "WhatsApp Bot Gateway Microservice",
      category: "software",
      categoryLabel: "Software Source Code",
      price: 750000,
      originalPrice: 1200000,
      rating: 4.8,
      salesCount: 68,
      desc: "Source code microservice REST API WhatsApp Gateway tanpa biaya langganan bulanan pihak ketiga. Siap integrasi broadcast tagihan, OTP, dan CS bot.",
      features: [
        "Engine Baileys Node.js High Concurrency",
        "Queue Job Redis Anti-Banned Safe Delays",
        "Webhook Handler & Multi-Device Support",
        "Docker Compose Ready"
      ],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 3,
      title: "Buku: Jalan Ninja Santri Menembus IT Global",
      category: "book",
      categoryLabel: "E-Book & Panduan",
      price: 99000,
      originalPrice: 150000,
      rating: 5.0,
      salesCount: 135,
      desc: "Panduan komprehensif roadmap belajar santri dari nol hingga mahir software engineering, etika adab penuntut ilmu, dan kiat tembus kerja remote internasional.",
      features: [
        "Format PDF & EPUB Interaktif (280 Halaman)",
        "Roadmap Fullstack & AI Engineer 2026",
        "Template CV & Portofolio Standar Tech Global",
        "Studi Kasus Santri Sukses Berkarya"
      ],
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 4,
      title: "Official Hoodie Developer Santri (Heavyweight)",
      category: "merch",
      categoryLabel: "Merchandise Resmi",
      price: 245000,
      rating: 4.9,
      salesCount: 88,
      desc: "Hoodie katun fleece premium 330 gsm dengan tipografi bordir eksklusif 'Code in Dunya, Jannah in Akhirah'. 100% keuntungan untuk beasiswa santri.",
      features: [
        "Material Cotton Fleece 330 GSM Nyaman & Sejuk",
        "Bordir Komputer Presisi & Tahan Lama",
        "Tersedia Ukuran M, L, XL, XXL",
        "Gratis Sticker Pack Tech Santri"
      ],
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
      isDigital: false
    },
    {
      id: 5,
      title: "Starter Kit Landing Page Yayasan & Pesantren",
      category: "software",
      categoryLabel: "Template Website",
      price: 350000,
      originalPrice: 600000,
      rating: 4.7,
      salesCount: 31,
      desc: "Template website landing page modern berbasis Next.js 14 & Tailwind CSS untuk profil pondok pesantren, donasi wakaf, dan pendaftaran santri baru.",
      features: [
        "Next.js App Router & TypeScript",
        "Komponen Form Pendaftaran Terintegrasi",
        "Kalkulator Zakat & Wakaf Otomatis",
        "Lighthouse Score 99/100 Mobile & Desktop"
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 6,
      title: "Kaos Tech Santri: 'Istiqomah & Debugging'",
      category: "merch",
      categoryLabel: "Merchandise Resmi",
      price: 125000,
      rating: 4.8,
      salesCount: 112,
      desc: "T-Shirt katun combed 24s lembut dengan sablon plastisol premium. Nyaman untuk ngoding seharian maupun aktivitas harian pondok.",
      features: [
        "Bahan Cotton Combed 24s Reaktif",
        "Sablon Plastisol Doff Awet & Tidak Pecah",
        "Desain Minimalis Elegan",
        "Free Gantungan Kunci Silikon Pondok"
      ],
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      isDigital: false
    }
  ];

  const categories = [
    { key: 'all', label: 'Semua Produk', icon: Package },
    { key: 'software', label: 'Software & Source Code', icon: Laptop },
    { key: 'book', label: 'Buku & Panduan', icon: BookOpen },
    { key: 'merch', label: 'Merchandise Resmi', icon: Shirt }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const nameStr = buyerName.trim() || 'Hamba Allah';
    const phoneStr = buyerPhone.trim() || '-';
    
    let text = `*PESANAN PRODUK PONDOK INFORMATIKA*\n`;
    text += `Nama Pemesan: ${nameStr}\n`;
    text += `No. WhatsApp: ${phoneStr}\n\n`;
    text += `*Rincian Pesanan:*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. ${item.title} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}\n`;
    });
    text += `\n*TOTAL PEMBAYARAN: ${formatRupiah(cartTotal)}*\n\n`;
    text += `Mohon info instruksi pembayaran / rekening resmi pengurus. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6282293827200?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Pondok Informatika" className="w-10 h-10 object-contain drop-shadow-sm" />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-950 block leading-none">
                Pondok<span className="text-blue-600">Store</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Karya &amp; Merchandise Santri
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-500 transition-all cursor-pointer shadow-sm"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>
            <a
              href="https://profile.pondokinformatika.id"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Profil Pondok
            </a>
          </div>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <header className="pt-32 pb-12 sm:pt-40 sm:pb-16 text-center relative bg-gradient-to-b from-blue-50/60 via-white to-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Produk Resmi &amp; Karya Intelektual Santri Berdaya
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Etalase Produk <span className="text-blue-600">Teknologi &amp; Dakwah</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Dukung kemandirian santri melalui pembelian lisensi perangkat lunak, e-book panduan rekayasa software, dan merchandise resmi Pondok Informatika.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari software, e-book, source code, kaos hoodie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  active 
                    ? 'bg-blue-600 text-white shadow-blue-600/20' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500 text-sm">Tidak ada produk yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-slate-800 shadow-sm border border-slate-200">
                      {p.categoryLabel}
                    </span>
                    {p.isDigital && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm">
                        Instant Delivery
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-slate-900">{p.rating}</span>
                    <span className="text-xs text-slate-400 font-normal">({p.salesCount} terjual)</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {p.desc}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {p.originalPrice && (
                        <span className="text-[11px] line-through text-slate-400 block font-medium">
                          {formatRupiah(p.originalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-black text-slate-950">
                        {formatRupiah(p.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Beli</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CART SLIDEOVER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-950">Keranjang Belanja</h2>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600">Keranjang belanja Anda masih kosong.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-950 truncate mb-1">{item.title}</h4>
                        <p className="text-xs font-black text-blue-600">{formatRupiah(item.price)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nama Lengkap Anda..."
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                    />
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp (cth: 08123456789)..."
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600 font-semibold">Total Pembayaran:</span>
                    <span className="text-base font-black text-slate-950">{formatRupiah(cartTotal)}</span>
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjutkan Checkout WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Official Store — Pondok Informatika Al-Bashirah.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <a href="https://pondokinformatika.id" className="hover:text-slate-900">Portal Utama</a>
            <a href="https://profile.pondokinformatika.id" className="hover:text-slate-900">Profile</a>
            <a href="https://katalog.pondokinformatika.id" className="hover:text-slate-900">Katalog</a>
            <a href="https://donasi.pondokinformatika.id" className="hover:text-slate-900">Donasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
