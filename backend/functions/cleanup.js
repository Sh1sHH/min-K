const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

// Doğrulanmamış kullanıcıları silen fonksiyon
exports.deleteUnverifiedUsers = onSchedule('* * * * *', async (event) => {
  try {
    // Tüm kullanıcıları getir
    const users = await admin.auth().listUsers();
    const now = Date.now();

    // Her kullanıcı için kontrol yap
    for (const user of users.users) {
      // Kullanıcı doğrulanmamışsa ve hesap oluşturma zamanı 5 dakikadan eskiyse
      if (!user.emailVerified) {
        const creationTime = new Date(user.metadata.creationTime).getTime();
        const timeDiff = Math.floor((now - creationTime) / (1000 * 60)); // Dakika cinsinden fark

        // 5 dakika geçtiyse kullanıcıyı sil
        if (timeDiff >= 5) {
          await admin.auth().deleteUser(user.uid);
          console.log(`Doğrulanmamış kullanıcı silindi: ${user.email}`);
        }
      }
    }
    
    console.log('Doğrulanmamış kullanıcı kontrolü tamamlandı.');
    return null;
  } catch (error) {
    console.error('Hata:', error);
    return null;
  }
});
