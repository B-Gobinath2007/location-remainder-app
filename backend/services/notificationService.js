/**
 * notificationService.js
 *
 * Server-side notification helper.
 * Currently logs to console; can be extended to send emails
 * (nodemailer), SMS (Twilio), or Web Push (web-push) in production.
 */

const notifyUser = (userId, reminder) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] 🔔 NOTIFICATION → User ${userId} entered zone for reminder: "${reminder.title}" ` +
    `(lat: ${reminder.latitude}, lng: ${reminder.longitude}, radius: ${reminder.radius}m)`
  );

  // ── Extend below ─────────────────────────────────────────────────────
  // Example: Send a push notification via web-push
  // webpush.sendNotification(subscription, JSON.stringify({ title: reminder.title }));

  // Example: Send email via nodemailer
  // transporter.sendMail({ to: user.email, subject: 'Reminder Triggered', text: reminder.title });
};

module.exports = { notifyUser };
