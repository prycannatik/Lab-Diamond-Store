// src/components/JewelryBuilderModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  COLOR_DESCRIPTIONS, CLARITY_DESCRIPTIONS, 
  SETTING_OPTIONS, EARRING_SETTINGS, 
  METAL_OPTIONS, SIZE_OPTIONS, BACKING_OPTIONS,
  SETTING_PRICES, METAL_PRICES, SETTING_DESCRIPTIONS,
} from "../constants";
import { RingPreview, LiquidButton, IconButton, LiquidToggle } from "./Icons";

export default function JewelryBuilderModal({ open, diamond, config, onChangeConfig, onClose, onAdd, t }) {
  if (!open || !diamond) return null;

  const [mode, setMode] = useState("ring");

  useEffect(() => {
    if(open) setMode("ring"); 
  }, [open]);

  const settingsList = mode === "ring" ? SETTING_OPTIONS : EARRING_SETTINGS;
  
  // Fallback logic
  const currentSetting = config.setting;
  const validSetting = settingsList.includes(currentSetting) ? currentSetting : settingsList[0];
  
  // Calculate Price
  const settingPrice = SETTING_PRICES[validSetting] || 0;
  const metalPrice = METAL_PRICES[config.metal] || 0;
  const estimatedPrice = diamond.price + settingPrice + metalPrice;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    const newDefaults = newMode === 'ring' ? SETTING_OPTIONS[0] : EARRING_SETTINGS[0];
    onChangeConfig("setting", newDefaults);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-[11px] text-slate-100 shadow-2xl shadow-black overflow-hidden backdrop-blur-xl">
        
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300 drop-shadow-sm">{t('builderTitle')}</p>
            <p className="text-xs text-slate-400">{t('builderDesc')}</p>
          </div>
          <IconButton icon={X} onClick={onClose} />
        </div>

        {/* TYPE TOGGLE: Using Liquid Toggle */}
        <div className="mb-4">
            <LiquidToggle 
                options={[
                    { value: 'ring', label: t('typeRing') },
                    { value: 'earring', label: t('typeEarring') }
                ]}
                activeValue={mode}
                onChange={handleModeChange}
            />
        </div>

        {/* Centre stone summary */}
        <div className="rounded-2xl p-3 text-[10px] backdrop-blur-md bg-slate-900/40 border border-white/5 mb-3 shadow-inner">
          <p className="mb-1 text-[11px] font-semibold text-slate-300">{t('centerStone')}</p>
          <p className="text-slate-100">
            {diamond.carat.toFixed(2)} ct {diamond.shape} · {COLOR_DESCRIPTIONS[diamond.color]} · {CLARITY_DESCRIPTIONS[diamond.clarity]}
          </p>
        </div>

        {/* Builder grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Left column: Settings */}
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold text-slate-300">{t('settingStyle')}</p>
              <div className="grid grid-cols-2 gap-2">
                {settingsList.map((s) => {
                  const active = validSetting === s;
                  return (
                    <button 
                        key={s} 
                        type="button" 
                        onClick={() => onChangeConfig("setting", s)} 
                        className={`relative group flex flex-col gap-1 rounded-2xl border px-3 py-2 text-left transition-all duration-500 overflow-hidden 
                        ${active ? "border-blue-400/50" : "border-white/5 hover:border-white/20"}
                        `}
                    >
                       <div className={`absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}>
                           <div className="absolute inset-0 bg-blue-600/20" />
                           <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                       </div>
                       <div className="relative z-10">
                        <div className="mb-2 w-full"><RingPreview setting={s} active={active} /></div>
                        <p className={`text-[10px] font-semibold transition-colors duration-300 ${active ? "text-white drop-shadow-sm" : "text-slate-300"}`}>{s}</p>
                        <p className="mt-0.5 text-[9px] text-slate-400 line-clamp-2">{SETTING_DESCRIPTIONS[s]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Metal & Options */}
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold text-slate-300">{t('metal')}</p>
              <div className="flex flex-wrap gap-2">
                {METAL_OPTIONS.map((m) => (
                  <LiquidButton key={m} label={m} active={config.metal === m} onClick={() => onChangeConfig("metal", m)} size="small" />
                ))}
              </div>
            </div>
            
            {mode === "ring" ? (
                <div>
                <p className="mb-1 text-[10px] font-semibold text-slate-300">{t('ringSize')}</p>
                <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((s) => (
                    <LiquidButton key={s} label={s} active={config.size === s} onClick={() => onChangeConfig("size", s)} size="small" />
                    ))}
                </div>
                </div>
            ) : (
                <div>
                <p className="mb-1 text-[10px] font-semibold text-slate-300">{t('backingType')}</p>
                <div className="flex flex-wrap gap-2">
                    {BACKING_OPTIONS.map((b) => (
                    <LiquidButton key={b} label={b} active={config.backing === b} onClick={() => onChangeConfig("backing", b)} size="small" />
                    ))}
                </div>
                </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px]">
          <div className="text-slate-100">
            <p className="text-[10px] text-slate-400">{t('estPrice')}</p>
            <p className="text-base font-semibold text-white drop-shadow-sm">CHF {estimatedPrice.toLocaleString("de-CH")}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LiquidButton label={t('addToCart')} variant="primary" onClick={() => onAdd(mode, validSetting, estimatedPrice)} className="w-full sm:w-auto" />
            <button type="button" onClick={onClose} className="text-[10px] text-slate-400 hover:text-slate-200">{t('cancel')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}