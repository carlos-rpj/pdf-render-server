export function healthCheck(req, res) {
  res.status(200);
  res.json({ ok: true });
}