'use client';

import { useState } from 'react';

const LANGS = [
    { code: 'hi', label: '🇮🇳 Hindi' }, { code: 'fr', label: '🇫🇷 French' },
    { code: 'es', label: '🇪🇸 Spanish' }, { code: 'de', label: '🇩🇪 German' },
    { code: 'ja', label: '🇯🇵 Japanese' }, { code: 'zh', label: '🇨🇳 Chinese' },
    { code: 'ar', label: '🇸🇦 Arabic' }, { code: 'pt', label: '🇧🇷 Portuguese' },
    { code: 'ru', label: '🇷🇺 Russian' }, { code: 'ko', label: '🇰🇷 Korean' },
    { code: 'it', label: '🇮🇹 Italian' }, { code: 'ml', label: '🇮🇳 Malayalam' },
    { code: 'ta', label: '🇮🇳 Tamil' }, { code: 'bn', label: '🇧🇩 Bengali' },
    { code: 'th', label: '🇹🇭 Thai' }, { code: 'vi', label: '🇻🇳 Vietnamese' },
];

export default function TranslateTab() {
    const [text, setText] = useState('');
    const [targetLang, setTargetLang] = useState('hi');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [phrases, setPhrases] = useState(null);
    const [phrasesLoading, setPhrasesLoading] = useState(false);
    const [rotated, setRotated] = useState(false);

    const translate = async () => {
        if (!text.trim()) return;
        setLoading(true); setResult(null);
        try {
            const r = await fetch('/api/agent/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLanguage: targetLang })
            });
            const d = await r.json();
            if (d.success) {
                setResult(d.data);
            } else {
                setResult({ error: d.error || 'Translation failed. The AI service might be temporarily unavailable.' });
            }
        } catch (e) {
            console.error(e);
            setResult({ error: 'Network error or service unavailable.' });
        }
        setLoading(false);
    };

    const loadPhrases = async () => {
        setPhrasesLoading(true); setPhrases(null);
        try {
            const r = await fetch('/api/agent/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: 'Generate travel phrases', targetLanguage: targetLang, mode: 'phrases' })
            });
            const d = await r.json();
            if (d.success) {
                setPhrases(d.data);
            }
        } catch (e) { 
            console.error(e); 
        }
        setPhrasesLoading(false);
    };

    const handleSwap = () => {
        setRotated(!rotated);
        if (result && !result.error) {
            setText(result.translatedText);
            setResult(null);
        }
    };

    const selectedLangLabel = LANGS.find(l => l.code === targetLang)?.label || targetLang;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="label" style={{ color: 'var(--color-primary-light)' }}>REAL-TIME AI TRANSLATION</span>
                    <h2 className="section-title">🌐 Translation Agent</h2>
                    <p className="section-subtitle">Real-time AI translation for any language pair</p>
                </div>
            </div>

            {/* Translator Grid Container */}
            <div className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', alignItems: 'center' }} className="translator-grid">
                    {/* LEFT PANEL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="label">Source Text (English)</label>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{text.length} chars</span>
                        </div>
                        <textarea
                            className="input-field"
                            rows={5}
                            placeholder="Type anything — a phrase, a question, a sign you saw..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{ resize: 'none', height: '135px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-ghost" onClick={() => setText('')} style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
                                Clear Text
                            </button>
                        </div>
                    </div>

                    {/* CENTER ACTION SWAP BUTTON */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={handleSwap}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-subtle)',
                                border: '1px solid var(--color-primary)',
                                color: 'var(--color-primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.4s var(--ease-out-expo)',
                                boxShadow: 'var(--shadow-glow)'
                            }}
                            title="Swap Translation"
                        >
                            ↔
                        </button>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label className="label">Target Language</label>
                            <select className="input-field" value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ height: '46px' }}>
                                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                            </select>
                        </div>
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            minHeight: '135px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                {result && !result.error ? (
                                    <div>
                                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontWeight: 600 }}>
                                            {result.translatedText}
                                        </p>
                                        {result.phonetic && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                                                📣 {result.phonetic}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>
                                        Translation will appear here...
                                    </p>
                                )}
                            </div>
                            {result && !result.error && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => {
                                            navigator.clipboard.writeText(result.translatedText);
                                            alert('Copied translation to clipboard!');
                                        }}
                                        style={{ padding: '4px 10px', fontSize: '11px' }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button className="btn-primary" onClick={translate} disabled={loading || !text.trim()}
                    style={{ width: '100%', justifyContent: 'center', height: '46px', marginTop: '20px' }}>
                    {loading ? <><span className="spinner" /> Translating...</> : 'Translate Now'}
                </button>

                {result?.culturalNote && (
                    <div className="card" style={{ background: 'rgba(253,203,110,0.03)', border: '1px solid rgba(253,203,110,0.1)', display: 'flex', gap: '12px', marginTop: '20px', padding: '16px' }}>
                        <span style={{ fontSize: '1.2rem' }}>💡</span>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-warning)' }}>Cultural Note</p>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '2px', lineHeight: 1.5 }}>{result.culturalNote}</p>
                        </div>
                    </div>
                )}

                {result?.error && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {result.error}</p>
                    </div>
                )}

                <style jsx global>{`
                    @media (min-width: 992px) {
                        .translator-grid {
                            grid-template-columns: 1fr 60px 1fr !important;
                        }
                    }
                `}</style>
            </div>

            {/* Common Phrases */}
            <div className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>⚡ Essential Travel Phrases in {selectedLangLabel}</h3>
                    <button className="btn-secondary" onClick={loadPhrases} disabled={phrasesLoading} style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                        {phrasesLoading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Loading...</> : 'Generate Phrases'}
                    </button>
                </div>
                {phrases ? (
                    <div className="card-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                        {phrases.phrases?.map((p, i) => (
                            <div key={i} className="card" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{p.useCase}</span>
                                </div>
                                <p style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.english}</p>
                                {p.translated && <p style={{ color: 'var(--color-primary-light)', marginTop: '4px', fontSize: '0.92rem', fontWeight: 600 }}>{p.translated}</p>}
                                {p.phonetic && <p style={{ color: 'var(--color-text-faint)', fontSize: '0.78rem', marginTop: '3px', fontStyle: 'italic' }}>📣 {p.phonetic}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px', fontSize: 'var(--text-sm)' }}>Select a language and click Generate Phrases for AI-powered travel phrases.</p>
                )}
            </div>
        </div>
    );
}
