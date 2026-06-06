/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Loader2, Bot, Calendar, Ship, MapPin } from "lucide-react";
import { ChatMessage } from "../types";

interface ConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function Concierge({ isOpen, onClose, onNavigateToTab }: ConciergeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Warm greetings. I am Aurelia, your private Cool Cottages Concierge. Whether you wish to arrange a starlit campfire evening, draft a bespoke scenic wander itinerary, or request special cottage amenities before your arrival, I am at your service. \n\nHow may I elevate your stay today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll chats to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg("");
    setIsLoading(true);

    try {
      const payloadMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error("Butler communications temporarily interrupted.");
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: "I apologize, but my communications with the island office are temporarily experiencing high seas. Let me assure you our teams are tending to it immediately.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    { text: "Draft a 3-day romantic itinerary", icon: Calendar },
    { text: "Tell me about 'The Azure Pearl' Yacht Charter", icon: Ship },
    { text: "What dining experiences can I book?", icon: Bot },
    { text: "Are there helicopter transfers?", icon: MapPin },
  ];

  // Simple Markdown-to-HTML formatter
  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // Bold formatter
      let processed = line;
      
      // Handle Bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      processed = processed.replace(boldRegex, "<strong>$1</strong>");

      // Handle Bullet points starting with "- " or "* "
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().substring(2);
        const boldFormatted = itemText.replace(boldRegex, "<strong>$1</strong>");
        return (
          <li key={lineIdx} className="ml-4 list-disc text-xs md:text-sm text-slate-700 dark:text-slate-200 mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldFormatted }}></li>
        );
      }

      // Default line rendering
      if (line.trim() === "") {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p
          key={lineIdx}
          className="text-xs md:text-sm text-slate-700 dark:text-slate-200 mb-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[550px] bg-[#ffffff]/95 dark:bg-[#0b1c30]/95 backdrop-blur-2xl rounded-2xl shadow-2xl flex flex-col border border-[#001a52]/10 dark:border-white/10 z-50 overflow-hidden animate-fade-in-up">
      {/* Concierge Header */}
      <header className="px-5 py-4 bg-[#001a52] text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-golden/20 rounded-full flex items-center justify-center border border-white/20 animate-pulse">
            <Sparkles className="w-4.5 h-4.5 text-amber-300" />
          </div>
          <div>
            <div className="font-headline-md text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <span>Aurelia</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Online" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#dbe1ff]/80 block">
              Lead Butler & Butler Advisor
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          title="Minimize Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#f8f9ff]/50 dark:bg-slate-900/40">
        {messages.map((m) => {
          const isMe = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {/* Bot Icon */}
                {!isMe && (
                  <div className="w-7 h-7 bg-[#dbe1ff] text-[#00174a] rounded-full flex items-center justify-center mt-1 text-xs font-bold shadow-sm">
                    A
                  </div>
                )}
                
                <div className={`rounded-2xl p-3.5 shadow-sm ${
                  isMe
                    ? "bg-[#001a52] text-white rounded-tr-none"
                    : "bg-white dark:bg-[#213145] text-[#0b1c30] rounded-tl-none border border-slate-100 dark:border-none"
                }`}>
                  {isMe ? (
                    <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  ) : (
                    <div>{formatMarkdown(m.text)}</div>
                  )}
                  <span className="text-[8px] opacity-60 text-right mt-1 block">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center text-slate-500 text-xs pl-9">
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#819ae7]" />
              <span className="italic font-medium">Aurelia is drafting suggestions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Recommendations Helper */}
      {messages.length === 1 && !isLoading && (
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
            Suggested Consultations
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset.text)}
                  className="flex items-center gap-1.5 p-1.5 text-left border bg-white rounded text-[10px] text-slate-600 hover:border-[#001a52]/40 hover:text-[#001a52] transition-all truncate"
                >
                  <Icon className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{preset.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMsg);
        }}
        className="px-4 py-3 bg-white dark:bg-[#0b1c30] border-t border-[#001a52]/10 dark:border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask Aurelia about stays, experiences..."
          disabled={isLoading}
          className="flex-1 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg py-2.5 px-4 text-xs focus:outline-none focus:bg-white focus:border-[#001a52]/30 dark:focus:border-white/30 text-slate-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || isLoading}
          className="bg-[#001a52] text-white hover:bg-[#0e2f76] disabled:bg-slate-200 disabled:text-slate-400 p-2.5 rounded-lg shadow transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
