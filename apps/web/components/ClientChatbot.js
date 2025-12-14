import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function ClientChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI property assistant. Looking for something specific?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
      if (!input.trim()) return;
      const userMsg = { id: Date.now(), text: input, sender: 'user' };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      // Mock AI Response
      setTimeout(() => {
          setMessages(prev => [...prev, {
              id: Date.now() + 1,
              text: "That sounds great! I'll filter properties matching your criteria. Would you like to schedule a site visit?",
              sender: 'bot'
          }]);
      }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-transform hover:scale-105 flex items-center justify-center"
          >
              <MessageSquare className="w-6 h-6" />
          </button>
      )}

      {/* Chat Window */}
      {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden border border-gray-100 flex flex-col h-[500px]">
              {/* Header */}
              <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                  <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-bold">AI Assistant</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'}`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 mr-2"
                  />
                  <button onClick={handleSend} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full">
                      <Send className="w-5 h-5" />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
