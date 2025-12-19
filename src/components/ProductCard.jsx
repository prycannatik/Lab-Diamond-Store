import React from "react";
import { ShoppingCart, Gem } from "lucide-react";
import { Badge, LiquidButton } from "./Icons";

export default function ProductCard({ product, onAddToCart, onOpenBuilder, t }) {
  const cardStyle = "border-slate-800 bg-slate-950/70 shadow-slate-950/60 hover:border-blue-400 hover:shadow-blue-500/40";
  const cardBase = "group flex flex-col rounded-3xl border p-4 shadow-xl transition hover:-translate-y-1";

  return (
    <div className={`${cardBase} ${cardStyle}`}>
      {/* IMAGE AREA */}
      <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900">
        {product.image ? (
            // REAL IMAGE FROM SUPABASE
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        ) : (
            // FALLBACK CSS GRADIENT (If no image)
            <div className="h-full w-full bg-gradient-to-br from-sky-900/20 via-cyan-900/10 to-slate-900/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(56,189,248,0.1),transparent_50%)]" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="h-20 w-20 rotate-12 rounded-[36%] border border-white/10 bg-white/5 shadow-inner shadow-white/20 backdrop-blur-md" />
                  <Gem className="absolute bottom-3 right-3 h-5 w-5 text-blue-400/80" />
                </div>
            </div>
        )}

        {/* BADGES */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.bestSeller && <Badge>Best seller</Badge>}
          {product.tripleEx && <Badge>Always 3× Excellent</Badge>}
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-1 flex-col gap-3">
         <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-sky-300">{product.type}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{product.name}</h3>
        </div>
         <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200/90">
          <div className="space-y-1">
             <div className="flex items-center justify-between"><span className="text-slate-400">{t('shape')}</span><span>{product.shape}</span></div>
             <div className="flex items-center justify-between"><span className="text-slate-400">Carat</span><span>{product.carat.toFixed(2)} ct</span></div>
          </div>
          <div className="space-y-1">
             <div className="flex items-center justify-between"><span className="text-slate-400">{t('colour')}</span><span>{product.color}</span></div>
             <div className="flex items-center justify-between"><span className="text-slate-400">{t('clarity')}</span><span>{product.clarity}</span></div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-[11px] text-slate-400">{t('from')}</p>
            <p className="text-lg font-semibold text-white">CHF {product.price.toLocaleString("de-CH")}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {onOpenBuilder && (
              <LiquidButton 
                label={t('designJewel')} 
                icon={<Gem className="h-3 w-3" />} 
                onClick={() => onOpenBuilder(product)} 
                size="small"
              />
            )}
            <LiquidButton 
              variant="primary"
              label={t('addToBasket')} 
              icon={<ShoppingCart className="h-3 w-3" />} 
              onClick={(e) => onAddToCart(product, e)} 
              size="small"
              className="!px-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}