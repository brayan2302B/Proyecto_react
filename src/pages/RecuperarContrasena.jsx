import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FiArrowLeft } from 'react-icons/fi';
import fondoCampus from '../assets/Fondo.jpg.jpeg';
import logoSena from '../assets/logo-sena.png';

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('El correo electrónico es obligatorio');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Formato de correo electrónico no válido');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Procesando solicitud...');

    setTimeout(() => {
      toast.success(`Se ha enviado un enlace de recuperación a ${email} (simulado)`, { id: toastId });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative transition-all duration-500"
      style={{ 
        backgroundImage: `url(${fondoCampus})`,
        backgroundColor: '#0a0f0d' // Fallback solid background
      }}
    >
      {/* Light overlay — lets the campus photo show through */}
      <div className="absolute inset-0 bg-black/25 z-0"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-350">
        
        {/* SENA Logo */}
        <div className="flex justify-center mb-6">
          <img src={logoSena} alt="Logo SENA" className="w-20 h-20 object-contain mx-auto" />
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-200 text-sm mb-6 max-w-xs mx-auto font-medium">
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleReset} className="space-y-5 text-left" noValidate>
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white block">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@sena.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                error 
                  ? 'border-red-500 focus:ring-red-500/30' 
                  : 'border-white/20 focus:border-sena-green focus:ring-sena-green/30'
              } focus:outline-none focus:ring-4 transition-all duration-200 text-sm`}
            />
            {error && (
              <p className="text-xs font-medium text-red-400 pt-1">{error}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#4CAF50] hover:bg-[#43A047] disabled:bg-gray-700 text-white rounded-2xl font-bold text-sm shadow-lg transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <span>Enviar Enlace</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
