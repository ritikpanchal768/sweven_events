import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  GripVertical,
  Save
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

declare global {
  interface Window {
    instgrm: any;
  }
}

interface InstagramPost {
  id: string;
  url: string;
  displayOrder?: number;
}

export function SocialMediaManager() {

  const [inputUrl, setInputUrl] = useState("");
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const API_BASE =
    "http://localhost:9001/sweven_events/api/social/instagram";

  /* ================= FETCH POSTS ================= */

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(API_BASE + "/getAllPost", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    const sorted = data.sort(
      (a: InstagramPost, b: InstagramPost) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );

    setPosts(sorted);
    setHasChanges(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= EMBED RENDER ================= */

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [posts]);

  /* ================= CLEAN URL ================= */

  const cleanUrl = (url: string) => {
    const match = url.match(
      /https:\/\/www\.instagram\.com\/(p|reel)\/[^\/]+/
    );
    return match ? match[0] + "/" : null;
  };

  /* ================= ADD POSTS ================= */

  const handleAddMultiple = async () => {
    if (!inputUrl.trim()) return;

    setLoading(true);

    const lines = inputUrl
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const validUrls = lines
      .map(cleanUrl)
      .filter((url): url is string => url !== null);

    if (validUrls.length === 0) {
      alert("No valid Instagram URLs found");
      setLoading(false);
      return;
    }

    await Promise.all(
      validUrls.map((url) =>
        fetch(API_BASE + "/addPost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ url })
        })
      )
    );

    setInputUrl("");
    fetchPosts();
    setLoading(false);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {

        await fetch(`${API_BASE}/delete/${id}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // Remove locally
        const filtered = posts.filter((post) => post.id !== id);

        // Normalize order
        const normalized = filtered.map((post, index) => ({
            ...post,
            displayOrder: index
        }));

        setPosts(normalized);

        // Auto-save normalized order
        await fetch(API_BASE + "/reorder", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(
            normalized.map((p, index) => ({
                id: p.id,
                displayOrder: index
            }))
            )
        });

        setHasChanges(false);
    };

  /* ================= DRAG ================= */

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);

    const newPosts = arrayMove(posts, oldIndex, newIndex);

    const updated = newPosts.map((post, index) => ({
      ...post,
      displayOrder: index
    }));

    setPosts(updated);
    setHasChanges(true);
  };

  /* ================= SAVE ORDER ================= */

  const handleSaveOrder = async () => {
    await fetch(API_BASE + "/reorder", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(
        posts.map((p, index) => ({
          id: p.id,
          displayOrder: index
        }))
      )
    });

    setHasChanges(false);
    alert("Order saved successfully!");
  };

  /* ================= SORTABLE ITEM ================= */

  function SortableItem({ post }: { post: InstagramPost }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: post.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="min-w-[350px] max-w-[350px] relative"
      >
        {/* DELETE */}
        <button
          onClick={() => handleDelete(post.id)}
          className="absolute top-2 right-2 z-20 bg-black/70 p-2 rounded-full text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-20 bg-black/70 p-2 rounded-full text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <blockquote
          className="instagram-media rounded-2xl overflow-hidden"
          data-instgrm-permalink={post.url}
          data-instgrm-version="14"
        ></blockquote>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* ADD POSTS SECTION */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h2 className="text-lg font-bold text-white mb-4">
          Add Instagram Posts
        </h2>

        <textarea
          rows={4}
          placeholder="Paste one Instagram link per line"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-700 text-white resize-none"
        />

        <button
          onClick={handleAddMultiple}
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {loading ? "Adding..." : "Add Posts"}
        </button>
      </div>

      {/* DRAG REORDER SECTION */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-lg font-bold text-white mb-6">
          Drag Handle to Reorder
        </h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={posts.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-8 overflow-x-auto pb-4">
              {posts.map((post) => (
                <SortableItem key={post.id} post={post} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {hasChanges && (
          <button
            onClick={handleSaveOrder}
            className="mt-6 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Save className="w-4 h-4" />
            Save Order
          </button>
        )}
      </div>
    </div>
  );
}