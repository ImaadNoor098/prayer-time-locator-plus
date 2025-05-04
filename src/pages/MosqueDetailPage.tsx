
import React, { useEffect } from 'react';
import MosqueDetail from '@/components/MosqueDetail';
import BottomBar from '@/components/BottomBar';
import { ThemeToggle } from '@/components/ThemeToggle';

const MosqueDetailPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen islamic-pattern-bg pb-20 pt-4">
      <div className="container mx-auto max-w-4xl px-4 mb-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      <MosqueDetail />
      <BottomBar />
    </div>
  );
};

export default MosqueDetailPage;
