import { NextApiRequest, NextApiResponse } from "next";
import {getSubscriptionStateFromDatabase} from "../../app/firebase/firebaseAdmin"; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Missing or invalid email parameter" });
    }

    try {
      const subscriptionState = await getSubscriptionStateFromDatabase(email);
      res.status(200).json(subscriptionState);
    } catch (error) {
      console.error("Error fetching subscription state:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}