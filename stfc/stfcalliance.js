const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

async function fetchAllianceData() {
  try {
    const res = await fetch(ALLIANCE_WORKER_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Fetched ", data);
    
    if (!data.players || data.players.length === 0) {
      console.error("No players found");
      return;
    }
    
    renderRoster(data.players);
    console.log(`Successfully loaded ${data.players.length} players`);
    
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
  
  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  if (players.length > 0) {
    Object.keys(players[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create body
  const tbody = document.createElement("tbody");
  players.forEach(player => {
    const row = document.createElement("tr");
    Object.keys(players[0]).forEach(key => {
      const td = document.createElement("td");
      td.textContent = player[key];
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




// const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

// async function fetchAllianceData() {
//   try {
//     const res = await fetch(ALLIANCE_WORKER_URL);
    
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
    
//     const data = await res.json();
//     console.log("Fetched ", data);
    
//     if (!data.players || data.players.length === 0) {
//       console.error("No players found");
//       return;
//     }
    
//     renderRoster(data.players);
//     console.log(`Successfully loaded ${data.players.length} players`);
    
//   } catch (err) {
//     console.error("Error fetching alliance ", err);
//   }
// }

// function renderRoster(players) {
//   const container = document.getElementById("roster-container");
  
//   if (!container) {
//     console.error("Roster container not found in DOM");
//     return;
//   }
  
//   container.innerHTML = "";
  
//   const table = document.createElement("table");
//   table.id = "roster";
  
//   // Create header
//   const thead = document.createElement("thead");
//   const headerRow = document.createElement("tr");
  
//   if (players.length > 0) {
//     Object.keys(players[0]).forEach(key => {
//       const th = document.createElement("th");
//       th.textContent = key;
//       headerRow.appendChild(th);
//     });
//   }
  
//   thead.appendChild(headerRow);
//   table.appendChild(thead);
  
//   // Create body
//   const tbody = document.createElement("tbody");
//   players.forEach(player => {
//     const row = document.createElement("tr");
//     Object.values(player).forEach(value => {
//       const td = document.createElement("td");
//       td.textContent = value;
//       row.appendChild(td);
//     });
//     tbody.appendChild(row);
//   });
  
//   table.appendChild(tbody);
//   container.appendChild(table);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   fetchAllianceData();
//   setInterval(fetchAllianceData, 5 * 60 * 1000);
// });