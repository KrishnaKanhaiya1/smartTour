'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const CHAT_COOLDOWN_MS = 8000; // 8-second cooldown between messages to conserve API quota

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Hi! I\'m SmartTour AI. Ask me anything about travel — destinations, safety, food, packing, culture, or anything else!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0); // seconds remaining
    const bottomRef = useRef(null);
    const cooldownRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    // Cooldown timer
    const startCooldown = useCallback(() => {
        setCooldown(Math.ceil(CHAT_COOLDOWN_MS / 1000));
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || loading || cooldown > 0) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Only send last 5 messages for context (reduced from 10 to save tokens)
            const history = messages.slice(-5).map(m => ({ role: m.role === 'model' ? 'model' : 'user', content: m.content }));
            const r = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, history })
            });
            const d = await r.json();
            if (d.success) {
                setMessages(prev => [...prev, { role: 'model', content: d.data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: `SmartTour AI is temporarily unavailable: ${d.error || 'please try again in a moment.'}` }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'model', content: 'Connection issue. Please try again.' }]);
        }
        setLoading(false);
        startCooldown(); // Start cooldown after each message
    };

    const QUICK = ['Best time to visit Bali?', 'What to eat in Tokyo?', 'Packing tips for cold weather', 'Is Cairo safe?'];

    const canSend = input.trim() && cooldown === 0 && !loading;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close SmartTour chat' : 'Open SmartTour chat'}
                className="no-print"
                style={{
                    position: 'fixed', bottom: '28px', right: '28px', zIndex: 9000,
                    width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: 'var(--color-primary)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(12, 171, 168, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-smooth)',
                    transform: open ? 'rotate(45deg) scale(0.95)' : 'rotate(0) scale(1)',
                    color: 'var(--color-bg)'
                }}
            >
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                )}
            </button>

            {/* Chat Panel */}
            {open && (
                <div className="no-print" style={{
                    position: 'fixed', bottom: '96px', right: '28px', zIndex: 8999,
                    width: '380px', maxWidth: 'calc(100vw - 40px)',
                    background: 'var(--color-surface-0)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.5)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'fade-up 0.3s var(--ease-out-expo)',
                    maxHeight: '540px',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'var(--color-surface-1)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'var(--color-primary-subtle)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-primary)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-display)' }}>SmartTour AI</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Online — Ask anything</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, maxHeight: '320px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'thin' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div className="chat-bubble-ai" style={{ display: 'flex', gap: '5px', alignItems: 'center', color: 'var(--color-text-faint)' }}>
                                    <span style={{ animation: 'pulse-ring 1s infinite', animationDelay: '0s' }}>●</span>
                                    <span style={{ animation: 'pulse-ring 1s infinite', animationDelay: '0.2s' }}>●</span>
                                    <span style={{ animation: 'pulse-ring 1s infinite', animationDelay: '0.4s' }}>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 1 && (
                        <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {QUICK.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(q)}
                                    className="pill-toggle"
                                    style={{ fontSize: 'var(--text-xs)', padding: '5px 10px' }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: '12px 14px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex', gap: '8px',
                        background: 'var(--color-surface-1)',
                    }}>
                        <input
                            className="input-field"
                            style={{ flex: 1, borderRadius: 'var(--radius-md)' }}
                            placeholder="Ask about travel..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!canSend}
                            style={{
                                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                border: 'none', cursor: canSend ? 'pointer' : 'default',
                                background: canSend ? 'var(--color-primary)' : 'var(--color-surface-2)',
                                color: canSend ? 'var(--color-bg)' : 'var(--color-text-faint)',
                                fontSize: cooldown > 0 ? 'var(--text-xs)' : 'var(--text-base)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s var(--ease-smooth)', flexShrink: 0,
                                fontWeight: 700,
                            }}
                        >
                            {cooldown > 0 ? `${cooldown}` : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
