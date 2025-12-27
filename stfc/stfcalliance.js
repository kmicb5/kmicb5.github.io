const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

// Track which columns are visible
const visibleColumns = {
  server: true,
  name: true,
  arank: true,
  level: true,
  ahelps: true,
  acontrib: true,
  aisocontrib: true,
  ajoined: true,
  rssmined: true
};

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
  
  // Create column toggle controls
  const toggleDiv = document.createElement("div");
  toggleDiv.className = "column-toggles";
  toggleDiv.style.marginBottom = "15px";
  toggleDiv.style.display = "flex";
  toggleDiv.style.flexWrap = "wrap";
  toggleDiv.style.gap = "10px";
  
  if (players.length > 0) {
    Object.keys(players[0]).forEach(column => {
      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.gap = "5px";
      label.style.cursor = "pointer";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = visibleColumns[column];
      checkbox.dataset.column = column;
      checkbox.style.cursor = "pointer";
      
      checkbox.addEventListener("change", (e) => {
        visibleColumns[column] = e.target.checked;
        updateTableVisibility();
      });
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(column));
      toggleDiv.appendChild(label);
    });
  }
  
  container.appendChild(toggleDiv);
  
  // Create table
  const table = document.createElement("table");
  table.id = "roster";
  
  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  if (players.length > 0) {
    Object.keys(players[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      th.dataset.column = key;
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
      td.dataset.column = key;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
  
  // Apply initial visibility
  updateTableVisibility();
}

function updateTableVisibility() {
  const table = document.getElementById("roster");
  if (!table) return;
  
  // Update header visibility
  table.querySelectorAll("th").forEach(th => {
    const column = th.dataset.column;
    th.style.display = visibleColumns[column] ? "table-cell !important" : "none !important";
  });
  
  // Update cell visibility
  table.querySelectorAll("td").forEach(td => {
    const column = td.dataset.column;
    td.style.display = visibleColumns[column] ? "table-cell !important" : "none !important";
  });
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