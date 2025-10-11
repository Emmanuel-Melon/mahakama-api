import { Request, Response, NextFunction } from 'express';
import useragent from 'express-useragent';

interface UserAgentInfo extends useragent.Details {
  ip: string;
  method: string;
  path: string;
  timestamp: Date;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

// This middleware parses the user agent and attaches it to req.useragent
export const userAgentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // First, parse the user agent using express-useragent
  useragent.express()(req, res, () => {
    if (!req.useragent) {
      return next(new Error('Failed to parse user agent'));
    }

    // Get client IP (respecting proxies)
    const ip = req.ip || 
               req.connection.remoteAddress || 
               (req.socket && req.socket.remoteAddress) || 
               'unknown';

    // Prepare user agent info with our additional data
    const userAgentInfo: UserAgentInfo = {
      ...req.useragent,
      ip,
      method: req.method,
      path: req.path,
      timestamp: new Date(),
      deviceType: req.useragent.isMobile ? 'mobile' : req.useragent.isTablet ? 'tablet' : 'desktop',
    };

    // Attach to request object for later use in route handlers
    req.userAgent = userAgentInfo;

    // // Log the user agent info
    // console.log('User Agent Info:', {
    //   ...userAgentInfo,
    //   // Don't log the full source as it can be very long
    //   source: undefined,
    // });

    next();
  });
};

// Extend the Express Request type to include our userAgent
declare global {
  namespace Express {
    interface Request {
      userAgent?: UserAgentInfo;
    }
  }
}