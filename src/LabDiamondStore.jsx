import React, { useState, useMemo, useRef, useEffect } from "react";
import { ShoppingCart, Search, Gem, ChevronDown, Check, X, Leaf, ShieldCheck, Microscope } from "lucide-react"; 
import { DIAMOND_SHAPES, CLARITIES, COLORS, TRANSLATIONS } from "./constants";
import CartDrawer from "./components/CartDrawer";
import ProductCard from "./components/ProductCard";
import JewelryBuilderModal from "./components/JewelryBuilderModal";
import FluidGlass from "./components/FluidGlass"; 
import Dock from "./components/Dock"; 
import { Badge, ShapeIcon, ClarityIcon, ColorIcon, LiquidButton, FlagIcon, Chatbot, IconButton } from "./components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "./lib/supabase"; // CONNECTED SUPABASE

// --- EDUCATION MODAL ---
function EducationModal({ open, onClose, t }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
          >
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900/80 to-slate-950" />
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 p-8 text-slate-100">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400">{t('labGrown')}</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{t('whyLab')}?</h2>
                </div>
                <IconButton icon={X} onClick={onClose} />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="mb-3 inline-flex rounded-full bg-green-500/20 p-2 text-green-400"><Leaf size={20} /></div>
                  <h3 className="mb-1 font-semibold text-white">Eco-Friendly</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Cultivated in controlled environments with a significantly smaller carbon footprint than mined diamonds.</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="mb-3 inline-flex rounded-full bg-blue-500/20 p-2 text-blue-400"><Microscope size={20} /></div>
                  <h3 className="mb-1 font-semibold text-white">Chemically Identical</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Atom-for-atom identical to mined diamonds. The only difference is the origin.</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="mb-3 inline-flex rounded-full bg-purple-500/20 p-2 text-purple-400"><ShieldCheck size={20} /></div>
                  <h3 className="mb-1 font-semibold text-white">100% Conflict Free</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Guaranteed ethical origins with zero human rights abuses or conflict funding.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function LabDiamondStore() {
  const [lang, setLang] = useState("en"); 
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const t = (key) => TRANSLATIONS[lang][key] || key;

  // --- SUPABASE DATA STATE ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        // 1. Fetch Loose Diamonds
        const { data: diamonds, error: dError } = await supabase
            .from('diamonds')
            .select('*')
            .eq('is_sold', false);
        
        if (dError) throw dError;

        // 2. Fetch Settings (Pre-set Rings/Earrings)
        const { data: settings, error: sError } = await supabase
            .from('settings')
            .select('*');
        
        if (sError) throw sError;

        // 3. Map them to the format the UI expects
        const mappedDiamonds = (diamonds || []).map(d => ({
            id: `d_${d.id}`, // Prefix to avoid collisions
            dbId: d.id,
            name: `${d.carat.toFixed(2)} ct ${d.shape} Lab Diamond`,
            type: 'Loose Diamond',
            shape: d.shape,
            clarity: d.clarity,
            color: d.color,
            carat: d.carat,
            price: d.price,
            // ADDED: Image mapping
            image: d.image_url, 
            tripleEx: d.cut === 'Excellent' || d.cut === 'Ideal',
            bestSeller: d.price > 3000 && d.price < 5000 // Simple logic for badge
        }));

        const mappedSettings = (settings || []).map(s => ({
            id: `s_${s.id}`,
            dbId: s.id,
            name: s.name,
            type: s.type === 'Ring' ? 'Engagement Ring' : 'Earrings',
            shape: 'Round', // Default for preview
            clarity: 'VS1', // Mock for preview
            color: 'E',     // Mock for preview
            carat: 1.0,     // Mock for preview
            price: s.price + 1000, // Base price + mock diamond
            // ADDED: Image mapping
            image: s.image_url,
            tripleEx: true,
            bestSeller: false
        }));

        setProducts([...mappedDiamonds, ...mappedSettings]);

      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);


  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 20000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const minProductPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.min(...products.map(p => p.price));
  }, [products]);

  const [shapeFilter, setShapeFilter] = useState("All");
  const [clarityFilter, setClarityFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [query, setQuery] = useState("");
  
  const [maxPrice, setMaxPrice] = useState(20000);
  
  // Update max price once data loads
  useEffect(() => {
      if (maxProductPrice > 0) setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);
  
  const [educationOpen, setEducationOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ firstName: "", lastName: "", email: "", phone: "", street: "", postalCode: "", city: "", country: "Switzerland" });
  const [paymentDetails, setPaymentDetails] = useState({ method: "card", cardName: "", cardNumber: "", expiry: "", cvc: "" });
  
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderDiamond, setBuilderDiamond] = useState(null);
  const [builderConfig, setBuilderConfig] = useState({ setting: "Solitaire", metal: "18k White Gold", size: "54 (EU)", backing: "Push Back" });
  
  const searchInputRef = useRef(null);

  const [flyingGems, setFlyingGems] = useState([]);
  const [cartImpact, setCartImpact] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (shapeFilter !== "All" && p.shape !== shapeFilter) return false;
      if (clarityFilter !== "All" && p.clarity !== clarityFilter) return false;
      if (colorFilter !== "All" && p.color !== colorFilter) return false;
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (p.price > maxPrice) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const text = `${p.name} ${p.type} ${p.shape} ${p.clarity} ${p.color}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
    return result; 
  }, [products, shapeFilter, clarityFilter, colorFilter, typeFilter, query, maxPrice]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = cartSubtotal === 0 ? 0 : cartSubtotal >= 3000 ? 0 : 49;
  const total = cartSubtotal + shipping;

  function handleAddToCart(product, e) { 
    if (e) {
      const startRect = e.currentTarget.getBoundingClientRect();
      const cartEl = document.getElementById("cart-icon-container");
      const endRect = cartEl ? cartEl.getBoundingClientRect() : { left: window.innerWidth - 50, top: 20, width: 40, height: 40 };
      
      const newGem = {
        id: Date.now(),
        start: { x: startRect.left + startRect.width / 2, y: startRect.top + startRect.height / 2 },
        end: { x: endRect.left + endRect.width / 2, y: endRect.top + endRect.height / 2 }
      };
      
      setFlyingGems(prev => [...prev, newGem]);
      
      setTimeout(() => {
        setFlyingGems(prev => prev.filter(g => g.id !== newGem.id));
        setCartImpact(Date.now());
        setTimeout(() => setCartImpact(null), 300);
      }, 800); 
    }

    setCartItems((prev) => { 
        const ex = prev.find((i) => i.product.id === product.id); 
        return ex ? prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { product, qty: 1 }]; 
    }); 
  }

  // --- SUPABASE ORDER HANDLING ---
  async function handlePlaceOrder(shipping, payment) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    customer_email: shipping.email,
                    total_amount: total,
                    status: 'paid', // In real app, this happens after Stripe callback
                    items: cartItems.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        qty: item.qty,
                        customConfig: item.product.customConfig || null
                    })),
                    shipping_address: shipping
                }
            ])
            .select();

        if (error) throw error;

        setOrderPlaced(true);
        setCheckoutStep(4);
        setCartItems([]); // Clear cart
    } catch (err) {
        console.error("Order failed:", err);
        alert("Failed to place order. Please try again.");
    }
  }

  function openBuilder(product) { 
    setBuilderDiamond(product); 
    setBuilderConfig({ setting: "Solitaire", metal: "18k White Gold", size: "54 (EU)", backing: "Push Back" }); 
    setBuilderOpen(true); 
  }
  
  function closeBuilder() { 
    setBuilderOpen(false); 
    setBuilderDiamond(null); 
  }
  
  function handleBuilderConfigChange(field, value) { 
    setBuilderConfig((prev) => ({ ...prev, [field]: value })); 
  }
  
  function handleAddFromBuilder(mode, finalSetting, finalPrice) { 
    if (!builderDiamond) return; 
    const itemName = `${builderDiamond.carat.toFixed(2)} ct ${mode === 'ring' ? 'Ring' : 'Earrings'}`;
    const p = { 
        id: Date.now(), 
        name: itemName, 
        type: mode === 'ring' ? 'Custom Ring' : 'Custom Earrings', 
        shape: builderDiamond.shape, 
        clarity: builderDiamond.clarity, 
        color: builderDiamond.color, 
        carat: builderDiamond.carat, 
        price: finalPrice, 
        tripleEx: true, 
        bestSeller: false, 
        customConfig: { ...builderConfig, setting: finalSetting, mode, baseId: builderDiamond.id } 
    }; 
    const mockEvent = { currentTarget: { getBoundingClientRect: () => ({ left: window.innerWidth/2, top: window.innerHeight/2, width: 0, height: 0 }) } };
    handleAddToCart(p, mockEvent); 
    closeBuilder(); 
  }

  const dockItems = [
    { 
      icon: (
        <div className="flex flex-col items-center justify-center h-full w-full pt-1">
           <FlagIcon lang={lang} className="w-4 h-3 rounded-sm shadow-sm mb-0.5" />
           <ChevronDown className="h-2 w-2 text-slate-400 opacity-70" />
        </div>
      ), 
      label: t('language'), 
      onClick: () => setShowLangMenu(!showLangMenu), 
      className: 'bg-slate-800 border-slate-700 text-slate-200' 
    },
    { 
      icon: <Search size={18} className="text-slate-200" />, 
      label: t('search'), 
      onClick: () => { 
          searchInputRef.current?.focus(); 
          searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          setShowLangMenu(false);
      }, 
      className: 'bg-slate-800 border-slate-700' 
    },
    { 
      icon: (
        <div id="cart-icon-container" className="relative flex items-center justify-center h-full w-full">
          <ShoppingCart size={18} className="text-slate-200" />
          
          <AnimatePresence>
            {cartImpact && (
               <motion.div 
                 initial={{ scale: 0, opacity: 1 }}
                 animate={{ scale: 2, opacity: 0 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 rounded-full bg-blue-400"
               />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {cartCount > 0 && (
                <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cartCount} 
                    className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white border border-slate-900 shadow-lg"
                >
                {cartCount}
                </motion.span>
            )}
          </AnimatePresence>
        </div>
      ), 
      label: t('basket'), 
      onClick: () => { setIsCartOpen(true); setCheckoutStep(1); setOrderPlaced(false); setShowLangMenu(false); }, 
      className: 'bg-slate-800 border-slate-700' 
    }
  ];

  const progressPercent = ((maxPrice - minProductPrice) / (maxProductPrice - minProductPrice)) * 100;
  const safeProgress = isNaN(progressPercent) ? 100 : Math.max(0, Math.min(100, progressPercent));

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors duration-500" onClick={() => showLangMenu && setShowLangMenu(false)}>
      
      {flyingGems.map((gem) => (
         <motion.div
            key={gem.id}
            initial={{ x: gem.start.x - 12, y: gem.start.y - 12, scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{ x: gem.end.x - 12, y: gem.end.y - 12, scale: 1, opacity: 1, rotate: 720 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed z-[100] pointer-events-none"
         >
            <div className="relative h-6 w-6 flex items-center justify-center">
               <Gem className="h-6 w-6 text-blue-400 fill-blue-400/30 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
               <div className="absolute inset-0 bg-blue-400 blur-md opacity-50 rounded-full" />
            </div>
         </motion.div>
      ))}

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="relative z-20 flex items-center gap-2 min-w-[150px]">
            <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-sky-300">{t('labGrown')}</p>
                <p className="-mt-1 text-sm font-semibold tracking-[0.2em]">{t('diamondStudio')}</p>
            </div>
          </div>
          
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <nav className="hidden pointer-events-auto items-center gap-6 text-xs font-medium sm:flex">
              <button type="button" className={typeFilter === "Loose Diamond" ? "text-sky-300" : "text-slate-400 hover:text-slate-200"} onClick={() => { setTypeFilter("Loose Diamond"); }}>{t('diamonds')}</button>
              <button type="button" className={typeFilter === "Engagement Ring" ? "text-sky-300" : "text-slate-400 hover:text-slate-200"} onClick={() => { setTypeFilter("Engagement Ring"); }}>{t('rings')}</button>
              <button type="button" className={typeFilter === "Earrings" ? "text-sky-300" : "text-slate-400 hover:text-slate-200"} onClick={() => { setTypeFilter("Earrings"); }}>{t('earrings')}</button>
              <button type="button" className={educationOpen ? "text-sky-300" : "text-slate-400 hover:text-slate-200"} onClick={() => setEducationOpen(true)}>{t('whyLab')}</button>
            </nav>
          </div>

          <div className="relative z-20 flex items-center justify-end min-w-[150px]">
             <div className="relative">
                 <Dock items={dockItems} baseItemSize={34} magnification={48} distance={100} panelHeight={44} />
                 {showLangMenu && (
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-14 left-0 w-32 rounded-xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl shadow-black backdrop-blur-md z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200"
                    >
                        {["en", "de", "fr", "it"].map((l) => (
                            <button 
                                key={l}
                                onClick={() => { setLang(l); setShowLangMenu(false); }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${lang === l ? "bg-blue-600/20 text-blue-200 border border-blue-500/30" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}`}
                            >
                                <div className="flex items-center gap-2">
                                    <FlagIcon lang={l} className="w-4 h-3 rounded-[1px]" />
                                    <span className="uppercase">{l}</span>
                                </div>
                                {lang === l && <Check size={12} />}
                            </button>
                        ))}
                    </div>
                 )}
             </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16">
        <section className="border-b border-slate-800 pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">{t('labGrown')}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('heroTitle')}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/90 sm:text-[15px]">{t('heroDesc')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
              <Badge>{t('alwaysEx')}</Badge>
              <Badge>{t('grading')}</Badge>
            </div>
          </div>

          <div id="quick-filter" className="mt-6 relative rounded-3xl shadow-2xl overflow-hidden group">
             <FluidGlass intensity={2} color="#0f172a" className="z-0 opacity-90" />
             <div className="relative z-10 p-6 backdrop-blur-[2px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200 drop-shadow-md">{t('quickFilter')}</p>
              <p className="mt-1 text-sm font-medium text-white drop-shadow-md">{t('designInSeconds')}</p>
              
              <div className="mt-5 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-slate-200 drop-shadow-sm">{t('shape')}</span></div>
                  <div className="flex flex-wrap gap-3">
                    <LiquidButton label={t('allShapes')} active={shapeFilter === "All"} onClick={() => setShapeFilter("All")} />
                    {DIAMOND_SHAPES.map((shape) => (
                      <LiquidButton key={shape} label={shape} active={shapeFilter === shape} onClick={() => setShapeFilter(shape)} icon={<ShapeIcon shape={shape} active={shapeFilter === shape} />} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-slate-200 drop-shadow-sm">{t('clarity')}</span></div>
                  <div className="flex flex-wrap gap-3">
                    <LiquidButton label={t('anyClarity')} active={clarityFilter === "All"} onClick={() => setClarityFilter("All")} />
                    {CLARITIES.map((cl) => (
                      <LiquidButton key={cl} label={cl} active={clarityFilter === cl} onClick={() => setClarityFilter(cl)} icon={<ClarityIcon clarity={cl} active={clarityFilter === cl} />} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-slate-200 drop-shadow-sm">{t('colour')}</span></div>
                  <div className="flex flex-wrap gap-3">
                    <LiquidButton label={t('allColours')} active={colorFilter === "All"} onClick={() => setColorFilter("All")} />
                    {COLORS.map((c) => (
                      <LiquidButton key={c} label={c} active={colorFilter === c} onClick={() => setColorFilter(c)} icon={<ColorIcon color={c} active={colorFilter === c} />} />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                    <div className="pt-1">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-200 drop-shadow-sm">{t('priceLimit')}</span>
                            <span className="text-xs font-bold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-500/20">CHF {maxPrice.toLocaleString()}</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-slate-800">
                            <div 
                                className="absolute left-0 top-0 h-full rounded-full bg-blue-500" 
                                style={{ width: `${safeProgress}%` }}
                            />
                            <input 
                                type="range" 
                                min={minProductPrice} 
                                max={maxProductPrice} 
                                step="100" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(Number(e.target.value))} 
                                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-500 pointer-events-none z-0"
                                style={{ left: `${safeProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 mt-2 font-medium">
                            <span>CHF {minProductPrice.toLocaleString()}</span>
                            <span>CHF {maxProductPrice.toLocaleString()}+</span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-slate-200 drop-shadow-sm">{t('search')}</label>
                        <div className="flex items-center overflow-hidden rounded-full border border-white/5 bg-slate-950/50 px-4 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400/50 backdrop-blur-md">
                            <Search className="mr-2 h-4 w-4 text-slate-400" />
                            <input ref={searchInputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} className="h-9 w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/5">
                     <div className="flex items-start gap-3 rounded-xl bg-blue-900/10 border border-blue-500/10 p-3 backdrop-blur-md">
                        <div className="p-1.5 bg-blue-500/20 rounded-full text-blue-300 border border-blue-400/20">
                            <Gem size={14} />
                        </div>
                        <div>
                            <p className="text-[11px] text-blue-200 leading-relaxed">
                                <strong className="text-blue-100 font-semibold">{t('qualityNote').split(':')[0]}:</strong>
                                {t('qualityNote').split(':')[1]}
                            </p>
                        </div>
                     </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
             <div><h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">{t('curated')}</h2><p className="mt-1 text-xs text-slate-300">{filteredProducts.length} {t('designsMatch')}</p></div>
          </div>
          
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-[300px] w-full rounded-3xl bg-white/5 animate-pulse border border-white/5"/>
                ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                    onOpenBuilder={product.type === "Loose Diamond" ? openBuilder : undefined} 
                    t={t}
                />
                ))}
            </div>
          )}
        </section>
      </main>
      
      {/* CART DRAWER NOW PASSES DATA UP TO HANDLE PLACE ORDER */}
      <CartDrawer 
        open={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        cartSubtotal={cartSubtotal} 
        shipping={shipping} 
        total={total} 
        checkoutStep={checkoutStep} 
        setCheckoutStep={setCheckoutStep} 
        shippingDetails={shippingDetails} 
        onChangeShipping={(f, v) => setShippingDetails(p => ({...p, [f]:v}))} 
        paymentDetails={paymentDetails} 
        onChangePayment={(f, v) => setPaymentDetails(p => ({...p, [f]:v}))} 
        onUpdateQty={(id, q) => setCartItems(prev => prev.map(i => i.product.id === id ? {...i, qty: q} : i))} 
        onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.product.id !== id))} 
        onPlaceOrder={() => handlePlaceOrder(shippingDetails, paymentDetails)} 
        orderPlaced={orderPlaced}
        t={t}
      />
      
      <JewelryBuilderModal 
        open={builderOpen} 
        diamond={builderDiamond} 
        config={builderConfig} 
        onChangeConfig={handleBuilderConfigChange} 
        onClose={closeBuilder} 
        onAdd={handleAddFromBuilder} 
        t={t}
      />
      
      <EducationModal 
        open={educationOpen} 
        onClose={() => setEducationOpen(false)}
        t={t}
      />

      <Chatbot t={t} products={products} />
      
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/85 pb-6 pt-4 text-[10px] text-slate-500">
        <div className="mx-auto max-w-5xl px-4 text-center"><p>© {new Date().getFullYear()} Lab Diamond Studio.</p></div>
      </footer>
    </div>
  );
}