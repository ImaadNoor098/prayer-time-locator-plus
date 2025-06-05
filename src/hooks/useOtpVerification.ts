
import { useState } from 'react';

export const useOtpVerification = () => {
  const [pendingPhoneVerification, setPendingPhoneVerification] = useState<boolean>(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  const startVerification = (phone: string) => {
    setPendingPhone(phone);
    setPendingPhoneVerification(true);
  };

  const completeVerification = () => {
    setPendingPhoneVerification(false);
    setPendingPhone('');
  };

  return {
    pendingPhoneVerification,
    pendingPhone,
    startVerification,
    completeVerification
  };
};
