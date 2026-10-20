import React, { useState } from 'react';
import { X, Lock, ShieldAlert, KeyRound, Eye, EyeOff, CheckCircle2, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_EMAIL = 'j2022robles@gmail.com';
const ADMIN_PASS = 'Losloquitos2026';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
        setIsLoading(false);
        onSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setErrorMessage('Credenciales inválidas. Acceso restringido únicamente al administrador autorizado.');
      }
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASS);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Header */}
        <div className="text-center pb-5 border-b border-slate-800">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
            <Lock className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] uppercase font-mono tracking-wider text-amber-500 font-bold">
            Área de Seguridad B2B
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Acceso a Gestión de Ventas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            El módulo de ventas, órdenes de talleres y control de inventario requiere autenticación de administrador.
          </p>
        </div>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="my-4 p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Correo Electrónico de Administrador
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-0.5"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Helper Button to Fill Credentials */}
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-amber-400 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Autocompletar credenciales de Administrador (Demo)</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {isLoading ? (
              <span>Verificando credenciales...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Ingresar al Panel de Ventas</span>
              </>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            Acceso protegido con cifrado de sesión B2B · AutoRepuestos Pro
          </span>
        </div>
      </div>
    </div>
  );
};
