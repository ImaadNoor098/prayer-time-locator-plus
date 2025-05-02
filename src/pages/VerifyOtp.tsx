
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from "@/hooks/use-toast";

const VerifyOtp: React.FC = () => {
  const { verifyOtp, resendOtp, pendingPhoneVerification, pendingPhone, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Check if we have a pending verification
  useEffect(() => {
    if (!pendingPhoneVerification) {
      navigate('/register');
    }
  }, [pendingPhoneVerification, navigate]);
  
  // Handle resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);
  
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    const success = await verifyOtp(otp);
    if (success) {
      // Navigate to home or previously attempted route
      const redirectPath = sessionStorage.getItem('auth-redirect') || '/';
      sessionStorage.removeItem('auth-redirect');
      navigate(redirectPath);
    }
  };
  
  const handleResendOtp = async () => {
    const success = await resendOtp();
    if (success) {
      setResendDisabled(true);
    }
  };
  
  // If there's no pending verification, don't render
  if (!pendingPhoneVerification) {
    return null;
  }
  
  return (
    <div className="min-h-screen islamic-pattern-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-islamic-blue">
            Phone Verification
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to {pendingPhone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            
            <div className="flex flex-col items-center w-full space-y-4">
              <Button 
                onClick={handleVerify} 
                className="w-full bg-islamic-blue hover:bg-islamic-blue/90"
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              
              <div className="text-sm text-center">
                <p className="text-gray-500">Didn't receive code?</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-islamic-blue" 
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isLoading}
                >
                  {resendDisabled 
                    ? `Resend in ${countdown}s` 
                    : "Resend code"
                  }
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-4 italic">
                For testing purposes, you can use the code: <span className="font-bold">123456</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-gray-500 w-full">
            Check your SMS inbox for the verification code.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOtp;
