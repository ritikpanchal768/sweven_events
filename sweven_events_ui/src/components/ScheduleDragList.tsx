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
import { motion } from 'framer-motion';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker: string;
  orderIndex: number;
}

interface Props {
  schedule: ScheduleItem[];
  setSchedule: (items: ScheduleItem[]) => void;
}

export function ScheduleDragList({ schedule, setSchedule }: Props) {

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = schedule.findIndex(i => i.id === active.id);
    const newIndex = schedule.findIndex(i => i.id === over.id);

    const newItems = arrayMove(schedule, oldIndex, newIndex);

    // 🔥 Update orderIndex automatically
    const updated = newItems.map((item, index) => ({
      ...item,
      orderIndex: index + 1
    }));

    setSchedule(updated);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={schedule.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {schedule.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ item }: { item: ScheduleItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-white font-bold">
            {item.orderIndex}. {item.title || "Untitled"}
          </p>
          <p className="text-zinc-400 text-sm">
            {item.time}
          </p>
        </div>
        <span className="text-cyan-400 text-sm">
          Drag
        </span>
      </div>
    </motion.div>
  );
}
