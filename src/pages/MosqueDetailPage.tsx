
import React, { useEffect } from 'react';
import MosqueDetail from '@/components/MosqueDetail';
import BottomBar from '@/components/BottomBar';
import { useNavigation } from '@/contexts/NavigationContext';
import { ScrollArea } from "@/components/ui/scroll-area";

const MosqueDetailPage: React.FC = () => {
  const { setLastMosqueDetailState } = useNavigation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Save this as the last mosque detail page visited
    setLastMosqueDetailState({
      timestamp: new Date().getTime(),
      fromDetail: true,
    });
  }, [setLastMosqueDetailState]);

  return (
    <div className="flex flex-col h-screen islamic-pattern-bg">
      <ScrollArea className="flex-grow overflow-y-auto pb-16">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <MosqueDetail />
        </div>
      </ScrollArea>
      <BottomBar />
    </div>
  );
};

export default MosqueDetailPage;
