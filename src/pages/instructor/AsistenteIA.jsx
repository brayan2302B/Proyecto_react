import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiInfo, FiMessageSquare, FiCpu, FiMoreHorizontal } from 'react-icons/fi';
import logoSena from '../../assets/logo-sena.png';
import PageContainer from '../../components/PageContainer';

export default function AsistenteIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola! Soy tu asistente virtual de STIMI. Puedo ayudarte con las siguientes tareas:\n\n• Generar borradores para tus informes GC y GF.\n• Sugerir evidencias basadas en tu plan de formación.\n• Redactar obligaciones y actividades.\n• Darte consejos para el seguimiento de aprendices.\n• Ayudarte con la programación de actividades.\n\n¿En qué puedo ayudarte hoy?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'He recibido tu solicitud. Como soy un asistente simulado en esta fase de desarrollo, no puedo procesar peticiones reales todavía. Sin embargo, en el sistema final, aquí generaría el contenido solicitado basándome en tus directrices y el formato requerido (GC/GF).\n\n¿Hay algo más en lo que pueda simular ayudarte?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s delay
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageContainer maxWidth="max-w-4xl" className="h-[calc(100vh-2rem)] flex flex-col">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-t-3xl p-5 shadow-sm flex items-center gap-4 z-10 relative">
        <div className="relative">
          <div className="w-12 h-12 bg-green-50 rounded-full border border-green-100 flex items-center justify-center p-2">
            <img src={logoSena} alt="STIMI Bot" className="w-full h-full object-contain" />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Asistente STIMI</h2>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <FiCpu className="w-3.5 h-3.5" /> En línea • {messages.length} mensajes
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-6 space-y-6 scroll-smooth">
        
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="bg-gray-200/60 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
            Hoy
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="shrink-0 mt-1">
                {msg.sender === 'ai' ? (
                  <div className="w-8 h-8 bg-green-50 rounded-full border border-green-100 flex items-center justify-center p-1.5">
                    <img src={logoSena} alt="AI" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[#407754] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    TÚ
                  </div>
                )}
              </div>

              {/* Bubble */}
              <div>
                <div className={`p-4 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#407754] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-gray-400 mt-1.5 font-medium ${msg.sender === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.time}
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex max-w-[80%] gap-3 flex-row">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-50 rounded-full border border-green-100 flex items-center justify-center p-1.5">
                  <img src={logoSena} alt="AI" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center gap-1 text-gray-400">
                  <FiMoreHorizontal className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border border-gray-200 rounded-b-3xl p-4 shadow-sm z-10 relative">
        <form onSubmit={handleSend} className="relative flex items-end gap-3">
          <div className="relative flex-1">
            <FiMessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Shift+Enter para nueva línea)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none max-h-32 min-h-[52px]"
              rows="1"
            />
          </div>
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3.5 bg-[#407754] hover:bg-[#346244] disabled:bg-gray-300 text-white rounded-2xl shadow-sm transition-all"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
        
        {/* Tips & Disclaimer */}
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
          <p className="text-xs text-gray-400 font-medium">
            <strong className="text-gray-500">Tip:</strong> Sé específico. Ejemplo: <em>"Ayúdame a redactar las obligaciones para el informe GC de Julio"</em>
          </p>
        </div>
      </div>
      
      {/* Disclaimer banner */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 text-left">
        <FiInfo className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-800 font-medium">
          El asistente utiliza Inteligencia Artificial para generar contenido. Por favor, verifica siempre la precisión de la información y consulta con coordinación en caso de dudas sobre los lineamientos institucionales antes de enviar tu informe final.
        </p>
      </div>

    </PageContainer>
  );
}
