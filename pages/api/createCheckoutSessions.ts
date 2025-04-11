import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Ensure the Stripe secret key is defined
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil", // Updated API version
});

// Define the expected structure of the request body
interface CheckoutSessionRequestBody {
  lookupKey: string;
  productId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { lookupKey, productId } = req.body as CheckoutSessionRequestBody;

    if (!lookupKey || !productId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: lookupKey === "premium plus annual" ? "Premium Plus Yearly" : "Premium Monthly",
                metadata: { productId },
              },
              unit_amount: lookupKey === "premium plus annual" ? 9999 : 999, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Return the session ID to the client
      res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}