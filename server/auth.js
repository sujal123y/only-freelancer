import jwt from 'jsonwebtoken';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'onlyfreelancer_cinematic_jwt_secret_key_prod_grade_998877';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, email, name, role, phone, company, avatar, is_active FROM users WHERE id = ?').get(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User session invalid or account inactive.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or token invalid.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Owner and Admin have root level access
    if (req.user.role === 'owner' || req.user.role === 'admin') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Role '${req.user.role}' lacks sufficient privileges for this resource.`
    });
  };
}

export function logAudit(req, action, targetType = null, targetId = null, details = null) {
  try {
    const userId = req.user ? req.user.id : null;
    const userEmail = req.user ? req.user.email : 'system/anonymous';
    const role = req.user ? req.user.role : 'anonymous';
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_id, user_email, role, action, target_type, target_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      userId,
      userEmail,
      role,
      action,
      targetType ? String(targetType) : null,
      targetId ? String(targetId) : null,
      typeof details === 'object' ? JSON.stringify(details) : details,
      ip
    );
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}
