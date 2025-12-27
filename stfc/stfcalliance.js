function renderRoster(players) {
  const tbody = document.querySelector("#roster tbody");
  tbody.innerHTML = "";

  // Find max values for scaling bars
  const maxPower = Math.max(...players.map(p => p.power));
  const maxHelps = Math.max(...players.map(p => p.ahelps));

  players.forEach(p => {
    const tr = document.createElement("tr");

    // Scale bars to max 100px width
    const powerWidth = Math.floor((p.power / maxPower) * 100);
    const helpsWidth = Math.floor((p.ahelps / maxHelps) * 100);

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.level}</td>
      <td>
        ${p.power.toLocaleString()} 
        <div class="stat-bar stat-power" style="width:${powerWidth}px"></div>
      </td>
      <td>${p.arank}</td>
      <td>
        ${p.ahelps} 
        <div class="stat-bar stat-helps" style="width:${helpsWidth}px"></div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}