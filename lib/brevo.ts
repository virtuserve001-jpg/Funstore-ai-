import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER || 'your_brevo_email@example.com',
    pass: process.env.BREVO_API_KEY || 'your_brevo_smtp_key',
  },
});

// 1. Send Escalation Alert to Store Owner (Pillar 7: Escalation Logic)
export async function sendEscalationEmail(customerEmail: string, userMessage: string) {
  try {
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_key_here') {
      console.log(`[Simulation] Escalation Email sent to owner regarding: ${customerEmail}`);
      return;
    }
    await transporter.sendMail({
      from: '"FunStore AI Engine" <ai@funstore.local>',
      to: 'owner@funstore.local',
      subject: `🚨 [ESCALATION] Urgent Customer Assistance Required (${customerEmail})`,
      html: `
        <h2>🤖 AI Engine Escalation Alert</h2>
        <p>Your AI assistant has transferred a conversation to human support.</p>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Last Message:</strong> "${userMessage}"</p>
        <hr/>
        <p>Please check your CRM and reach out to the customer directly.</p>
      `,
    });
  } catch (error) {
    console.error("Brevo escalation email error:", error);
  }
}

// 2. Send Order Confirmation (Pillar 4: Closer)
export async function sendOrderConfirmationEmail(customerEmail: string, productName: string, price: number) {
  try {
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_key_here') {
      console.log(`[Simulation] Order Confirmation Email sent to: ${customerEmail}`);
      return;
    }
    await transporter.sendMail({
      from: '"FunStore Support" <orders@funstore.local>',
      to: customerEmail,
      subject: `🎉 Your FunStore Order Confirmation (#${Math.floor(Math.random() * 899999 + 100000)})`,
      html: `
        <h2>Thank you for your order! 🚀</h2>
        <p>We are excited to let you know that your order has been received and is being processed.</p>
        <div style="background:#f4f4f5; padding:16px; border-radius:8px;">
          <h3>Order Details:</h3>
          <p><strong>Item:</strong> ${productName}</p>
          <p><strong>Total Paid:</strong> $${price.toFixed(2)}</p>
        </div>
        <p>Our AI assistant FunBot appreciates your business! Enjoy your new premium tech.</p>
      `,
    });
  } catch (error) {
    console.error("Brevo order email error:", error);
  }
}
