const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Helper function to check if user is admin
const isUserAdmin = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.admin === true || user.customClaims?.superAdmin === true;
  } catch (error) {
    return false;
  }
};

// Set admin role
exports.setAdminRole = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Token validation
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Check admin permission
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email adresi gerekli' });
      }

      const userRecord = await admin.auth().getUserByEmail(email);
      const currentClaims = userRecord.customClaims || {};

      if (currentClaims.admin || currentClaims.superAdmin) {
        return res.status(400).json({ error: 'Bu kullanıcı zaten admin' });
      }

      await admin.auth().setCustomUserClaims(userRecord.uid, {
        ...currentClaims,
        admin: true
      });

      res.status(200).json({
        success: true,
        message: `${email} admin olarak atandı.`
      });
    } catch (error) {
      console.error('Admin atama hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Create initial admin
exports.createInitialAdmin = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: 'Email parametresi gerekli.' });
      }

      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
        superAdmin: true
      });

      res.json({
        success: true,
        message: `${email} süper admin olarak atandı.`
      });
    } catch (error) {
      console.error('İlk admin oluşturma hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// List admins
exports.listAdmins = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const listUsersResult = await admin.auth().listUsers();
      const adminUsers = listUsersResult.users
        .filter(user => {
          const claims = user.customClaims || {};
          return claims.admin || claims.superAdmin;
        })
        .map(user => ({
          email: user.email,
          role: user.customClaims?.superAdmin ? 'süper admin' : 'admin'
        }));

      res.json(adminUsers);
    } catch (error) {
      console.error('Admin listesi alma hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Remove admin role
exports.removeAdminRole = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email adresi gerekli' });
      }

      const userRecord = await admin.auth().getUserByEmail(email);
      const currentClaims = userRecord.customClaims || {};

      if (currentClaims.superAdmin) {
        return res.status(403).json({ error: 'Süper admin yetkisi kaldırılamaz' });
      }

      if (!currentClaims.admin) {
        return res.status(400).json({ error: 'Bu kullanıcı zaten admin değil' });
      }

      const { admin: removedAdmin, ...remainingClaims } = currentClaims;
      await admin.auth().setCustomUserClaims(userRecord.uid, remainingClaims);

      res.status(200).json({
        success: true,
        message: `${email} adresinin admin yetkisi kaldırıldı.`
      });
    } catch (error) {
      console.error('Admin yetkisi kaldırma hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// List all users
exports.listAllUsers = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const listUsersResult = await admin.auth().listUsers();
      const users = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        createdAt: user.metadata.creationTime,
        lastSignIn: user.metadata.lastSignInTime,
        customClaims: user.customClaims || {}
      }));

      res.json(users);
    } catch (error) {
      console.error('Kullanıcı listesi alma hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Set premium role
exports.setUserPremium = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email adresi gerekli' });
      }

      const targetUser = await admin.auth().getUserByEmail(email);
      const currentClaims = targetUser.customClaims || {};
      
      await admin.auth().setCustomUserClaims(targetUser.uid, {
        ...currentClaims,
        premium: true
      });

      res.json({ message: `${email} adresine premium üyelik verildi` });
    } catch (error) {
      console.error('Premium üyelik verme hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Remove premium role
exports.removeUserPremium = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).send('');
      return;
    }

    try {
      res.set('Access-Control-Allow-Origin', '*'); // <<< Bunu eklemen gerekiyor!
      
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email adresi gerekli' });
      }

      const targetUser = await admin.auth().getUserByEmail(email);
      const currentClaims = targetUser.customClaims || {};
      
      const { premium, ...remainingClaims } = currentClaims;
      await admin.auth().setCustomUserClaims(targetUser.uid, remainingClaims);

      res.json({
        success: true,
        message: `${email} adresinin premium üyeliği kaldırıldı`
      });
    } catch (error) {
      console.error('Premium üyelik kaldırma hatası:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

