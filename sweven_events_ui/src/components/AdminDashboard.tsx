
import { 
  PlusCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Ticket, 
  Calendar,
  Mail,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createEvent, type CreateEventData } from '@/services/api';
import {
  DndContext,
  closestCenter,
  DragEndEvent
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import React, { useState, useCallback, useEffect } from 'react';
import { SocialMediaManager } from './SocialMediaManager';


interface AdminDashboardProps {
  onClose: () => void;
  onLogout?: () => void;
}

const SortableScheduleItem = React.memo(function SortableScheduleItem({
    item,
    handleScheduleChange,
    handleRemoveSchedule
  }: any) {

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="p-4 mb-4 rounded-xl bg-zinc-900 border border-zinc-800"
      >
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-cyan-400 mb-3"
        >
          ⠿ Drag to reorder (Step {item.orderIndex})
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="time"
            value={item.time}
            onChange={(e) =>
              handleScheduleChange(item.id, 'time', e.target.value)
            }
            className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white"
          />

          <input
            type="text"
            placeholder="Title"
            value={item.title}
            onChange={(e) =>
              handleScheduleChange(item.id, 'title', e.target.value)
            }
            className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white"
          />

          <input
            type="text"
            placeholder="Speaker"
            value={item.speaker}
            onChange={(e) =>
              handleScheduleChange(item.id, 'speaker', e.target.value)
            }
            className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white"
          />

          <textarea
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              handleScheduleChange(item.id, 'description', e.target.value)
            }
            className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white"
          />
        </div>

        <button
          onClick={() => handleRemoveSchedule(item.id)}
          className="text-red-400 text-sm mt-3"
        >
          Remove
        </button>
      </div>
    );
  });

export function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
      'overview' | 'create' | 'social' | 'analytics' | 'promos' | 'bookings'
    >('overview');

  const [bannerFile, setBannerFile] = useState<File | null>(null);


  // Mock data
  const stats = [
    { label: 'Total Events', value: '24', change: '+12%', icon: Calendar, color: 'cyan' },
    { label: 'Total Bookings', value: '1,847', change: '+28%', icon: Ticket, color: 'blue' },
    { label: 'Revenue', value: '$284,392', change: '+34%', icon: DollarSign, color: 'green' },
    { label: 'Active Users', value: '12,483', change: '+18%', icon: Users, color: 'purple' }
  ];

  const recentBookings = [
    { id: '1', event: 'ELECTRO PULSE FESTIVAL', customer: 'John Doe', tickets: 2, amount: 178, time: '5 min ago' },
    { id: '2', event: 'TECH SUMMIT 2026', customer: 'Jane Smith', tickets: 1, amount: 399, time: '12 min ago' },
    { id: '3', event: 'STARTUP EXPO', customer: 'Mike Johnson', tickets: 3, amount: 447, time: '23 min ago' },
    { id: '4', event: 'GLOBAL FOOD FESTIVAL', customer: 'Sarah Williams', tickets: 4, amount: 140, time: '1 hour ago' }
  ];

  const [eventForm, setEventForm] = useState({
    title: '',
    subtitle: '',
    category: 'Music',
    description: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    city: '',
    venue: '',
    address: '',
    state: '',
    zipCode: '',
    mapUrl: '',
    totalSeats: '',
    ticketTiers: [
      {
        tierName: '',
        tierDescription: '',
        totalTierSeats: '',
        price: '',
        features: '',
      }
    ],
    schedule: [
      {
        id: crypto.randomUUID(),
        time: '',
        title: '',
        description: '',
        speaker: '',
        orderIndex: 1
      }
    ],

    
    speakers: [
      {
        id: crypto.randomUUID(),
        name: '',
        title: '',
        bio: '',
        image: ''
      }
    ],
    faqs: [
      {
        question: '',
        answer: ''
      }
    ],
      

    features: '',
    tags: '',
    isFeatured: false,
    approvalRequired: false
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [events, setEvents] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchEvents();
    }
  }, [activeTab]);
  const fetchEvents = async () => {
    const res = await fetch('http://localhost:9001/sweven_events/v1/event/all');
    const data = await res.json();
    setEvents(data);
  };

  const fetchPendingBookings = async (eventId: string) => {
    const res = await fetch(
      `http://localhost:9001/sweven_events/v1/booking/admin/event/${eventId}/pendingBookings`
    );
    const data = await res.json();
    setPendingBookings(data);
    setSelectedEventId(eventId);
  };

  const approveBooking = async (id: string) => {
    await fetch(`http://localhost:9001/sweven_events/v1/booking/admin/booking/${id}/approve`, { method: 'PUT' });
    fetchPendingBookings(selectedEventId!);
  };

  const rejectBooking = async (id: string) => {
    await fetch(`http://localhost:9001/sweven_events/v1/booking/admin/booking/${id}/reject`, { method: 'PUT' });
    fetchPendingBookings(selectedEventId!);
  };

    const handleScheduleChange = useCallback((
      id: string,
      field: string,
      value: string
    ) => {
      setEventForm(prev => ({
        ...prev,
        schedule: prev.schedule.map(item =>
          item.id === id
            ? { ...item, [field]: value }
            : item
        )
      }));
    }, []);


  const handleAddSchedule = () => {
    setEventForm(prev => {
      const newSchedule = [
        ...prev.schedule,
        {
          id: crypto.randomUUID(),
          time: '',
          title: '',
          description: '',
          speaker: '',
          orderIndex: prev.schedule.length + 1
        }
      ];

      return {
        ...prev,
        schedule: newSchedule
      };
    });
  };

  const handleRemoveSchedule = useCallback((id: string) => {
    setEventForm(prev => {
      const updated = prev.schedule
        .filter(item => item.id !== id)
        .map((item, idx) => ({
          ...item,
          orderIndex: idx + 1
        }));

      return {
        ...prev,
        schedule: updated
      };
    });
  }, []);

  const handleSpeakerChange = (id: string, field: string, value: string) => {
    setEventForm(prev => ({
      ...prev,
      speakers: prev.speakers.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  const handleAddSpeaker = () => {
    setEventForm(prev => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        {
          id: crypto.randomUUID(),
          name: '',
          title: '',
          bio: '',
          image: ''
        }
      ]
    }));
  };

  const handleRemoveSpeaker = (id: string) => {
    setEventForm(prev => ({
      ...prev,
      speakers: prev.speakers.filter(s => s.id !== id)
    }));
  };
  const handleFaqChange = (index: number, field: string, value: string) => {
    const updatedFaqs = [...eventForm.faqs];
    updatedFaqs[index][field] = value;

    setEventForm(prev => ({
      ...prev,
      faqs: updatedFaqs
    }));
  };

  const handleAddFaq = () => {
    setEventForm(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = eventForm.faqs.filter((_, i) => i !== index);

    setEventForm(prev => ({
      ...prev,
      faqs: updatedFaqs
    }));
  };



  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setEventForm(prev => {
    const oldIndex = prev.schedule.findIndex(i => i.id === active.id);
    const newIndex = prev.schedule.findIndex(i => i.id === over.id);

    const reordered = arrayMove(prev.schedule, oldIndex, newIndex)
      .map((item, index) => ({
        ...item,
        orderIndex: index + 1
      }));

    return {
      ...prev,
      schedule: reordered
    };
  });
};




  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      setEventForm(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };
    const handleTierChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedTiers = [...eventForm.ticketTiers];

    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value
    };

    setEventForm(prev => ({
      ...prev,
      ticketTiers: updatedTiers
    }));
  };

  const handleAddTier = () => {
    setEventForm(prev => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        {
          tierName: '',
          tierDescription: '',
          totalTierSeats: '',
          price: '',
          features: '',
        }
      ]
    }));
  };

    
    const handleCreateEvent = async (status: 'draft' | 'published') => {
    try {
      setError('');
      setLoading(true);

      if (!bannerFile) {
        setError('Please upload banner image');
        return;
      }

      const isoStart = new Date(
        `${eventForm.date}T${eventForm.time}`
      ).toISOString();

      const isoEnd = new Date(
        `${eventForm.endDate || eventForm.date}T${eventForm.endTime || eventForm.time}`
      ).toISOString();

      const eventData = {
        title: eventForm.title,
        subtitle: eventForm.subtitle,
        description: eventForm.description,
        category: eventForm.category,
        date: isoStart,
        endDate: isoEnd,
        totalSeats: Number(eventForm.totalSeats),
        venue: {
          name: eventForm.venue,
          address: eventForm.address,
          city: eventForm.city,
          state: eventForm.state,
          zipCode: eventForm.zipCode,
          venueMap: eventForm.mapUrl
        },
        ticketTiers: eventForm.ticketTiers.map(tier => ({
          name: tier.tierName,
          price: Number(tier.price),
          description: tier.tierDescription,
          totalTierSeats: Number(tier.totalTierSeats),
          features: tier.features
            .split(',')
            .map(f => f.trim())
            .filter(Boolean)
        })),
        tags: eventForm.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),

        schedule: eventForm.schedule
          .filter(item => item.title.trim() !== '')
          .map((item, index) => ({
            time: item.time,
            title: item.title,
            description: item.description,
            speaker: item.speaker,
            orderIndex: index + 1
          })),

        speakers: eventForm.speakers
          .filter(s => s.name.trim() !== '')
          .map(s => ({
            name: s.name,
            title: s.title,
            bio: s.bio,
            image: s.image
          })),

        faqs: eventForm.faqs
          .filter(f => f.question.trim() !== '')
          .map(f => ({
            question: f.question,
            answer: f.answer
          })),


        isFeatured: eventForm.isFeatured,
        approvalRequired: eventForm.approvalRequired,
        status
      };

      const formData = new FormData();
      formData.append(
        'event',
        new Blob([JSON.stringify(eventData)], { type: 'application/json' })
      );
      formData.append('bannerImage', bannerFile);

      await createEvent(formData);

      alert('Event created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Event Organizer Dashboard</h1>
              <p className="text-zinc-400">Manage your events, bookings, and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex gap-2 border-b border-zinc-800">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'create', label: 'Create Event' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'promos', label: 'Promo Codes' },
              { id: 'social', label: 'Social Media' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                          <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                        </div>
                        <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-zinc-500">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Bookings */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
                  <button className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-semibold">{booking.customer}</p>
                        <p className="text-sm text-zinc-400">{booking.event}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${booking.amount}</p>
                        <p className="text-xs text-zinc-500">{booking.tickets} tickets • {booking.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/30">
                  <Mail className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Email Campaign</h3>
                  <p className="text-zinc-400 mb-4">Send automated confirmations and reminders to attendees</p>
                  <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors">
                    Configure
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30">
                  <MessageSquare className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">SMS Notifications</h3>
                  <p className="text-zinc-400 mb-4">Send instant SMS confirmations and event updates</p>
                  <button className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors">
                    Setup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Event Tab */}
          {activeTab === 'create' && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Event Title *</label>
                    <input
                      name="title"
                      value={eventForm.title}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Subtitle *
                    </label>
                    <input
                      name="subtitle"
                      value={eventForm.subtitle}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Short catchy line about event"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Category *</label>
                    <select 
                      name="category"
                      value={eventForm.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none">
                      <option>Music</option>
                      <option>Conference</option>
                      <option>Sports</option>
                      <option>Arts & Culture</option>
                      <option>Food & Drink</option>
                      <option>Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={eventForm.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Describe your event..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    name="tags"
                    value={eventForm.tags}
                    onChange={handleChange}
                    type="text"
                    placeholder="Music, Holi, DJ"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Date *</label>
                    <input
                      name="date"
                      value={eventForm.date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Time *</label>
                    <input
                      name="time"
                      value={eventForm.time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">City *</label>
                    <input
                      name="city"
                      value={eventForm.city}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="City name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Venue *</label>
                    <input
                      name="venue"
                      value={eventForm.venue}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Venue name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Address *
                    </label>
                    <input
                      name="address"
                      value={eventForm.address}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        State *
                      </label>
                      <input
                        name="state"
                        value={eventForm.state}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Zip Code *
                      </label>
                      <input
                        name="zipCode"
                        value={eventForm.zipCode}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Google Maps URL
                      </label>

                      <input
                        name="mapUrl"
                        value={eventForm.mapUrl}
                        onChange={handleChange}
                        type="text"
                        placeholder="https://maps.google.com/?q=28.6139,77.2090"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Total Seats *</label>
                    <input
                      name="totalSeats"
                      value={eventForm.totalSeats}
                      onChange={handleChange}
                      type="number"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Banner Image *
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setBannerFile(e.target.files[0]);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Ticket Tiers</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                      
                        {eventForm.ticketTiers.map((tier, index) => (
                          <div key={index} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                            <div className="grid md:grid-cols-3 gap-4">

                              <input
                                value={tier.tierName}
                                onChange={(e) =>
                                  handleTierChange(index, 'tierName', e.target.value)
                                }
                                type="text"
                                placeholder="Tier name (e.g., General)"
                                className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                              />

                              <input
                                value={tier.tierDescription}
                                onChange={(e) =>
                                  handleTierChange(index, 'tierDescription', e.target.value)
                                }
                                type="text"
                                placeholder="Tier description (VIP access etc)"
                                className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                              />

                              <input
                                value={tier.features}
                                onChange={(e) =>
                                  handleTierChange(index, 'features', e.target.value)
                                }
                                type="text"
                                placeholder="VIP Lounge, Free Drinks, Fast Entry"
                                className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                              />

                              <input
                                value={tier.price}
                                onChange={(e) =>
                                  handleTierChange(index, 'price', e.target.value)
                                }
                                type="number"
                                placeholder="Price"
                                className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                              />

                              <input
                                value={tier.totalTierSeats}
                                onChange={(e) =>
                                  handleTierChange(index, 'totalTierSeats', e.target.value)
                                }
                                type="number"
                                placeholder="total seats"
                                className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white focus:border-cyan-500 focus:outline-none"
                              />

                            </div>
                          </div>
                        ))}
                      
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Another Tier
                    </button>


                  </div>
                </div>

                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Event Schedule</h3>

                    <DndContext
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={eventForm.schedule.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {eventForm.schedule.map((item, index) => (
                          <SortableScheduleItem
                            key={item.id}
                            item={item}
                            handleScheduleChange={handleScheduleChange}
                            handleRemoveSchedule={handleRemoveSchedule}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>

                    <button
                      type="button"
                      onClick={handleAddSchedule}
                      className="flex items-center gap-2 text-cyan-400"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Schedule Item
                    </button>
                  </div>
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Speakers</h3>

                    {eventForm.speakers.map(speaker => (
                      <div key={speaker.id} className="p-4 mb-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        
                        <input
                          type="text"
                          placeholder="Speaker Name"
                          value={speaker.name}
                          onChange={e => handleSpeakerChange(speaker.id, 'name', e.target.value)}
                          className="w-full mb-2 px-4 py-2 bg-black border border-zinc-700 text-white rounded-lg"
                        />

                        <input
                          type="text"
                          placeholder="Speaker Title (e.g. DJ, Artist)"
                          value={speaker.title}
                          onChange={e => handleSpeakerChange(speaker.id, 'title', e.target.value)}
                          className="w-full mb-2 px-4 py-2 bg-black border border-zinc-700 text-white rounded-lg"
                        />

                        <textarea
                          placeholder="Bio"
                          value={speaker.bio}
                          onChange={e => handleSpeakerChange(speaker.id, 'bio', e.target.value)}
                          className="w-full mb-2 px-4 py-2 bg-black border border-zinc-700 text-white rounded-lg"
                        />
                          {/* 🔥 ADD THIS IMAGE UPLOAD INPUT */}
                          <input
                            type="file"
                            accept="image/*"
                            className="mb-2 text-white"
                            onChange={async (e) => {
                              if (!e.target.files) return;

                              const file = e.target.files[0];

                              try {
                                const imageUrl = await uploadFile(file); // your API function
                                handleSpeakerChange(speaker.id, "image", imageUrl);
                              } catch (error) {
                                console.error("Image upload failed", error);
                              }
                            }}
                          />

                          {/* Preview */}
                          {speaker.image && (
                            <img
                              src={speaker.image}
                              alt="preview"
                              className="w-32 h-32 object-cover rounded-lg mb-2"
                            />
                          )}
                        <button
                          onClick={() => handleRemoveSpeaker(speaker.id)}
                          className="text-red-400 text-sm"
                        >
                          Remove Speaker
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddSpeaker}
                      className="text-cyan-400"
                    >
                      + Add Speaker
                    </button>
                  </div>
                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">FAQs</h3>

                    {eventForm.faqs.map((faq, index) => (
                      <div key={index} className="p-4 mb-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={e => handleFaqChange(index, 'question', e.target.value)}
                          className="w-full mb-2 px-4 py-2 bg-black border border-zinc-700 text-white rounded-lg"
                        />

                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={e => handleFaqChange(index, 'answer', e.target.value)}
                          className="w-full mb-2 px-4 py-2 bg-black border border-zinc-700 text-white rounded-lg"
                        />

                        <button
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-400 text-sm"
                        >
                          Remove FAQ
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddFaq}
                      className="text-cyan-400"
                    >
                      + Add FAQ
                    </button>
                  </div>



                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-white font-semibold">Featured Event</p>
                    <p className="text-zinc-400 text-sm">
                      Show this event in featured section on homepage.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEventForm(prev => ({
                        ...prev,
                        isFeatured: !prev.isFeatured
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-all ${
                      eventForm.isFeatured ? "bg-cyan-500" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-all ${
                        eventForm.isFeatured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div>
                      <p className="text-white font-semibold">Approval Required</p>
                      <p className="text-zinc-400 text-sm">
                        Users must request approval before booking.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEventForm(prev => ({
                          ...prev,
                          approvalRequired: !prev.approvalRequired
                        }))
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        eventForm.approvalRequired ? "bg-cyan-500" : "bg-zinc-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-all ${
                          eventForm.approvalRequired ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    onClick={() => handleCreateEvent('draft')}
                    className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors"
                  >
                    Save as Draft
                  </button>

                  <button
                    onClick={() => handleCreateEvent('published')}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Publishing...' : 'Publish Event'}
                  </button>

                </div>

              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">

              {/* Event Selector */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-4">
                  Select Event
                </h2>

                <div className="space-y-3">
                  {events.map(event => (
                    <button
                      key={event.id}
                      onClick={() => fetchPendingBookings(event.id)}
                      className="w-full text-left p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <p className="text-white font-semibold">
                        {event.title}
                      </p>
                      {event.approvalRequired && (
                        <p className="text-xs text-cyan-400">
                          Approval Required
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pending Requests */}
              {selectedEventId && (
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Pending Booking Requests
                  </h2>

                  {pendingBookings.length === 0 && (
                    <p className="text-zinc-500">
                      No pending approvals.
                    </p>
                  )}

                  {pendingBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="p-4 mb-3 rounded-xl bg-zinc-800 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {booking.firstName} {booking.lastName}
                        </p>
                        <p className="text-zinc-400 text-sm">
                          {booking.quantity} tickets • {booking.email}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => approveBooking(booking.id)}
                          className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectBooking(booking.id)}
                          className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>
                </div>
                
                <div className="aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Analytics visualization would appear here</p>
                    <p className="text-sm text-zinc-600 mt-2">Track bookings, revenue, and user engagement in real-time</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h3 className="text-white font-semibold mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-cyan-400">34.2%</p>
                  <p className="text-xs text-zinc-500 mt-1">+5.4% from last month</p>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h3 className="text-white font-semibold mb-2">Avg. Ticket Value</h3>
                  <p className="text-3xl font-bold text-blue-400">$154</p>
                  <p className="text-xs text-zinc-500 mt-1">+8.2% from last month</p>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h3 className="text-white font-semibold mb-2">Customer Satisfaction</h3>
                  <p className="text-3xl font-bold text-green-400">4.8/5</p>
                  <p className="text-xs text-zinc-500 mt-1">Based on 1,234 reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* Promo Codes Tab */}
          {activeTab === 'promos' && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Promotional Codes</h2>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                  <PlusCircle className="w-4 h-4 inline mr-2" />
                  Create Promo Code
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Promo Code *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g., SUMMER2026"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Discount Type *</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none">
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Discount Value *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Max Uses *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">Active Promo Codes</h3>
                {['EARLYBIRD', 'VIP2026', 'STUDENT15'].map(code => (
                  <div key={code} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold">{code}</p>
                      <p className="text-sm text-zinc-400">20% off • 45/100 uses</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      Deactivate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && <SocialMediaManager />}
        </div>
      </div>
    </div>
    
  )
  
}