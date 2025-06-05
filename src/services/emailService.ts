
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const sendRegistrationNotification = async (userData: RegisterFormData) => {
  try {
    // In a real app, this would be an API call to a secure backend
    // For demo purposes, we'll log the request
    console.log(`Sending registration notification for ${userData.name} (${userData.email})`);
    
    // This is a simulated email notification using a public email sending API
    // Note: In a production environment, this should be handled by a secure backend
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_id', // Replace with your EmailJS service ID
        template_id: 'template_id', // Replace with your EmailJS template ID
        user_id: 'user_id', // Replace with your EmailJS user ID
        template_params: {
          to_email: 'commonoor098@gmail.com',
          subject: 'New User Registration',
          from_name: 'Mosque Finder App',
          message: `New user registered!\n\nName: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}\n\nTimestamp: ${new Date().toISOString()}`,
        }
      }),
    });
    
    console.log('Registration notification sent:', response.ok);
  } catch (error) {
    console.error('Failed to send registration notification:', error);
  }
};
