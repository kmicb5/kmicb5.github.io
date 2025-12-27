const ALLIANCE_WORKER_URL = "https://throbbing-night-83f1.gf9mkqbtwv.workers.dev";

const visibleColumns = {};
let currentSort = { column: null, ascending: true };
let allPlayers = [];

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
    
    allPlayers = data.players;
    renderRoster(allPlayers);
    console.log(`Successfully loaded ${allPlayers.length} players`);
    
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
  
  // Initialize all columns as visible
  if (players.length > 0) {
    Object.keys(players[0]).forEach(column => {
      visibleColumns[column] = true;
    });
  }
  
  // Create checkboxes
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
      checkbox.checked = true;
      checkbox.dataset.column = column;
      checkbox.style.cursor = "pointer";
      
      checkbox.addEventListener("change", (e) => {
        visibleColumns[column] = e.target.checked;
        toggleColumn(column, e.target.checked);
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
      th.style.cursor = "pointer";
      th.style.userSelect = "none";
      th.title = "Click to sort";
      
      th.addEventListener("click", () => {
        sortTable(key);
      });
      
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
}

function parseFormattedNumber(value) {
  if (typeof value !== 'string') return parseFloat(value) || 0;
  
  const trimmed = value.trim();
  const match = trimmed.match(/^([\d.]+)([MB]?)$/i);
  
  if (!match) return 0;
  
  let num = parseFloat(match[1]);
  const suffix = match[2].toUpperCase();
  
  if (suffix === 'K') num *= 1000;
  if (suffix === 'M') num *= 1000000;
  if (suffix === 'B') num *= 1000000000;
  if (suffix === 'T') num *= 1000000000000;
  
  return num;
}

function sortTable(column) {
  // Toggle ascending/descending if clicking same column
  if (currentSort.column === column) {
    currentSort.ascending = !currentSort.ascending;
  } else {
    currentSort.column = column;
    currentSort.ascending = true;
  }
  
  // Sort the players
  allPlayers.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Try formatted numbers first (321.11M, 1.76B)
    const aNum = parseFormattedNumber(aVal);
    const bNum = parseFormattedNumber(bVal);
    
    if (aNum !== 0 || bNum !== 0) {
      return currentSort.ascending ? aNum - bNum : bNum - aNum;
    }
    
    // String comparison
    if (typeof aVal === 'string') {
      return currentSort.ascending 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });
  
  // Re-render table
  renderRoster(allPlayers);
}

function toggleColumn(column, isVisible) {
  const table = document.getElementById("roster");
  if (!table) return;
  
  const headers = table.querySelectorAll(`th[data-column="${column}"]`);
  const cells = table.querySelectorAll(`td[data-column="${column}"]`);
  
  headers.forEach(th => {
    th.style.display = isVisible ? "" : "none";
  });
  
  cells.forEach(td => {
    td.style.display = isVisible ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllianceData();
  setInterval(fetchAllianceData, 5 * 60 * 1000);
});