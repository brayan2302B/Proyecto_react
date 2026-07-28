import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FiInfo } from 'react-icons/fi';
import api from '../services/api';
import axios from 'axios';
import fondoCampus from '../assets/Fondo.jpg.jpeg';
import logoSena from '../assets/logo-sena.png';

export default function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombreCompleto.trim()) {
      tempErrors.nombreCompleto = 'El nombre completo es obligatorio';
    }

    if (!formData.email) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Formato de correo electrónico no válido';
    }

    if (!formData.numeroDocumento.trim()) {
      tempErrors.numeroDocumento = 'El número de documento es obligatorio';
    }

    if (!formData.password) {
      tempErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor, corrige los errores del formulario');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Procesando registro...');

    try {
      const payload = {
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        contrasena: formData.password,
        confirmarContrasena: formData.confirmPassword
      };

      const response = await api.post('/personas', payload);
      
      toast.success(response.data.message || 'Cuenta registrada. Un coordinador debe activarla antes de que puedas iniciar sesión.', {
        id: toastId,
        duration: 5000
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error during registration:', error);
      let errMsg = 'Ocurrió un error al procesar el registro.';
      if (axios.isAxiosError(error) && error.response) {
        errMsg = error.response.data.message || errMsg;
      }
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative transition-all duration-500"
      style={{ 
        backgroundImage: `url(${fondoCampus})`,
        backgroundColor: '#0a0f0d' // Fallback
      }}
    >
      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/25 z-0"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center transition-all duration-350 my-8">
        
        {/* SENA Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoSena} alt="Logo SENA" className="w-20 h-20 object-contain mx-auto" />
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
          Crear Cuenta
        </h2>
        <p className="text-gray-200 text-sm mb-6 font-medium">
          Regístrate para solicitar acceso al Sistema STIMI.
        </p>

        {/* Warning notification banner in yellow */}
        <div className="flex gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 text-left">
          <FiInfo className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-200">
            El área de formación y rol serán asignados por el coordinador una vez aprobada tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          
          {/* Nombre Completo */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white block">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombreCompleto"
              placeholder="Juan Pérez"
              value={formData.nombreCompleto}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                errors.nombreCompleto 
                  ? 'border-red-500' 
                  : 'border-white/20 focus:border-sena-green'
              } focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm`}
            />
            {errors.nombreCompleto && (
              <p className="text-xs font-medium text-red-400 pt-1">{errors.nombreCompleto}</p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white block">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="juan.perez@sena.edu.co"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                errors.email 
                  ? 'border-red-500' 
                  : 'border-white/20 focus:border-sena-green'
              } focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm`}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-400 pt-1">{errors.email}</p>
            )}
          </div>

          {/* Tipo y Número de Documento (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white block">
                Tipo de Documento
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-sena-green focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm appearance-none cursor-pointer"
              >
                <option value="CC" className="bg-slate-900 text-white">Cédula de Ciudadanía</option>
                <option value="CE" className="bg-slate-900 text-white">Cédula de Extranjería</option>
                <option value="TI" className="bg-slate-900 text-white">Tarjeta de Identidad</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white block">
                Número de Documento
              </label>
              <input
                type="text"
                name="numeroDocumento"
                placeholder="1029384756"
                value={formData.numeroDocumento}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                  errors.numeroDocumento 
                    ? 'border-red-500' 
                    : 'border-white/20 focus:border-sena-green'
                } focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm`}
              />
              {errors.numeroDocumento && (
                <p className="text-xs font-medium text-red-400 pt-1">{errors.numeroDocumento}</p>
              )}
            </div>
          </div>

          {/* Contraseñas (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white block">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                  errors.password 
                    ? 'border-red-500' 
                    : 'border-white/20 focus:border-sena-green'
                } focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm`}
              />
              {errors.password && (
                <p className="text-xs font-medium text-red-400 pt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white block">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border ${
                  errors.confirmPassword 
                    ? 'border-red-500' 
                    : 'border-white/20 focus:border-sena-green'
                } focus:outline-none focus:ring-4 focus:ring-sena-green/30 text-sm`}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-400 pt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Regional & Centro Info Block */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">Regional:</span>
              <span className="font-semibold text-white">Huila regional</span>
            </div>
            <div className="flex justify-between text-right mt-1">
              <span className="text-gray-300">Centro de Formación:</span>
              <span className="font-semibold text-white max-w-[200px] truncate" title="Centro de Gestión y Desarrollo Sostenible Surcolombiano">
                Centro de Gestión y Desarrollo Sostenible Surcolombiano
              </span>
            </div>
          </div>

          {/* Register Button */}
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
              <span>Registrarse</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-bold text-[#4CAF50] hover:underline ml-1"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
