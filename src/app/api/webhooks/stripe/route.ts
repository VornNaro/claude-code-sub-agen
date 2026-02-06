import { NextRequest, NextResponse } from "next/server";

/**
 * Stripe Webhook Handler (Placeholder)
 *
 * In production this endpoint receives events from Stripe and processes them
 * (e.g. fulfilling orders after successful payment). For now we log the event
 * and return 200 OK so the webhook handshake succeeds.
 *
 * Setup:
 *   1. Set STRIPE_WEBHOOK_SECRET in your environment variables.
 *   2. Point your Stripe webhook to <app-url>/api/webhooks/stripe.
 *   3. Uncomment the signature verification block below.
 */

// Stripe sends the raw body, so we must NOT parse it as JSON automatically.
// Next.js App Router route handlers give us `request.text()` for the raw body.

export async function POST(request: NextRequest) {
  const body = await request.text();
  // Used for signature verification when STRIPE_WEBHOOK_SECRET is configured.
  const _signature = request.headers.get("stripe-signature");

  // --------------------------------------------------------------------------
  // Signature verification (uncomment when STRIPE_WEBHOOK_SECRET is set)
  // --------------------------------------------------------------------------
  // import Stripe from "stripe";
  //
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //   apiVersion: "2024-12-18.acacia",
  // });
  //
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  // } catch (err) {
  //   const message = err instanceof Error ? err.message : "Unknown error";
  //   console.error(`Webhook signature verification failed: ${message}`);
  //   return NextResponse.json(
  //     { error: "Webhook signature verification failed" },
  //     { status: 400 }
  //   );
  // }

  // --------------------------------------------------------------------------
  // Parse the event without verification (development only)
  // --------------------------------------------------------------------------

  let event: { id: string; type: string; data: { object: Record<string, unknown> } };

  try {
    event = JSON.parse(body);
  } catch {
    console.error("Failed to parse webhook body as JSON");
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // --------------------------------------------------------------------------
  // Handle specific event types
  // --------------------------------------------------------------------------

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `[Stripe Webhook] checkout.session.completed - Session ID: ${session.id}`
      );
      // In production you would:
      //   1. Look up the order by session metadata (e.g. session.metadata.orderId)
      //   2. Update the order status in the database to "paid"
      //   3. Send a confirmation email to the customer
      //   4. Trigger any fulfillment workflows
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(
        `[Stripe Webhook] payment_intent.succeeded - PI ID: ${paymentIntent.id}`
      );
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log(
        `[Stripe Webhook] payment_intent.payment_failed - PI ID: ${paymentIntent.id}`
      );
      // In production: update order status, notify user, etc.
      break;
    }

    default: {
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  }

  // Always acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
