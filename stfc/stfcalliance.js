const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

async function fetchAllianceData() {
  try {
    const res = await fetch(ALLIANCE_WORKER_URL);
    const html = await res.text();
    console.log(html); // debug: confirm the raw Worker HTML

    // Extract player array (values) - adjust regex if site changes
    const arrayMatch = html.match(/\[(?:\".*?\"|[0-9.]+,?)+\]/);
    if (!arrayMatch) return console.error("Player array not found.");
    const values = JSON.parse(arrayMatch[0]);

    // Extract field map
    const mapMatch = html.match(/\{(?:\s*\".*?\":\d+,?)+\}/);
    if (!mapMatch) return console.error("Field map not found.");
    const fieldMap = JSON.parse(mapMatch[0]);

    // Build player objects
    const players = [];
    const blockSize = Object.keys(fieldMap).length;
    for (let i = 0; i < values.length; i += blockSize) {
      const block = values.slice(i, i + blockSize);
      const player = {};
      for (const key in fieldMap) {
        player[key] = block[fieldMap[key]];
      }
      players.push(player);
    }

    renderRoster(players);

  } catch (err) {
    console.error("Error fetching alliance data:", err);
  }
}

// Call fetch once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  fetchAllianceData();
  setInterval(fetchAllianceData, 5 * 60 * 1000); // refresh every 5 min
});