/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export all functions
exports.blog = require('./api/blog').blog;
exports.setAdminRole = require('./auth/admin').setAdminRole;
exports.removeAdminRole = require('./auth/admin').removeAdminRole;
exports.createInitialAdmin = require('./auth/admin').createInitialAdmin;
exports.listAdmins = require('./auth/admin').listAdmins;
exports.listAllUsers = require('./auth/admin').listAllUsers;
exports.setUserPremium = require('./auth/admin').setUserPremium;
exports.removeUserPremium = require('./auth/admin').removeUserPremium;
