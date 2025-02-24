const twilio = require("twilio");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = require("../config");

// Twilio setup (Twilio credentials)
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async ({ mobile, body }) => {
  try {
    const message = await client.messages.create({
      body,
      to: `+91${mobile}`,
      from: TWILIO_PHONE_NUMBER,
    });
  } catch (error) {
    throw new Error("Error sending OTP via SMS. Please try again.");
  }
};
module.exports = { sendSMS };
