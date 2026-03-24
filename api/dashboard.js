export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Simple auth check via query param
  if (req.query.key !== process.env.DASHBOARD_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

  try {
    let totalUsers = 0, newUsersWeek = 0, recentUsers = [];
    let activeSubscriptions = 0, mrr = 0, recentPayments = [];

    // Clerk — get users
    if (CLERK_SECRET) {
      try {
        const clerkR = await fetch("https://api.clerk.com/v1/users?limit=10&order_by=-created_at", {
          headers: { "Authorization": `Bearer ${CLERK_SECRET}` }
        });
        if (clerkR.ok) {
          const users = await clerkR.json();
          const arr = Array.isArray(users) ? users : users.data || [];
          totalUsers = arr.length;
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          newUsersWeek = arr.filter(u => u.created_at > weekAgo).length;
          recentUsers = arr.slice(0, 5).map(u => ({
            email: u.email_addresses?.[0]?.email_address || "unknown",
            created: new Date(u.created_at).toLocaleDateString("es-ES")
          }));
        }
      } catch(e) { console.error("Clerk error:", e); }
    }

    // Stripe — get subscriptions and payments
    if (STRIPE_SECRET) {
      try {
        const subR = await fetch("https://api.stripe.com/v1/subscriptions?status=active&limit=10", {
          headers: { "Authorization": `Bearer ${STRIPE_SECRET}` }
        });
        if (subR.ok) {
          const subs = await subR.json();
          activeSubscriptions = subs.data?.length || 0;
          mrr = (subs.data || []).reduce((acc, s) => acc + (s.plan?.amount || 0) / 100, 0);
        }
        const payR = await fetch("https://api.stripe.com/v1/charges?limit=5", {
          headers: { "Authorization": `Bearer ${STRIPE_SECRET}` }
        });
        if (payR.ok) {
          const pays = await payR.json();
          recentPayments = (pays.data || []).map(p => ({
            email: p.billing_details?.email || "unknown",
            amount: (p.amount / 100).toFixed(0),
            date: new Date(p.created * 1000).toLocaleDateString("es-ES"),
            plan: p.amount >= 2900 ? "Empresa" : "Personal"
          }));
        }
      } catch(e) { console.error("Stripe error:", e); }
    }

    return res.status(200).json({
      totalUsers, newUsersWeek, recentUsers,
      activeSubscriptions, mrr: mrr.toFixed(0), recentPayments
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
