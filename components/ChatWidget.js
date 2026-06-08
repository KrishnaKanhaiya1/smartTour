'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: '👋 Hi! I\'m SmartTour AI. Ask me anything about travel — destinations, safety, food, packing, culture, or anything else!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.slice(1).map(m => ({ role: m.role === 'model' ? 'model' : 'user', content: m.content }));
            const r = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, history })
            });
            const d = await r.json();
            if (d.success) {
                setMessages(prev => [...prev, { role: 'model', content: d.data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: '⚠️ Sorry, I had trouble processing that. Please try again.' }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'model', content: '⚠️ Connection issue. Please try again.' }]);
        }
        setLoading(false);
    };

    const QUICK = ['🗺️ Best time to visit Bali?', '🍜 What to eat in Tokyo?', '💼 Packing tips for cold weather', '🛡️ Is Cairo safe?'];

    return (
        <>
            {/* Floating Button */}
            <button onClick={() => setOpen(!open)} style={{
                position: 'fixed', bottom: '28px', right: '28px', zIndex: 9000,
                width: '60px', height: '60px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                boxShadow: '0 8px 30px var(--color-primary-glow-strong)',
                fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease', transform: open ? 'rotate(45deg)' : 'rotate(0)',
                color: '#0a0b0f'
            }}>
                {open ? '✕' : '🤖'}
            </button>

            {/* Chat Panel */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: '100px', right: '28px', zIndex: 8999,
                    width: '380px', maxWidth: 'calc(100vw - 40px)',
                    background: 'var(--color-surface)', border: '1px solid var(--border-medium)',
                    borderRadius: '24px', boxShadow: 'var(--shadow-lg)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'page-enter 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#0a0b0f' }}>🤖</div>
                        <div>
                            <p style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>SmartTour AI</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>Online — Ask anything</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, maxHeight: '340px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollbarWidth: 'thin' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div className="chat-bubble-ai" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <span style={{ animation: 'pulse 1s infinite', animationDelay: '0s' }}>●</span>
                                    <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>●</span>
                                    <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 1 && (
                        <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {QUICK.map((q, i) => (
                                <button key={i} onClick={() => { setInput(q); }} style={{
                                    background: 'var(--color-surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '100px',
                                    padding: '5px 10px', fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s',
                                    fontFamily: 'var(--font-body)'
                                }}
                                    onMouseEnter={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.color = 'var(--color-text)'; }}
                                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.color = 'var(--color-text-muted)'; }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
                        <input
                            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '10px 14px', color: 'var(--color-text)', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                            placeholder="Ask about travel..."
                            value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
                            width: '40px', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: input.trim() ? 'var(--color-primary)' : 'var(--color-surface-card)',
                            color: input.trim() ? '#0a0b0f' : 'var(--color-text-faint)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', flexShrink: 0, fontWeight: 'bold'
                        }}>➤</button>
                    </div>
                </div>
            )}
        </>
    );
}
