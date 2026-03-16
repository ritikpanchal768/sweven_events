import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { EventCard } from './components/EventCard';
import { Countdown } from './components/Countdown';
import { BookingModal } from './components/BookingModal';
import { EventDetail } from './components/EventDetail';
import { EventsView } from './components/EventsView';
import { AdminDashboard } from './components/AdminDashboard';
import { OrganizerLogin } from './components/OrganizerLogin';
import { mockEvents } from './data/mockEvents';
import { Event } from './types/event';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Shield, Zap } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getFeaturedEvent , getUpcomingEvents} from './services/api';
import { InstagramGallery } from './components/InstagramGallery';

type Page = 'home' | 'events' | 'eventDetail' | 'admin' | 'adminLogin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(false);

  // 🔥 NEW: Featured Event from API
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const apiEvent = await getFeaturedEvent();

      const mappedEvent: Event = {
        id: apiEvent.id,
        title: apiEvent.title,
        subtitle: apiEvent.subtitle || '',
        description: apiEvent.description || '',
        category: apiEvent.category || '',
        date: apiEvent.date,
        endDate: apiEvent.endDate || apiEvent.date,
        time: new Date(apiEvent.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        venue: apiEvent.venue,
        city: apiEvent.city,
        address: apiEvent.address || '',
        image: apiEvent.bannerImage || '',
        bannerImage: apiEvent.bannerImage || '',

        ticketTiers: (apiEvent.ticketTiers || []).map((tier: any) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price,
          description: tier.description || '',
          seatsAvailable: tier.seatsAvailable ?? tier.totalSeats ?? 0,
          totalSeats: tier.totalSeats ?? 0,
          features: tier.features ?? []
        })),

        // ✅ FIXED
        schedule: (apiEvent.schedule || []).map((item: any) => ({
          id: item.id,
          time: item.time,
          title: item.title,
          description: item.description,
          speaker: item.speaker,
          orderIndex: item.orderIndex
        })),

        speakers: (apiEvent.speakers || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          title: s.title,
          bio: s.bio,
          image: s.image
        })),
        totalSeats: apiEvent.totalSeats ?? 0,
        seatsLeft: apiEvent.seatsLeft ?? 0,
        isFeatured: true,
        approvalRequired: apiEvent.approvalRequired ?? false,
        tags: apiEvent.tags ?? [],
        organizer: {
          name: apiEvent.organizer?.name || 'Sweven Events'
        },
        venueMap: apiEvent.venueMap || '',
        faqs: apiEvent.faqs ?? [],
      };


      setFeaturedEvent(mappedEvent);

    } catch (error) {
      console.error('Error loading featured event:', error);

      const fallback =
        mockEvents.find(e => e.isFeatured) || mockEvents[0];

      setFeaturedEvent(fallback);
    } finally {
      setLoadingFeatured(false);
    }
  };

  fetchFeatured();
}, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiEvent = await getFeaturedEvent();

        const mappedEvent: Event = {
          id: apiEvent.id,
          title: apiEvent.title,
          subtitle: apiEvent.subtitle || '',
          description: apiEvent.description || '',
          category: apiEvent.category || '',
          date: apiEvent.date,
          endDate: apiEvent.endDate || apiEvent.date,
          time: new Date(apiEvent.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          venue: apiEvent.venue,
          city: apiEvent.city,
          address: apiEvent.address || '',
          image: apiEvent.bannerImage || '',
          bannerImage: apiEvent.bannerImage || '',

          ticketTiers: (apiEvent.ticketTiers || []).map((tier: any) => ({
            id: tier.id,
            name: tier.name,
            price: tier.price,
            description: tier.description || '',
            seatsAvailable: tier.seatsAvailable ?? tier.totalSeats ?? 0,
            totalSeats: tier.totalSeats ?? 0,
            features: tier.features ?? []
          })),

          // ✅ FIXED
          schedule: (apiEvent.schedule || []).map((item: any) => ({
            id: item.id,
            time: item.time,
            title: item.title,
            description: item.description,
            speaker: item.speaker,
            orderIndex: item.orderIndex
          })),

          speakers: (apiEvent.speakers || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            title: s.title,
            bio: s.bio,
            image: s.image
          })),
          totalSeats: apiEvent.totalSeats ?? 0,
          seatsLeft: apiEvent.seatsLeft ?? 0,
          isFeatured: true,
          approvalRequired: apiEvent.approvalRequired ?? false,
          tags: apiEvent.tags ?? [],
          organizer: {
            name: apiEvent.organizer?.name || 'Sweven Events'
          },
          venueMap: apiEvent.venueMap || '',
          faqs: apiEvent.faqs ?? [],
        };


        setFeaturedEvent(mappedEvent);

      } catch (error) {
        console.error('Error loading featured event:', error);

        const fallback =
          mockEvents.find(e => e.isFeatured) || mockEvents[0];

        setFeaturedEvent(fallback);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);
  
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingEvents();

        const mapped: Event[] = data.map((apiEvent: any) => {
          const tiers = (apiEvent.ticketTiers || []).map((tier: any) => ({
            id: tier.id,
            name: tier.name,
            price: tier.price ?? 0,
            description: tier.description || '',
            seatsAvailable: tier.seatsAvailable ?? tier.totalSeats ?? 0,
            totalSeats: tier.totalSeats ?? 0,
            features: tier.features ?? []
          }));

          return {
            id: apiEvent.id,
            title: apiEvent.title,
            subtitle: apiEvent.subtitle || '',
            description: apiEvent.description || '',
            category: apiEvent.category || '',
            date: apiEvent.date,
            endDate: apiEvent.endDate || apiEvent.date,
            time: new Date(apiEvent.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            venue: apiEvent.venue || '',
            city: apiEvent.city || '',
            address: apiEvent.address || '',
            image: apiEvent.bannerImage || '',
            bannerImage: apiEvent.bannerImage || '',
            totalSeats: apiEvent.totalSeats ?? 0,
            seatsLeft: apiEvent.seatsLeft ?? 0,
            approvalRequired: apiEvent.approvalRequired ?? false,
            ticketTiers: tiers,
            schedule: apiEvent.schedule || [],
            speakers: apiEvent.speakers || [],
            tags: apiEvent.tags || [],
            organizer: {
              name: apiEvent.organizer?.name || 'Sweven Events'
            },
            venueMap: apiEvent.venueMap || '',
            faqs: apiEvent.faqs || []
          };
        });

        setUpcomingEvents(mapped);
      } catch (err) {
        console.error('Failed to load upcoming events', err);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchUpcoming();
  }, []);

  // Keep upcoming events from mock (UI unchanged)
  // const upcomingEvents = mockEvents.filter(
  //   e => e.id !== featuredEvent?.id
  // );

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentPage('eventDetail');
  };

  const handleBookClick = (event: Event) => {
    setBookingEvent(event);
  };

  const handleNavigate = (page: 'home' | 'events' | 'admin') => {
    if (page === 'admin') {
      if (!isOrganizerLoggedIn) {
        setCurrentPage('adminLogin');
      } else {
        setCurrentPage('admin');
      }
    } else {
      setCurrentPage(page);
      setSelectedEvent(null);
    }
  };

  const handleOrganizerLogin = (email: string, password: string) => {
    console.log('Organizer login:', email);
    setIsOrganizerLoggedIn(true);
    setCurrentPage('admin');
  };

  const handleOrganizerLogout = () => {
    setIsOrganizerLoggedIn(false);
    setCurrentPage('home');
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    swipeToSlide: true,
    touchMove: true,
    draggable: false, // 🔥 ADD THIS
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        onClose={() => setCurrentPage('home')}
        onLogout={handleOrganizerLogout}
      />
    );
  }

  if (currentPage === 'eventDetail' && selectedEvent) {
    return (
      <>
        <EventDetail
          event={selectedEvent}
          onBack={() => setCurrentPage('home')}
          onBook={() => handleBookClick(selectedEvent)}
        />
        {bookingEvent && (
          <BookingModal
            event={bookingEvent}
            onClose={() => setBookingEvent(null)}
          />
        )}
      </>
    );
  }

  if (currentPage === 'events') {
    return (
      <>
        <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
        {/* <EventsView events={mockEvents} onEventClick={handleEventClick} /> */}
        <EventsView events={upcomingEvents} onEventClick={handleEventClick} />
        {bookingEvent && (
          <BookingModal
            event={bookingEvent}
            onClose={() => setBookingEvent(null)}
          />
        )}
      </>
    );
  }

  if (currentPage === 'adminLogin') {
    return (
      <OrganizerLogin
        onLogin={handleOrganizerLogin}
        onCancel={() => setCurrentPage('home')}
      />
    );
  }

  // ⛔ Loading state
  if (loadingFeatured || !featuredEvent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading featured event...
      </div>
    );
  }

  // 🧠 derive time from backend date
  const eventTime = new Date(featuredEvent.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-black">
      <Navigation onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredEvent.bannerImage || '/default-banner.jpg'}
            alt={featuredEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse pointer-event-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              NEXT BIG EVENT
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              {featuredEvent.title}
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl mx-auto">
              {featuredEvent.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12 text-white">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-cyan-400">
                  {new Date(featuredEvent.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-sm text-zinc-400">{eventTime}</span>
              </div>

              <div className="w-px bg-zinc-700" />

              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-cyan-400">
                  {featuredEvent.venue}
                </span>
                <span className="text-sm text-zinc-400">
                  {featuredEvent.city}
                </span>
              </div>

              <div className="w-px bg-zinc-700" />

              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-cyan-400">
                  ₹
                  {Math.min(
                    ...featuredEvent.ticketTiers.map(t => t.price)
                  )}
                </span>
                <span className="text-sm text-zinc-400">
                  Starting Price
                </span>
              </div>
            </div>

            <div className="mb-12 flex justify-center">
              <Countdown targetDate={featuredEvent.date} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             {featuredEvent.approvalRequired ? (
                  <button
                    onClick={() => handleBookClick(featuredEvent)}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
                  >
                    Request Approval
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleBookClick(featuredEvent)}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105"
                  >
                    Book Tickets Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

              <button
                onClick={() => handleEventClick(featuredEvent)}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Details
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-zinc-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">50K+ Happy Attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">Instant Confirmation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
  

      {/* Upcoming Events Carousel */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Upcoming Events</h2>
                <p className="text-zinc-400">Discover amazing experiences happening soon</p>
              </div>
              <button
                onClick={() => setCurrentPage('events')}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <Slider {...carouselSettings} className="event-carousel">
            {upcomingEvents
              // .filter(event => event.id !== featuredEvent?.id). -- KEEP ALL UPCOMING EVENTS
              .map(event => (
              <div key={event.id} className="px-3">
                <EventCard
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Instagram Gallery */}
      <InstagramGallery />

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Sweven Events?</h2>
            <p className="text-zinc-400 text-lg">The most trusted event booking platform</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast Booking',
                description: 'Complete your booking in under 60 seconds with our streamlined process',
                color: 'cyan'
              },
              {
                icon: Shield,
                title: 'Secure & Trusted',
                description: 'Your payment information is protected with bank-level encryption',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Instant Confirmation',
                description: 'Get your tickets immediately with QR codes sent to your email',
                color: 'purple'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-zinc-700 transition-all group hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Loved by Event-Goers</h2>
            <p className="text-zinc-400 text-lg">Hear what our customers have to say</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Music Enthusiast',
                content: 'The booking process was incredibly smooth! Got my tickets in less than a minute.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Tech Professional',
                content: 'Best event platform I\'ve used. The QR code tickets made entry so convenient.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Festival Lover',
                content: 'Love the variety of events and the instant confirmation. Highly recommend!',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Sweven Events
            </span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 Sweven Events. All rights reserved. | Premium event booking platform
          </p>
          
        </div>
      </footer>

      {/* Booking Modal */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          onClose={() => setBookingEvent(null)}
        />
      )}
    </div>
  );
}

export default App;