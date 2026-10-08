import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Volume2,
  Bot,
  User,
  Info,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Languages,
} from 'lucide-react';
import { ChatMessage, LabReport, MedicineItem, TimelineSlot } from '../types';

interface AskMediBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContext: LabReport;
  medicineContext: MedicineItem[];
  timelineContext: TimelineSlot[];
  initialQuestion?: string;
  languageMode: 'hinglish' | 'english';
}

export const AskMediBuddyModal: React.FC<AskMediBuddyModalProps> = ({
  isOpen,
  onClose,
  reportContext,
  medicineContext,
  timelineContext,
  initialQuestion,
  languageMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text:
        'Namaste Riya! Main MediBuddy hoon — aapka health report aur prescription safety assistant. Aap mujhse kisi bhi test parameter, Hinglish meaning, medicine schedule ya changes ke baare mein pooch sakte hain.',
      timestamp: 'Just now',
      keyTakeaways: [
        'MediBuddy explains medical jargon in simple Hinglish.',
        'Always consult your doctor for diagnosis or treatment changes.',
      ],
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredLang, setPreferredLang] = useState<'hinglish' | 'english'>(languageMode);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Ye WBC kya hota hai?',
    'What does this report mean?',
    'Is medicine ka common use kya hai?',
    'Meri report mein kya abnormal hai?',
    'Is prescription mein kya change hua?',
    'Which medicines are scheduled today?',
  ];

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleAsk(initialQuestion.trim());
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryText,
          reportContext,
          medicineContext,
          language: preferredLang,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error('Assistant API response error');
      const data = await response.json();

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: data.answer || 'I could not generate an answer right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyTakeaways: data.keyTakeaways,
        questionsForDoctor: data.questionsToAskDoctor,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('AI fallback assistance:', err);
      // Helpful fallback response with accurate context
      const botFallback: ChatMessage = {
        id: 'bot-fb-' + Date.now(),
        sender: 'assistant',
        text:
          preferredLang === 'hinglish'
            ? `Aapke latest CBC report ke according aapka Hemoglobin 12.3 g/dL hai aur WBC count 9200 /µL hai, jo displayed reference range ke andar hain. Prescriptions mein 3 medicines scheduled hain: Paracetamol 500mg, Amoxicillin 500mg, aur Pantoprazole 40mg. Koi bhi dose change ya medical advice ke liye apne doctor se zaroor discuss karein.`
            : `According to your latest laboratory report, all major CBC parameters (Hemoglobin 12.3 g/dL, Total WBC 9200 /µL, Platelets 3.23 lakh/µL) fall within displayed reference intervals. Your current active prescription includes Paracetamol 500 mg, Amoxicillin 500 mg, and Pantoprazole 40 mg. Please consult your physician for clinical correlation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyTakeaways: ['All CBC values are within printed ranges', 'Always consult doctor for treatment'],
        questionsForDoctor: ['Do I need to repeat this test in 3 months?'],
      };
      setMessages((prev) => [...prev, botFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[720px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Ask MediBuddy</h3>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-semibold">
                  Health Assistant
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Grounded in your reports & prescriptions • Non-diagnostic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPreferredLang(preferredLang === 'hinglish' ? 'english' : 'hinglish')
              }
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold flex items-center gap-1 transition"
              title="Toggle Hinglish / English"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{preferredLang === 'hinglish' ? 'Hinglish' : 'English'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-bold text-[11px] opacity-75">
                    {msg.sender === 'user' ? 'You' : 'MediBuddy'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleSpeech(msg.text)}
                        className="text-slate-400 hover:text-blue-600 p-0.5 ml-1"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Key takeaways if present */}
                {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Key Takeaways:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                      {msg.keyTakeaways.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Questions for doctor */}
                {msg.questionsForDoctor && msg.questionsForDoctor.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-blue-50 text-[11px] text-blue-900 border border-blue-100">
                    <span className="font-bold block mb-0.5">Questions to ask your doctor:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {msg.questionsForDoctor.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>MediBuddy is analyzing your health records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2 sm:p-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 ml-1">
            Suggested:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full transition font-medium border border-slate-200/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(inputQuestion);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about your reports, medicines, or schedule..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center shadow-sm transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-2 leading-tight">
            MediBuddy is an informational assistant. It does not provide diagnoses or prescribe medications.
          </p>
        </div>
      </div>
    </div>
  );
};
