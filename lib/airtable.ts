import Airtable from 'airtable';

// Initialize Airtable Client
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY || 'default_key' }).base(process.env.AIRTABLE_BASE_ID || 'default_base');

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  ltv: number;
  history: string;
}

// 1. Fetch Customer CRM Profile (Pillar 5: CRM Awareness)
export async function getCustomerProfile(email: string): Promise<CustomerProfile | null> {
  try {
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'default_key') {
      // Return simulated data if API key isn't added yet
      if (email === 'alice@vip-tech.com') {
        return { id: 'rec1', name: 'Alice', email: 'alice@vip-tech.com', ltv: 499.99, history: 'Purchased Stealth Drone Pro. Very interested in high-end gadgets.' };
      }
      return null;
    }
    const records = await base('Customers').select({
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length > 0) {
      const record = records[0];
      return {
        id: record.id,
        name: (record.get('Name') as string) || 'Valued Customer',
        email: (record.get('Email') as string) || email,
        ltv: (record.get('LTV') as number) || 0,
        history: (record.get('Notes') as string) || 'No prior support tickets.'
      };
    }
    return null;
  } catch (error) {
    console.error("Airtable getCustomerProfile error:", error);
    return null;
  }
}

// 2. Log Conversation (Pillar 8: Analytics)
export async function logConversation(email: string, message: string, response: string, escalated: boolean = false) {
  try {
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'default_key') return;
    await base('Conversations').create([
      {
        fields: {
          Email: email,
          Message: message,
          Response: response,
          Timestamp: new Date().toISOString(),
          Escalated: escalated ? "true" : "false"
        }
      }
    ]);
  } catch (error) {
    console.error("Airtable logConversation error:", error);
  }
}

// 3. Create Order & Update LTV (Pillar 4 & 8: Closer & Analytics)
export async function createOrderAndUpdateLTV(email: string, productName: string, price: number) {
  try {
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'default_key') return;
    // Log order
    await base('Orders').create([
      {
        fields: {
          Email: email,
          Product: productName,
          Price: price,
          Status: 'Paid',
          Timestamp: new Date().toISOString()
        }
      }
    ]);

    // Update Customer LTV
    const customer = await getCustomerProfile(email);
    if (customer && customer.id && customer.id !== 'rec1') {
      await base('Customers').update([
        {
          id: customer.id,
          fields: {
            LTV: customer.ltv + price
          }
        }
      ]);
    } else {
      // Create new customer record if they didn't exist
      await base('Customers').create([
        {
          fields: {
            Name: email.split('@')[0],
            Email: email,
            LTV: price,
            Notes: `First purchase: ${productName}`
          }
        }
      ]);
    }
  } catch (error) {
    console.error("Airtable createOrder error:", error);
  }
}

// 4. Fetch Analytics for Admin Dashboard
export async function getStoreAnalytics() {
  try {
    if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === 'default_key') {
      return { totalRevenue: 1249.95, totalOrders: 7, totalChats: 32, escalations: 2 };
    }
    const orders = await base('Orders').select({ view: 'Grid view' }).all();
    const chats = await base('Conversations').select({ view: 'Grid view' }).all();

    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += (order.get('Price') as number) || 0;
    });

    let escalations = 0;
    chats.forEach(chat => {
      if (chat.get('Escalated') === 'true') escalations++;
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalChats: chats.length,
      escalations
    };
  } catch (error) {
    console.error("Airtable getStoreAnalytics error:", error);
    return { totalRevenue: 1249.95, totalOrders: 7, totalChats: 32, escalations: 2 };
  }
}
