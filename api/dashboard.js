export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.query.key !== process.env.DASHBOARD_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

  let totalUsers = 0, newUsersWeek = 0, recentUsers = [];
  let activeSubscriptions = 0, mrr = 0, recentPayments = [];

  if (CLERK_SECRET) {
    try {
      const r = await fetch("https://api.clerk.com/v1/users?limit=10&order_by=-created_at", {
        headers: { "Authorization": `Bearer ${CLERK_SECRET}` }
      });
      if (r.ok) {
        const data = await r.json();
        const users = Array.isArray(data) ? data : (data.data || []);
        totalUsers = users.length;
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        newUsersWeek = users.filter(u => u.created_at > weekAgo).length;
        recentUsers = users.slice(0, 5).map(u => ({
          email: u.email_addresses?.[0]?.email_address || "unknown",
          created: new Date(u.created_at).toLocaleDateString("es-ES")
        }));
      }
    } catch(e) {}
  }

  if (STRIPE_SECRET) {
    try {
      const sr = await fetch("https://api.stripe.com/v1/subscriptions?status=active&limit=10", {
        headers: { "Authorization": `Bearer ${STRIPE_SECRET}` }
      });
      if (sr.ok) {
        const subs = await sr.json();
        activeSubscriptions = subs.data?.length || 0;
        mrr = (subs.data || []).reduce((a, s) => a + (s.plan?.amount || 0) / 100, 0);
      }
      const pr = await fetch("https://api.stripe.com/v1/charges?limit=5", {
        headers: { "Authorization": `Bearer ${STRIPE_SECRET}` }
      });
      if (pr.ok) {
        const pays = await pr.json();
        recentPayments = (pays.data || []).map(p => ({
          email: p.billing_details?.email || "unknown",
          amount: (p.amount / 100).toFixed(0),
          date: new Date(p.created * 1000).toLocaleDateString("es-ES"),
          plan: p.amount >= 2900 ? "Empresa" : "Personal"
        }));
      }
    } catch(e) {}
  }

  return res.status(200).json({
    totalUsers, newUsersWeek, recentUsers,
    activeSubscriptions, mrr: mrr.toFixed(0), recentPayments
  });
}
