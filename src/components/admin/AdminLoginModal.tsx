import React, { useState } from 'react';
import { X, Lock, RefreshCw, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('admin@reddragon.dev');
  const [password, setPassword] = useState('reddragon2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failure.');
      }

      onSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Authentication Portal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-[#090303] border border-[#2d0707] shadow-[0_0_50px_rgba(229,9,20,0.3)] p-8 text-left z-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f0505]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-[#E50914] bg-[#160202] flex items-center justify-center text-[#FF1A1A]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-cinzel text-sm font-bold text-white tracking-widest">
                ADMIN ACCESS
              </div>
              <div className="text-[10px] font-mono-clean text-[#888888]">
                SECURE COMMAND NODE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close portal"
            className="p-1 border border-[#260505] text-[#888888] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-[#800f0f] bg-[#290404] flex items-center gap-2.5 text-xs text-[#FF8888]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF1A1A]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono-clean text-[#888888] uppercase tracking-wider">
              OPERATOR EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0e0303] border border-[#260505] text-white text-xs font-mono-clean focus:border-[#E50914] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono-clean text-[#888888] uppercase tracking-wider">
              ENCRYPTION KEY / PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0e0303] border border-[#260505] text-white text-xs font-mono-clean focus:border-[#E50914] focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#0d0303] border border-[#1f0505] text-[11px] font-mono-clean text-[#888888]">
            <span className="text-[#FF1A1A] font-semibold">Demo Credentials:</span> admin@reddragon.dev / reddragon2026
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E50914] hover:bg-[#FF1A1A] text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>AUTHENTICATE OPERATOR</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
