import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '../types/event';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  featured?: boolean;
}



export function EventCard({ event, onClick, featured = false }: EventCardProps) {
  const startingPrice = Math.min(...event.ticketTiers.map(t => t.price));
  const seatsPercentage = (event.seatsLeft / event.totalSeats) * 100;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900/90 to-black border border-zinc-800/50 cursor-pointer ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        {/* Seats Left Indicator */}
        {seatsPercentage < 30 && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              Only {event.seatsLeft} left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-zinc-400 mb-4 line-clamp-1">
          {event.subtitle}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>{formatDate(event.date)}</span>
            <span className="text-zinc-600">•</span>
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>{event.venue}, {event.city}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500">Starting from</p>
            <p className="text-2xl font-bold text-white">
              ${startingPrice}
              <span className="text-sm text-zinc-500 font-normal ml-1">/ ticket</span>
            </p>
          </div>
          
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all group-hover:gap-3">
            Book Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
      </div>
    </motion.div>
  );
}
