import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiX, FiMoreHorizontal, FiZap } from 'react-icons/fi';
import logoSena from '../assets/logo-sena.png';

// Quick action responses based on STIMI mock data
const QUICK_RESPONSES = {
  pendientes: {
    question: '¿Cuáles son mis informes pendientes?',
    answer: '📋 **Informes pendientes para Julio 2026:**\n\n• **Informe GC** (Gestión Contractual - GTH-F-062 V10) → No cargado\n• **Informe GF** (Gestión Financiera) → No cargado\n\n⏰ Fecha límite: **31 de julio de 2026** a las 23:59.\n\nTe recomiendo priorizar la carga del GC, ya que requiere más datos de obligaciones contractuales.',
  },
  cumplimiento: {
    question: '¿Cuál es mi porcentaje de cumplimiento?',
    answer: '📊 **Tu cumplimiento anual 2026:**\n\n• Mayo 2026: ✅ GC Validado · ✅ GF Validado\n• Junio 2026: ✅ GC Validado · ✅ GF Validado\n• Julio 2026: ⏳ GC Pendiente · ⏳ GF Pendiente\n\n**Cumplimiento acumulado: 66.7%** (4 de 6 informes entregados)\n\nSi entregas los 2 informes de Julio antes del cierre, alcanzarás el 100% del semestre.',
  },
  formatos: {
    question: '¿Dónde descargo los formatos GC y GF?',
    answer: '📄 **Formatos disponibles:**\n\n• **GC (Gestión Contractual):** Formato GTH-F-062 Versión 10. Descárgalo desde la sección "Mis Informes" → "Cargar Informe" → selecciona tipo GC.\n\n• **GF (Gestión Financiera):** Formato de soporte financiero mensual. Disponible en la misma sección, tipo GF.\n\n💡 Ambos formatos deben ser firmados digitalmente antes de subirlos a la plataforma.',
  },
};

export default function AsistenteWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola, Wilson! 👋 Soy tu asistente virtual de STIMI.\n\n¿Deseas consultar tus informes pendientes, tu cumplimiento anual, o dónde descargar los formatos GC/GF?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Don't close if clicking the floating button itself
        const fab = document.getElementById('stimi-assistant-fab');
        if (fab && fab.contains(e.target)) return;
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const addAIResponse = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleQuickAction = (key) => {
    const action = QUICK_RESPONSES[key];
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: action.question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    addAIResponse(action.answer);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInputValue('');

    addAIResponse('He recibido tu consulta. Como asistente simulado en esta fase de desarrollo, te recomiendo usar los botones de acceso rápido para obtener información precisa sobre tus informes. En la versión final, podré responder cualquier pregunta sobre tus obligaciones contractuales y financieras.\n\n¿Hay algo más en lo que pueda ayudarte?');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="stimi-assistant-fab"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-[#407754] hover:bg-[#346244]'
        }`}
        title="Asistente STIMI"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <FiZap className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-[136px] right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-[#407754] px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center p-1.5 backdrop-blur-sm">
                <img src={logoSena} alt="STIMI Bot" className="w-full h-full object-contain" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-[#407754] rounded-full"></span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">Asistente STIMI</h3>
              <p className="text-[11px] text-green-200 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block"></span>
                En línea
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-1' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#407754] text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Quick Actions (show only after first AI message and if no user messages yet) */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pl-1 animate-in fade-in delay-300">
                {[
                  { key: 'pendientes', label: '📋 Pendientes' },
                  { key: 'cumplimiento', label: '📊 Cumplimiento' },
                  { key: 'formatos', label: '📄 Formatos' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleQuickAction(key)}
                    className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-green-50 hover:border-[#407754] hover:text-[#407754] transition-all shadow-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <FiMoreHorizontal className="w-5 h-5 text-gray-400 animate-pulse" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="relative flex-1">
                <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#407754] focus:ring-1 focus:ring-[#407754]"
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 bg-[#407754] hover:bg-[#346244] disabled:bg-gray-300 text-white rounded-xl transition-all shrink-0"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
