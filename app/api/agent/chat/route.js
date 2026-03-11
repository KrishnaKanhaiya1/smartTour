// app/api/agent/chat/route.js
import { NextResponse } from 'next/server';
import { OrchestratorAgent } from '@/lib/services/agents/orchestrator';

export async function POST(request) {
    try {
        const { message, history } = await request.json();

        if (!message) {
            return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
        }

        const orchestrator = new OrchestratorAgent();
        const result = await orchestrator.chat(message, history || []);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
