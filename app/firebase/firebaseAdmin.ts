import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Replace escaped newlines
    }),
  });
}

const db = admin.firestore();

// Function to get subscription state from Firestore
export const getSubscriptionStateFromDatabase = async (email: string) => {
  try {
    const customersSnapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .get();

    if (customersSnapshot.empty) {
      return { isSubscribed: false, isPlusSubscribed: false };
    }

    const customerDoc = customersSnapshot.docs[0];
    const subscriptionsSnapshot = await customerDoc.ref.collection("subscriptions").get();

    let isSubscribed = false;
    let isPlusSubscribed = false;

    subscriptionsSnapshot.forEach((doc) => {
      const subscription = doc.data();
      if (subscription.status === "active") {
        const priceId = subscription.priceId;
        if (priceId === "price_1RCWbMD0BkzW11TYts5MQ1X0") {
          isPlusSubscribed = true;
        } else if (priceId === "price_1RCWbMD0BkzW11TYItqzrbXJ") {
          isSubscribed = true;
        }
      }
    });

    return { isSubscribed, isPlusSubscribed };
  } catch (error) {
    console.error("Error querying Firestore:", error);
    throw new Error("Failed to fetch subscription state from database");
  }
};
export { db };