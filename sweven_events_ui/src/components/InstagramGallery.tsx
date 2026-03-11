// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Heart, MessageCircle, Send, Bookmark, MoreVertical, CheckCircle } from 'lucide-react';
// import { InstagramEmbed } from './InstagramEmbed';

// interface InstagramPost {
//   id: string;
//   username: string;
//   userAvatar: string;
//   verified: boolean;
//   image: string;
//   likes: number;
//   caption: string;
//   timeAgo: string;
//   instagramUrl: string;
//   comments?: number;
// }

// const mockPosts: InstagramPost[] = [
//   {
//     id: '1',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop',
//     likes: 15234,
//     caption: '🎵 ELECTRO PULSE FESTIVAL is coming! Get ready for the ultimate electronic music experience. Limited tickets available! Link in bio.',
//     timeAgo: '2 hours ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 342
//   },
//   {
//     id: '2',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1000&fit=crop',
//     likes: 12847,
//     caption: '🏀 SLAM DUNK CHAMPIONSHIP 2026 - Watch the best players compete live! Early bird tickets now available. Tag a friend who needs to see this! 🔥',
//     timeAgo: '5 hours ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 289
//   },
//   {
//     id: '3',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=1000&fit=crop',
//     likes: 18956,
//     caption: '✨ Behind the scenes of our Tech Innovation Summit! Amazing speakers, cutting-edge demos, and unforgettable networking. See you at the next one! 💡',
//     timeAgo: '1 day ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 521
//   },
//   {
//     id: '4',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1000&fit=crop',
//     likes: 21403,
//     caption: '🍕 STREET FOOD FESTIVAL highlights! Over 50+ vendors, live music, and thousands of happy foodies. Who\'s ready for the next one? Drop a 🙋 below!',
//     timeAgo: '2 days ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 634
//   },
//   {
//     id: '5',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1000&fit=crop',
//     likes: 9876,
//     caption: '🎨 ART & DESIGN EXPO 2026 - Immerse yourself in creativity. Featuring 100+ artists from around the world. Tickets selling fast! 🖼️',
//     timeAgo: '3 days ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 187
//   },
//   {
//     id: '6',
//     username: 'swevenevents',
//     userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&h=150&fit=crop',
//     verified: true,
//     image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1000&fit=crop',
//     likes: 16543,
//     caption: '🎭 Behind the curtain! Check out these stunning moments from our exclusive fashion show. More events coming soon! ✨ #SwevenEvents',
//     timeAgo: '4 days ago',
//     instagramUrl: 'https://instagram.com/swevenoffice',
//     comments: 412
//   }
// ];

// interface PostCardProps {
//   post: InstagramPost;
// }

// function PostCard({ post }: PostCardProps) {
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes);
//   const [showHeart, setShowHeart] = useState(false);
//   const [expanded, setExpanded] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
//   const lastTap = useRef(0);
//   const imageRef = useRef<HTMLDivElement>(null);
//   const rippleIdRef = useRef(0);

//   const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
//     const now = Date.now();
//     const timeSince = now - lastTap.current;

//     if (timeSince < 300 && timeSince > 0) {
//       // Double tap detected
//       if (!liked) {
//         setLiked(true);
//         setLikeCount(prev => prev + 1);
//       }
//       setShowHeart(true);
//       setTimeout(() => setShowHeart(false), 1000);
      
//       // Create ripple effect
//       createRipple(e);
//     }

//     lastTap.current = now;
//   };

//   const createRipple = (e: React.MouseEvent | React.TouchEvent) => {
//     if (!imageRef.current) return;
    
//     const rect = imageRef.current.getBoundingClientRect();
//     let x, y;
    
//     if ('touches' in e) {
//       x = e.touches[0].clientX - rect.left;
//       y = e.touches[0].clientY - rect.top;
//     } else {
//       x = e.clientX - rect.left;
//       y = e.clientY - rect.top;
//     }
    
//     const rippleId = rippleIdRef.current++;
//     setRipples(prev => [...prev, { x, y, id: rippleId }]);
    
//     setTimeout(() => {
//       setRipples(prev => prev.filter(r => r.id !== rippleId));
//     }, 600);
//   };

//   const handleLikeClick = () => {
//     if (liked) {
//       setLiked(false);
//       setLikeCount(prev => prev - 1);
//     } else {
//       setLiked(true);
//       setLikeCount(prev => prev + 1);
//     }
//   };

//   const formatLikes = (count: number) => {
//     if (count >= 1000000) {
//       return `${(count / 1000000).toFixed(1)}M`;
//     }
//     if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}K`;
//     }
//     return count.toString();
//   };

//   const truncateCaption = (text: string, expanded: boolean) => {
//     if (expanded) return text;
//     const words = text.split(' ');
//     if (words.length <= 15) return text;
//     return words.slice(0, 15).join(' ') + '...';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: '-100px' }}
//       transition={{ duration: 0.5 }}
//       className="w-full"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-3 mb-3">
//         <div className="flex items-center gap-3">
//           <motion.div 
//             className="relative"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
//               <img
//                 src={post.userAvatar}
//                 alt={post.username}
//                 className="w-full h-full rounded-full object-cover ring-2 ring-black"
//               />
//             </div>
//           </motion.div>
//           <div className="flex items-center gap-2">
//             <span className="text-white font-semibold text-sm">{post.username}</span>
//             {post.verified && (
//               <CheckCircle className="w-4 h-4 text-cyan-400 fill-cyan-400" />
//             )}
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="text-white p-2 hover:bg-zinc-800/50 rounded-full transition-colors"
//         >
//           <MoreVertical className="w-5 h-5" />
//         </motion.button>
//       </div>

//       {/* Image */}
//       <div
//         ref={imageRef}
//         className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 shadow-lg"
//         onClick={handleDoubleTap}
//         onTouchEnd={handleDoubleTap}
//       >
//         <motion.img
//           src={post.image}
//           alt="Post"
//           className="w-full h-full object-cover"
//           whileTap={{ scale: 0.98 }}
//           transition={{ duration: 0.15, ease: "easeOut" }}
//         />
        
//         {/* Ripple Effects */}
//         <AnimatePresence>
//           {ripples.map((ripple) => (
//             <motion.div
//               key={ripple.id}
//               initial={{ scale: 0, opacity: 0.5 }}
//               animate={{ scale: 3, opacity: 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.6, ease: "easeOut" }}
//               className="absolute w-20 h-20 rounded-full bg-white pointer-events-none"
//               style={{
//                 left: ripple.x - 40,
//                 top: ripple.y - 40,
//               }}
//             />
//           ))}
//         </AnimatePresence>
        
//         {/* Double Tap Heart Animation */}
//         <AnimatePresence>
//           {showHeart && (
//             <motion.div
//               initial={{ scale: 0, opacity: 0, rotate: -30 }}
//               animate={{ 
//                 scale: [0, 1.3, 1], 
//                 opacity: [1, 1, 0],
//                 rotate: 0
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="absolute inset-0 flex items-center justify-center pointer-events-none"
//             >
//               <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl" />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Gradient Overlay at Bottom */}
//         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
//       </div>

//       {/* Actions */}
//       <div className="flex items-center justify-between px-3 mt-2">
//         <div className="flex items-center gap-4">
//           {/* Like Button */}
//           <motion.button
//             whileTap={{ scale: 0.75 }}
//             onClick={handleLikeClick}
//             className="relative"
//           >
//             <motion.div
//               animate={liked ? { scale: [1, 1.4, 1] } : {}}
//               transition={{ duration: 0.4, ease: "easeOut" }}
//             >
//               <Heart
//                 className={`w-5 h-5 transition-colors duration-200 ${
//                   liked ? 'text-red-500 fill-red-500' : 'text-white hover:text-zinc-400'
//                 }`}
//               />
//             </motion.div>
//           </motion.button>

//           {/* Comment Button */}
//           <motion.button
//             whileHover={{ scale: 1.1, rotate: -12 }}
//             whileTap={{ scale: 0.9, rotate: 0 }}
//             className="text-white hover:text-zinc-400 transition-colors"
//           >
//             <MessageCircle className="w-5 h-5" />
//           </motion.button>

//           {/* Share Button */}
//           <motion.button
//             whileHover={{ scale: 1.1, x: 4 }}
//             whileTap={{ scale: 0.9 }}
//             className="text-white hover:text-zinc-400 transition-colors"
//           >
//             <Send className="w-5 h-5" />
//           </motion.button>
//         </div>

//         {/* Save Button */}
//         <motion.button
//           whileTap={{ scale: 0.75 }}
//           onClick={() => setSaved(!saved)}
//           className="text-white hover:text-zinc-400 transition-colors"
//         >
//           <motion.div
//             animate={saved ? { scale: [1, 1.3, 1] } : {}}
//             transition={{ duration: 0.3 }}
//           >
//             <Bookmark
//               className={`w-5 h-5 transition-all duration-200 ${
//                 saved ? 'fill-white' : ''
//               }`}
//             />
//           </motion.div>
//         </motion.button>
//       </div>

//       {/* Likes Count */}
//       <div className="px-3 mt-2">
//         <motion.p
//           key={likeCount}
//           initial={{ scale: 1 }}
//           animate={liked ? { scale: [1, 1.05, 1] } : {}}
//           transition={{ duration: 0.3 }}
//           className="text-white font-semibold text-sm"
//         >
//           {formatLikes(likeCount)} likes
//         </motion.p>
//       </div>

//       {/* Caption */}
//       <div className="px-3 mt-2">
//         <p className="text-xs leading-snug">
//           <span className="font-semibold text-white mr-2">{post.username}</span>
//           <span className="text-zinc-200">
//             {truncateCaption(post.caption, expanded)}
//             {!expanded && post.caption.split(' ').length > 15 && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setExpanded(true)}
//                 className="text-zinc-500 ml-1 hover:text-zinc-400 transition-colors font-medium"
//               >
//                 more
//               </motion.button>
//             )}
//           </span>
//         </p>
//       </div>

//       {/* View Comments */}
//       {post.comments && (
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="px-3 mt-2 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
//         >
//           View all {post.comments} comments
//         </motion.button>
//       )}

//       {/* Time & Instagram Link */}
//       <div className="px-3 mt-2 flex items-center justify-between">
//         <p className="text-xs text-zinc-500 uppercase tracking-wide">{post.timeAgo}</p>
//         <motion.a
//           whileHover={{ scale: 1.05, x: 2 }}
//           whileTap={{ scale: 0.95 }}
//           href={post.instagramUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold flex items-center gap-1"
//         >
//           View on Instagram
//           <motion.span
//             initial={{ x: 0 }}
//             whileHover={{ x: 2 }}
//           >
//             →
//           </motion.span>
//         </motion.a>
//       </div>
//     </motion.div>
//   );
// }

// export function InstagramGallery() {
//   return (
//     <section className="py-20 px-0 bg-black relative overflow-hidden">
//       {/* Background Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black pointer-events-none" />
      
//       <div className="relative z-10 max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12 px-6"
//         >
//           <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 text-sm font-semibold mb-4">
//             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
//               <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
//                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//               </svg>
//             </div>
//             FOLLOW OUR JOURNEY
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Behind the Scenes
//           </h2>
//           <p className="text-zinc-400 text-lg">
//             Experience the magic through our lens. Follow us on Instagram for exclusive content!
//           </p>
//         </motion.div>

//         {/* Instagram Feed */}
//         {/* <div className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
//             {mockPosts.map((post) => (
//                 <PostCard key={post.id} post={post} />
//             ))}
//         </div> */}

//         <div className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
//             <InstagramEmbed url="https://www.instagram.com/p/DVK1B-xkzik/" />
//             <InstagramEmbed url="https://www.instagram.com/p/DVIq3FsEvnJ/" />
//             <InstagramEmbed url="https://www.instagram.com/p/DVGNrqPiM85/" />
//             <InstagramEmbed url="https://www.instagram.com/p/DUkkKgAAeHx/" />
//         </div>

//         {/* Follow CTA */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mt-12 px-6"
//         >
//           <a
//             href="https://instagram.com/swevenoffice"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105"
//           >
//             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//               <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
//                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//               </svg>
//             </div>
//             Follow @swevenevents
//           </a>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InstagramEmbed } from "./InstagramEmbed";

interface InstagramPost {
  id: string;
  url: string;
  displayOrder?: number;
  createdAt?: string;
}

export function InstagramGallery() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    "http://localhost:9001/sweven_events/api/social/instagram";

  useEffect(() => {
    fetch(API_BASE + "/getAllPost")
      .then((res) => res.json())
      .then((data: InstagramPost[]) => {
        // sort by displayOrder if exists
        const sorted = data.sort(
          (a, b) =>
            (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );

        setPosts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Instagram posts", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 px-0 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 text-sm font-semibold mb-4">
            FOLLOW OUR JOURNEY
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Behind the Scenes
          </h2>

          <p className="text-zinc-400 text-lg">
            Experience the magic through our lens.
          </p>
        </motion.div>

        {/* Feed */}
        {loading ? (
          <div className="text-center text-zinc-500">
            Loading Instagram posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-zinc-500">
            No posts available.
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
            {posts.map((post) => (
              <InstagramEmbed key={post.id} url={post.url} />
            ))}
          </div>
        )}

        {/* Follow CTA */}
        <div className="text-center mt-12">
          <a
            href="https://instagram.com/swevenevents"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105"
          >
            Follow @swevenevents
          </a>
        </div>
      </div>
    </section>
  );
}