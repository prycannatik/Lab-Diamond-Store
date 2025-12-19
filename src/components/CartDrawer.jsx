// src/components/CartDrawer.jsx
import React from "react";
import { X, Trash2 } from "lucide-react";
import { CLARITY_DESCRIPTIONS, COLOR_DESCRIPTIONS } from "../constants";
import Stepper, { Step } from "./Stepper";
import { LiquidButton, IconButton } from "./Icons";

// Row for a single item in the cart
function CartItemRow({ item, onChangeQty, onRemove }) {
  const { product, qty } = item;
  
  // Pure Dark Styles
  const rowStyle = "bg-slate-900/40 border-white/5 text-slate-200 hover:bg-white/5";

  return (
    <div className={`flex items-start gap-3 rounded-2xl p-3 text-xs border backdrop-blur-md transition-colors ${rowStyle}`}>
      
      {/* IMAGE THUMBNAIL LOGIC */}
      {product.image ? (
        <img 
          src={product.image} 
          alt={product.name} 
          className="mt-1 h-10 w-10 rounded-xl object-cover shadow-inner border border-white/10" 
        />
      ) : (
        <div className="mt-1 h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-inner border border-white/10" />
      )}

      <div className="flex-1">
        <p className="text-[11px] font-semibold text-white">{product.name}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{product.shape} · {product.carat.toFixed(2)} ct · {COLOR_DESCRIPTIONS[product.color]} · {CLARITY_DESCRIPTIONS[product.clarity]}</p>
        
        <div className="mt-2 flex items-center justify-between">
          {/* Qty Controls */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
            <button onClick={() => onChangeQty(Math.max(1, qty - 1))} className="h-5 w-5 rounded-full hover:bg-white/10 text-xs text-slate-300">−</button>
            <span className="min-w-[1rem] text-center text-[10px] font-medium text-white">{qty}</span>
            <button onClick={() => onChangeQty(qty + 1)} className="h-5 w-5 rounded-full hover:bg-white/10 text-xs text-slate-300">+</button>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="font-semibold text-[11px] text-blue-300">CHF {(product.price * qty).toLocaleString("de-CH")}</p>
            <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", placeholder }) {
    return (
        <div className="grid gap-1">
            <label className="text-[10px] text-slate-400 font-medium ml-1">{label}</label>
            <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-slate-950/50 px-3 text-[11px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all shadow-inner"
            placeholder={placeholder || label}
            />
        </div>
    )
}

export default function CartDrawer({ open, onClose, items, cartSubtotal, shipping, total, checkoutStep, setCheckoutStep, shippingDetails, onChangeShipping, paymentDetails, onChangePayment, onUpdateQty, onRemoveItem, onPlaceOrder, orderPlaced, t }) {
  if (!open) return null;

  function handleBeforeStepChange(current) {
    if (current === 2) {
        const required = ["firstName", "lastName", "email", "street", "city", "postalCode"];
        if (required.some((f) => !shippingDetails[f])) { alert("Please fill in all required shipping fields."); return false; }
    }
    if (current === 3 && paymentDetails.method === "card") {
        const required = ["cardName", "cardNumber", "expiry", "cvc"];
        if (required.some((f) => !paymentDetails[f])) { alert("Please fill in all required card details."); return false; }
    }
    return true;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-stretch justify-end bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-slate-950/95 text-white shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Header */}
        <div className="px-5 pt-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 drop-shadow-sm">{t('basket')}</p>
            <p className="text-[11px] text-slate-500">{items.length} items</p>
          </div>
          <IconButton icon={X} onClick={onClose} />
        </div>

        {items.length === 0 && !orderPlaced ? (
           <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-500">
             <div className="h-12 w-12 rounded-full bg-slate-900/50 mb-3 flex items-center justify-center text-2xl border border-white/5">💎</div>
             <p>{t('emptyBasket')}</p>
           </div>
        ) : orderPlaced ? (
           <div className="px-5 mt-6 flex-1 flex flex-col items-center justify-center">
              <div className="rounded-3xl border border-blue-400/30 bg-blue-900/10 p-6 text-center backdrop-blur-md">
                  <div className="mb-3 mx-auto h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">✓</div>
                  <p className="font-semibold text-blue-200 text-sm mb-1">{t('orderConfirmed')}</p>
                  <p className="text-xs text-slate-400 mb-4">{t('thankYou')}</p>
                  <LiquidButton label={t('close')} onClick={onClose} variant="primary" className="w-full" />
              </div>
           </div>
        ) : (
            <div className="flex-1 overflow-y-auto">
                <Stepper
                    initialStep={1}
                    forceStep={checkoutStep}
                    onStepChange={(s) => setCheckoutStep(s)}
                    onFinalStepCompleted={onPlaceOrder}
                    beforeStepChange={handleBeforeStepChange}
                    backButtonText={t('back')}
                    nextButtonText={t('checkout')}
                    stepCircleContainerClassName="text-slate-200"
                >
                  {/* STEP 1: BASKET */}
                  <Step>
                      <div className="space-y-3 min-h-[200px]">
                        {items.map((item) => <CartItemRow key={item.product.id} item={item} onChangeQty={(q) => onUpdateQty(item.product.id, q)} onRemove={() => onRemoveItem(item.product.id)} />)}
                      </div>
                      <div className="mt-4 border-t border-white/10 pt-4 text-xs space-y-2">
                          <div className="flex justify-between text-slate-400"><span>{t('subtotal')}</span><span>CHF {cartSubtotal.toLocaleString("de-CH")}</span></div>
                          <div className="flex justify-between text-slate-400"><span>{t('shipping')}</span><span>{shipping === 0 ? "Included" : `CHF ${shipping}`}</span></div>
                          <div className="flex justify-between font-semibold text-sm mt-2 text-white"><span>{t('total')}</span><span>CHF {total.toLocaleString("de-CH")}</span></div>
                      </div>
                  </Step>

                  {/* STEP 2: ADDRESS */}
                  <Step>
                      <div className="rounded-2xl p-4 bg-slate-900/40 border border-white/5">
                          <p className="text-[11px] font-semibold mb-3 text-slate-300 uppercase tracking-wide">{t('shippingAddress')}</p>
                          <div className="grid gap-3">
                              <div className="grid grid-cols-2 gap-3">
                                <InputGroup label={t('firstName')} value={shippingDetails.firstName} onChange={(v) => onChangeShipping("firstName", v)} />
                                <InputGroup label={t('lastName')} value={shippingDetails.lastName} onChange={(v) => onChangeShipping("lastName", v)} />
                              </div>
                              <InputGroup label={t('email')} value={shippingDetails.email} onChange={(v) => onChangeShipping("email", v)} type="email" />
                              <InputGroup label={t('street')} value={shippingDetails.street} onChange={(v) => onChangeShipping("street", v)} />
                              <div className="grid grid-cols-2 gap-3">
                                <InputGroup label={t('postalCode')} value={shippingDetails.postalCode} onChange={(v) => onChangeShipping("postalCode", v)} />
                                <InputGroup label={t('city')} value={shippingDetails.city} onChange={(v) => onChangeShipping("city", v)} />
                              </div>
                          </div>
                      </div>
                  </Step>

                  {/* STEP 3: PAYMENT */}
                  <Step>
                     <div className="rounded-2xl p-4 bg-slate-900/40 border border-white/5">
                        <p className="text-[11px] font-semibold mb-3 text-slate-300 uppercase tracking-wide">{t('paymentMethod')}</p>
                        <div className="flex gap-2 mb-4">
                            {["card", "twint", "bank"].map((method) => (
                                <LiquidButton 
                                    key={method} 
                                    label={method === "card" ? "Card" : method === "twint" ? "TWINT" : "Bank"} 
                                    active={paymentDetails.method === method}
                                    onClick={() => onChangePayment("method", method)}
                                    size="small"
                                    className="flex-1"
                                />
                            ))}
                        </div>
                        
                        {paymentDetails.method === "card" && (
                            <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <InputGroup label={t('cardName')} value={paymentDetails.cardName} onChange={(v) => onChangePayment("cardName", v)} />
                                <InputGroup label={t('cardNumber')} value={paymentDetails.cardNumber} onChange={(v) => onChangePayment("cardNumber", v)} />
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label={t('expiry')} value={paymentDetails.expiry} onChange={(v) => onChangePayment("expiry", v)} placeholder="MM/YY" />
                                    <InputGroup label={t('cvc')} value={paymentDetails.cvc} onChange={(v) => onChangePayment("cvc", v)} type="password" />
                                </div>
                            </div>
                        )}
                     </div>
                  </Step>

                  {/* STEP 4: REVIEW */}
                  <Step>
                      <div className="rounded-2xl p-4 space-y-4 bg-slate-900/40 border border-white/5">
                           <div className="text-[11px] text-slate-300">
                              <p className="mb-1 font-bold text-white border-b border-white/5 pb-1">{t('shipping')}</p>
                              <p>{shippingDetails.firstName} {shippingDetails.lastName}</p>
                              <p>{shippingDetails.street}</p>
                              <p>{shippingDetails.postalCode} {shippingDetails.city}</p>
                           </div>
                           <div className="text-[11px] text-slate-300">
                              <p className="mb-1 font-bold text-white border-b border-white/5 pb-1">{t('checkout')}</p>
                              <p className="capitalize">{paymentDetails.method === 'card' ? 'Credit Card' : paymentDetails.method}</p>
                              <p className="font-bold text-white mt-2 text-sm">{t('total')}: CHF {total.toLocaleString("de-CH")}</p>
                           </div>
                      </div>
                  </Step>
                </Stepper>
            </div>
        )}
      </aside>
    </div>
  );
}