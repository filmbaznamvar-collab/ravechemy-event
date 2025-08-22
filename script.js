// فرانت فقط به سرورلس خودش صدا می‌زند، نه مستقیم به Ticketmaster → CORS حل میشه
const sections = Array.from(document.querySelectorAll(".list[data-country]"));

async function loadCountry(code, mount) {
  try {
    const res = await fetch(/api/events?country=${code}&size=8);
    const data = await res.json();
    mount.innerHTML = "";
    if (!data.events || !data.events.length) {
      mount.innerHTML = <p class="loading">No events found.</p>;
      return;
    }
    data.events.forEach(ev => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = 
        <div class="name">${ev.name}</div>
        <div class="meta">Date: ${ev.date} — City: ${ev.city}${ev.venue ? " — Venue: " + ev.venue : ""}</div>
      ;
      mount.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    mount.innerHTML = <p class="loading">Error loading events.</p>;
  }
}

sections.forEach(s => loadCountry(s.dataset.country, s));// فرانت فقط به سرورلس خودش صدا می‌زند، نه مستقیم به Ticketmaster → CORS حل میشه
const sections = Array.from(document.querySelectorAll(".list[data-country]"));

async function loadCountry(code, mount) {
  try {
    const res = await fetch(/api/events?country=${code}&size=8);
    const data = await res.json();
    mount.innerHTML = "";
    if (!data.events || !data.events.length) {
      mount.innerHTML = <p class="loading">No events found.</p>;
      return;
    }
    data.events.forEach(ev => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = 
        <div class="name">${ev.name}</div>
        <div class="meta">Date: ${ev.date} — City: ${ev.city}${ev.venue ? " — Venue: " + ev.venue : ""}</div>
      ;
      mount.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    mount.innerHTML = <p class="loading">Error loading events.</p>;
  }
}

sections.forEach(s => loadCountry(s.dataset.country, s));// Vercel Serverless Function (Node 18)
module.exports = async (req, res) => {
  try {
    const { country = "DE", size = "8" } = req.query;
    const API_KEY = process.env.TICKETMASTER_KEY; // توی Vercel ست می‌کنیم

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing TICKETMASTER_KEY" });
    }

    const url =
      https://app.ticketmaster.com/discovery/v2/events.json +
      ?apikey=${API_KEY} +
      &countryCode=${encodeURIComponent(country)} +
      &classificationName=Music +
      &size=${encodeURIComponent(size)} +
      &sort=date,asc;

    const r = await fetch(url);
    const json = await r.json();

    const list = (json?._embedded?.events || []).map(e => ({
      name: e.name,
      date: (e.dates?.start?.localDate)  (e.dates?.start?.dateTime  "").slice(0,10),
      city: e._embedded?.venues?.[0]?.city?.name || "",
      venue: e._embedded?.venues?.[0]?.name || "",
      sourceUrl: e.url
    }));

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600");
    return res.status(200).json({ events: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
