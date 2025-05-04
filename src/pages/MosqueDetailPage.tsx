
import React, { useEffect } from 'react';
import MosqueDetail from '@/components/MosqueDetail';
import BottomBar from '@/components/BottomBar';

const MosqueDetailPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen islamic-pattern-bg pb-20 pt-4">
      <MosqueDetail />
      <BottomBar />
    </div>
  );
};

export default MosqueDetailPage;
