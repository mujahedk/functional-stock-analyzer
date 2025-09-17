import yahooFinance from 'yahoo-finance2';

// Silence one-time notices that clutter logs on Vercel
yahooFinance.suppressNotices(['ripHistorical', 'yahooSurvey']);

// Export the configured client
export default yahooFinance;
