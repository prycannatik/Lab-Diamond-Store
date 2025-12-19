// src/components/Icons.jsx
import React, { useState, useRef, useEffect } from "react";
import { Diamond, MessageCircle, Send, X, Sparkles, ChevronRight } from "lucide-react";
import { CLARITY_ORDER, DIAMOND_SHAPES } from "../constants";

// --- 1. Badge Component ---
export function Badge({ children }) {
  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md";
  const style = "border border-white/10 bg-white/5 text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
  return (
    <span className={`${base} ${style}`}>
      <Diamond className="h-3 w-3" />
      {children}
    </span>
  );
}

// --- 2. Flag Icon ---
export function FlagIcon({ lang, className }) {
  if (lang === 'en') {
    return (
      <svg viewBox="0 0 60 30" className={className}>
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="white" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    )
  }
  if (lang === 'de') {
    return (
      <svg viewBox="0 0 5 3" className={className}>
        <rect width="5" height="3" y="0" fill="black"/>
        <rect width="5" height="2" y="1" fill="#DD0000"/>
        <rect width="5" height="1" y="2" fill="#FFCC00"/>
      </svg>
    )
  }
  if (lang === 'fr') {
    return (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" x="0" fill="#002395"/>
        <rect width="1" height="2" x="1" fill="#fff"/>
        <rect width="1" height="2" x="2" fill="#ED2939"/>
      </svg>
    )
  }
  if (lang === 'it') {
    return (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" x="0" fill="#009246"/>
        <rect width="1" height="2" x="1" fill="#fff"/>
        <rect width="1" height="2" x="2" fill="#CE2B37"/>
      </svg>
    )
  }
  return null;
}

// --- 3. Shape Icon ---
export function ShapeIcon({ shape, active }) {
  const strokeClass = active ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "text-slate-500 opacity-50";
  const fillClass = active ? "fill-blue-400/20" : "fill-transparent";
  const groupProps = shape === "Pear" ? { transform: "translate(0, 1.5)" } : {};

  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 transition-all duration-300 ${strokeClass} ${fillClass}`} stroke="currentColor" strokeWidth="1.4">
      <g {...groupProps}>
        {shape === "Round" && <><circle cx="12" cy="12" r="7" className={fillClass} /><circle cx="12" cy="12" r="7" fill="none" /></>}
        {shape === "Oval" && <><ellipse cx="12" cy="12" rx="8" ry="5" className={fillClass} /><ellipse cx="12" cy="12" rx="8" ry="5" fill="none" /></>}
        {shape === "Princess" && <><rect x="6.5" y="6.5" width="11" height="11" className={fillClass} /><rect x="6.5" y="6.5" width="11" height="11" fill="none" /></>}
        {shape === "Emerald" && <path d="M9 4.5h6l3 3v9l-3 3H9l-3-3v-9z" className={fillClass} />}
        {shape === "Cushion" && <rect x="6.5" y="6.5" width="11" height="11" rx="3" ry="3" className={fillClass} />}
        {shape === "Pear" && <path d="M12 3.5C14.4 6.7 17 9 17 12a5 5 0 1 1-10 0c0-3 2.6-5.3 5-8.5z" className={fillClass} />}
        {shape === "Radiant" && <path d="M10 4.5h4l3 3v5.5l-3 3H10l-3-3V7.5z" className={fillClass} />}
        {shape === "Asscher" && <path d="M8.5 4.5h7l3 3v7l-3 3h-7l-3-3v-7z" className={fillClass} />}
      </g>
    </svg>
  );
}

// --- 4. Clarity Icon ---
export function ClarityIcon({ clarity, active }) {
  const rank = CLARITY_ORDER.indexOf(clarity);
  return (
    <span className="flex items-center gap-[3px]">
      {CLARITY_ORDER.map((level, idx) => {
        const filled = idx <= rank;
        const filledClass = filled 
          ? (active ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-slate-400") 
          : "bg-white/10";
        
        return <span key={level} className={`h-2.5 w-1 rounded-full transition-all duration-300 ${filledClass}`} />;
      })}
    </span>
  );
}

// --- 5. Color Icon ---
export function ColorIcon({ color, active }) {
  let gradientClass = "from-slate-600 to-slate-400";
  if (color === "D") gradientClass = "from-white to-slate-200";
  if (color === "E") gradientClass = "from-slate-200 to-slate-400";
  if (color === "F") gradientClass = "from-slate-300 to-slate-500";
  return <span className={`h-3 w-8 rounded-full bg-gradient-to-r ${gradientClass} ${active ? "shadow-[0_0_10px_rgba(100,180,255,0.6)] ring-1 ring-white/50" : "opacity-30"}`} />;
}

// --- 6. Liquid Button ---
export function LiquidButton({ 
  label, 
  children, 
  active, 
  onClick, 
  icon, 
  className = "", 
  variant = "default",
  fullWidth = false,
  size = "default",
  ...rest
}) {
  const base = `relative flex items-center justify-center gap-2 rounded-full transition-all duration-500 group overflow-hidden ${fullWidth ? 'w-full' : ''} ${className}`;

  const inactive = `
    bg-slate-900/40 border border-white/5 text-slate-400
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-2px_10px_0_rgba(0,0,0,0.5)]
    hover:bg-white/5 hover:text-white hover:border-white/20 
    hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_0_15px_0_rgba(255,255,255,0.05)]
  `;
  
  const activeStyle = `
    bg-blue-600/40 text-white border border-blue-400/50
    shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.5),inset_0_0_20px_0_rgba(60,100,255,0.6),0_0_20px_0_rgba(60,100,255,0.4)]
  `;

  const primaryStyle = `
    font-semibold text-white
    shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.4),0_4px_15px_rgba(37,99,235,0.4)]
    hover:-translate-y-0.5
    bg-blue-600/80 border border-blue-300/50 hover:bg-blue-500
  `;

  let appliedStyle = inactive;
  if (active) appliedStyle = activeStyle;
  if (variant === "primary") appliedStyle = primaryStyle;

  let padding = "px-5 py-2 text-xs font-semibold";
  if (variant === "primary") padding = "px-6 py-2.5 text-xs font-semibold";
  if (size === "small") padding = "px-3 py-1.5 text-[11px] font-medium";

  return (
    <button onClick={onClick} className={`${base} ${appliedStyle} ${padding} backdrop-blur-xl`} type="button" {...rest}>
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent opacity-100 pointer-events-none" />
      <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t ${active ? 'from-blue-500/30' : 'from-white/5'} to-transparent opacity-100 pointer-events-none`} />

      <div className="relative z-10 flex items-center gap-2">
        {icon && <span className="flex items-center">{icon}</span>}
        {!icon && !children && variant === 'default' && (
            <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? "bg-white shadow-[0_0_8px_white]" : "bg-slate-500 shadow-inner"}`} />
        )}
        <span className="tracking-wide">{label || children}</span>
      </div>
    </button>
  );
}

// --- 7. Liquid Toggle ---
export function LiquidToggle({ options, activeValue, onChange }) {
  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-slate-900/40 p-1 shadow-inner backdrop-blur-xl">
      <div 
        className="absolute top-1 bottom-1 rounded-full bg-blue-600/40 border border-blue-400/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.5),inset_0_0_20px_0_rgba(60,100,255,0.6),0_0_20px_0_rgba(60,100,255,0.4)] transition-all duration-300 ease-out"
        style={{
            width: `calc((100% - 8px) / ${options.length})`,
            left: `calc(4px + (100% - 8px) / ${options.length} * ${options.findIndex(o => o.value === activeValue)})`
        }}
      />
      
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeValue === opt.value ? "text-white text-shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// --- 8. Icon Button ---
export function IconButton({ icon: Icon, badge, label, onClick }) {
    const base = "relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 overflow-hidden group backdrop-blur-md";
    const darkStyle = `
      bg-slate-900/40 border-white/5 text-slate-400 
      hover:bg-white/5 hover:text-white hover:border-white/20
      shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
    `;
    
    return (
      <button onClick={onClick} className={`${base} ${darkStyle}`} aria-label={label} type="button">
        <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/10 to-transparent opacity-100 pointer-events-none" />
        <Icon className="relative z-10 h-4 w-4" />
        {badge > 0 && <span className="absolute -right-1 -top-1 z-20 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.6)] border border-white/20">{badge}</span>}
      </button>
    );
}

// --- 9. Ring Preview ---
export function RingPreview({ setting, active }) {
  const base = "flex h-20 w-full flex-col items-center justify-center rounded-2xl border transition-all duration-500 relative overflow-hidden group";
  
  const activeClass = "border-blue-400/50 bg-blue-600/20 shadow-[inset_0_0_20px_rgba(60,100,255,0.3)]";
  const inactiveClass = "border-white/5 bg-slate-900/30 hover:bg-white/5 hover:border-white/20";
  
  return (
    <div className={`${base} ${active ? activeClass : inactiveClass}`}>
       <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/5 to-transparent opacity-100 pointer-events-none" />
       
       <div className="relative z-10 flex flex-col items-center">
        <div className={`mb-2 h-8 w-12 rounded-lg backdrop-blur-md shadow-inner transition-all duration-300 ${active ? "bg-blue-400/20 border-blue-300/40" : "bg-white/5 border-white/5"}`} style={{ borderWidth: 1 }} />
        <span className={`text-[9px] uppercase tracking-widest font-semibold transition-colors duration-300 ${active ? "text-blue-100" : "text-slate-500"}`}>{setting}</span>
      </div>
    </div>
  );
}

// --- 10. Chatbot Component ---
// UPDATED: Accepts 'products' as a prop to avoid importing the deleted 'PRODUCTS' constant
function QuickReplyOptions({ options, onSelect }) {
  return (
    <div className="flex flex-col items-end gap-2 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="rounded-full border border-blue-500/30 bg-blue-900/20 px-3 py-1.5 text-[10px] font-semibold text-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all active:scale-95"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Chatbot({ t, products = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [flowState, setFlowState] = useState("HOME");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      resetToHome();
    }
  }, [t]);

  useEffect(() => {
    if(scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const getMainMenuOptions = () => [
    { id: 'track_order', label: t('chatOptOrder') },
    { id: 'check_stock', label: t('chatOptStock') },
    { id: 'education', label: t('chatOptEdu') },
    { id: 'policies', label: t('chatOptPolicy') },
    { id: 'human', label: t('chatOptAgent') }
  ];

  const resetToHome = () => {
    setFlowState("HOME");
    addSystemMessage(t('chatWelcome'), getMainMenuOptions());
  };

  const addSystemMessage = (text, options = null) => {
    setMessages(prev => [...prev, { role: 'system', text, options }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
  };

  const handleOptionSelect = (option) => {
    addUserMessage(option.label);
    processInput(option.id, option.label, true);
  };

  const handleSend = () => {
    if(!input.trim()) return;
    const text = input;
    setInput("");
    addUserMessage(text);
    processInput(text, text, false);
  };

  const processInput = (rawId, rawText, isOption) => {
    setIsTyping(true);
    const lowerText = rawText.toLowerCase();

    setTimeout(() => {
        let response = "";
        let nextOptions = null;
        let nextState = flowState;

        if (lowerText.includes("menu") || lowerText.includes("start") || lowerText.includes("reset") || rawId === 'chatOptMain') {
            resetToHome();
            setIsTyping(false);
            return;
        }

        switch (flowState) {
            case "HOME":
                if (rawId === 'track_order' || lowerText.includes('order') || lowerText.includes('track')) {
                    response = t('chatAskOrder');
                    nextState = "ORDER_TRACKING";
                } else if (rawId === 'check_stock' || lowerText.includes('stock')) {
                    response = t('chatAskShape');
                    nextOptions = DIAMOND_SHAPES.slice(0, 5).map(s => ({ id: `shape_${s}`, label: s }));
                    nextState = "INVENTORY";
                } else if (rawId === 'education' || lowerText.includes('learn')) {
                    response = t('chatEduIntro');
                    nextOptions = [
                        { id: 'edu_cut', label: 'Cut' },
                        { id: 'edu_color', label: 'Color' },
                        { id: 'edu_clarity', label: 'Clarity' }
                    ];
                    nextState = "EDUCATION";
                } else if (rawId === 'policies' || lowerText.includes('shipping') || lowerText.includes('return')) {
                    response = t('chatPolicyShip') + "\n\n" + t('chatPolicyReturn');
                    nextOptions = [{ id: 'main_menu', label: t('chatOptMain') }];
                    nextState = "HOME";
                } else if (rawId === 'human' || lowerText.includes('human') || lowerText.includes('agent')) {
                    response = t('chatAgent');
                    nextOptions = [{ id: 'main_menu', label: t('chatOptMain') }];
                    nextState = "HOME";
                } else {
                    response = "I can help with Orders, Stock, Education, or Policies. Please select an option.";
                    nextOptions = getMainMenuOptions();
                }
                break;

            case "ORDER_TRACKING":
                const orderMatch = rawText.match(/#?\d{4}/);
                if (orderMatch) {
                    response = t('chatFoundOrder');
                    nextOptions = [{ id: 'main_menu', label: t('chatOptMain') }];
                    nextState = "HOME";
                } else {
                    response = t('chatErrOrder');
                    nextState = "ORDER_TRACKING";
                    nextOptions = [{ id: 'cancel_order', label: t('cancel') }];
                    if (rawText.toLowerCase().includes('cancel')) resetToHome();
                }
                break;

            case "INVENTORY":
                // UPDATED: Check passed 'products' prop instead of static list
                const shape = DIAMOND_SHAPES.find(s => rawText.toLowerCase().includes(s.toLowerCase()));
                if (shape) {
                    // Safety check in case products prop is empty
                    const availableProducts = products || [];
                    const count = availableProducts.filter(p => p.shape === shape).length;
                    
                    if (count > 0) {
                        const cheapest = Math.min(...availableProducts.filter(p => p.shape === shape).map(p => p.price));
                        response = `${shape}: ${t('chatStockResult').replace('890', cheapest)}`;
                    } else {
                         // Fallback message if no stock logic (or no db connection yet)
                        response = `We have limited stock of ${shape} diamonds right now. Please check the main grid.`;
                    }
                    nextOptions = [{ id: 'check_stock', label: t('chatOptStock') }, { id: 'main_menu', label: t('chatOptMain') }];
                    nextState = "HOME";
                } else {
                    response = "I didn't recognize that shape. Please choose one:";
                    nextOptions = DIAMOND_SHAPES.slice(0, 4).map(s => ({ id: `shape_${s}`, label: s }));
                }
                break;

            case "EDUCATION":
                if (rawText.toLowerCase().includes('cut')) response = t('chatEduCut');
                else if (rawText.toLowerCase().includes('color')) response = t('chatEduColor');
                else if (rawText.toLowerCase().includes('clarity')) response = t('chatEduClarity');
                else response = t('chatEduIntro');
                
                nextOptions = [
                    { id: 'edu_cut', label: 'Cut' },
                    { id: 'edu_color', label: 'Color' },
                    { id: 'edu_clarity', label: 'Clarity' },
                    { id: 'main_menu', label: t('chatOptMain') }
                ];
                break;

            default:
                resetToHome();
                return;
        }

        if (response) {
            setFlowState(nextState);
            addSystemMessage(response, nextOptions);
        }
        setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {isOpen && (
            <div className="w-[calc(100vw-2rem)] sm:w-80 rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] backdrop-blur-2xl ring-1 ring-white/5 animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[80vh] overflow-hidden">
                <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                            <Sparkles size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{t('chatTitle')}</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-1"><X size={16}/></button>
                </div>
                
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700 min-h-[250px]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[11px] leading-relaxed whitespace-pre-wrap shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-white/5'}`}>
                                {msg.text}
                            </div>
                            {msg.role === 'system' && msg.options && (
                                <QuickReplyOptions options={msg.options} onSelect={handleOptionSelect} />
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl px-3 py-3 bg-slate-800 border border-white/5 flex gap-1 items-center h-9">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }}/>
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }}/>
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }}/>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative shrink-0">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('chatPlaceholder')}
                        className="w-full h-10 rounded-full border border-white/10 bg-slate-950/50 pl-4 pr-10 text-xs text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none transition-colors shadow-inner"
                    />
                    <button onClick={handleSend} className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm">
                        <Send size={12} />
                    </button>
                </div>
            </div>
        )}

        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-blue-400 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600 hover:text-white ${isOpen ? 'rotate-90 opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
        >
            <MessageCircle size={24} className="fill-current" />
            
            {/* Liquid Glass Red Dot */}
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_5px_rgba(220,38,38,0.5)] border border-red-300/40 animate-pulse">
                <span className="absolute inset-0 rounded-full bg-white/20 blur-[1px]" />
            </span>
        </button>
    </div>
  );
}