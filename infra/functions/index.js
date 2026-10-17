// Sample notification helper
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
exports.notifyNewSignup = async (userEmail) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Notification skipped. Admin:', adminEmail, 'User:', userEmail);
    return;
  }
  const msg = {
    to: adminEmail,
    from: 'noreply@example.com',
    subject: 'New user signup request',
    text: `User ${userEmail} requested access.`,
  };
  await sgMail.send(msg);
};
