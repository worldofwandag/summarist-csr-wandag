import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Ensure the Stripe secret key is defined
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

// Define the expected structure of the request body
interface CheckoutSessionRequestBody {
  lookupKey: string;
  email: string; // Include the user's email
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { lookupKey, email } = req.body as CheckoutSessionRequestBody;

    if (!lookupKey || !email) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      // Map the lookupKey to the corresponding price ID
      const priceId =
        lookupKey === "premium plus annual"
          ? "price_1RCWbMD0BkzW11TYts5MQ1X0" // Replace with your actual yearly price ID
          : "price_1RCWbMD0BkzW11TYItqzrbXJ"; // Replace with your actual monthly price ID

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email, // Attach the user's email to the session
        line_items: [
          {
            price: priceId, // Use the predefined price ID
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/for-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/choose-plan`,
      });

      // Return the session ID to the client
      res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.error("Error creating Stripe Checkout session:", err); // Log the error
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}