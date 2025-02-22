// Function to calculate Eorzea Time (ET) in real-time
function getEorzeaTime() {
    const earthTime = new Date();
    const eorzeaTime = new Date(earthTime.getTime() * 3600 / 175);
    
    let hours = eorzeaTime.getUTCHours();
    let minutes = eorzeaTime.getUTCMinutes();
    
    // Convert to 12-hour format
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for AM/PM format

    return { hours, minutes, period };
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
            let nodeEnd = node.start + node.duration;
            let isActive = 
                (currentET >= node.start && currentET < nodeEnd) || 
                (nodeEnd > 24 && currentET < nodeEnd % 24);
            
            if (isActive) activeNodes.push(node);
        });
    });

    return activeNodes;
}

// Update the UI in real-time
function updateTracker() {
    const { hours, minutes, period } = getEorzeaTime();
    const currentET = getEorzeaTime().hours + (getEorzeaTime().period === "PM" ? 12 : 0);
    const activeNodes = getActiveNodes(currentET);
    const trackerDiv = document.getElementById("tracker");

    trackerDiv.innerHTML = `<h2>Current Eorzea Time: ${hours}:${minutes.toString().padStart(2, '0')} ${period}</h2>`;

    if (activeNodes.length > 0) {
        activeNodes.forEach(node => {
            let startTime = node.start % 12 || 12;
            let startPeriod = node.start >= 12 ? "PM" : "AM";
            let endTime = (node.start + node.duration) % 12 || 12;
            let endPeriod = (node.start + node.duration) >= 12 ? "PM" : "AM";

            trackerDiv.innerHTML += `
                <div class="node">
                    <h3>${node.name}</h3>
                    <p>Location: ${node.location}</p>
                    <p>Aetheryte: ${node.aetheryte}</p>
                    <p>Active from ${startTime}:00 ${startPeriod} - ${endTime}:00 ${endPeriod} ET</p>
                </div>
            `;
        });
    } else {
        trackerDiv.innerHTML += `<p>No active nodes at this time.</p>`;
    }
}

// Refresh every second for real-time updates
setInterval(updateTracker, 1000);
updateTracker();

