
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ForgotPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-islamic-blue">
            <Clock className="h-5 w-5" />
            Feature Coming Soon
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            The forgot password feature will be enabled soon. 
            We're working hard to bring you this functionality.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="bg-islamic-blue hover:bg-islamic-blue/90"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordPopup;
