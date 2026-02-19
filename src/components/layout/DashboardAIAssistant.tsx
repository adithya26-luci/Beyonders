import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '@/components/climate/ClimateComponents';
import { Send, Bot, User, Leaf, Clock, Sparkles, X } from 'lucide-react';
import { currentStatus, currentStressScore } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  'Best time for outdoor exercise?',
  'Why is it critical now?',
  'Analyze local micro-climate',
  'Prediction for next 48h',
  'Global comparison',
];

const mockResponses: Record<string, string> = {
  default: `Based on my analysis of **14,203 data points** from your local mesh network and global satellite feeds:

**Current Environmental Status:**
- **Status:** ${currentStatus.toUpperCase()} (Score: ${currentStressScore}/100)
- **Micro-climate:** Heat island effect detected in your block (+2.1°C vs regional avg)
- **Air Quality:** PM2.5 at 87 (Moderate) | NOx levels elevated due to traffic

**My Strategic Recommendation:**
1. **Critical:** Avoid outdoor exposure until 8:00 PM.
2. **Ventilation:** Do NOT open windows yet. Wait for AQI to drop below 50 (expected at 9:30 PM).
3. **Recovery:** Your physiological recovery window opens at 10 PM.

I am monitoring real-time feeds from 3 nearby weather stations. What would you like to analyze?`,
};

function generateResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('exercise') || lower.includes('outdoor')) {
    return `**Outdoor Activity Optimization Analysis**

Accessing biometric & environmental data streams...

🟢 **Optimal Window: 5:30 AM – 7:30 AM (Tomorrow)**
- **Projected Temp:** 23°C (Feels like 25°C)
- **AQI Forecast:** 32 (Excellent)
- **UV Index:** 0-1 (Low)

🟡 **Secondary Window: 8:30 PM – 9:30 PM (Today)**
- **Temp:** 27°C (Cooling trend)
- **Note:** Only light intensity recommended due to residual humidity (75%).

⚠️ **Current Risk:** **High.**
Heat stress probability is **88%** if exercising now. Core body temperature could rise dangerously within 15 mins.

**AI Recommendation:** Shift to indoor strength training for today.`;
  }
  if (lower.includes('critical') || lower.includes('why')) {
    return `**Critical Status Root Cause Analysis**

I have correlated your local sensor data with historical patterns.

**Primary Drivers of "Critical" State:**
1. **Solar Irradiance:** Peaked at 1050 W/m² (Extreme) at 1:15 PM.
2. **Humidity Lock:** A high-pressure system is trapping 82% moisture at ground level.
3. **Urban Heat:** Concrete retention is adding +3.5°C to ambient air temp.

**Data Deviation:**
- Current Temp (39°C) is **2.4σ** (standard deviations) above the 10-year average for this date.
- Energy grid load is at **94% capacity**, risking brownouts.

**Conclusion:** The compound effect of heat + humidity + stagnation is creating a dangerous wet-bulb event.`;
  }
  if (lower.includes('local') || lower.includes('micro') || lower.includes('compare')) {
    return `**Micro-Climate vs Regional Analysis**

Comparing your specific coordinates with the wider metro region:

**Your Location (Zone 4B):**
- **Temp:** 39.2°C 🔴 (+1.8°C vs Airport Station)
- **AQI:** 112 🔴 (+25 vs City Center)
- **Wind Speed:** 0.5 km/h (Stagnant)

**Insight:**
Your area is currently in a "pollution trap" due to low wind shear and building density.

**Action:**
Activate indoor air purification. Do not rely on natural ventilation until wind speed increases (>5 km/h) forecasted for 11:00 PM.`;
  }
  if (lower.includes('tomorrow') || lower.includes('predict') || lower.includes('48h')) {
    return `**48-Hour Predictive Modeling**

Running Ensemble Forecast Model (v4.2)...

**Tomorrow's Outlook:**
- **Max Temp:** 36.5°C (📉 -2.5°C vs today)
- **Rain Probability:** 45% (Light showers expected at 4 PM)
- **Relief:** A cool front is approaching from the North-West.

**Key Windows (Next 24h):**
| Time | Status | Prediction |
|------|--------|------------|
| 20:00 | 🟡 Strained | Sunset cooling begins |
| 23:00 | 🟢 Safe | AQI clears to <50 |
| 06:00 | 🟢 Optimal | Lowest temp (24°C) |
| 13:00 | 🔴 Critical | Peak heat (shaver duration) |

**Long-term trend:** We are entering a 3-day cooling cycle.`;
  }
  if (lower.includes('global') || lower.includes('world')) {
    return `**Global Climate Context**

Contextualizing your local data against global anomalies:

- **Global Avg Temp:** Today is +1.2°C above the pre-industrial baseline.
- **Similar Conditions:** Your current weather matches **Cairo, Egypt** today.
- **Jet Stream:** A wobbly jet stream is causing this stationary heat dome over your region.

**Planetary Health:**
- Global CO₂: 421 ppm
- Arctic Sea Ice: 12% below average

**Relevance:** Large-scale atmospheric blocking patterns suggest this heatwave may persist for 18 more hours before breaking.`;
  }
  // Generic Conversational Responses
  if (lower.match(/^(hi|hello|hey|greetings)/)) {
    return `**Hello!** 👋 

I am online and connected to the climate grid. I can help you with:
- **Real-time environmental analysis**
- **Health & safety recommendations**
- **Forecast modeling**
- **Global climate comparisons**

How can I assist you right now?`;
  }

  if (lower.includes('help') || lower.includes('assist') || lower.includes('what can you do')) {
    return `**I am here to help.** 🛡️

My core capabilities include:
1. **Monitoring:** Real-time tracking of Temp, AQI, and Grid Load.
2. **Analysis:** Identifying root causes of heat stress or pollution spikes.
3. **Prediction:** 48-hour forecasting models for planning safe activities.
4. **Advisory:** personalized health tips based on current conditions.

Try asking: *"Is it safe to go for a run?"* or *"Why is the humidity so high?"*`;
  }

  if (lower.includes('thank') || lower.includes('thanks')) {
    return `**You're welcome!** Stay safe and cool. 💧`;
  }

  if (lower.includes('who are you') || lower.includes('what are you')) {
    return `I am the **Climate Time Assistant**, a specialized AI integrated into your environmental resilience OS. My purpose is to decode complex climate data into actionable insights to protect your health and optimize your daily schedule.`;
  }

  return mockResponses.default;
}

export function DashboardAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm **Climate Time Assistant** 🌍

I have aggregated data from **satellite feeds, local IoT sensors, and historical climate models**.

**Real-time Intelligence:**
- **Status:** ${currentStatus.toUpperCase()}
- **Data Points:** 14,203 analyzed
- **Prediction Confidence:** 92%

How can I assist your climate decisions today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = generateResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMsg]);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🔴/g, '<span class="text-critical">🔴</span>')
      .replace(/🟡/g, '<span class="text-strained">🟡</span>')
      .replace(/🟢/g, '<span class="text-safe">🟢</span>')
      .replace(/\n/g, '<br>')
      .replace(/---/g, '<hr class="border-border my-2">');
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 z-50 hover:shadow-primary/40 transition-shadow"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex-shrink-0 bg-sidebar/50 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Climate Assistant</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                      <p className="text-[10px] text-muted-foreground">Global Grid Active</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/80 backdrop-blur-sm">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'gradient-primary' : 'bg-surface-3'
                    }`}>
                    {msg.role === 'assistant'
                      ? <Leaf className="w-3 h-3 text-primary-foreground" />
                      : <User className="w-3 h-3 text-muted-foreground" />
                    }
                  </div>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'assistant'
                      ? 'card-eco rounded-tl-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                      }`}>
                      {msg.role === 'assistant' ? (
                        <div
                          className="text-muted-foreground [&_strong]:text-foreground"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                        />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-center"
                >
                  <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="card-eco rounded-2xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t border-border flex-shrink-0 bg-sidebar/30 backdrop-blur-md">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-surface-2 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 transition-all flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex-shrink-0 bg-sidebar/50 backdrop-blur-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask connecting to satellite feed..."
                  className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  <Send className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
