// Simple custom request logging middleware
export const requestLogger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${method} request to ${url}`);
  
  // Optionally, we could capture the response time by hooking into res.on('finish', ...)
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} [${ms}ms]`);
  });

  next();
};

export default requestLogger;
