import { Calendar, MapPin, Clock, Users, ArrowLeft, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Event } from '../types/event';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onBook: () => void;
}

export function EventDetail({ event, onBack, onBook }: EventDetailProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Book Button - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-40 lg:hidden">
        <button
          onClick={onBook}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${
            event.approvalRequired
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/50'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50'
          }`}
        >
          {event.approvalRequired ? 'Request Approval' : 'Book Tickets Now'}
        </button>
      </div>

      {/* Sticky Book Button - Desktop */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <button
          onClick={onBook}
          className={`px-8 py-4 rounded-xl text-white font-bold text-lg shadow-2xl transition-all hover:scale-105 ${
            event.approvalRequired
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/50'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50'
          }`}
        >
          {event.approvalRequired ? 'Request Approval' : 'Book Tickets Now'}
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <img
            src={event.bannerImage || '/placeholder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
            // onError={(e) => {
            //   (e.target as HTMLImageElement).src = '/placeholder.jpg';
            // }}
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 rounded-xl bg-black/50 backdrop-blur-md border border-zinc-800 text-white hover:bg-black/70 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Category Badge */}
        <div className="absolute top-6 right-6">
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            {event.category}
          </span>
        </div>

        {event.approvalRequired && (
          <div className="absolute top-20 right-6">
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">
              Approval Required
            </span>
          </div>
        )}

        {/* Title & Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-xl text-zinc-300 mb-6">{event.subtitle}</p>
              
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>{event.seatsLeft} seats left</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-zinc-300 leading-relaxed">{event.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule?.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800"
                    >
                      <div className="text-cyan-400 font-bold text-lg min-w-[80px]">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-zinc-400 text-sm">{item.description}</p>
                        {item.speaker && (
                          <p className="text-cyan-400 text-sm mt-2">Speaker: {item.speaker}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Speakers/Artists */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Featured Artists</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {event.speakers.map(speaker => (
                    <div key={speaker.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <img 
                        src={speaker.image} 
                        alt={speaker.name}
                        className="w-full aspect-square object-cover rounded-xl mb-4"
                      />
                      <h4 className="text-white font-bold text-lg">{speaker.name}</h4>
                      <p className="text-cyan-400 text-sm mb-2">{speaker.title}</p>
                      <p className="text-zinc-400 text-sm">{speaker.bio}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {event.faqs && event.faqs.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {event.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
                      >
                        <span className="text-white font-semibold pr-4">{faq.question}</span>
                        {expandedFaq === idx ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-5 pb-5">
                          <p className="text-zinc-400">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Tiers */}
            <div className="sticky top-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                <h3 className="text-2xl font-bold text-white mb-4">Ticket Options</h3>
                <div className="space-y-3">
                  {event.ticketTiers?.map(tier => (
                    <div key={tier.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-bold">{tier.name}</h4>
                        <p className="text-cyan-400 font-bold text-lg">₹{tier.price}</p>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">{tier.description}</p>
                      <p className="text-xs text-zinc-500">{tier.seatsAvailable} seats available</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onBook}
                  className={`w-full mt-4 py-3 rounded-xl text-white font-bold transition-all ${
                    event.approvalRequired
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/50'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50'
                  }`}
                >
                  {event.approvalRequired ? 'Request Access' : 'Book Now'}
                </button>
              </div>

              {/* Venue Info */}
              <div className="mt-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-3">Venue</h3>

                <p className="text-white font-semibold mb-1">{event.venue}</p>
                <p className="text-zinc-400 text-sm mb-4">{event.address}</p>

                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  {event.venueMap ? (
                    <iframe
                      src={`${event.venueMap}&output=embed`}
                      className="w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* Organizer */}
              <div className="mt-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-3">Organized by</h3>
                <p className="text-white font-semibold">{event.organizer.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
