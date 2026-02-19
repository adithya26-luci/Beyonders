import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/climate/ClimateComponents';
import { StatusBadge } from '@/components/climate/ClimateComponents';
import { Send, Bot, User, Leaf, Clock, Sparkles } from 'lucide-react';
import { currentStatus, currentStressScore } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  'When is the best time for outdoor exercise today?',
  'Why is the current period critical?',
  'What should my family do right now?',
  'Predict tomorrow\'s climate conditions',
  'How can I reduce my energy footprint today?',
  'Generate a summary of today\'s climate',
];

const mockResponses: Record<string, string> = {
  default: `Based on current conditions (Stress Score: ${currentStressScore}/100, **STRAINED** status), here's my analysis:

**Current Situation:**
- Temperature: 34.2°C with a heat index of 41°C
- Humidity at 78% — above safe threshold
- AQI at 87 — Moderate-Poor air quality
- Indoor CO₂ at 1,240 ppm — above recommended 1,000 ppm

**My Recommendation:**
1. Avoid outdoor activities until **8:00 PM** tonight
2. Increase indoor ventilation if possible
3. Schedule heavy tasks for the **10 PM – 6 AM** recovery window
4. Expect conditions to peak **Critical** around 1–3 PM

Is there anything specific you'd like to know about today's climate schedule?`,
};

function generateResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('exercise') || lower.includes('outdoor')) {
    return `**Best Time for Outdoor Exercise Today:**

🟢 **Morning Window (5:30 – 7:30 AM)** — Optimal
- Temperature: ~23°C, Heat Index: 25°C
- AQI: ~32 (Excellent)
- Humidity: ~65%

🟡 **Evening Window (8:00 – 9:30 PM)** — Acceptable
- Temperature: ~26–28°C, falling
- AQI: ~48 (Good)

⚠️ **Avoid 10 AM – 5 PM** — Heat index exceeds 38°C during this period. Risk of heat exhaustion is high.

**My Suggestion:** If you must exercise outdoors, carry water, wear light clothing, and limit sessions to 30 minutes max during the evening window.`;
  }
  if (lower.includes('critical') || lower.includes('why')) {
    return `**Why This Period Is Critical:**

The Climate Time Engine has classified the current 11 AM–4 PM block as 🔴 **CRITICAL** for the following reasons:

| Factor | Current | Threshold | Deviation |
|--------|---------|-----------|-----------|
| Temperature | 36–39°C | 30°C | +28% |
| Humidity | 80–82% | 70% | +14% |
| AQI | 95–112 | 80 | +24% |
| Heat Index | 41–43°C | 35°C | +22% |
| Energy Demand | 6.8 kW | 5.5 kW | +24% |

**Combined Stress Score: 82/100** — Exceeds Critical threshold of 70.

**Risk Level:** Vulnerable groups (elderly, children, those with respiratory conditions) face significant health risk. Indoor CO₂ at 1,240 ppm also reduces cognitive performance.`;
  }
  if (lower.includes('family') || lower.includes('children') || lower.includes('kids')) {
    return `**Family Action Plan — Right Now:**

🔴 **Current Status: STRAINED → CRITICAL approaching**

**Immediate Actions:**
1. **Children indoors** — No outdoor play until 8 PM tonight
2. **Keep blinds closed** on south and west-facing windows to reduce heat gain
3. **Monitor indoor CO₂** — open a window slightly in rooms with occupants
4. **Hydration** — 250ml water every 30 minutes for all family members

**Today's Safe Windows for Kids:**
- ✅ 5:30–7:30 AM (Passed)
- ✅ 8:00–9:30 PM (Upcoming)

**Appliance Scheduling:**
- Run dishwasher, laundry → After 10 PM
- Oven use → Before 9 AM or after 8 PM
- Air conditioning → Set to 24°C minimum (not lower)

Want me to generate a custom family schedule PDF for today?`;
  }
  if (lower.includes('tomorrow') || lower.includes('predict')) {
    return `**24-Hour Climate Forecast — Tomorrow:**

🤖 *LSTM Model Prediction (Confidence: 74%)*

**Overall Assessment:** Tomorrow will be slightly cooler with a max of **36.5°C** vs today's 39°C.

**Key Windows:**
| Period | Status | Stress Score | Notes |
|--------|--------|-------------|-------|
| 12–6 AM | 🟢 Safe | 15–22 | Excellent recovery night |
| 6–9 AM | 🟢 Safe | 28–35 | Best window for activity |
| 9 AM–12 PM | 🟡 Strained | 45–58 | Moderate caution |
| 12–4 PM | 🔴 Critical | 72–80 | Avoid outdoors |
| 4–8 PM | 🟡 Strained | 55–62 | Cooling begins |
| 8 PM–12 AM | 🟢 Safe | 30–38 | Evening safe window |

**AQI Forecast:** Improving to 65–75 tomorrow (Moderate)
**Rain Probability:** 18%

**Recommendation:** Plan outdoor activities before 9 AM or after 8 PM.`;
  }
  if (lower.includes('energy') || lower.includes('carbon')) {
    return `**Energy & Carbon Reduction Plan — Today:**

🌱 *Personalized for current conditions*

**High-Impact Actions:**

1. **Shift Peak Load** — Move dishwasher, washing machine, EV charging to 10 PM–6 AM
   - *Estimated savings: 2.3 kWh / day*

2. **AC Optimization** — Set to 24°C (not 20°C). Each degree saves ~8% energy
   - *Estimated savings: 1.1 kWh*

3. **Natural Ventilation** — Cross-ventilate during evening window (8 PM – 6 AM)
   - *Reduces AC runtime by ~40%*

4. **Device Standby** — Unplug unused electronics during 11 AM – 4 PM
   - *Saves 0.3–0.8 kWh*

**Your Estimated Daily Carbon Impact:** 4.2 kg CO₂
**With these actions:** 2.8 kg CO₂ (-33%)

Would you like a week-long carbon optimization plan?`;
  }
  if (lower.includes('summary')) {
    return `**Today's Climate Intelligence Summary — ${new Date().toLocaleDateString()}**

---

🌡️ **Peak Temperature:** 39°C (1:00 PM)
💧 **Peak Humidity:** 82%
🌬️ **Max AQI:** 112 (Unhealthy)
⚡ **Peak Energy Load:** 6.8 kW
🔴 **Critical Hours:** 6 (11 AM – 5 PM)
🟡 **Strained Hours:** 8 (8–11 AM, 5–8 PM)
🟢 **Safe Hours:** 10 (12–8 AM, 8–10 PM)

**Most Significant Events:**
- 11:42 AM: Humidity burst (+14% above threshold)
- 12:30 PM: PM2.5 micro-pollution spike (AQI 112)
- 1:15 PM: Energy demand surge (89% grid capacity)

**Climate Resilience Score Today:** 58/100 ⚠️

**AI Recommendation:** Schedule tomorrow's key activities between 5–9 AM. Recovery window tonight looks strong (10 PM onwards).

*Full PDF report available on the Reports page.*`;
  }
  return mockResponses.default;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm **EcoVate Climate Copilot** 🌍

I'm your AI-powered climate intelligence assistant. I have real-time access to your environmental data, ML model outputs, and behavioral patterns.

**Current Status:** ${currentStatus.toUpperCase()} (Score: ${currentStressScore}/100)

Here's what I can help you with:
- 🕐 Explain why periods are safe or critical
- 📅 Suggest optimized activity schedules
- 🌡️ Predict tomorrow's climate conditions
- 💡 Recommend energy and behavioral changes
- 📊 Generate climate reports and summaries

What would you like to know?`,
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
    scrollToBottom();
  }, [messages]);

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
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Climate Copilot</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                <p className="text-xs text-muted-foreground">AI Assistant · Memory Enabled</p>
              </div>
            </div>
          </div>
          <StatusBadge status={currentStatus} score={currentStressScore} size="sm" />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-6 py-3 border-b border-border flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="whitespace-nowrap text-[10px] px-3 py-1.5 rounded-full bg-surface-2 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 transition-all flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
              msg.role === 'assistant' ? 'gradient-primary' : 'bg-surface-3'
            }`}>
              {msg.role === 'assistant'
                ? <Leaf className="w-4 h-4 text-primary-foreground" />
                : <User className="w-4 h-4 text-muted-foreground" />
              }
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant'
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
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                <Clock className="w-2.5 h-2.5" />
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 items-center"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="card-eco rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about climate conditions, schedules, predictions..."
            className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Climate Copilot · Context-aware · Memory enabled · Based on real-time data
        </p>
      </div>
    </div>
  );
}
