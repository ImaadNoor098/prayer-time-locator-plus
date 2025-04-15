
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnfavoriteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mosqueName: string;
}

const UnfavoriteConfirmation: React.FC<UnfavoriteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mosqueName,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-islamic-blue dark:text-islamic-cream">
            Remove from Favorites
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-medium text-islamic-blue">{mosqueName}</span> from your favorites?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-islamic-gray text-islamic-gray hover:bg-islamic-gray/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-islamic-green hover:bg-islamic-green/90"
          >
            Yes, Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnfavoriteConfirmation;
