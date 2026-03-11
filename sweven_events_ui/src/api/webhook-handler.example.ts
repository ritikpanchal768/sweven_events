/**
 * Example Webhook Handler for Sweven Events
 * This example shows how to handle webhooks from Sweven Events API
 */

import crypto from 'crypto';

// Webhook event types
export type WebhookEventType =
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.cancelled'
  | 'payment.completed'
  | 'payment.failed'
  | 'ticket.scanned'
  | 'event.published'
  | 'event.cancelled';

export interface WebhookPayload {
  id: string;
  type: WebhookEventType;
  createdAt: string;
  data: any;
}

export interface BookingWebhookData {
  bookingId: string;
  eventId: string;
  status: string;
  totalAmount: number;
  ticketCount: number;
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface PaymentWebhookData {
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'failed';
  failureReason?: string;
}

export interface TicketWebhookData {
  ticketId: string;
  bookingId: string;
  eventId: string;
  scannedAt: string;
  location: string;
  scannedBy: string;
}

/**
 * Verify webhook signature
 * Ensures the webhook came from Sweven Events
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

/**
 * Main webhook handler
 * Route: POST /api/webhooks/sweven-events
 */
export async function handleWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<{ success: boolean; message: string }> {
  
  // 1. Verify the webhook signature
  if (!verifyWebhookSignature(payload, signature, secret)) {
    console.error('Invalid webhook signature');
    return { success: false, message: 'Invalid signature' };
  }

  // 2. Parse the payload
  let webhookData: WebhookPayload;
  try {
    webhookData = JSON.parse(payload);
  } catch (error) {
    console.error('Invalid JSON payload:', error);
    return { success: false, message: 'Invalid JSON' };
  }

  // 3. Handle the webhook based on event type
  try {
    switch (webhookData.type) {
      case 'booking.created':
        await handleBookingCreated(webhookData.data);
        break;
        
      case 'booking.confirmed':
        await handleBookingConfirmed(webhookData.data);
        break;
        
      case 'booking.cancelled':
        await handleBookingCancelled(webhookData.data);
        break;
        
      case 'payment.completed':
        await handlePaymentCompleted(webhookData.data);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(webhookData.data);
        break;
        
      case 'ticket.scanned':
        await handleTicketScanned(webhookData.data);
        break;
        
      case 'event.published':
        await handleEventPublished(webhookData.data);
        break;
        
      case 'event.cancelled':
        await handleEventCancelled(webhookData.data);
        break;
        
      default:
        console.warn('Unhandled webhook event type:', webhookData.type);
    }
    
    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, message: 'Processing error' };
  }
}

/**
 * Handler for booking.created event
 */
async function handleBookingCreated(data: BookingWebhookData) {
  console.log('New booking created:', data.bookingId);
  
  // Example actions:
  // 1. Update your database
  // 2. Send internal notification
  // 3. Trigger business logic
  // 4. Update inventory
  
  // await db.bookings.create({
  //   id: data.bookingId,
  //   eventId: data.eventId,
  //   status: data.status,
  //   totalAmount: data.totalAmount,
  //   ticketCount: data.ticketCount,
  //   attendee: data.attendee
  // });
  
  // await notificationService.send({
  //   to: 'admin@yourcompany.com',
  //   subject: 'New Booking Received',
  //   body: `Booking ${data.bookingId} created for ${data.attendee.firstName}`
  // });
}

/**
 * Handler for booking.confirmed event
 */
async function handleBookingConfirmed(data: BookingWebhookData) {
  console.log('Booking confirmed:', data.bookingId);
  
  // Example actions:
  // 1. Send confirmation email to customer
  // 2. Update booking status
  // 3. Generate tickets
  
  // await emailService.sendBookingConfirmation({
  //   to: data.attendee.email,
  //   bookingId: data.bookingId,
  //   ticketCount: data.ticketCount
  // });
}

/**
 * Handler for booking.cancelled event
 */
async function handleBookingCancelled(data: BookingWebhookData) {
  console.log('Booking cancelled:', data.bookingId);
  
  // Example actions:
  // 1. Update database
  // 2. Release inventory
  // 3. Process refund
  // 4. Send cancellation email
  
  // await db.bookings.update(data.bookingId, { status: 'cancelled' });
  // await inventoryService.releaseSeats(data.eventId, data.ticketCount);
  // await emailService.sendCancellationConfirmation(data.attendee.email);
}

/**
 * Handler for payment.completed event
 */
async function handlePaymentCompleted(data: PaymentWebhookData) {
  console.log('Payment completed:', data.transactionId);
  
  // Example actions:
  // 1. Update payment record
  // 2. Confirm booking
  // 3. Send receipt
  
  // await db.payments.create({
  //   transactionId: data.transactionId,
  //   bookingId: data.bookingId,
  //   amount: data.amount,
  //   currency: data.currency,
  //   status: 'completed'
  // });
  
  // await bookingService.confirm(data.bookingId);
}

/**
 * Handler for payment.failed event
 */
async function handlePaymentFailed(data: PaymentWebhookData) {
  console.log('Payment failed:', data.transactionId, data.failureReason);
  
  // Example actions:
  // 1. Update payment status
  // 2. Notify customer
  // 3. Cancel booking if needed
  
  // await db.payments.update(data.transactionId, { 
  //   status: 'failed',
  //   failureReason: data.failureReason
  // });
  
  // await emailService.sendPaymentFailureNotification({
  //   bookingId: data.bookingId,
  //   reason: data.failureReason
  // });
}

/**
 * Handler for ticket.scanned event
 */
async function handleTicketScanned(data: TicketWebhookData) {
  console.log('Ticket scanned:', data.ticketId, 'at', data.location);
  
  // Example actions:
  // 1. Update ticket status
  // 2. Track attendance
  // 3. Prevent duplicate entry
  
  // await db.tickets.update(data.ticketId, {
  //   scanned: true,
  //   scannedAt: data.scannedAt,
  //   location: data.location
  // });
  
  // await analyticsService.trackAttendance({
  //   eventId: data.eventId,
  //   location: data.location
  // });
}

/**
 * Handler for event.published event
 */
async function handleEventPublished(data: any) {
  console.log('Event published:', data.eventId);
  
  // Example actions:
  // 1. Update event cache
  // 2. Send notifications to subscribers
  // 3. Create marketing campaigns
  
  // await cacheService.invalidate(`event:${data.eventId}`);
  // await marketingService.createCampaign(data.eventId);
}

/**
 * Handler for event.cancelled event
 */
async function handleEventCancelled(data: any) {
  console.log('Event cancelled:', data.eventId);
  
  // Example actions:
  // 1. Process refunds for all bookings
  // 2. Send notifications to attendees
  // 3. Update event status
  
  // const bookings = await db.bookings.findByEvent(data.eventId);
  // for (const booking of bookings) {
  //   await refundService.processRefund(booking.id);
  //   await emailService.sendEventCancellationNotice(booking.attendee.email);
  // }
}

/**
 * Express.js Example Route Handler
 */
export function createWebhookRoute() {
  return async (req: any, res: any) => {
    const signature = req.headers['x-sweven-signature'];
    const webhookSecret = process.env.SWEVEN_WEBHOOK_SECRET;
    
    if (!signature || !webhookSecret) {
      return res.status(400).json({ error: 'Missing signature or secret' });
    }
    
    const payload = JSON.stringify(req.body);
    const result = await handleWebhook(payload, signature, webhookSecret);
    
    if (result.success) {
      return res.status(200).json({ received: true });
    } else {
      return res.status(400).json({ error: result.message });
    }
  };
}

/**
 * Next.js API Route Example
 * File: /pages/api/webhooks/sweven-events.ts
 */
export const nextJsWebhookHandler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const signature = req.headers['x-sweven-signature'];
  const webhookSecret = process.env.SWEVEN_WEBHOOK_SECRET;
  
  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or secret' });
  }
  
  const payload = JSON.stringify(req.body);
  const result = await handleWebhook(payload, signature, webhookSecret);
  
  if (result.success) {
    return res.status(200).json({ received: true });
  } else {
    return res.status(400).json({ error: result.message });
  }
};

export default {
  handleWebhook,
  verifyWebhookSignature,
  createWebhookRoute,
  nextJsWebhookHandler
};
