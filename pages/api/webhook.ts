import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { db } from "../../app/firebase/firebaseAdmin"; // Import Firestore instance

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export const config = {
  api: {
    bodyParser: false, // Stripe requires the raw body to validate the webhook signature
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_email!;
      const subscriptionId = session.subscription as string;

      try {
        // Fetch subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const priceId = subscription.items.data[0]?.price.id;

        // Add or update the customer in Firestore
        const customersSnapshot = await db
          .collection("customers")
          .where("email", "==", email)
          .get();

        let customerRef;

        if (customersSnapshot.empty) {
          // Create a new customer document if it doesn't exist
          customerRef = await db.collection("customers").add({
            email: email,
          });
        } else {
          // Use the existing customer document
          customerRef = customersSnapshot.docs[0].ref;
        }

        // Add or update the subscription in the customer's subcollection
        await customerRef.collection("subscriptions").doc(subscriptionId).set({
          status: subscription.status,
          priceId: priceId,
          items: subscription.items.data.map((item) => ({
            price: item.price.id,
            quantity: item.quantity,
          })),
        });

        console.log(`Customer ${email} updated in Firestore.`);
      } catch (error) {
        console.error("Error updating Firestore with subscription details:", error);
      }

      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}