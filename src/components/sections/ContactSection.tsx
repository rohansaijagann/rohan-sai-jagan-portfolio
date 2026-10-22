import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Copy,
  Check,
  CornerDownLeft,
  Loader2,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData.ts';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { Accent } from '../Accent.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    botcheck: '', // honeypot
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check for bots
    if (formData.botcheck) {
      setStatus('success');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '', botcheck: '' });
        } else {
          throw new Error('Failed to send message via form endpoint.');
        }
      } else {
        // Mock success fallback for preview without backend endpoint
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus('success');
        setFormData({ name: '', email: '', message: '', botcheck: '' });
      }
    } catch {
      setStatus('error');
      setErrorMessage('Could not deliver message.');
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      {/* Section Watermark 08 */}
      <SectionWatermark index="08" />

      {/* Accent Green Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-[#6a9955]/10 blur-[150px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-7 relative z-10">
        {/* Eyebrow & Header */}
        <div className="space-y-3 pb-5 border-b border-white/[0.08]">
          <div className="font-mono text-[13px] text-[#6a9955]">
            // chapter 08 · contact
          </div>
          <h2
            id="contact-heading"
            className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            Let's <Accent color="#6a9955">build</Accent> something.
            <SectionAnchor sectionId="contact" />
          </h2>
          <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
            Got an idea, a project, or a team that makes good things? Say hello.
          </p>
        </div>

        {/* 2-Column Layout: Left = Terminal Form, Right = ONE window with open rows (Bug 11 fix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Terminal Window with prompt commands */}
          <div className="lg:col-span-7 rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col">
            {/* Terminal Title Bar */}
            <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                <span className="text-[#aab2c0] text-xs ml-2 flex items-center space-x-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-[#6a9955]" />
                  <span>bash — contact.sh</span>
                </span>
              </div>
              <span className="text-xs text-[#6a9955] font-mono">tty1</span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm space-y-4 bg-[#0a0c10]">
              <div className="text-xs text-[#aab2c0]/60 pb-1 border-b border-white/5">
                # Rohan Sai Jagan interactive contact prompt
              </div>

              {status === 'success' ? (
                <div className="py-8 space-y-4 text-center sm:text-left">
                  <div className="text-emerald-400 font-bold text-base flex items-center space-x-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>✓ Message sent. I'll get back to you soon.</span>
                  </div>
                  <p className="text-xs text-[#aab2c0] leading-relaxed">
                    Thanks for reaching out! I'll read your note and reply promptly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
                  >
                    <span>$ send another message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* $ name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs text-[#6a9955] font-semibold flex items-center space-x-1.5"
                    >
                      <span>$</span>
                      <span>name</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151c] border border-white/10 text-white placeholder:text-[#aab2c0]/40 focus:outline-none focus:border-[#6a9955] focus:ring-1 focus:ring-[#6a9955] transition-all font-mono text-sm"
                    />
                  </div>

                  {/* $ email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs text-[#6a9955] font-semibold flex items-center space-x-1.5"
                    >
                      <span>$</span>
                      <span>email</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151c] border border-white/10 text-white placeholder:text-[#aab2c0]/40 focus:outline-none focus:border-[#6a9955] focus:ring-1 focus:ring-[#6a9955] transition-all font-mono text-sm"
                    />
                  </div>

                  {/* $ message */}
                  <div className="space-y-1">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs text-[#6a9955] font-semibold flex items-center space-x-1.5"
                    >
                      <span>$</span>
                      <span>message</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder="what's on your mind?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151c] border border-white/10 text-white placeholder:text-[#aab2c0]/40 focus:outline-none focus:border-[#6a9955] focus:ring-1 focus:ring-[#6a9955] transition-all font-mono text-sm resize-y"
                    />
                  </div>

                  {/* Failure / Error output */}
                  {status === 'error' && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-1 font-mono">
                      <div>! {errorMessage}</div>
                      <div>
                        or email directly:{' '}
                        <a
                          href={`mailto:${PERSONAL_INFO.email}`}
                          className="underline text-red-300 hover:text-white"
                        >
                          {PERSONAL_INFO.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#6a9955] hover:bg-[#5b8549] text-white text-xs font-mono font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Bug 11 Fix: ONE window with open rows (no card-in-card or tiles inside a card) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                <span className="text-[#aab2c0] text-xs ml-2 font-mono">coordinates.json</span>
              </div>
              <span className="text-[10px] text-[#6a9955] font-mono">direct</span>
            </div>

            {/* Open Rows inside ONE window with hairline dividers */}
            <div className="divide-y divide-white/[0.06] bg-[#0a0c10] text-xs font-mono">
              {/* Row 1: Click-to-copy email with 'Copied' toast */}
              <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1">
                  <span className="text-[#aab2c0]/60 block text-[11px]">email</span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-[#f4f6fb] font-semibold hover:text-[#6a9955] transition-colors break-all text-sm block"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg bg-[#181c25] hover:bg-white/10 border border-white/10 text-xs text-[#6a9955] transition-colors cursor-pointer shrink-0 ml-3"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Row 2: Location */}
              <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="space-y-1">
                  <span className="text-[#aab2c0]/60 block text-[11px]">location</span>
                  <span className="text-[#f4f6fb] font-semibold text-sm block">
                    {PERSONAL_INFO.location}
                  </span>
                </div>
                <MapPin className="w-4 h-4 text-[#4ec9b0] shrink-0" />
              </div>

              {/* Row 3: GitHub */}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Github className="w-4 h-4 text-[#aab2c0] group-hover:text-white transition-colors" />
                  <span className="text-[#f4f6fb] font-medium text-sm">GitHub</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#aab2c0]/60 group-hover:text-white transition-colors" />
              </a>

              {/* Row 4: LinkedIn */}
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-[#569cd6]" />
                  <span className="text-[#f4f6fb] font-medium text-sm">LinkedIn</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#aab2c0]/60 group-hover:text-white transition-colors" />
              </a>

              {/* Row 5: Medium */}
              <a
                href={PERSONAL_INFO.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#ce9178] text-black font-bold flex items-center justify-center text-[10px]">
                    M
                  </span>
                  <span className="text-[#f4f6fb] font-medium text-sm">Medium</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#aab2c0]/60 group-hover:text-white transition-colors" />
              </a>

              {/* Row 6: LeetCode */}
              <a
                href={PERSONAL_INFO.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-4 h-4 rounded-full bg-[#dcdcaa] text-black font-bold flex items-center justify-center text-[10px]">
                    L
                  </span>
                  <span className="text-[#f4f6fb] font-medium text-sm">LeetCode</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#aab2c0]/60 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer: "Designed and built by Rohan Sai Jagan · 2026" and quiet "// to be continued." */}
        <footer className="w-full pt-12 pb-6 text-center font-mono border-t border-white/[0.05] mt-12 space-y-1">
          <p className="text-xs text-[#aab2c0]">Designed and built by Rohan Sai Jagan · 2026</p>
          <p className="text-xs text-[#aab2c0]/60">// to be continued.</p>
        </footer>
      </div>
    </section>
  );
};
