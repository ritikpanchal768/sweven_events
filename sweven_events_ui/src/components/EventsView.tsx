import { useEffect, useState } from 'react';
import { Grid3X3, Calendar as CalendarIcon, List, Search, SlidersHorizontal } from 'lucide-react';
import { Event } from '../types/event';
import { EventCard } from './EventCard';
import { motion } from 'framer-motion';
import { getUpcomingEvents} from '../services/api';

interface EventsViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

type ViewMode = 'grid' | 'calendar' | 'list';

export function EventsView({ events, onEventClick }: EventsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  const cities = ['all', ...Array.from(new Set(events.map(e => e.city)))];
  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || event.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    let matchesDate = true;
    if (selectedDate !== 'all') {
      const eventDate = new Date(event.date);
      const today = new Date();
      
      if (selectedDate === 'today') {
        matchesDate = eventDate.toDateString() === today.toDateString();
      } else if (selectedDate === 'thisWeek') {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesDate = eventDate >= today && eventDate <= weekFromNow;
      } else if (selectedDate === 'thisMonth') {
        matchesDate = eventDate.getMonth() === today.getMonth() && 
                     eventDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesCity && matchesCategory && matchesDate;
  });

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingEvents();

        const mapped: Event[] = data.map((apiEvent: any) => ({
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
          ticketTiers: (apiEvent.ticketTiers || []).map((tier: any) => ({
            id: tier.id,
            name: tier.name,
            price: tier.price ?? 0,
            description: tier.description || '',
            seatsAvailable: tier.seatsAvailable ?? tier.totalSeats ?? 0,
            totalSeats: tier.totalSeats ?? 0,
            features: tier.features ?? []
          })),
          schedule: apiEvent.schedule || [],
          speakers: apiEvent.speakers || [],
          tags: apiEvent.tags || [],
          organizer: {
            name: apiEvent.organizer?.name || 'Sweven Events'
          },
          venueMap: apiEvent.venueMap || '',
          faqs: apiEvent.faqs || []
        }));

        setUpcomingEvents(mapped);
      } catch (error) {
        console.error('Failed to load upcoming events', error);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchUpcoming();
  }, []);

  // Group events by month for calendar view
  const eventsByMonth = filteredEvents.reduce((acc, event) => {
    const monthYear = new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Upcoming Events</h1>
          <p className="text-zinc-400">Discover and book amazing events happening near you</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-zinc-400">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="space-y-12">
            {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
              <div key={monthYear}>
                <h2 className="text-2xl font-bold text-white mb-6">{monthYear}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredEvents.map((event, idx) => {
              const startingPrice = Math.min(...event.ticketTiers.map(t => t.price));
              const formatDate = (dateStr: string) => {
                return new Date(dateStr).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric'
                });
              };

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onEventClick(event)}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center text-white">
                        <span className="text-2xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-xs uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {event.category}
                        </span>
                        {event.seatsLeft < 100 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                            {event.seatsLeft} seats left
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                        <span>{formatDate(event.date)} • {event.time}</span>
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">From</p>
                        <p className="text-2xl font-bold text-white">${startingPrice}</p>
                      </div>
                      <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all whitespace-nowrap">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
