import React, { useState, useCallback, ReactNode } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragItem {
  id: string;
  content: ReactNode;
  locked?: boolean;
}

interface DragReorderGridProps {
  items: DragItem[];
  onReorder: (items: DragItem[]) => void;
  columns?: number;
  gap?: number;
  className?: string;
  itemClassName?: string;
  editMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
}

export function DragReorderGrid({
  items,
  onReorder,
  columns = 3,
  gap = 16,
  className,
  itemClassName,
  editMode = false,
  onEditModeChange,
}: DragReorderGridProps) {
  const [localItems, setLocalItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleReorder = useCallback(
    (newOrder: DragItem[]) => {
      setLocalItems(newOrder);
      onReorder(newOrder);
    },
    [onReorder]
  );

  const toggleLock = useCallback((id: string) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Edit mode toggle */}
      {onEditModeChange && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEditModeChange(!editMode)}
          className={cn(
            'absolute -top-12 right-0 px-4 py-2 rounded-lg',
            'flex items-center gap-2 text-sm',
            editMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          {editMode ? (
            <>
              <Lock className="w-4 h-4" />
              Done
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4" />
              Edit Layout
            </>
          )}
        </motion.button>
      )}

      <Reorder.Group
        axis="y"
        values={localItems}
        onReorder={handleReorder}
        className={cn(
          'grid',
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
          `gap-${gap / 4}`
        )}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {localItems.map((item) => (
          <DragItem
            key={item.id}
            item={item}
            editMode={editMode}
            isDragging={draggedId === item.id}
            onDragStart={() => setDraggedId(item.id)}
            onDragEnd={() => setDraggedId(null)}
            onToggleLock={() => toggleLock(item.id)}
            className={itemClassName}
          />
        ))}
      </Reorder.Group>

      {/* Drop zone indicator */}
      {editMode && draggedId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-xl pointer-events-none"
        />
      )}
    </div>
  );
}

interface DragItemProps {
  item: DragItem;
  editMode: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onToggleLock: () => void;
  className?: string;
}

function DragItem({
  item,
  editMode,
  isDragging,
  onDragStart,
  onDragEnd,
  onToggleLock,
  className,
}: DragItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={editMode && !item.locked}
      dragControls={dragControls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5)',
        zIndex: 50,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        'relative',
        editMode && !item.locked && 'cursor-grab active:cursor-grabbing',
        isDragging && 'z-50',
        className
      )}
    >
      {/* Edit mode overlay */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 z-10 rounded-xl',
            'border-2',
            item.locked ? 'border-muted' : 'border-primary/50',
            'pointer-events-none'
          )}
        />
      )}

      {/* Drag handle */}
      {editMode && !item.locked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 z-20',
            'px-3 py-1 rounded-full',
            'bg-card border border-border',
            'flex items-center gap-2',
            'cursor-grab active:cursor-grabbing'
          )}
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      )}

      {/* Lock toggle */}
      {editMode && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLock}
          className={cn(
            'absolute -top-3 -right-3 z-20',
            'w-8 h-8 rounded-full',
            'flex items-center justify-center',
            item.locked
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {item.locked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </motion.button>
      )}

      {/* Content */}
      <motion.div
        animate={{
          opacity: editMode && item.locked ? 0.5 : 1,
        }}
      >
        {item.content}
      </motion.div>
    </Reorder.Item>
  );
}

// Simpler list reorder for vertical lists
interface DragReorderListProps {
  items: DragItem[];
  onReorder: (items: DragItem[]) => void;
  className?: string;
  itemClassName?: string;
}

export function DragReorderList({
  items,
  onReorder,
  className,
  itemClassName,
}: DragReorderListProps) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn('space-y-2', className)}
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          whileDrag={{
            scale: 1.02,
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)',
          }}
          className={cn(
            'flex items-center gap-3 p-3',
            'bg-card border border-border rounded-lg',
            'cursor-grab active:cursor-grabbing',
            itemClassName
          )}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1">{item.content}</div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

export default DragReorderGrid;
