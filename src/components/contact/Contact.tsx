import React, { useState } from 'react';
import { Send, Flame, Mail, CheckCircle2, AlertCircle, RefreshCw, Github, Linkedin, Twitter, Instagram, Youtube, Radio } from 'lucide-react';
import type { SocialLink, SiteSetting } from '../../types/database.js';

interface ContactProps {
  settings?: SiteSetting;
  socialLinks: SocialLink[];
  initialSubject?: string;
}

export const Contact: React.FC<ContactProps> = ({
  settings,
  socialLinks,
  initialSubject = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Update subject if prop changes (e.g. from service click)
  React.useEffect(() => {
    if (initialSubject) {
      setFormData(prev => ({ ...prev, subject: `Inquiry: ${initialSubject}` }));
    }
  }, [initialSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setStatus('error');
      setErrorMessage('Please provide a valid name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setStatus('error');
      setErrorMessage('Message must be at least 5 characters.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch transmission.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed. Please try again.');
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'x': case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <section id="contact" className="relative py-28 border-t border-[#1a0505] bg-[#050505]">
      {/* Background Glow */}
      <div
        className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full pointer-events-none opacity-20 filter blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(229,9,20,0.5) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Social Connections */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
                <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
                <span>INITIATE TRANSMISSION</span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                LET&apos;S BUILD <br />
                <span className="bg-gradient-to-r from-[#FF1A1A] via-[#E50914] to-[#880000] bg-clip-text text-transparent">
                  SOMETHING GREAT.
                </span>
              </h2>
              <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
            </div>

            <p className="text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-light">
              Available for select architecture commissions, bespoke WebGL 3D productions, and high-frequency backend engineering. Let&apos;s turn your vision into a formidable digital presence.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono-clean text-[#888888]">
                <Mail className="w-4 h-4 text-[#FF1A1A]" />
                <span>DIRECT ENCRYPTION:</span>
                <a
                  href={`mailto:${settings?.contactEmail || 'contact@reddragon.dev'}`}
                  className="text-white hover:text-[#FF1A1A] transition-colors"
                >
                  {settings?.contactEmail || 'contact@reddragon.dev'}
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-clean text-[#888888]">
                <div className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-pulse" />
                <span className="text-[#D4D4D4]">
                  {settings?.statusText || 'AVAILABLE FOR COMMISSIONS'}
                </span>
              </div>
            </div>

            {/* Social Links Matrix */}
            <div className="pt-6 border-t border-[#1c0404]">
              <div className="text-xs font-mono-clean tracking-widest text-[#888888] uppercase mb-4">
                AUTHENTICATED SOCIAL CHANNELS
              </div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={soc.platform}
                    className="p-3 border border-[#260505] bg-[#0c0303] text-[#888888] hover:text-white hover:border-[#FF1A1A] hover:shadow-[0_0_15px_rgba(255,26,26,0.3)] transition-all flex items-center gap-2 text-xs font-mono-clean"
                  >
                    {getSocialIcon(soc.platform)}
                    <span>{soc.platform.toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 border border-[#240505] bg-[#080202] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-mono-clean text-[#888888] uppercase tracking-wider">
                    YOUR IDENTITY / NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full px-4 py-3 bg-[#0d0303] border border-[#2d0707] text-white text-sm focus:border-[#E50914] focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all font-mono-clean placeholder:text-[#444444]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-mono-clean text-[#888888] uppercase tracking-wider">
                    TRANSMISSION EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. architect@nexus.io"
                    className="w-full px-4 py-3 bg-[#0d0303] border border-[#2d0707] text-white text-sm focus:border-[#E50914] focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all font-mono-clean placeholder:text-[#444444]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs font-mono-clean text-[#888888] uppercase tracking-wider">
                  TRANSMISSION SUBJECT
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. WebGL Engine Architecture Commission"
                  className="w-full px-4 py-3 bg-[#0d0303] border border-[#2d0707] text-white text-sm focus:border-[#E50914] focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all font-mono-clean placeholder:text-[#444444]"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs font-mono-clean text-[#888888] uppercase tracking-wider">
                  BRIEF / SPECIFICATION *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your technical requirements, budget scope, and timeline..."
                  className="w-full px-4 py-3 bg-[#0d0303] border border-[#2d0707] text-white text-sm focus:border-[#E50914] focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all font-mono-clean placeholder:text-[#444444] resize-none"
                />
              </div>

              {/* Feedback States */}
              {status === 'success' && (
                <div className="p-4 border border-[#0d5924] bg-[#03200c] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-200">
                    Transmission successfully dispatched to the Red Dragon command node. You will receive an encrypted reply within 24 hours.
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 border border-[#800f0f] bg-[#290404] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#FF1A1A] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#FF8888]">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-[#E50914] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#FF1A1A] hover:shadow-[0_0_30px_rgba(255,26,26,0.6)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING DATA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
