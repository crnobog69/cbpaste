export default function handler(req, res) {
  res.status(200).json({ webhookUrl: process.env.DISCORD_WEBHOOK_URL });
}
