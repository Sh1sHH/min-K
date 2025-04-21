const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    if (user.customClaims?.admin !== true) {
      return res.status(403).json({ error: 'Admin yetkisi gerekli' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(403).json({ error: 'Admin check failed' });
  }
};

// Validation middleware
const validateBlogPost = (req, res, next) => {
  const { title, content, image, category } = req.body;
  
  if (!title?.trim() || !content?.trim() || !image || !category) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: {
        title: !title?.trim() ? 'Başlık gerekli' : null,
        content: !content?.trim() ? 'İçerik gerekli' : null,
        image: !image ? 'Görsel gerekli' : null,
        category: !category ? 'Kategori gerekli' : null
      }
    });
  }
  
  next();
};

// Helper function to format blog post
const formatBlogPost = (data, author) => {
  const now = admin.firestore.Timestamp.now();
  
  return {
    title: data.title.trim(),
    content: data.content.trim(),
    image: data.image,
    category: data.category,
    author: author.displayName || author.email.split('@')[0],
    summary: data.summary?.trim() || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || 'published',
    seo: {
      metaDescription: data.seo?.metaDescription?.trim() || data.summary?.trim() || '',
      keywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords : [data.category]
    },
    slug: data.slug || data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    readTime: data.readTime || `${Math.ceil(data.content.split(' ').length / 200)} dakika`,
    date: now,
    createdAt: now,
    updatedAt: now
  };
};

// Routes
// GET /posts - Get all posts
app.get('/posts', async (req, res) => {
  try {
    const postsSnapshot = await admin.firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .get();

    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.() || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /posts - Create new post
app.post('/posts', authenticateUser, requireAdmin, validateBlogPost, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    const postData = formatBlogPost(req.body, user);
    
    const docRef = await admin.firestore().collection('posts').add(postData);
    
    res.status(201).json({
      id: docRef.id,
      ...postData,
      date: postData.date.toDate().toISOString()
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /posts/:id - Update post
app.put('/posts/:id', authenticateUser, requireAdmin, validateBlogPost, async (req, res) => {
  try {
    const { id } = req.params;
    const postRef = admin.firestore().collection('posts').doc(id);
    const post = await postRef.get();

    if (!post.exists) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
    }

    const user = await admin.auth().getUser(req.user.uid);
    const updateData = {
      ...formatBlogPost(req.body, user),
      createdAt: post.data().createdAt, // Preserve original creation date
      updatedAt: admin.firestore.Timestamp.now()
    };

    await postRef.update(updateData);
    res.status(200).json({ message: 'Blog yazısı güncellendi' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /posts/:id - Delete post
app.delete('/posts/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const postRef = admin.firestore().collection('posts').doc(id);
    const post = await postRef.get();

    if (!post.exists) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
    }

    await postRef.delete();
    res.status(200).json({ message: 'Blog yazısı silindi' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the Express app as a Firebase Function
exports.blog = functions.https.onRequest(app); 