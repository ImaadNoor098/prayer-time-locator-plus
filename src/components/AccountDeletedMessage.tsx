
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AccountDeletedMessageProps {
  show: boolean;
}

const AccountDeletedMessage: React.FC<AccountDeletedMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>Account Deleted:</strong> Your account has been deleted. 
        You can register again to create a new account.
      </AlertDescription>
    </Alert>
  );
};

export default AccountDeletedMessage;
