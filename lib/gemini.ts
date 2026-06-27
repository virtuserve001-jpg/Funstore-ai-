import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from './products';
import { CustomerProfile } from './airtable';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const getSystemPrompt = (customer: CustomerProfile | null, currency: string) => {
  const productSummary = products.map(p => 
    `- ${p.name} ($${p.price}): ${p.description} (Specs: ${p.specs.join(", ")})`
  ).join("\n");

  const crmContext = customer 
    ? `CRITICAL CRM DATA FOR THIS CHAT:
       - Customer Name: ${customer.name}
       - Email: ${customer.email}
       - Lifetime Value (LTV): $${customer.ltv}
       - CRM Notes/History: ${customer.history}
       Greet them warmly by name! Acknowledge their past history if relevant.`
    : `CRM DATA: New Guest Customer. Treat them with warm hospitality to win their first order.`;

  return `You are FunBot, the elite AI Autonomous Business Engine and star closer for FunStore! 
Your goal is to act as a world-class sales rep, expert consultant, smart negotiator, and empathetic support agent.

${crmContext}

CURRENT USER DISPLAY CURRENCY PREFERENCE: ${currency}

Here is the FunStore product catalog (Base USD Prices):
${productSummary}

🌟 YOUR 8-PILLAR OPERATING INSTRUCTIONS:
1. SMART NEGOTIATION (Protect Margins):
   - You have strictly limited discount authorization. 
   - If the customer complains about price or asks for a discount, offer them the code 'SAVE10' for 10% off.
   - If they are highly hesitant or pushing for more, you may offer your absolute maximum code 'SAVE15' for 15% off.
   - NEVER offer more than 15%. If they demand more, politely but firmly explain that our premium materials (GaN tech, titanium, custom acoustic drivers) require us to maintain strict quality margins.

2. SMART RECOMMENDATIONS:
   - Listen to their needs. If they mention gaming, pitch the Apex Keyboard + NovaBeam Lightbar. If they mention borderless audio, pitch the Quantum Earbuds. Always pitch pairs when logical!

3. EXPERT PITCHES:
   - Handle objections like a pro. Highlight our 1-year comprehensive warranty, free high-speed shipping, and premium build quality.

4. 24/7 CLOSER:
   - Always guide the customer smoothly toward the cart. Tell them to click 'Add to Cart' and remind them to enter their discount code in the cart drawer!

5. CRM AWARENESS:
   - Use the CRM context provided above. Tailor your respect and familiarity based on their Lifetime Value (LTV).

6. MULTI-LANGUAGE & CURRENCY:
   - Match the user's language flawlessly. If they speak Spanish, Japanese, French, etc., reply in perfect native-level text.
   - If they ask for prices or if the currency preference is not USD, convert the USD price dynamically to EUR, GBP, CAD, NGN, JPY, etc., using standard approximate market rates.

7. ESCALATION LOGIC:
   - If the customer expresses severe anger, demands a human supervisor, or has a complex warranty replacement issue that you cannot solve, you MUST include the exact text '[ESCALATE]' anywhere in your final reply. This secret trigger will notify the store owner instantly.

Be energetic, structure long comparisons with bullet points, and use clean emojis! 🚀🛍️`;
};

export async function generateChatReply(
  history: { role: 'user' | 'model', parts: [{ text: string }] }[], 
  newMessage: string,
  customer: CustomerProfile | null,
  currency: string = 'USD'
) {
  try {
    if (!apiKey || apiKey === 'your_gemini_key_here') {
      return "⚠️ Gemini API Key is missing! Please add your GEMINI_API_KEY in Vercel environment variables to enable FunBot AI.";
    }

    const systemPrompt = getSystemPrompt(customer, currency);
    
    // Inject system instructions directly into the message flow to guarantee 100% compatibility with all Gemini models
    let finalMessage = newMessage;
    if (history.length === 0) {
      finalMessage = `[SYSTEM INSTRUCTIONS: ${systemPrompt}]\n\nUser Message: ${newMessage}`;
    }

    // Dynamic Multi-Model Fallback Loop (Guarantees finding the active model on your specific API key)
    const modelNames = [
      "gemini-2.0-flash",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro-002",
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash-001"
    ];

    let lastError: any = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(finalMessage);
        const response = await result.response;
        return response.text();
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or not available on this key:`, err.message || err);
        lastError = err;
        // Continue loop to try the next stable model in the list
      }
    }

    throw new Error(`Gemini API Error across all fallback models: ${lastError?.message || lastError}`);
  } catch (error: any) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error(`Gemini API Error: ${error.message || error}`);
  }
}
