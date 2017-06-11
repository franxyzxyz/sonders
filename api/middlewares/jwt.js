const admin = require('firebase-admin');

export default async function jwtAuth(req, res, next) {
  const authHeader = req.get('authorization');
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = await admin.auth().getUser(decoded.uid);
    req.user.id = req.user.uid;
    next();
  } catch (error) {
    return res.status(404).json({ message: 'UnauthorizedError' });
  }
}
