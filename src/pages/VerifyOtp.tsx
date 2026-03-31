
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // OTP verification is no longer needed with Supabase auth
    navigate('/login');
  }, [navigate]);
  
  return null;
};

export default VerifyOtp;
