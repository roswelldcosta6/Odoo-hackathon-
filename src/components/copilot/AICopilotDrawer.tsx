import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Flame,
  ShieldAlert,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { aiKnowledgeBase } from '../../data/mockData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, currentUser, userLeaveBalance } = useHRMS();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am **Dayflow AI**, your enterprise HR & Policy Copilot.\n\nAsk me anything about company leave policies, salary structures, remote stipends, or ask me to draft formal requests!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isCopilotOpen) return null;

  const promptSuggestions = [
    'How many sick leaves do I have left?',
    'Draft a formal leave reason for medical appointment',
    'What is our policy on remote work and reimbursement?',
    'Run team burnout & overtime anomaly analysis'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Generate AI response based on knowledge base
    setTimeout(() => {
      let matchedResponse = '';
      const lower = query.toLowerCase();

      for (const entry of aiKnowledgeBase) {
        if (entry.keywords.some(k => lower.includes(k))) {
          matchedResponse = entry.response;
          break;
        }
      }

      if (!matchedResponse) {
        if (lower.includes('salary') || lower.includes('payslip')) {
          matchedResponse = `**Dayflow Compensation Breakdown:**\nYour current monthly structure includes 50% Basic, 30% HRA, and 20% Special Allowances with standard statutory deductions. Download your official signed payslip in the **Payroll** tab.`;
        } else {
          matchedResponse = `I found policy information related to your request:\n\n- **Standard Workweek:** 40 hours (Mon-Fri).\n- **Core Sync Hours:** 10:00 AM – 4:00 PM PT.\n- **Support:** You can also contact HR directly via *hr-support@dayflow.io*.`;
        }
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: matchedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-dark/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-float flex flex-col justify-between border-l border-surface-border animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-4 px-5 border-b border-surface-border bg-gradient-to-r from-brand-blue to-accent-cyan text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">Dayflow AI Copilot</h3>
                <span className="text-[9px] bg-white text-brand-blue font-bold px-1.5 py-0.2 rounded">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-white/80">Policy & People Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-brand-light text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 relative group ${
                  msg.sender === 'user'
                    ? 'bg-brand-blue text-white rounded-tr-none'
                    : 'bg-surface-bg border border-surface-border text-slate-dark rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold text-slate-dark mt-1">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('> ')) {
                      return <blockquote key={i} className="pl-2.5 border-l-2 border-brand-blue my-1.5 italic text-slate-dark bg-white/70 p-1.5 rounded-r-lg">{line.replace('> ', '')}</blockquote>;
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[9px] ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-light'}`}>
                    {msg.timestamp}
                  </span>

                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-muted hover:text-brand-blue flex items-center gap-1 transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-accent-mint" />
                          <span className="text-accent-mint font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0 mt-0.5"
                />
              )}
            </div>
          ))}
        </div>

        {/* Suggested Prompts & Input Container */}
        <div className="p-4 border-t border-surface-border bg-white space-y-3">
          
          {/* Quick Prompts Carousel */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-light">
              Suggested Prompts
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {promptSuggestions.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-surface-bg hover:bg-brand-light hover:text-brand-blue border border-surface-border text-[11px] text-slate-dark whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask HR Copilot anything..."
              className="flex-1 bg-surface-bg border border-surface-border text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
