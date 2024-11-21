export default function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  console.log("API called, webhook URL:", webhookUrl);

  if (!webhookUrl) {
    console.log("Environment variables:", process.env);
    return res.status(500).json({
      error: "Webhook URL not configured",
      envExists: !!process.env.DISCORD_WEBHOOK_URL,
    });
  }

  res.status(200).json({ webhookUrl });
}
