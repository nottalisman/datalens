// A deliberately messy sample so Datalens has something to flag.
export function sampleData(): Record<string, unknown>[] {
  const regions = ["North", "South", "East", "West", "Central"];
  const products = ["Standard", "Pro", "Enterprise", "Trial"];
  const channels = ["Direct", "Partner", "Online", "Retail"];
  const names = [
    "Avery Chen", "Priya Rao", "Marcus Hall", "Sana Qureshi",
    "Luca Romano", "Mei Tanaka", "Diego Alvarez", "Hannah Weiss",
  ];

  const rows: Record<string, unknown>[] = [];
  const start = new Date("2026-01-01").getTime();
  const dayMs = 86_400_000;

  for (let i = 0; i < 180; i++) {
    const date = new Date(start + Math.floor(Math.random() * 300) * dayMs);
    const base = 400 + Math.random() * 2800;
    const amount = Math.round(base * 100) / 100;
    const row: Record<string, unknown> = {
      order_id: `ORD-${(1000 + i).toString()}`,
      order_date: date.toISOString().slice(0, 10),
      customer: names[Math.floor(Math.random() * names.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      product: products[Math.floor(Math.random() * products.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      quantity: Math.floor(1 + Math.random() * 8),
      unit_price: Math.round((50 + Math.random() * 400) * 100) / 100,
      amount,
      discount_pct: Math.random() < 0.6 ? Math.round(Math.random() * 25) : "",
      fulfilled: Math.random() < 0.9 ? "yes" : "no",
      notes: "",
    };
    // Introduce quality issues deliberately
    if (i % 23 === 0) row.region = "";
    if (i % 17 === 0) row.customer = "";
    if (i === 42) row.amount = 999999; // outlier
    if (i === 71) row.amount = -500; // negative outlier
    if (i % 31 === 0) row.quantity = "N/A"; // mixed type
    rows.push(row);
  }
  // Add a few exact duplicates
  rows.push({ ...rows[5] });
  rows.push({ ...rows[22] });
  rows.push({ ...rows[22] });
  return rows;
}
