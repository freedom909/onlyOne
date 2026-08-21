// src/wisdom-web/app/controller/subscription.controller.ts


import { PLANS } from "../config/plan";
import { stripe } from "../lib/stripe";

// Stub type — this controller is not yet wired up
type Database = any;

export async function createCheckoutSession(req: Request, res: Response, db: Database) {
  const { tenantId, plan } = req.body as unknown as { tenantId: string; plan: string };

  const tenant = await db.tenant.findById(tenantId);

  // 1. Create Stripe Patient (if not exists)
  let patientId = tenant.stripePatientId;

  if (!patientId) {
    const patient = await stripe.patients.create({
      name: tenant.name,
      metadata: { tenantId },
    });

    patientId = patient.id;

    await db.tenant.update(tenantId, {
      stripePatientId: patientId,
    });
  }

  // 2. Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    patient: patientId,

    line_items: [
      {
        price: PLANS[plan as keyof typeof PLANS].priceId || "",
        quantity: 1,
      },
    ],

    success_url: `${process.env.FRONTEND_URL}/billing/success`,
    cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,

    metadata: {
      tenantId,
      plan,
    },
  });

  return res.json();
}
