// /**
//  * API Service Layer
//  * Simulates backend API calls with mock responses
//  * Replace with actual API calls in production
//  */

// const API_BASE_URL =
//   (import.meta as any).env?.VITE_API_URL || "http://localhost:9001/v1";


// // Helper function to simulate API delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // Helper function to simulate API calls
// async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
//   // Simulate network delay
//   await delay(800);

//   // In production, this would be:
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options?.headers,
//     },
//   });
//   return response.json();

//   // Mock response for demo
//   console.log(`API Call: ${options?.method || 'GET'} ${endpoint}`, options?.body);
//   throw new Error('API call is mocked. Implement actual backend integration.');
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: {
//     code: string;
//     message: string;
//     details?: string;
//   };
//   timestamp: string;
// }

// export interface PaginatedResponse<T> {
//   items: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// // ==================== Events API ====================

// export interface GetEventsParams {
//   page?: number;
//   limit?: number;
//   city?: string;
//   category?: string;
//   startDate?: string;
//   endDate?: string;
//   featured?: boolean;
// }

// export async function getEvents(params: GetEventsParams = {}) {
//   const queryParams = new URLSearchParams();
//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined) {
//       queryParams.append(key, String(value));
//     }
//   });

//   const endpoint = `/events?${queryParams.toString()}`;
  
//   // Example mock response
//   return {
//     success: true,
//     data: {
//       events: [],
//       pagination: {
//         page: params.page || 1,
//         limit: params.limit || 20,
//         total: 0,
//         totalPages: 0
//       }
//     },
//     timestamp: new Date().toISOString()
//   };
// }

// export async function getEventById(eventId: string) {
//   const endpoint = `/events/${eventId}`;
//   return apiCall(endpoint);
// }

// // ==================== Bookings API ====================

// export interface CreateBookingData {
//   eventId: string;
//   ticketTierId: string;
//   quantity: number;
//   attendee: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//   };
//   addOns?: string[];
//   promoCode?: string;
//   paymentMethod: {
//     type: 'card';
//     token: string;
//   };
// }

// export interface BookingResponse {
//   id: string;
//   confirmationCode: string;
//   status: 'confirmed' | 'pending' | 'cancelled';
//   eventId: string;
//   eventTitle: string;
//   eventDate: string;
//   venue: {
//     name: string;
//     address: string;
//   };
//   tickets: Array<{
//     id: string;
//     qrCode: string;
//     ticketNumber: string;
//     tier: string;
//     attendeeName: string;
//   }>;
//   attendee: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//   };
//   pricing: {
//     subtotal: number;
//     addOnsTotal: number;
//     discount: number;
//     tax: number;
//     total: number;
//     currency: string;
//   };
//   payment: {
//     transactionId: string;
//     method: string;
//     status: string;
//     paidAt: string;
//   };
//   addOns: Array<{
//     id: string;
//     name: string;
//     price: number;
//   }>;
//   createdAt: string;
// }

// export async function createBooking(data: CreateBookingData): Promise<ApiResponse<{ booking: BookingResponse }>> {
//   const endpoint = '/bookings';
  
//   // Mock successful booking response
//   await delay(1500); // Simulate payment processing
  
//   return {
//     success: true,
//     data: {
//       booking: {
//         id: `bkg_${Math.random().toString(36).substr(2, 9)}`,
//         confirmationCode: `SWE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
//         status: 'confirmed',
//         eventId: data.eventId,
//         eventTitle: 'Event Title',
//         eventDate: new Date().toISOString(),
//         venue: {
//           name: 'Venue Name',
//           address: 'Venue Address'
//         },
//         tickets: Array.from({ length: data.quantity }, (_, i) => ({
//           id: `tkt_${Math.random().toString(36).substr(2, 9)}`,
//           qrCode: `https://cdn.swevenevents.com/qr/tkt_${i}.png`,
//           ticketNumber: `SWE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//           tier: 'Ticket Tier',
//           attendeeName: `${data.attendee.firstName} ${data.attendee.lastName}`
//         })),
//         attendee: data.attendee,
//         pricing: {
//           subtotal: 100 * data.quantity,
//           addOnsTotal: (data.addOns?.length || 0) * 25,
//           discount: data.promoCode ? 20 : 0,
//           tax: 15,
//           total: (100 * data.quantity) + ((data.addOns?.length || 0) * 25) - (data.promoCode ? 20 : 0) + 15,
//           currency: 'USD'
//         },
//         payment: {
//           transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
//           method: 'Visa ending in 4242',
//           status: 'completed',
//           paidAt: new Date().toISOString()
//         },
//         addOns: [],
//         createdAt: new Date().toISOString()
//       }
//     },
//     timestamp: new Date().toISOString()
//   };
// }

// export async function getUserBookings(params: { status?: string; page?: number; limit?: number } = {}) {
//   const endpoint = `/bookings`;
//   return apiCall(endpoint);
// }

// export async function getBookingById(bookingId: string) {
//   const endpoint = `/bookings/${bookingId}`;
//   return apiCall(endpoint);
// }

// export async function cancelBooking(bookingId: string) {
//   const endpoint = `/bookings/${bookingId}`;
//   return apiCall(endpoint, { method: 'DELETE' });
// }

// // ==================== Promo Codes API ====================

// export interface ValidatePromoCodeData {
//   code: string;
//   eventId: string;
//   ticketTierId: string;
//   quantity: number;
// }

// export interface PromoCodeValidationResponse {
//   valid: boolean;
//   code: string;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number;
//   applicableAmount: number;
//   discountAmount: number;
//   finalAmount: number;
//   message: string;
// }

// export async function validatePromoCode(data: ValidatePromoCodeData): Promise<ApiResponse<PromoCodeValidationResponse>> {
//   const endpoint = '/promo-codes/validate';
  
//   await delay(500);
  
//   // Mock validation - accept EARLYBIRD, VIP2026, STUDENT15
//   const validCodes = ['EARLYBIRD', 'VIP2026', 'STUDENT15'];
//   const isValid = validCodes.includes(data.code.toUpperCase());
  
//   if (!isValid) {
//     return {
//       success: false,
//       error: {
//         code: 'INVALID_PROMO_CODE',
//         message: 'Promo code is not valid',
//         details: `Code ${data.code} does not exist or is not applicable to this event`
//       },
//       timestamp: new Date().toISOString()
//     };
//   }
  
//   const discountValue = data.code.toUpperCase() === 'EARLYBIRD' ? 20 : 15;
//   const applicableAmount = 100 * data.quantity; // Mock price
//   const discountAmount = (applicableAmount * discountValue) / 100;
  
//   return {
//     success: true,
//     data: {
//       valid: true,
//       code: data.code.toUpperCase(),
//       discountType: 'percentage',
//       discountValue,
//       applicableAmount,
//       discountAmount,
//       finalAmount: applicableAmount - discountAmount,
//       message: 'Promo code applied successfully'
//     },
//     timestamp: new Date().toISOString()
//   };
// }

// // ==================== Organizer API ====================

// export interface CreateEventData {
//   title: string;
//   subtitle: string;
//   description: string;
//   category: string;
//   date: string;
//   endDate?: string;
//   venue: {
//     name: string;
//     address: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     coordinates?: {
//       lat: number;
//       lng: number;
//     };
//   };
//   ticketTiers: Array<{
//     name: string;
//     price: number;
//     description: string;
//     totalSeats: number;
//     features: string[];
//   }>;
//   tags: string[];
//   isFeatured: boolean;
//   status: 'draft' | 'published';
// }

// export async function createEvent(data: CreateEventData) {
//   const endpoint = '/organizer/events';
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(data)
//   });
// }

// export async function getEventAnalytics(eventId: string, period: '7d' | '30d' | 'all' = '30d') {
//   const endpoint = `/organizer/events/${eventId}/analytics?period=${period}`;
//   return apiCall(endpoint);
// }

// export interface CreatePromoCodeData {
//   code: string;
//   discountType: 'percentage' | 'fixed';
//   discountValue: number;
//   maxUses: number;
//   validFrom: string;
//   validUntil: string;
//   applicableTiers?: string[];
//   minimumPurchase?: number;
// }

// export async function createPromoCode(eventId: string, data: CreatePromoCodeData) {
//   const endpoint = `/organizer/events/${eventId}/promo-codes`;
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(data)
//   });
// }

// // ==================== Notifications API ====================

// export interface SendNotificationData {
//   type: 'reminder' | 'update' | 'cancellation';
//   channel: Array<'email' | 'sms'>;
//   template: string;
//   scheduledFor?: string;
//   recipientFilter: {
//     bookingStatus?: string;
//   };
// }

// export async function sendEventNotification(eventId: string, data: SendNotificationData) {
//   const endpoint = `/organizer/events/${eventId}/notifications`;
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(data)
//   });
// }

// // ==================== Authentication API ====================

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   user: {
//     id: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     role: string;
//   };
//   token: string;
//   refreshToken: string;
//   expiresIn: number;
// }

// export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
//   const endpoint = '/auth/login';
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(credentials)
//   });
// }

// export async function organizerLogin(credentials: LoginCredentials) {
//   const endpoint = '/auth/organizer/login';
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(credentials)
//   });
// }

// export async function loginOrganizer(credentials: LoginCredentials) {
//   const endpoint = '/auth/organizer/login';
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify(credentials)
//   });
// }


// export async function refreshToken(refreshToken: string) {
//   const endpoint = '/auth/refresh';
//   return apiCall(endpoint, {
//     method: 'POST',
//     body: JSON.stringify({ refreshToken })
//   });
// }

// export async function logout() {
//   const endpoint = '/auth/logout';
//   return apiCall(endpoint, {
//     method: 'POST'
//   });
// }

// // ==================== Webhook Verification ====================

// export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
//   // In production, implement HMAC verification
//   // Example using crypto:
//   // const crypto = require('crypto');
//   // const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
//   // return hash === signature;
  
//   return true; // Mock implementation
// }

// export default {
//   // Events
//   getEvents,
//   getEventById,
  
//   // Bookings
//   createBooking,
//   getUserBookings,
//   getBookingById,
//   cancelBooking,
  
//   // Promo Codes
//   validatePromoCode,
  
//   // Organizer
//   createEvent,
//   getEventAnalytics,
//   createPromoCode,
//   sendEventNotification,
  
//   // Auth
//   login,
//   organizerLogin,
//   loginOrganizer,
//   refreshToken,
//   logout,
  
//   // Utils
//   verifyWebhookSignature
// };


/**
 * Sweven Events — API Client
 * Production-ready fetch wrapper
 * Works with Vite + Spring Boot JWT
 */

//////////////////////////////
// ✅ BASE URL (VITE SAFE)
//////////////////////////////

const API_BASE_URL =
  (import.meta as any).VITE_API_URL || "http://localhost:9001/sweven_events/v1";

//////////////////////////////
// ✅ TOKEN MANAGER
//////////////////////////////

export const tokenManager = {

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  setTokens(access: string, refresh: string) {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

//////////////////////////////
// ✅ FETCH WRAPPER
//////////////////////////////

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  
  if(endpoint == "/auth/organizer/login"){
    tokenManager.clear(); // Clear tokens on login endpoint to avoid conflicts
  }
  const token = tokenManager.getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",

        // inject JWT automatically
        ...(token && {
          Authorization: `Bearer ${token}`
        }),

        ...options.headers,
      },
    }
  );

  //////////////////////////////////////
  // ✅ AUTO HANDLE ERRORS
  //////////////////////////////////////

  if (!response.ok) {

    // Try reading error body
    let message = "API Error";

    try {
      const err = await response.text();
      if (err) message = err;
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

//////////////////////////////////////////////////////
// 🔐 AUTH TYPES
//////////////////////////////////////////////////////

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

//////////////////////////////////////////////////////
// 🔐 AUTH API
//////////////////////////////////////////////////////

/**
 * Organizer Login
 */
export async function loginOrganizer(
  credentials: LoginCredentials
): Promise<AuthResponse> {

  const data = await apiCall<AuthResponse>(
    "/auth/organizer/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  );

  // ✅ store tokens immediately
  tokenManager.setTokens(
    data.accessToken,
    data.refreshToken
  );

  return data;
}

/**
 * Refresh Access Token
 */
export async function refreshAccessToken(): Promise<AuthResponse> {

  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const data = await apiCall<AuthResponse>(
    "/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({
        refreshToken
      }),
    }
  );

  tokenManager.setTokens(
    data.accessToken,
    data.refreshToken
  );

  return data;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {

  try {
    await apiCall<void>(
      "/auth/logout",
      {
        method: "POST",
      }
    );
  }
  finally {
    // even if API fails — clear tokens
    tokenManager.clear();
  }
}

//////////////////////////////////////////////////////
// 🎟 EVENT TYPES
//////////////////////////////////////////////////////

export interface CreateEventData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  endDate?: string;

  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  totalSeats: number;

  ticketTiers: {
    name: string;
    price: number;
    description: string;
    totalTierSeats: number;
    features: string[];
  }[];

  tags: string[];

  isFeatured: boolean;
  status: "draft" | "published";
}

//////////////////////////////////////////////////////
// 🎟 EVENT API
//////////////////////////////////////////////////////

/**
 * Create Event (Organizer Only)
 */
// export async function createEvent(
//   data: CreateEventData
// ): Promise<void> {

//   return apiCall<void>(
//     "/event/create",
//     {
//       method: "POST",
//       body: JSON.stringify(data),
//     }
//   );
// }
export const createEvent = async (formData: FormData) => {
  const response = await fetch(
    'http://localhost:9001/sweven_events/v1/event/create',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create event');
  }

  return response.text();
};

export const requestBooking = async (data: any) => {
  const res = await fetch('http://localhost:9001/sweven_events/v1/booking/requestBooking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error('Failed to submit booking request');
  }

  return res.json();
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:9001/sweven_events/v1/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.text(); // returns URL
};



//////////////////////////////////////////////////////
// FEATURED GET  
//////////////////////////////////////////////////////
export const getFeaturedEvent = async () => {
  const response = await fetch('http://localhost:9001/sweven_events/v1/event/featured');

  if (!response.ok) {
    throw new Error('Failed to fetch featured event');
  }

  return response.json();
};

export const getUpcomingEvents = async () => {
  const res = await fetch(
    'http://localhost:9001/sweven_events/v1/event/upcoming'
  );

  if (!res.ok) {
    throw new Error('Failed to fetch upcoming events');
  }

  return res.json();
};
//////////////////////////////////////////////////////
// EXPORT DEFAULT (optional)
//////////////////////////////////////////////////////

export default {
  loginOrganizer,
  refreshAccessToken,
  logout,
  createEvent,
};

