import React, { useState, useEffect } from 'react';
import { Clock, Cloud, Heart, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const FFXIVTimer = () => {
  const [currentEorzeanTime, setCurrentEorzeanTime] = useState('12:00 AM');
  const [nextNodes, setNextNodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterExpansion, setFilterExpansion] = useState('all');
  const [expandedNode, setExpandedNode] = useState(null);

  const nodes = [
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
  ];

  const getEorzeanTime = () => {
    const EORZEA_MULTIPLIER = 3600 / 175;
    const now = new Date();
    const eorzeaTime = now.getTime() * EORZEA_MULTIPLIER;
    return new Date(eorzeaTime);
  };

  const formatEorzeanTime = (date) => {
    let hours = date.getUTCHours() % 12 || 12;
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let period = date.getUTCHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${period}`;
  };

  const calculateNextSpawn = (node) => {
    const eorzeaDate = getEorzeanTime();
    const eorzeaHour = eorzeaDate.getUTCHours();
    
    let hoursUntilSpawn = node.start - eorzeaHour;
    if (hoursUntilSpawn <= 0) {
      hoursUntilSpawn += node.interval;
    }
    
    return hoursUntilSpawn;
  };

  useEffect(() => {
    const updateTimer = () => {
      const eorzeaDate = getEorzeanTime();
      setCurrentEorzeanTime(formatEorzeanTime(eorzeaDate));

      let upcoming = nodes.map(node => ({
        ...node,
        nextSpawn: calculateNextSpawn(node)
      }));

      upcoming.sort((a, b) => a.nextSpawn - b.nextSpawn);
      setNextNodes(upcoming);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Eorzean Time: {currentEorzeanTime}
      </h2>
      <div className="space-y-4">
        {nextNodes.map((node, index) => (
          <div key={index} className="node-item">
            <h3>{node.name} - Next Spawn in {node.nextSpawn}h</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FFXIVTimer;

