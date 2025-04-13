/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Admin başlatma
admin.initializeApp();

// Admin rolü verme fonksiyonu
exports.setAdminRole = functions.https.onRequest(async (req, res) => {
  // CORS için preflight kontrolü
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // CORS middleware
  return cors(req, res, async () => {
    try {
      // Token'ı al
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Yetkilendirme hatası',
          message: 'Yetkilendirme token\'ı bulunamadı'
        });
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      
      // Token'ı doğrula
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Admin yetkisini kontrol et
      const callerUser = await admin.auth().getUser(decodedToken.uid);
      const callerClaims = callerUser.customClaims || {};
      
      if (!callerClaims.admin && !callerClaims.superAdmin) {
        return res.status(403).json({
          error: 'Yetki hatası',
          message: 'Bu işlem için admin yetkisi gerekiyor'
        });
      }

      // Request body'den email'i al
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: 'Eksik bilgi',
          message: 'Email adresi gerekli'
        });
      }

      try {
        // Email ile kullanıcıyı bul
        const userRecord = await admin.auth().getUserByEmail(email);

        // Mevcut claims'i al
        const currentClaims = userRecord.customClaims || {};

        // Eğer zaten admin ise hata ver
        if (currentClaims.admin || currentClaims.superAdmin) {
          return res.status(400).json({
            error: 'Yetki hatası',
            message: 'Bu kullanıcı zaten admin'
          });
        }

        // Custom claims güncelle (mevcut claims'i koru)
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          ...currentClaims,
          admin: true
        });

        return res.status(200).json({
          success: true,
          message: `${email} admin olarak atandı.`
        });
      } catch (userError) {
        console.error('Kullanıcı bulunamadı:', userError);
        return res.status(404).json({
          error: 'Kullanıcı bulunamadı',
          message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı.'
        });
      }
    } catch (error) {
      console.error('Admin atama hatası:', error);
      return res.status(500).json({ 
        error: 'Sunucu hatası',
        message: 'Admin atama işlemi sırasında bir hata oluştu.'
      });
    }
  });
});

// İlk admin oluşturma fonksiyonu (sadece bir kez kullanılacak)
exports.createInitialAdmin = functions.https.onRequest(async (req, res) => {
  try {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Email parametresini kontrol et
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email parametresi gerekli.' });
    }

    try {
      // Kullanıcıyı bul
      const user = await admin.auth().getUserByEmail(email);

      // Custom claims'i güncelle
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
        superAdmin: true
      });

      return res.json({
        success: true,
        message: `${email} süper admin olarak atandı.`
      });
    } catch (userError) {
      return res.status(404).json({
        error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı.'
      });
    }
  } catch (error) {
    console.error('İlk admin oluşturma hatası:', error);
    return res.status(500).json({
      error: error.message || 'İlk admin oluşturma başarısız oldu.'
    });
  }
});

// Admin listesini getirme fonksiyonu
exports.listAdmins = functions.https.onRequest(async (req, res) => {
  // CORS için preflight kontrolü
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // CORS middleware
  return cors(req, res, async () => {
    try {
      // Token'ı al
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new Error('Yetkilendirme token\'ı bulunamadı');
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      
      // Token'ı doğrula
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Admin yetkisini kontrol et
      const userRecord = await admin.auth().getUser(decodedToken.uid);
      const customClaims = userRecord.customClaims || {};
      
      if (!customClaims.admin && !customClaims.superAdmin) {
        throw new Error('Bu işlem için admin yetkisi gerekiyor');
      }

      // Tüm kullanıcıları listele
      const listUsersResult = await admin.auth().listUsers(1000);
      
      // Admin olan kullanıcıları filtrele
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
      res.status(401).json({ 
        error: 'Yetkilendirme hatası',
        message: error.message 
      });
    }
  });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
