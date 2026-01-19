import React, { memo, useCallback } from 'react';
import { useVirtualList, useInfiniteScroll } from '@/hooks/useVirtualList';
import { ListSkeleton } from '@/components/ui/page-skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

function VirtualListInner<T>({
  items,
  itemHeight,
  containerHeight = 400,
  renderItem,
  keyExtractor,
  className = '',
  emptyMessage = 'No items to display',
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
}: VirtualListProps<T>) {
  const { containerProps, innerProps, virtualItems } = useVirtualList({
    items,
    itemHeight,
    containerHeight,
    overscan: 5,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return <ListSkeleton count={Math.floor(containerHeight / itemHeight)} />;
  }

  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center h-[${containerHeight}px] text-muted-foreground ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div {...containerProps} className={`scrollbar-thin scrollbar-thumb-border ${className}`}>
      <div {...innerProps}>
        <AnimatePresence mode="popLayout">
          {virtualItems.map(({ index, item, style }) => (
            <motion.div
              key={keyExtractor(item, index)}
              style={style}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Load more trigger */}
        {hasNextPage && (
          <div 
            ref={loadMoreRef}
            className="absolute bottom-0 left-0 right-0 flex justify-center p-4"
            style={{ top: items.length * itemHeight }}
          >
            {isFetchingNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const VirtualList = memo(VirtualListInner) as typeof VirtualListInner;

// Optimized list item wrapper with intersection observer
interface LazyListItemProps {
  children: React.ReactNode;
  onVisible?: () => void;
  className?: string;
}

export function LazyListItem({ children, onVisible, className }: LazyListItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div className="h-full bg-muted/20 animate-pulse rounded-lg" />}
    </div>
  );
}

// Scroll position memory
const scrollPositions = new Map<string, number>();

export function useScrollMemory(key: string) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Restore scroll position on mount
  React.useEffect(() => {
    const container = containerRef.current;
    const savedPosition = scrollPositions.get(key);
    
    if (container && savedPosition !== undefined) {
      container.scrollTop = savedPosition;
    }
  }, [key]);

  // Save scroll position on scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollPositions.set(key, e.currentTarget.scrollTop);
  }, [key]);

  // Save position on unmount
  React.useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (container) {
        scrollPositions.set(key, container.scrollTop);
      }
    };
  }, [key]);

  return { containerRef, handleScroll };
}
