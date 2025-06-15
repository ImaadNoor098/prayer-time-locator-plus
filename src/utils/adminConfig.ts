
// Admin configuration - only these emails can access admin panel data
export const ADMIN_EMAILS = [
  'commonoor098@gmail.com',
  // Add more admin emails here as needed
];

// Function to check if a user email is an admin
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Function to add a new admin email (for future use)
export const addAdminEmail = (email: string): void => {
  const normalizedEmail = email.toLowerCase();
  if (!ADMIN_EMAILS.includes(normalizedEmail)) {
    ADMIN_EMAILS.push(normalizedEmail);
    console.log(`✅ Admin email added: ${email}`);
  } else {
    console.log(`⚠️ Email ${email} is already an admin`);
  }
};

// Function to remove an admin email
export const removeAdminEmail = (email: string): void => {
  const normalizedEmail = email.toLowerCase();
  const index = ADMIN_EMAILS.indexOf(normalizedEmail);
  if (index > -1) {
    ADMIN_EMAILS.splice(index, 1);
    console.log(`✅ Admin email removed: ${email}`);
  } else {
    console.log(`⚠️ Email ${email} is not an admin`);
  }
};
