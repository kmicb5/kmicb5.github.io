const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

async function fetchAllianceData() {
  try {
    const res = await fetch(ALLIANCE_WORKER_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const html = await res.text();
    
    // DIAGNOSTIC: Log the raw response
    console.log("Raw response:", html);
    console.log("Response length:", html.length);
    console.log("First 500 chars:", html.substring(0, 500));
    
    // Try to extract JSON blocks
    const playerBlocks = html.match(/(\[.*?\])|(\{.*?\})/g);
    console.log("Parsed blocks:", playerBlocks);
    
    if (!playerBlocks || playerBlocks.length < 2) {
      console.error("Could not parse players - no JSON blocks found");
      return;
    }
    
    console.log("First block:", playerBlocks[0]);
    console.log("Second block:", playerBlocks[1]);
    
    const values = JSON.parse(playerBlocks[0]);
    const fieldMap = JSON.parse(playerBlocks[1]);
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
    console.log(`Successfully loaded ${players.length} players`);
    
  } catch (err) {
    console.error("Error fetching alliance ", err);
  }
}

function renderRoster(players) {
  const container = document.getElementById("roster-container");
  
  if (!container) {
    console.error("Roster container not found in DOM");
    return;
  }
  
  container.innerHTML = "";
  
  const table = document.createElement("table");
  table.id = "roster";
  
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  if (players.length > 0) {
    const keys = Object.keys(players[0]);
    keys.forEach(key => {
      const th = document.createElement("th");
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerRow.appendChild(th);
    });
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement("tbody");
  players.forEach(player => {
    const row = document.createElement("tr");
    Object.values(player).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllianceData();
  setInterval(fetchAllianceData, 5 * 60 * 1000);
});