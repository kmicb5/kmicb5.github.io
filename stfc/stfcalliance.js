// Minimal test to see what the Worker actually returns
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://throbbing-night-83f1.gf9mkqbtwv.workers.dev")
    .then(response => response.text())
    .then(html => {
      console.log("Worker returned HTML:");
      console.log(html); // this prints the raw page to the console
    })
    .catch(err => console.error("Fetch failed:", err));
});




// const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

// async function fetchAllianceData() {
//   try {
//     const res = await fetch(ALLIANCE_WORKER_URL);
//     const html = await res.text();

//     // DEBUG: confirm raw HTML
//     console.log("Worker HTML fetched:", html);

//     // Regex to extract the values array
//     const arrayMatch = html.match(/\[(?:\".*?\"|[0-9.]+,?)+\]/);
//     if (!arrayMatch) return console.error("Player array not found.");
//     const values = JSON.parse(arrayMatch[0]);

//     // Regex to extract the field map
//     const mapMatch = html.match(/\{(?:\s*\".*?\":\d+,?)+\}/);
//     if (!mapMatch) return console.error("Field map not found.");
//     const fieldMap = JSON.parse(mapMatch[0]);

//     // Build player objects
//     const players = [];
//     const blockSize = Object.keys(fieldMap).length;
//     for (let i = 0; i < values.length; i += blockSize) {
//       const block = values.slice(i, i + blockSize);
//       const player = {};
//       for (const key in fieldMap) {
//         player[key] = block[fieldMap[key]];
//       }
//       players.push(player);
//     }

//     // Call your LCARS render function
//     renderRoster(players);

//   } catch (err) {
//     console.error("Error fetching alliance data:", err);
//   }
// }

// // Ensure DOM is ready before rendering
// document.addEventListener("DOMContentLoaded", () => {
//   fetchAllianceData(); // initial load
//   setInterval(fetchAllianceData, 5 * 60 * 1000); // refresh every 5 min
// });