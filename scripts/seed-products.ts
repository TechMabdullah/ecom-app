// This is a one-time script to add sample products to Firestore.
// Run it with: npx tsx scripts/seed-products.ts

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

const db = getFirestore(app);

const sampleProducts = [
  {
    name: "ESP32 DevKit V1",
    slug: "esp32-devkit-v1",
    description: "Dual-core Wi-Fi + Bluetooth microcontroller board, 30-pin, USB-C.",
    price: 899,
    images: ["https://placehold.co/600x600/1b2318/f0a93b?text=ESP32"],
    category: "Boards",
    stock: 80,
    featured: true,
  },
  {
    name: "Arduino Uno R3",
    slug: "arduino-uno-r3",
    description: "The classic ATmega328P board — the standard starting point for makers.",
    price: 2199,
    images: ["https://placehold.co/600x600/1b2318/f0a93b?text=Arduino+Uno"],
    category: "Boards",
    stock: 60,
    featured: true,
  },
  {
    name: "830-Point Breadboard",
    slug: "breadboard-830",
    description: "Solderless breadboard, full-size, dual power rails.",
    price: 599,
    images: ["https://placehold.co/600x600/1b2318/f0a93b?text=Breadboard"],
    category: "Prototyping",
    stock: 120,
    featured: false,
  },
  {
    name: "Jumper Wire Kit (120pc)",
    slug: "jumper-wire-kit",
    description: "Male-male, male-female, and female-female jumper wires, assorted lengths.",
    price: 799,
    images: ["https://placehold.co/600x600/1b2318/f0a93b?text=Jumper+Wires"],
    category: "Prototyping",
    stock: 200,
    featured: false,
  },
];

async function seed() {
  console.log("Seeding products...");
  for (const product of sampleProducts) {
    const ref = db.collection("products").doc(product.slug);
    await ref.set({
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(`Added: ${product.name}`);
  }
  console.log("Done seeding!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});