const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

async function fetchAllianceData() {
  try {
    const res = await fetch(ALLIANCE_WORKER_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const html = await res.text();
    
    // Extract the big values + field map block reliably
    const playerBlocks = html.match(/(\[.*?\])|(\{.*?\})/g);
    
    if (!playerBlocks || playerBlocks.length < 2) {
      console.error("Could not parse players.");
      return;
    }
    
    const values = JSON.parse(playerBlocks[0]); // the array of numbers/strings
    const fieldMap = JSON.parse(playerBlocks[1]); // the field map object
    const players = [];
    const blockSize = Object.keys(fieldMap).length;
    
    // Build players array
    for (let i = 0; i < values.length; i += blockSize) {
      const block = values.slice(i, i + blockSize);
      const player = {};
      for (const key in fieldMap) {
        player[key] = block[fieldMap[key]];
      }
      players.push(player);
    }
    
    // Render ONCE after all players are parsed
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
  
  // Clear existing content
  container.innerHTML = "";
  
  // Create table
  const table = document.createElement("table");
  table.id = "roster";
  
  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  if (players.length > 0) {
    // Get all keys from first player
    const keys = Object.keys(players[0]);
    keys.forEach(key => {
      const th = document.createElement("th");
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize
      headerRow.appendChild(th);
    });
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create body
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

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  fetchAllianceData();
  // Refresh every 5 minutes
  setInterval(fetchAllianceData, 5 * 60 * 1000);
});