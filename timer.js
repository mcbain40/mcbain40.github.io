import React, { useState, useEffect } from 'react';
import { Clock, Heart, Filter, ChevronDown, ChevronUp } from 'lucide-react';



  // Updated node data structure
  export const nodes = [
    botany: [
      {
        name: "Ipe Log",
        location: "Kozama'uka (x7, y33)",
        aetheryte: "Earthenshire",
        type: "Botany",
        expansion: "Dawntrail",
        start: 12,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Nopaliflower",
        location: "Shaaloni (x10, y31)",
        aetheryte: "Sheshenewezi Springs",
        type: "Botany",
        expansion: "Dawntrail",
        start: 2,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Blackseed Cotton Boll",
        location: "Living Memory (x28, y17)",
        aetheryte: "Leynode Pyro",
        type: "Botany",
        expansion: "Dawntrail",
        start: 4,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Optical Fiberglass",
        location: "Living Memory (x28, y17)",
        aetheryte: "Leynode Pyro",
        type: "Botany",
        expansion: "Dawntrail",
        start: 4,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      }
    ],
    mining: [
      {
        name: "Turali Alumen",
        location: "Urqopacha (x37, y29)",
        aetheryte: "Worlar's Echo",
        type: "Mining",
        expansion: "Dawntrail",
        start: 8,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Fine Silver Ore",
        location: "Shaaloni (x36, y28)",
        aetheryte: "Hhusatawhi",
        type: "Mining",
        expansion: "Dawntrail",
        start: 10,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Alexandrian Ore",
        location: "Living Memory (x9, y15)",
        aetheryte: "Leynode Aero",
        type: "Mining",
        expansion: "Dawntrail",
        start: 6,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      },
      {
        name: "Harmonite Ore",
        location: "Living Memory (x9, y15)",
        aetheryte: "Leynode Aero",
        type: "Mining",
        expansion: "Dawntrail",
        start: 6,
        duration: 2,
        interval: 12,
        level: 100,
        patch: "7.0",
        folklore: true
      }
    ]
  ];

const FFXIVTimer = () => {
  // Initialize all state variables
  const [currentEorzeanTime, setCurrentEorzeanTime] = useState('00:00');
  const [nextNodes, setNextNodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterExpansion, setFilterExpansion] = useState('all');
  const [expandedNode, setExpandedNode] = useState(null);
  
  // Function to convert Earth time to Eorzean time
  const getEorzeanTime = () => {
    const EORZEA_MULTIPLIER = 3600 / 175;
    const now = new Date();
    const eorzeaTime = now.getTime() * EORZEA_MULTIPLIER;
    const eorzeaDate = new Date(eorzeaTime);
    return eorzeaDate;
  };

  // Function to format Eorzean time as HH:mm
  const formatEorzeanTime = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate time until next spawn for a node
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ffxiv-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Update timer and nodes every second
  useEffect(() => {
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

    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [filterType, filterExpansion, favorites]);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Clock className="h-6 w-6" />
          Current Eorzean Time: {currentEorzeanTime}
        </h2>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {nextNodes.map((node, index) => (
            <div key={index} className={`node-item ${favorites.includes(node.name) ? 'favorite' : ''}`}>
              <div className="flex items-start justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{node.name}</h3>
                    <button onClick={() => toggleFavorite(node.name)} className="favorite-heart">
                      <Heart className="h-5 w-5" fill={favorites.includes(node.name) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{node.location} (Aetheryte: {node.aetheryte})</p>
                  <p className="text-sm text-gray-600">Level {node.level} {node.type}</p>
                  <p className="text-sm text-gray-600">Patch: {node.patch}</p>
                  {node.folklore && <p className="text-sm text-gray-600 font-semibold">Folklore Node</p>}
                  <div className="mt-2">
                    <span className="timer-badge">
                      Next spawn in: {Math.floor(node.nextSpawn)}h {Math.floor((node.nextSpawn % 1) * 60)}m
                    </span>
                  </div>
                </div>
                <button onClick={() => setExpandedNode(expandedNode === node.name ? null : node.name)} className="p-2 hover:bg-gray-200 rounded">
                  {expandedNode === node.name ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FFXIVTimer;

