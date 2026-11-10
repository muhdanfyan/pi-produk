import { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Star, Check, ArrowRight, ShieldCheck, 
  Trash2, X, Plus, Minus, Tag, Download, Sparkles, MessageCircle, 
  ExternalLink, Layers, Laptop, BookOpen, Shirt, Package
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
        "Dokumentasi instalasi lengkap & Docker compose"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 2,
      title: "OpenWA Notification Gateway",
      category: "software",
      categoryLabel: "Software Microservice",
      price: 450000,
      originalPrice: 750000,
      rating: 4.8,
      salesCount: 118,
      desc: "Microservice Node.js untuk WhatsApp gateway otomatis tanpa langganan bulanan mahal. Ideal untuk notifikasi absensi dan tagihan sekolah.",
      features: [
        "Engine Baileys v6 Multi-Device QR Code",
        "REST API Fastify siap integrasi",
        "Anti-disconnect reconnect logic",
        "Dashboard pemantau status sesi"
      ],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 3,
      title: "E-Book: Menjadi Software Engineer Muslim",
      category: "book",
      categoryLabel: "E-Book & Modul",
      price: 85000,
      originalPrice: 150000,
      rating: 5.0,
      salesCount: 320,
      desc: "Panduan praktis membangun karir di industri teknologi global dengan tetap menjaga komitmen ibadah, adab syar'i, dan keberkahan rezeki.",
      features: [
        "Format PDF & EPUB 240 halaman",
        "Studi kasus karir remote worker",
        "Roadmap belajar Fullstack dari nol",
        "Doa-doa penuntut ilmu & adab ngoding"
      ],
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      isDigital: true
    },
    {
      id: 4,
      title: "Hoodie Eksklusif Santri IT — Black Edition",
      category: "merch",
      categoryLabel: "Merchandise Resmi",
      price: 245000,
      rating: 4.9,
      salesCount: 85,
      desc: "Hoodie katun fleece tebal premium 330 gsm dengan sablon tipografi inspiratif khas programmer santri Pondok Informatika.",
      features: [
        "Bahan Cotton Fleece tebal & adem",
        "Sablon Discharge High Density awet",
        "Saku depan multifungsi",
        "Ukuran S, M, L, XL, XXL"
      ],
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
      isDigital: false
    },
    {
      id: 5,
      title: "Kaos Developer 'Hafizh & Coder' Navy",
      category: "merch",
      categoryLabel: "Merchandise Resmi",
      price: 125000,
      rating: 4.8,
      salesCount: 140,
      desc: "T-shirt Cotton Combed 24s premium bertema integrasi antara Al-Qur'an dan teknologi tinggi. Nyaman dipakai ngoding seharian.",
      features: [
        "100% Cotton Combed 24s lembut",
        "Sablon Plastisol doff rapi",
        "Jahitan rantai standar distro",
        "Bonus stiker laptop pack"
      ],
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      isDigital: false
    },
    {
      id: 6,
      title: "Tumbler Stainless Vacuum 500ml",
      category: "merch",
      categoryLabel: "Merchandise Resmi",
      price: 95000,
      rating: 4.9,
      salesCount: 65,
      desc: "Botol minum stainless steel tahan panas dan dingin 12 jam dengan grafir laser logo resmi Pondok Informatika.",
      features: [
        "Stainless Steel SUS 304 food grade",
        "Tahan panas/dingin hingga 12 jam",
        "Kapasitas 500ml",
        "Laser engraving presisi"
      ],
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Pondok Informatika" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                Pondok<span className="text-blue-500">Store</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Karya &amp; Merchandise Santri
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-blue-500/50 transition-all cursor-pointer"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HEADER HERO */}
      <header className="pt-32 pb-12 sm:pt-40 sm:pb-16 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            100% Keuntungan Mendukung Operasional Beasiswa Santri
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Etalase Resmi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Software &amp; Karya Santri</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Dapatkan source code berkualitas industri, buku teknologi, dan merchandise eksklusif. Setiap pembelian Anda adalah kontribusi langsung bagi pendidikan santri dhuafa.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk software, kaos, buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>
      </header>

      {/* CATEGORY PILLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">Tidak ada produk yang sesuai dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800/90 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-blue-400 border border-slate-800">
                        {p.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{p.rating}</span>
                      <span className="text-slate-500 font-normal">({p.salesCount} terjual)</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Price section */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">
                        {formatRupiah(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatRupiah(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => addToCart(p)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-video">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {selectedProduct.categoryLabel}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedProduct.title}</h2>
              <div className="text-xl font-black text-white mt-2">
                {formatRupiah(selectedProduct.price)}
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {selectedProduct.desc}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-2">Spesifikasi &amp; Fitur:</h4>
                <ul className="space-y-1.5">
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambahkan ke Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART SLIDEOVER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <h2 className="font-bold text-base text-white">Keranjang Belanja</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {totalItemsCount}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Keranjang Anda masih kosong.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3 items-center">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs font-bold text-blue-400 mt-0.5">{formatRupiah(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout Form */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Anda..."
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Nomor WhatsApp aktif..."
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">Total Pembayaran</span>
                  <span className="text-lg font-black text-white">{formatRupiah(cartTotal)}</span>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Sekarang via WhatsApp</span>
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  Pembayaran resmi via QRIS / Rekening Yayasan Pondok Informatika.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} PondokStore — Karya &amp; Merchandise Pondok Informatika.</p>
      </footer>
    </div>
  );
}
