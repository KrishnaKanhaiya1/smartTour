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
                background: 'linear-gradient(135deg, #6C5CE7, #00CCCB)',
                boxShadow: '0 8px 30px rgba(108,92,231,0.5)',
                fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease', transform: open ? 'rotate(45deg)' : 'rotate(0)'
            }}>
                {open ? '✕' : '🤖'}
            </button>

            {/* Chat Panel */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: '100px', right: '28px', zIndex: 8999,
                    width: '380px', maxWidth: 'calc(100vw - 40px)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                    borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'fadeInUp 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #6C5CE7, #5a4bd1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
                        <div>
                            <p style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>SmartTour AI</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>Online — Ask anything</span>
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
                                    background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '100px',
                                    padding: '5px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.target.style.borderColor = 'var(--clr-primary)'; e.target.style.color = 'var(--text-primary)'; }}
                                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border-medium)'; e.target.style.color = 'var(--text-secondary)'; }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
                        <input
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                            placeholder="Ask about travel..."
                            value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
                            width: '40px', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: input.trim() ? 'linear-gradient(135deg, #6C5CE7, #a29bfe)' : 'var(--bg-card)',
                            color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', flexShrink: 0
                        }}>➤</button>
                    </div>
                </div>
            )}
        </>
    );
}
