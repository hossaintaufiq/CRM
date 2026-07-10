import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8001),
  secret: process.env.SECRET_KEY || "dev-secret-change-me-in-production-nexus-crm-2026",
  tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || "24h",
  corsOrigins: (
    process.env.CORS_ORIGINS ||
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
  ).split(","),
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID || "",
  appleClientId: process.env.APPLE_CLIENT_ID || "",
  githubClientId: process.env.GITHUB_CLIENT_ID || "",
  smtpHost: process.env.SMTP_HOST || "",
  twilioSid: process.env.TWILIO_ACCOUNT_SID || "",
  ldapServer: process.env.LDAP_SERVER || "",
  ssoMetadataUrl: process.env.SSO_METADATA_URL || "",
  stripeSecret: process.env.STRIPE_SECRET_KEY || "",
  openaiKey: process.env.OPENAI_API_KEY || "",
} as const;
