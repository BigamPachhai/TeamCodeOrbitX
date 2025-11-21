import nodemailer from "nodemailer";
import twilio from "twilio";

/**
 * Multi-channel notification utilities
 * Supports SMS, WhatsApp, Email, and Push notifications
 */

// Email configuration - DISABLED
const createEmailTransporter = () => {
  // Notifications disabled - return null to skip email sending
  return null;
  
  // Uncomment below to enable email notifications
  // if (!process.env.SMTP_HOST) {
  //   console.warn("SMTP not configured - email notifications disabled");
  //   return null;
  // }
  // return nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT || 587,
  //   secure: process.env.SMTP_SECURE === "true",
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
};

// Twilio client (for SMS/WhatsApp) - DISABLED
const createTwilioClient = () => {
  // Notifications disabled - return null to skip SMS/WhatsApp sending
  return null;
  
  // Uncomment below to enable SMS/WhatsApp notifications
  // if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  //   console.warn("Twilio not configured - SMS/WhatsApp notifications disabled");
  //   return null;
  // }
  // return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

/**
 * Send email notification
 */
export const sendEmailNotification = async (to, subject, html, text) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      console.log("Email notification skipped (SMTP not configured)");
      return { success: false, reason: "SMTP not configured" };
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS notification via Twilio
 */
export const sendSMSNotification = async (to, message) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log("SMS notification skipped (Twilio not configured)");
      return { success: false, reason: "Twilio not configured" };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to.startsWith("+") ? to : `+977${to.replace(/^0/, "")}`, // Format for Nepal
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send WhatsApp notification via Twilio
 */
export const sendWhatsAppNotification = async (to, message) => {
  try {
    const client = createTwilioClient();
    if (!client) {
      console.log("WhatsApp notification skipped (Twilio not configured)");
      return { success: false, reason: "Twilio not configured" };
    }

    // Format phone number for WhatsApp
    const formattedTo = to.startsWith("+") ? to : `whatsapp:+977${to.replace(/^0/, "")}`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: formattedTo,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send multi-channel notification
 * Sends to all enabled channels
 */
export const sendMultiChannelNotification = async (user, notification) => {
  const results = {
    email: null,
    sms: null,
    whatsapp: null,
    push: null,
  };

  // Prepare message
  const message = `${notification.title}\n\n${notification.message}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #003865; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${notification.title}</h1>
        <p style="margin: 10px 0 0 0; font-size: 12px;">रुपन्देही जिल्ला | Rupandehi District</p>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p style="line-height: 1.6; color: #374151;">${notification.message}</p>
        ${notification.issue ? `
          <div style="margin-top: 20px; padding: 15px; background-color: white; border-left: 4px solid #003865;">
            <p style="margin: 0; font-weight: bold; color: #003865;">Issue Details:</p>
            <p style="margin: 5px 0; color: #6b7280;">Category: ${notification.issue.category}</p>
            <p style="margin: 5px 0; color: #6b7280;">Location: ${notification.issue.locationName}</p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/issue/${notification.issue._id}" 
               style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #003865; color: white; text-decoration: none; border-radius: 4px;">
              View Issue
            </a>
          </div>
        ` : ""}
      </div>
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">नेपाल सरकार | Government of Nepal</p>
        <p style="margin: 5px 0 0 0;">Rupandehi District Administration Office</p>
      </div>
    </div>
  `;

  // All notifications disabled - return empty results
  // Uncomment below to enable multi-channel notifications
  
  // Send email if user has email
  // if (user.email && process.env.ENABLE_EMAIL === "true") {
  //   results.email = await sendEmailNotification(
  //     user.email,
  //     notification.title,
  //     emailHtml,
  //     message
  //   );
  // }

  // Send SMS if user has phone and SMS is enabled
  // if (user.phone && process.env.ENABLE_SMS === "true") {
  //   results.sms = await sendSMSNotification(user.phone, message);
  // }

  // Send WhatsApp if user has phone and WhatsApp is enabled
  // if (user.phone && process.env.ENABLE_WHATSAPP === "true") {
  //   results.whatsapp = await sendWhatsAppNotification(user.phone, message);
  // }

  // Push notifications are handled by frontend Service Worker
  // if (process.env.ENABLE_PUSH === "true") {
  //   results.push = { success: true, note: "Push notification queued" };
  // }

  return results;
};

