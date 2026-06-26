import { NextResponse } from 'next/server';
import { generateChatReply } from '@/lib/gemini';
import { getCustomerProfile, logConversation } from '@/lib/airtable';
import { sendEscalationEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, activeEmail, currency } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].content;

    // 1. Fetch CRM Profile from Airtable (Pillar 5)
    const customerProfile = activeEmail ? await getCustomerProfile(activeEmail) : null;

    // 2. Format history for Gemini
    const history = messages.slice(0, -1).map((msg: { role: string, content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // 3. Generate AI Response
    let reply = await generateChatReply(history, latestMessage, customerProfile, currency || 'USD');

    // 4. Check for Escalation Trigger (Pillar 7)
    let isEscalated = false;
    if (reply.includes('[ESCALATE]')) {
      isEscalated = true;
      // Remove the internal tag before showing to customer
      reply = reply.replace('[ESCALATE]', '').trim();
      reply += "\n\n🚨 I have officially escalated your ticket to our senior human support team. The store owner has been notified via priority email and will contact you shortly.";
      
      // Fire Brevo Email to Store Owner
      await sendEscalationEmail(activeEmail || 'guest@example.com', latestMessage);
    }

    // 5. Log Conversation to Airtable Analytics (Pillar 8)
    await logConversation(activeEmail || 'guest@example.com', latestMessage, reply, isEscalated);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong in the chat API." }, 
      { status: 500 }
    );
  }
}
