const axios = require('axios');
require('dotenv').config();

async function sendLeadsToContextProcessor(leads) {
  try {
    const res = await axios.post(
    process.env.CONTEXT_PROCESSOR_API,
    leads,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTEXT_PROCESSOR_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

    console.log("Leads sent successfully:", res.data);
  } catch (err) {
    console.error("Error sending to context processor:",  err.response);
  }
}

// sendLeadsToContextProcessor(lead);

module.exports = { sendLeadsToContextProcessor };
