import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface Lead {
  // Replace with actual shape of a lead
  [key: string]: any;
}

export async function sendLeadsToContextProcessor(leads: Lead[] | Lead): Promise<void> {
  try {
    const res = await axios.post(
      process.env.CONTEXT_PROCESSOR_API as string,
      leads,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTEXT_PROCESSOR_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Leads sent successfully:", res.data);
  } catch (err: any) {
    console.error("Error sending to context processor:", err.response || err.message);
  }
}

