
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      size="icon"
    >
      <Zap className="h-6 w-6" />
    </Button>
  );
};
