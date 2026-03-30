-- Cleanup expired OTPs (run periodically or as a cron job)
-- This removes OTP records that have expired and been verified or are older than 24 hours

DELETE FROM email_verifications 
WHERE expires_at < NOW() - INTERVAL '24 hours'
   OR (verified = true AND created_at < NOW() - INTERVAL '7 days');

-- Optional: Show how many records were deleted
-- SELECT COUNT(*) as deleted_count FROM email_verifications WHERE expires_at < NOW() - INTERVAL '24 hours';
