const gatheringNodes = {
  dawntrail: {
    botany: [
      { name: "Ipe Log", location: "Kozama'uka (x7, y33)", aetheryte: "Earthenshire", start: 12, duration: 2 },
      { name: "Nopaliflower", location: "Shaaloni (x10, y31)", aetheryte: "Sheshenewezi Springs", start: 2, duration: 2 },
      { name: "Blackseed Cotton Boll", location: "Living Memory (x28, y17)", aetheryte: "Leynode Pyro", start: 4, duration: 2 },
      { name: "Optical Fiberglass", location: "Living Memory (x28, y17)", aetheryte: "Leynode Pyro", start: 4, duration: 2 }
    ],
    mining: [
      { name: "Turali Alumen", location: "Urqopacha (x37, y29)", aetheryte: "Worlar's Echo", start: 8, duration: 2 },
      { name: "Fine Silver Ore", location: "Shaaloni (x36, y28)", aetheryte: "Hhusatawhi", start: 10, duration: 2 },
      { name: "Alexandrian Ore", location: "Living Memory (x9, y15)", aetheryte: "Leynode Aero", start: 6, duration: 2 },
      { name: "Harmonite Ore", location: "Living Memory (x9, y15)", aetheryte: "Leynode Aero", start: 6, duration: 2 }
    ]
  }
};

// Function to get Eorzea Time
function getEorzeaTime() {
    let now = new Date();
    let eorzeaHours = (now.getUTCHours() * 2 + Math.floor(now.getUTCMinutes() / 30)) % 24;
    let eorzeaMinutes = (now.getUTCMinutes() * 2) % 60;
    return { hours: eorzeaHours, minutes: eorzeaMinutes };
}

// Function to check active nodes
function getActiveNodes() {
    let { hours } = getEorzeaTime();
    let activeNodes = [];

    Object.values(gatheringNodes.dawntrail).forEach(nodes => {
        nodes.forEach(node => {
            let endTime = (node.start + node.duration) % 24;
            if ((hours >= node.start && hours < endTime) || (endTime < node.start && (hours >= node.start || hours < endTime))) {
                activeNodes.push(node);
            }
        });
    });

    return activeNodes;
}

// Function to update the tracker display
function updateTracker() {
    let { hours, minutes } = getEorzeaTime();
    let trackerDiv = document.getElementById("tracker");
    let activeNodes = getActiveNodes();

    trackerDiv.innerHTML = `<h2>Current Eorzea Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}</h2>`;

    if (activeNodes.length === 0) {
        trackerDiv.innerHTML += `<p>No nodes are active right now.</p>`;
    } else {
        activeNodes.forEach(node => {
            trackerDiv.innerHTML += `
                <div class="node">
                    <h3>${node.name}</h3>
                    <p><strong>Location:</strong> ${node.location}</p>
                    <p><strong>Aetheryte:</strong> ${node.aetheryte}</p>
                    <p><strong>Active from:</strong> ${node.start}:00 - ${(node.start + node.duration) % 24}:00 ET</p>
                </div>
            `;
        });
    }
}

// Update every 10 seconds
setInterval(updateTracker, 10000);
updateTracker();

