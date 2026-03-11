export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  seatsAvailable: number;
  totalSeats: number;
  features: string[];
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface Schedule {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker: string;
  orderIndex: number;
}

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  city: string;
  address: string;
  image: string;
  bannerImage: string;
  ticketTiers: TicketTier[];
  speakers?: Speaker[];
  schedule?: Schedule[];
  totalSeats: number;
  seatsLeft: number;
  isFeatured: boolean;
  approvalRequired?: boolean;
  tags: string[];
  organizer: {
    name: string;
    logo?: string;
  };
  venueMap?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketTierId: string;
  quantity: number;
  addOns: string[];
  promoCode?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}
