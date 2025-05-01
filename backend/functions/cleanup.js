const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.deleteUnverifiedUsers = onSchedule(
  {
    schedule: "0 4 * * *", // Her gün saat 04:00
    timeZone: "Europe/Istanbul",
    memory: "128MiB",
    timeoutSeconds: 60,
  },
  async (event) => {
    try {
      let nextPageToken;
      let deletedCount = 0;

      do {
        const listUsersResult = await admin
          .auth()
          .listUsers(1000, nextPageToken);

        for (const user of listUsersResult.users) {
          if (!user.emailVerified) {
            const createdAt = new Date(user.metadata.creationTime).getTime();
            const now = Date.now();
            const diffMins = (now - createdAt) / 1000 / 60;

            if (diffMins > 10) {
              await admin.auth().deleteUser(user.uid);
              console.log(`Silindi: ${user.email}`);
              deletedCount++;
            }
          }
        }

        nextPageToken = listUsersResult.pageToken;
      } while (nextPageToken);

      console.log(`Toplam silinen kullanıcı: ${deletedCount}`);
    } catch (error) {
      console.error("Hata:", error);
    }
  }
);
