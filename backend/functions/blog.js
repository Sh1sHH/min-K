const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firestore if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Helper function to check if user is admin
const isUserAdmin = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.admin === true;
  } catch (error) {
    return false;
  }
};

// Create a new blog post
exports.createPost = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Check if user is admin
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { title, content, image, category } = req.body;

      // Validate required fields
      if (!title || !content || !image || !category) {
        return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
      }

      // Create new post
      const post = {
        title,
        content,
        image,
        category,
        author: decodedToken.email,
        date: admin.firestore.Timestamp.now(),
        readTime: `${Math.ceil(content.split(' ').length / 200)} min`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection('posts').add(post);
      
      return res.status(201).json({
        id: docRef.id,
        ...post,
      });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Get all blog posts
exports.getPosts = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const postsSnapshot = await db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get();

      const posts = [];
      postsSnapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate().toLocaleDateString('tr-TR'),
        });
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Update a blog post
exports.updatePost = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Check if user is admin
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { id } = req.params;
      const { title, content, image, category } = req.body;

      // Validate required fields
      if (!title || !content || !image || !category) {
        return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
      }

      // Update post
      const postRef = db.collection('posts').doc(id);
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
      });

      return res.status(200).json({ message: 'Blog yazısı güncellendi' });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Delete a blog post
exports.deletePost = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Check if user is admin
      if (!await isUserAdmin(decodedToken.uid)) {
        return res.status(403).json({ error: 'Admin yetkisi gerekli' });
      }

      if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { id } = req.params;
      const postRef = db.collection('posts').doc(id);
      const post = await postRef.get();

      if (!post.exists) {
        return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
      }

      await postRef.delete();

      return res.status(200).json({ message: 'Blog yazısı silindi' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}); 