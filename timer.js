// FFXIV Gathering Timer Component
const FFXIVTimer = () => {
  const [currentEorzeanTime, setCurrentEorzeanTime] = React.useState('00:00');
  const [nextNodes, setNextNodes] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [filterType, setFilterType] = React.useState('all');
  const [filterExpansion, setFilterExpansion] = React.useState('all');
  const [expandedNode, setExpandedNode] = React.useState(null);

  // Sample node data
  const nodes = [
    {
      name: "Raw Ruby",
      location: "Coerthas Western Highlands (x13,y15)",
      type: "Mining",
      expansion: "Heavensward",
      start: 2,
      duration: 2,
      interval: 12,
      level: 60,
      weather: null,
      patch: "3.0"
    },
    {
      name: "Sculptor",
      location: "The Ruby Sea",
      type: "Fishing",
      expansion: "Stormblood",
      start: 10,
      duration: 3,
      interval: 24,
      level: 70,
      weather: ["Clear Skies", "Fair Skies"],
      bait: "Plump Worm",
      patch: "4.0"
      
    }
  ];

  // Convert Earth time to Eorzean time
  const getEorzeanTime = () => {
    const EORZEA_MULTIPLIER = 3600 / 175;
    const now = new Date();
    const eorzeaTime = now.getTime() * EORZEA_MULTIPLIER;
    return new Date(eorzeaTime);
  };

  // Format Eorzean time as HH:mm
  const formatEorzeanTime = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate time until next spawn
  const calculateNextSpawn = (node) => {
    const eorzeaDate = getEorzeanTime();
    const eorzeaHour = eorzeaDate.getUTCHours();
    
    let hoursUntilSpawn = node.start - eorzeaHour;
    if (hoursUntilSpawn <= 0) {
      hoursUntilSpawn += node.interval;
    }
    
    return hoursUntilSpawn;
  };

  // Toggle favorite status
  const toggleFavorite = (nodeName) => {
    const newFavorites = favorites.includes(nodeName)
      ? favorites.filter(f => f !== nodeName)
      : [...favorites, nodeName];
    setFavorites(newFavorites);
    localStorage.setItem('ffxiv-favorites', JSON.stringify(newFavorites));
  };

  // Load favorites on mount
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('ffxiv-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Update timer and nodes
  React.useEffect(() => {
    const updateTimer = () => {
      const eorzeaDate = getEorzeanTime();
      setCurrentEorzeanTime(formatEorzeanTime(eorzeaDate));

      let upcoming = nodes
        .filter(node => 
          (filterType === 'all' || node.type === filterType) &&
          (filterExpansion === 'all' || node.expansion === filterExpansion)
        )
        .map(node => ({
          ...node,
          nextSpawn: calculateNextSpawn(node)
        }));

      // Sort by favorites first, then spawn time
      upcoming.sort((a, b) => {
        const aFav = favorites.includes(a.name);
        const bFav = favorites.includes(b.name);
        if (aFav !== bFav) return bFav ? 1 : -1;
        return a.nextSpawn - b.nextSpawn;
      });

      setNextNodes(upcoming);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [filterType, filterExpansion, favorites]);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <span className="h-6 w-6">⏰</span>
          Current Eorzean Time: {currentEorzeanTime}
        </h2>
        <div className="flex gap-4 mt-4">
          <select 
            className="ffxiv-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Mining">Mining</option>
            <option value="Botany">Botany</option>
            <option value="Fishing">Fishing</option>
          </select>
          <select
            className="ffxiv-select"
            value={filterExpansion}
            onChange={(e) => setFilterExpansion(e.target.value)}
          >
            <option value="all">All Expansions</option>
            <option value="A Realm Reborn">A Realm Reborn</option>
            <option value="Heavensward">Heavensward</option>
            <option value="Stormblood">Stormblood</option>
            <option value="Shadowbringers">Shadowbringers</option>
            <option value="Endwalker">Endwalker</option>
          </select>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {nextNodes.map((node, index) => (
            <div 
              key={index} 
              className={`node-item ${favorites.includes(node.name) ? 'favorite' : ''}`}
            >
              <div className="flex items-start justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{node.name}</h3>
                    <button
                      onClick={() => toggleFavorite(node.name)}
                      className="favorite-heart"
                    >
                      <span role="img" aria-label="heart">
                        {favorites.includes(node.name) ? '❤️' : '🤍'}
                      </span>
                    </button>
                    <span className="expansion-badge">{node.expansion}</span>
                  </div>
                  <p className="text-sm text-gray-600">{node.location}</p>
                  <p className="text-sm text-gray-600">Level {node.level} {node.type}</p>
                  <div className="mt-2">
                    <span className="timer-badge">
                      Next spawn in: {Math.floor(node.nextSpawn)}h {Math.floor((node.nextSpawn % 1) * 60)}m
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedNode(expandedNode === node.name ? null : node.name)}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  {expandedNode === node.name ? '▼' : '▶'}
                </button>
              </div>
              
              {expandedNode === node.name && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <p className="text-sm">Expansion: {node.expansion}</p>
                  <p className="text-sm">Patch: {node.patch}</p>
                  <p className="text-sm">Window Duration: {node.duration} hours</p>
                  {node.weather && (
                    <p className="text-sm">Weather Conditions: {node.weather.join(", ")}</p>
                  )}
                  {node.bait && (
                    <p className="text-sm">Recommended Bait: {node.bait}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// This line is important for the component to be accessible
window.FFXIVTimer = FFXIVTimer;
