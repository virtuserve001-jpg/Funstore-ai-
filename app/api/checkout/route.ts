import { NextResponse } from 'next/server';
import { createOrderAndUpdateLTV } from '@/lib/airtable';
import { sendOrderConfirmationEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, total } = body;

    if (!items || items.length === 0 || !email) {
      return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
    }

    const productSummary = items.map((item: any) => `${item.name} (x${item.quantity})`).join(', ');

    // 1. Log Order & Update Customer LTV in Airtable CRM
    await createOrderAndUpdateLTV(email, productSummary, total);

    // 2. Send Order Confirmation Email via Brevo
    await sendOrderConfirmationEmail(email, productSummary, total);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: "Checkout processing failed." }, { status: 500 });
  }
}
