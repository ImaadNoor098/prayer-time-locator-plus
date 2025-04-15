
import { useState } from 'react';
import { Mosque } from '@/types';

export const useUnfavoriteDialog = () => {
  const [unfavoriteDialogState, setUnfavoriteDialogState] = useState<{
    isOpen: boolean;
    mosque: Mosque | null;
  }>({
    isOpen: false,
    mosque: null
  });

  // Show unfavorite confirmation dialog
  const showUnfavoriteConfirmation = (mosque: Mosque) => {
    setUnfavoriteDialogState({
      isOpen: true,
      mosque: mosque
    });
  };

  // Hide unfavorite confirmation dialog
  const hideUnfavoriteConfirmation = () => {
    setUnfavoriteDialogState({
      isOpen: false,
      mosque: null
    });
  };

  return {
    unfavoriteDialogState,
    showUnfavoriteConfirmation,
    hideUnfavoriteConfirmation
  };
};
