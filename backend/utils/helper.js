// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get allowed campus domains from environment
const getAllowedDomains = () => {
  const configured = process.env.CAMPUS_EMAIL_DOMAINS;
  return (configured && configured.split(',').map(d => d.trim()).filter(Boolean)) || ['saividya.ac.in', 'saividhya.ac.in'];
};

// Validate campus email
const isValidCampusEmail = (email) => {
  // TEMPORARILY DISABLED: Accept all valid email addresses
  const normalizedEmail = String(email || '').trim().toLowerCase();
  
  // Basic email validation - just check if it has @ and domain
  const atIndex = normalizedEmail.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === normalizedEmail.length - 1) {
    return false;
  }
  
  return true; // Accept any valid email format
  
  /* ORIGINAL CODE - Uncomment to restore domain restriction
  const campusDomains = getAllowedDomains();
  const domainPart = normalizedEmail.slice(atIndex + 1);

  return campusDomains.some((rawDomain) => {
    const d = String(rawDomain || '').trim().toLowerCase();
    const bareDomain = d.startsWith('@') ? d.slice(1) : d;
    if (!bareDomain) return false;
    return domainPart === bareDomain || domainPart.endsWith(`.${bareDomain}`);
  });
  */
};

module.exports = {
  generateOTP,
  isValidCampusEmail,
  getAllowedDomains
};
