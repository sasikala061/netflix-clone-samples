export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  return res.status(201).json({ message: 'registration received', email })
}
