const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

async function fetchAllianceData() {
  try {
    const res = await fetch(ALLIANCE_WORKER_URL);
    const html = await res.text();

    // Extract the big values + field map block reliably
    // The pattern is: player values,...,{"fieldmap":...},...repeat
    const playerBlocks = html.match(/(\[.*?\])|(\{.*?\})/g);
    if (!playerBlocks || playerBlocks.length < 2) return console.error("Could not parse players.");

    const values = JSON.parse(playerBlocks[0]); // the array of numbers/strings
    const fieldMap = JSON.parse(playerBlocks[1]); // the field map object

    const players = [];
    const blockSize = Object.keys(fieldMap).length;
    for (let i = 0; i < values.length; i += blockSize) {
      const block = values.slice(i, i + blockSize);
      const player = {};
      for (const key in fieldMap) player[key] = block[fieldMap[key]];
      players.push(player);
    }

    renderRoster(players);

  } catch (err) {
    console.error("Error fetching alliance data:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllianceData();
  setInterval(fetchAllianceData, 5 * 60 * 1000);
});