
import React, { useEffect } from 'react';
import MosqueDetail from '@/components/MosqueDetail';
import BottomBar from '@/components/BottomBar';
import { useNavigation } from '@/contexts/NavigationContext';

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
    <div className="min-h-screen islamic-pattern-bg pb-20 pt-4">
      <MosqueDetail />
      <BottomBar />
    </div>
  );
};

export default MosqueDetailPage;
