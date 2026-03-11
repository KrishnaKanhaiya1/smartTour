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
        } catch (e) { console.error(e); }
        setPhrasesLoading(false);
    };

    const selectedLangLabel = LANGS.find(l => l.code === targetLang)?.label || targetLang;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">🌐 Translation Agent</h2>
                <p className="section-subtitle">Real-time AI translation for any language pair</p>
            </div>

            {/* Translator Card */}
            <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <label className="label">Text to Translate</label>
                        <textarea
                            className="input-field"
                            rows={4}
                            placeholder="Type anything — a phrase, a question, a sign you saw..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '180px' }}>
                            <label className="label">Target Language</label>
                            <select className="input-field" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                                {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                            </select>
                        </div>
                        <button className="btn-primary" onClick={translate} disabled={loading || !text.trim()}
                            style={{ padding: '12px 28px' }}>
                            {loading ? <><span className="spinner" /> Translating...</> : '🔤 Translate Now'}
                        </button>
                    </div>
                </div>

                {result && !result.error && (
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ background: 'rgba(108,92,231,0.08)', border: '1px solid rgba(108,92,231,0.2)', borderRadius: '14px', padding: '20px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>ORIGINAL · {result.sourceLanguage?.toUpperCase()}</p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>"{result.originalText}"</p>
                        </div>
                        <div style={{ background: 'rgba(0,204,203,0.08)', border: '1px solid rgba(0,204,203,0.25)', borderRadius: '14px', padding: '20px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--clr-secondary)', marginBottom: '8px', fontWeight: 600 }}>{selectedLangLabel.toUpperCase()}</p>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 600 }}>"{result.translatedText}"</p>
                            {result.phonetic && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>📣 {result.phonetic}</p>}
                        </div>
                        {result.culturalNote && (
                            <div style={{ gridColumn: '1/-1', background: 'rgba(253,203,110,0.08)', border: '1px solid rgba(253,203,110,0.25)', borderRadius: '12px', padding: '14px 18px', display: 'flex', gap: '10px' }}>
                                <span style={{ fontSize: '1.2rem' }}>💡</span>
                                <p style={{ color: 'var(--clr-gold)', fontSize: '0.9rem' }}>{result.culturalNote}</p>
                            </div>
                        )}
                    </div>
                )}
                {result?.error && (
                    <div className="glass-card" style={{ marginTop: '24px', padding: '16px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)', borderRadius: '12px' }}>
                        <p style={{ color: 'var(--clr-danger)', fontWeight: 600, textAlign: 'center' }}>⚠️ {result.error}</p>
                    </div>
                )}
            </div>

            {/* Common Phrases */}
            <div className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚡ Essential Travel Phrases in {selectedLangLabel}</h3>
                    <button className="btn-secondary" onClick={loadPhrases} disabled={phrasesLoading} style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                        {phrasesLoading ? <><span className="spinner" style={{ width: '14px', height: '14px' }} /> Loading...</> : '🔄 Generate Phrases'}
                    </button>
                </div>
                {phrases ? (
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {phrases.phrases?.map((p, i) => (
                            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{p.useCase}</span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{p.english}</p>
                                {p.translated && <p style={{ color: 'var(--clr-secondary)', marginTop: '4px', fontSize: '0.95rem' }}>{p.translated}</p>}
                                {p.phonetic && <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '3px', fontStyle: 'italic' }}>📣 {p.phonetic}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>Select a language and click Generate Phrases for AI-powered travel phrases</p>
                )}
            </div>
        </div>
    );
}
