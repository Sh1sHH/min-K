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
const express = require('express');
const cors = require('cors')({ 
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors);
app.use(express.json());

// Auth middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    console.log('Auth başlangıç:', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth header eksik veya hatalı:', authHeader);
      return res.status(401).json({ error: 'Yetkilendirme başarısız: Token bulunamadı' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('Token alındı, doğrulanıyor...');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token doğrulandı:', decodedToken);
    
    // Admin yetkisi kontrolü
    const user = await admin.auth().getUser(decodedToken.uid);
    console.log('Kullanıcı bilgileri:', user.customClaims);
    
    if (!user.customClaims?.admin) {
      console.log('Admin yetkisi yok:', user.email);
      return res.status(403).json({ error: 'Admin yetkisi gerekli' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error detayları:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(401).json({ 
      error: 'Yetkilendirme başarısız',
      details: error.message,
      code: error.code
    });
  }
};

// Blog post'larını getir
app.get('/posts', authenticateAdmin, async (req, res) => {
  try {
    console.log('Posts getiriliyor...');
    const postsSnapshot = await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .get();

    const posts = [];
    postsSnapshot.forEach(doc => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toLocaleDateString('tr-TR')
      });
    });

    console.log('Posts başarıyla getirildi:', posts.length);
    res.json(posts);
  } catch (error) {
    console.error('Posts getirme hatası:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Blog yazıları alınamadı',
      details: error.message,
      code: error.code
    });
  }
});

// Tekil blog post'u getir
app.get('/posts/:id', async (req, res) => {
  try {
    const postDoc = await db.collection('posts').doc(req.params.id).get();
    
    if (!postDoc.exists) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
    }

    const post = {
      id: postDoc.id,
      ...postDoc.data(),
      date: postDoc.data().date.toDate().toLocaleDateString('tr-TR')
    };

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Blog yazısı alınamadı' });
  }
});

// Yeni blog post'u oluştur
app.post('/posts', authenticateAdmin, async (req, res) => {
  try {
    console.log('Yeni post oluşturuluyor, gelen veri:', req.body);
    const { title, content, image, category } = req.body;

    // Validasyon
    if (!title || !content || !image || !category) {
      console.log('Eksik alanlar:', { title, content, image, category });
      return res.status(400).json({ 
        error: 'Tüm alanlar zorunludur',
        missing: {
          title: !title,
          content: !content,
          image: !image,
          category: !category
        }
      });
    }

    // Firestore bağlantısını kontrol et
    try {
      await db.collection('posts').get();
      console.log('Firestore bağlantısı başarılı');
    } catch (dbError) {
      console.error('Firestore bağlantı hatası:', dbError);
      return res.status(500).json({
        error: 'Veritabanı bağlantı hatası',
        details: dbError.message
      });
    }

    // Post verisini hazırla
    const post = {
      title: title.trim(),
      content: content.trim(),
      image: image.trim(),
      category: category.trim(),
      author: req.user.email,
      date: new Date(),
      readTime: `${Math.ceil(content.split(' ').length / 200)} dk`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Post verisi hazırlandı:', post);

    // Firestore'a kaydet
    const docRef = await db.collection('posts').add({
      ...post,
      date: admin.firestore.Timestamp.fromDate(post.date),
      createdAt: admin.firestore.Timestamp.fromDate(post.createdAt),
      updatedAt: admin.firestore.Timestamp.fromDate(post.updatedAt)
    });

    console.log('Post başarıyla oluşturuldu:', docRef.id);
    
    res.status(201).json({
      id: docRef.id,
      ...post,
      date: post.date.toLocaleDateString('tr-TR')
    });
  } catch (error) {
    console.error('Post oluşturma hatası:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      body: req.body
    });

    // Daha detaylı hata mesajları
    if (error.code === 'permission-denied') {
      return res.status(403).json({
        error: 'Firestore erişim izni hatası',
        details: 'Veritabanına erişim izniniz yok. Lütfen Firebase Console\'dan Firestore kurallarını kontrol edin.'
      });
    }

    if (error.code === 'not-found') {
      return res.status(404).json({
        error: 'Firestore koleksiyon hatası',
        details: 'Posts koleksiyonu bulunamadı. Lütfen Firebase Console\'dan koleksiyonun varlığını kontrol edin.'
      });
    }

    res.status(500).json({ 
      error: 'Blog yazısı oluşturulamadı',
      details: error.message,
      code: error.code || 'unknown'
    });
  }
});

// Blog post'unu güncelle
app.put('/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    const postId = req.params.id;

    // Validasyon
    if (!title || !content || !image || !category) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    const postRef = db.collection('posts').doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
    }

    await postRef.update({
      title,
      content,
      image,
      category,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      readTime: `${Math.ceil(content.split(' ').length / 200)} dk`,
    });

    res.json({ message: 'Blog yazısı güncellendi' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Blog yazısı güncellenemedi' });
  }
});

// Blog post'unu sil
app.delete('/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    const postRef = db.collection('posts').doc(req.params.id);
    const post = await postRef.get();

    if (!post.exists) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
    }

    await postRef.delete();
    res.json({ message: 'Blog yazısı silindi' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Blog yazısı silinemedi' });
  }
});

// Admin başlatma
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

// API'yi Cloud Functions'a bağla
exports.api = functions.https.onRequest((req, res) => {
  // CORS için preflight kontrolü
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // Her istekte CORS başlıklarını ekle
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return app(req, res);
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
