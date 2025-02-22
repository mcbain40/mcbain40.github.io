// Eorzea Time Calculator
function getEorzeaTime() {
    const earthTime = new Date();
    const eorzeaTime = new Date(earthTime.getTime() * 3600 / 175);
    return eorzeaTime.getUTCHours();
}

// Gathering Nodes Database
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

// Function to check active nodes
function getActiveNodes(currentET) {
    let activeNodes = [];

    Object.keys(gatheringNodes.dawntrail).forEach((type) => {
        gatheringNodes.dawntrail[type].forEach((node) => {
            if ((currentET >= node.start && currentET < node.start + node.duration) ||
                (node.start + node.duration > 24 && currentET < (node.start + node.duration) % 24)) {
                activeNodes.push(node);
            }
        });
    });

    return activeNodes;
}

// Update the UI
function updateTracker() {
    const currentET = getEorzeaTime();
    const activeNodes = getActiveNodes(currentET);
    const trackerDiv = document.getElementById("tracker");

    trackerDiv.innerHTML = `<h2>Current Eorzea Time: ${currentET}:00</h2>`;

    if (activeNodes.length > 0) {
        activeNodes.forEach(node => {
            trackerDiv.innerHTML += `
                <div class="node">
                    <h3>${node.name}</h3>
                    <p>Location: ${node.location}</p>
                    <p>Aetheryte: ${node.aetheryte}</p>
                    <p>Active from ${node.start}:00 - ${node.start + node.duration}:00 ET</p>
                </div>
            `;
        });
    } else {
        trackerDiv.innerHTML += `<p>No active nodes at this time.</p>`;
    }
}

// Refresh every 10 seconds
setInterval(updateTracker, 10000);
updateTracker();

