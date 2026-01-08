// Comprehensive trade job types with materials, labor estimates, and how-to instructions
// Based on Jan 2026 UK Trade Prices, Housebuilder's Bible 15th Edition, industry standards

export interface JobMaterial {
  name: string;
  unit: string;
  quantity: number;
  unitCostTrade: number;
  unitCostRetail: number;
  wasteFactor: number;
}

export interface TradeJob {
  id: string;
  name: string;
  description: string;
  labourHours: number;
  skillLevel: 'apprentice' | 'qualified' | 'master';
  materials: JobMaterial[];
  tools: string[];
  instructions: string[];
  safetyNotes: string[];
  buildingRegsNotes?: string[];
}

export interface TradeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  hourlyRateTrade: number;
  hourlyRateRetail: number;
  jobs: TradeJob[];
}

export const TRADE_CATEGORIES: TradeCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing & Heating',
    icon: 'Wrench',
    description: 'Hot/cold water systems, heating, drainage, gas',
    hourlyRateTrade: 44,
    hourlyRateRetail: 52,
    jobs: [
      {
        id: 'replace_radiator',
        name: 'Replace Single Radiator',
        description: 'Drain down, remove old radiator, fit new radiator with TRV and lockshield',
        labourHours: 2,
        skillLevel: 'qualified',
        materials: [
          { name: 'K2 Radiator 600x1000', unit: 'nr', quantity: 1, unitCostTrade: 115, unitCostRetail: 145, wasteFactor: 0 },
          { name: 'TRV Valve 15mm', unit: 'nr', quantity: 1, unitCostTrade: 18, unitCostRetail: 25, wasteFactor: 0 },
          { name: 'Lockshield Valve 15mm', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'PTFE Tape', unit: 'roll', quantity: 1, unitCostTrade: 1.20, unitCostRetail: 2, wasteFactor: 0 },
          { name: 'Radiator Brackets', unit: 'set', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Pipe wrench', 'Adjustable spanner', 'Spirit level', 'Drill', 'Radiator key', 'Bucket', 'Towels'],
        instructions: [
          '1. Turn off boiler and isolate radiator circuit',
          '2. Close both valves (TRV to 0, lockshield fully clockwise)',
          '3. Place bucket and towels under valves',
          '4. Undo valve nuts and drain radiator completely',
          '5. Remove old radiator and brackets',
          '6. Mark new bracket positions using spirit level',
          '7. Drill and fix new brackets (wall plugs for masonry)',
          '8. Hang new radiator and connect valves',
          '9. Open valves, bleed radiator, check for leaks',
          '10. Fire up system and balance radiator'
        ],
        safetyNotes: [
          'Hot water scalding risk - let system cool first',
          'Heavy lifting - radiators can weigh 20-40kg',
          'Electrical isolation if near electrical points'
        ],
      },
      {
        id: 'fit_bathroom_suite',
        name: 'Fit Complete Bathroom Suite',
        description: 'Remove old suite, fit new WC, basin, and bath with taps and waste connections',
        labourHours: 16,
        skillLevel: 'qualified',
        materials: [
          { name: 'Close-coupled WC', unit: 'nr', quantity: 1, unitCostTrade: 145, unitCostRetail: 185, wasteFactor: 0 },
          { name: 'Basin & Pedestal', unit: 'nr', quantity: 1, unitCostTrade: 125, unitCostRetail: 165, wasteFactor: 0 },
          { name: 'Acrylic Bath 1700mm', unit: 'nr', quantity: 1, unitCostTrade: 110, unitCostRetail: 145, wasteFactor: 0 },
          { name: 'Bath Mixer Tap', unit: 'nr', quantity: 1, unitCostTrade: 95, unitCostRetail: 135, wasteFactor: 0 },
          { name: 'Basin Mixer Tap', unit: 'nr', quantity: 1, unitCostTrade: 65, unitCostRetail: 95, wasteFactor: 0 },
          { name: 'Bath Waste & Overflow', unit: 'nr', quantity: 1, unitCostTrade: 22, unitCostRetail: 32, wasteFactor: 0 },
          { name: 'Basin Waste', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 14, wasteFactor: 0 },
          { name: '40mm Waste Pipe', unit: 'm', quantity: 4, unitCostTrade: 4.50, unitCostRetail: 6, wasteFactor: 0.10 },
          { name: '110mm Soil Connector', unit: 'nr', quantity: 1, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'Flexible Tap Connectors 15mm', unit: 'nr', quantity: 4, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
          { name: 'Silicone Sealant', unit: 'tube', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Pipe wrench', 'Basin wrench', 'Drill', 'Hole saw', 'Spirit level', 'Silicone gun', 'Adjustable spanners', 'Pipe cutter', 'Bucket'],
        instructions: [
          '1. Isolate water supply and drain down system',
          '2. Disconnect and remove old sanitaryware',
          '3. Check and repair any damaged pipework',
          '4. Position bath on legs, level using spirit level',
          '5. Connect bath waste and overflow to drainage',
          '6. Fit bath panel with access for maintenance',
          '7. Position WC and mark fixing holes',
          '8. Connect WC pan to soil pipe with flexible connector',
          '9. Fit cistern and connect to cold supply',
          '10. Position basin/pedestal and fix to wall',
          '11. Connect taps with flexible connectors',
          '12. Connect all wastes to drainage stack',
          '13. Turn on water, test all connections for leaks',
          '14. Seal around bath, basin with silicone',
          '15. Test flush, fill times, and drainage'
        ],
        safetyNotes: [
          'Isolate electricity if removing electric shower',
          'Heavy lifting - bath can be 30kg+',
          'Sharp edges on removed items',
          'Asbestos check on old pipework insulation'
        ],
        buildingRegsNotes: [
          'Part G - Sanitation and hot water safety',
          'Unvented hot water must be installed by G3 qualified person',
          'TMVs required where vulnerable users present'
        ]
      },
      {
        id: 'fit_shower_enclosure',
        name: 'Fit Shower Enclosure',
        description: 'Fit quadrant or square shower enclosure with tray and thermostatic mixer',
        labourHours: 6,
        skillLevel: 'qualified',
        materials: [
          { name: '900x900 Quadrant Enclosure', unit: 'nr', quantity: 1, unitCostTrade: 295, unitCostRetail: 380, wasteFactor: 0 },
          { name: 'Stone Resin Tray 900x900', unit: 'nr', quantity: 1, unitCostTrade: 145, unitCostRetail: 185, wasteFactor: 0 },
          { name: 'Thermostatic Shower Mixer', unit: 'nr', quantity: 1, unitCostTrade: 185, unitCostRetail: 250, wasteFactor: 0 },
          { name: 'Shower Waste 90mm', unit: 'nr', quantity: 1, unitCostTrade: 18, unitCostRetail: 26, wasteFactor: 0 },
          { name: '40mm Waste Pipe', unit: 'm', quantity: 2, unitCostTrade: 4.50, unitCostRetail: 6, wasteFactor: 0.10 },
          { name: 'Silicone Sealant Clear', unit: 'tube', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Wall Plugs & Screws', unit: 'pack', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Drill', 'SDS drill for masonry', 'Spirit level', 'Silicone gun', 'Pipe cutter', 'Tile cutter', 'Adjustable spanners'],
        instructions: [
          '1. Check floor is level, prepare substrate',
          '2. Position tray and mark waste location',
          '3. Cut hole for waste if required',
          '4. Fit waste trap to tray',
          '5. Bed tray on sand/cement or foam legs',
          '6. Level tray using spirit level',
          '7. Connect waste to drainage (min 1:40 fall)',
          '8. Run hot and cold supplies to mixer position',
          '9. Fix shower mixer to wall at correct height',
          '10. Assemble enclosure frame to manufacturer specs',
          '11. Fix frame to wall ensuring plumb and level',
          '12. Fit glass panels and doors',
          '13. Seal all joints with silicone',
          '14. Test for leaks and adjust doors'
        ],
        safetyNotes: [
          'Glass panels are heavy - two person lift',
          'Drilling into walls - check for pipes/cables',
          'Ensure RCD protection for any electrical work'
        ]
      },
      {
        id: 'install_combi_boiler',
        name: 'Install Combi Boiler',
        description: 'Remove old boiler, install new combi with flue, controls, and commission',
        labourHours: 10,
        skillLevel: 'master',
        materials: [
          { name: '30kW Combi Boiler', unit: 'nr', quantity: 1, unitCostTrade: 1850, unitCostRetail: 2400, wasteFactor: 0 },
          { name: 'Horizontal Flue Kit', unit: 'nr', quantity: 1, unitCostTrade: 85, unitCostRetail: 120, wasteFactor: 0 },
          { name: '22mm Copper Pipe', unit: 'm', quantity: 8, unitCostTrade: 5.20, unitCostRetail: 6.80, wasteFactor: 0.10 },
          { name: '15mm Copper Pipe', unit: 'm', quantity: 4, unitCostTrade: 3.20, unitCostRetail: 4.50, wasteFactor: 0.10 },
          { name: '22mm Fittings Pack', unit: 'set', quantity: 1, unitCostTrade: 35, unitCostRetail: 48, wasteFactor: 0 },
          { name: 'Magnetic Filter', unit: 'nr', quantity: 1, unitCostTrade: 95, unitCostRetail: 135, wasteFactor: 0 },
          { name: 'Expansion Vessel', unit: 'nr', quantity: 1, unitCostTrade: 45, unitCostRetail: 62, wasteFactor: 0 },
          { name: 'System Inhibitor', unit: 'litre', quantity: 1, unitCostTrade: 18, unitCostRetail: 28, wasteFactor: 0 },
          { name: 'Programmer/Thermostat', unit: 'nr', quantity: 1, unitCostTrade: 65, unitCostRetail: 95, wasteFactor: 0 },
        ],
        tools: ['Pipe cutter', 'Pipe bender', 'Blow torch', 'Core drill', 'Flue analyser', 'Pressure gauge', 'Spanners', 'Spirit level'],
        instructions: [
          '1. Isolate gas, water, and electricity to existing boiler',
          '2. Drain heating system completely',
          '3. Disconnect and remove old boiler',
          '4. Core drill flue hole to external (check regulations)',
          '5. Fit new boiler bracket and hang boiler',
          '6. Install flue through wall with correct terminal',
          '7. Connect gas supply (must be Gas Safe registered)',
          '8. Connect flow and return pipework',
          '9. Connect cold mains and hot outlet',
          '10. Install magnetic filter on return',
          '11. Fit condensate drain to suitable outlet',
          '12. Connect electrical supply and controls',
          '13. Fill and pressurise system (1-1.5 bar)',
          '14. Bleed all radiators',
          '15. Commission boiler per manufacturer instructions',
          '16. Perform gas safety checks and issue certificate',
          '17. Complete benchmark documentation'
        ],
        safetyNotes: [
          'Must be Gas Safe registered for gas work',
          'Part P for electrical connections',
          'Flue position regulations - check clearances',
          'Asbestos survey for old boiler/flue materials'
        ],
        buildingRegsNotes: [
          'Part J - Combustion appliances',
          'Part L - Conservation of fuel and power',
          'Must notify Building Control or use competent person scheme',
          'Boiler must be minimum 92% ErP rated'
        ]
      },
      {
        id: 'fix_leaking_tap',
        name: 'Fix Leaking Tap',
        description: 'Replace tap washer or ceramic cartridge',
        labourHours: 0.5,
        skillLevel: 'apprentice',
        materials: [
          { name: 'Tap Washer Assorted Pack', unit: 'pack', quantity: 1, unitCostTrade: 3, unitCostRetail: 5, wasteFactor: 0 },
          { name: 'O-Ring Kit', unit: 'pack', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
          { name: 'Silicone Grease', unit: 'tube', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Adjustable spanner', 'Screwdriver set', 'Pliers'],
        instructions: [
          '1. Turn off water supply at isolation valve or stopcock',
          '2. Turn tap on to release pressure',
          '3. Remove tap handle (screw under cap)',
          '4. Unscrew headgear/cartridge',
          '5. Replace washer or cartridge',
          '6. Apply silicone grease to threads',
          '7. Reassemble tap',
          '8. Turn water back on and test'
        ],
        safetyNotes: ['Scalding risk from hot tap', 'Water damage if isolation fails']
      },
      {
        id: 'unblock_drain',
        name: 'Unblock Drain',
        description: 'Clear blocked sink, bath, or toilet drain',
        labourHours: 1,
        skillLevel: 'apprentice',
        materials: [
          { name: 'Drain Cleaner', unit: 'bottle', quantity: 1, unitCostTrade: 6, unitCostRetail: 10, wasteFactor: 0 },
          { name: 'Replacement Waste Trap', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 14, wasteFactor: 0 },
        ],
        tools: ['Plunger', 'Drain rods', 'Drain snake', 'Bucket', 'Rubber gloves', 'CCTV camera (for diagnosis)'],
        instructions: [
          '1. Assess blockage type and location',
          '2. Try plunger first for simple blockages',
          '3. Remove and clean trap if accessible',
          '4. Use drain snake for deeper blockages',
          '5. For external drains, use drain rods',
          '6. Flush with hot water and cleaner',
          '7. Test drainage flow',
          '8. Check for root damage or pipe collapse if recurring'
        ],
        safetyNotes: ['Hygiene - wear gloves', 'Chemical burns from drain cleaner', 'Sewage exposure risk']
      },
      {
        id: 'install_outside_tap',
        name: 'Install Outside Tap',
        description: 'Fit external bibcock with check valve and isolation',
        labourHours: 2,
        skillLevel: 'qualified',
        materials: [
          { name: 'Outside Tap Bibcock', unit: 'nr', quantity: 1, unitCostTrade: 18, unitCostRetail: 28, wasteFactor: 0 },
          { name: 'Double Check Valve', unit: 'nr', quantity: 1, unitCostTrade: 22, unitCostRetail: 32, wasteFactor: 0 },
          { name: 'Isolation Valve 15mm', unit: 'nr', quantity: 1, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
          { name: '15mm Copper Pipe', unit: 'm', quantity: 3, unitCostTrade: 3.20, unitCostRetail: 4.50, wasteFactor: 0.10 },
          { name: '15mm Fittings', unit: 'set', quantity: 1, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'Pipe Insulation 15mm', unit: 'm', quantity: 3, unitCostTrade: 1.50, unitCostRetail: 2.50, wasteFactor: 0 },
          { name: 'Wall Plate Elbow', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Pipe cutter', 'Blow torch', 'Core drill', 'Spirit level', 'Spanners'],
        instructions: [
          '1. Identify suitable cold water supply point',
          '2. Turn off water and drain down',
          '3. Tee off cold supply with isolation valve',
          '4. Install double check valve (Water Regs requirement)',
          '5. Run pipe to external wall location',
          '6. Core drill through wall for pipe',
          '7. Fit wall plate elbow and bibcock',
          '8. Insulate all pipework',
          '9. Turn on water and test for leaks',
          '10. Ensure isolation valve accessible for winter drain-down'
        ],
        safetyNotes: ['Water regulations compliance required', 'Check for cables before drilling'],
        buildingRegsNotes: ['Water Regulations require double check valve for backflow prevention']
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    description: 'Power, lighting, consumer units, testing',
    hourlyRateTrade: 40,
    hourlyRateRetail: 48,
    jobs: [
      {
        id: 'add_socket_outlet',
        name: 'Add Single Socket Outlet',
        description: 'Install new double socket spurred from existing ring main',
        labourHours: 2,
        skillLevel: 'qualified',
        materials: [
          { name: 'Double Socket + Backbox', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: '2.5mm T&E Cable', unit: 'm', quantity: 8, unitCostTrade: 1.95, unitCostRetail: 2.80, wasteFactor: 0.15 },
          { name: 'Fused Connection Unit', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Cable Clips', unit: 'pack', quantity: 1, unitCostTrade: 3, unitCostRetail: 5, wasteFactor: 0 },
        ],
        tools: ['Multimeter', 'Voltage tester', 'SDS drill', 'Cable detector', 'Wire strippers', 'Screwdrivers'],
        instructions: [
          '1. Isolate circuit at consumer unit',
          '2. Verify dead using voltage tester',
          '3. Locate existing socket on ring main',
          '4. Mark position for new socket',
          '5. Cut out backbox hole in wall',
          '6. Chase wall or run cable in trunking',
          '7. Run 2.5mm T&E to new location',
          '8. Connect spur at existing socket or use FCU',
          '9. Connect and fit new socket',
          '10. Test circuit - IR, continuity, polarity',
          '11. Update electrical certificate'
        ],
        safetyNotes: [
          'Isolate and prove dead before work',
          'Part P notifiable in certain areas (bathroom, kitchen, outdoors)',
          'Maximum one spur per socket on ring'
        ],
        buildingRegsNotes: [
          'Part P - Electrical safety',
          'Notifiable work in special locations requires Building Control notification or competent person',
          'Must be tested and certified to BS 7671'
        ]
      },
      {
        id: 'install_downlights',
        name: 'Install LED Downlights (set of 6)',
        description: 'Fit recessed LED downlights with transformer/driver',
        labourHours: 4,
        skillLevel: 'qualified',
        materials: [
          { name: 'LED Downlight Fire Rated', unit: 'nr', quantity: 6, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: '1.5mm T&E Cable', unit: 'm', quantity: 15, unitCostTrade: 1.50, unitCostRetail: 2.20, wasteFactor: 0.15 },
          { name: 'Junction Box', unit: 'nr', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
          { name: 'Dimmer Switch (if required)', unit: 'nr', quantity: 1, unitCostTrade: 18, unitCostRetail: 25, wasteFactor: 0 },
          { name: 'Connector Blocks', unit: 'strip', quantity: 2, unitCostTrade: 2, unitCostRetail: 3, wasteFactor: 0 },
        ],
        tools: ['Hole saw (65mm or 75mm)', 'Drill', 'Cable detector', 'Multimeter', 'Fish tape', 'Steps/ladder'],
        instructions: [
          '1. Plan layout - minimum 500mm from walls, even spacing',
          '2. Check above ceiling for joists, pipes, cables',
          '3. Isolate lighting circuit',
          '4. Mark hole positions on ceiling',
          '5. Cut holes using appropriate hole saw',
          '6. Run cable from switch to first light',
          '7. Loop cable between lights',
          '8. Connect cables at each downlight',
          '9. Push downlights into holes (spring clips)',
          '10. Connect and test switch',
          '11. Test circuit and certify'
        ],
        safetyNotes: [
          'Fire rated downlights required in ceilings below habitable rooms',
          'Keep insulation clear of transformers',
          'Working at height - use appropriate access'
        ]
      },
      {
        id: 'consumer_unit_upgrade',
        name: 'Consumer Unit Upgrade',
        description: 'Replace old fusebox with 18-way dual RCD consumer unit',
        labourHours: 8,
        skillLevel: 'master',
        materials: [
          { name: '18-Way Dual RCD Consumer Unit', unit: 'nr', quantity: 1, unitCostTrade: 220, unitCostRetail: 280, wasteFactor: 0 },
          { name: 'MCBs Assorted', unit: 'pack', quantity: 1, unitCostTrade: 85, unitCostRetail: 120, wasteFactor: 0 },
          { name: '16mm Meter Tails', unit: 'm', quantity: 2, unitCostTrade: 6.50, unitCostRetail: 9, wasteFactor: 0 },
          { name: 'Earth Block', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Circuit Labels', unit: 'set', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Multimeter', 'IR tester', 'RCD tester', 'Loop impedance tester', 'Screwdrivers', 'Cable strippers'],
        instructions: [
          '1. Request DNO isolation of supply (or use live working methods)',
          '2. Remove cover from existing unit',
          '3. Label all circuits',
          '4. Isolate at main switch',
          '5. Disconnect all circuits',
          '6. Remove old consumer unit',
          '7. Install new unit maintaining cable lengths',
          '8. Connect meter tails',
          '9. Connect earth and neutral bars',
          '10. Fit appropriate MCBs for each circuit',
          '11. Connect circuit cables to MCBs',
          '12. Power up and test all RCDs',
          '13. Full electrical test and certification',
          '14. Issue Electrical Installation Certificate'
        ],
        safetyNotes: [
          'Live working hazard - follow GS38',
          'Must be competent to BS 7671',
          'Fire risk from metal consumer unit - AMD3 compliant unit required',
          'Notify Building Control'
        ],
        buildingRegsNotes: [
          'Notifiable work under Part P',
          'Must issue EIC (Electrical Installation Certificate)',
          'Consumer unit must be non-combustible (metal enclosure) per AMD3'
        ]
      },
      {
        id: 'rewire_room',
        name: 'Rewire Single Room',
        description: 'Complete rewire of one room including sockets, lights, and switches',
        labourHours: 12,
        skillLevel: 'master',
        materials: [
          { name: '2.5mm T&E Cable', unit: 'm', quantity: 30, unitCostTrade: 1.95, unitCostRetail: 2.80, wasteFactor: 0.15 },
          { name: '1.5mm T&E Cable', unit: 'm', quantity: 20, unitCostTrade: 1.50, unitCostRetail: 2.20, wasteFactor: 0.15 },
          { name: 'Double Sockets', unit: 'nr', quantity: 4, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Light Switches', unit: 'nr', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Ceiling Rose', unit: 'nr', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Metal Backboxes', unit: 'nr', quantity: 6, unitCostTrade: 2.50, unitCostRetail: 4, wasteFactor: 0 },
        ],
        tools: ['SDS drill', 'Chasing tool', 'Multimeter', 'IR tester', 'Cable detector', 'Steps'],
        instructions: [
          '1. Plan socket and light positions',
          '2. Isolate existing circuits',
          '3. Remove old wiring and accessories',
          '4. Chase walls for new cables',
          '5. Fit backboxes',
          '6. Run new cables from consumer unit',
          '7. First fix all cables',
          '8. Plaster/make good chases',
          '9. Second fix accessories',
          '10. Connect at consumer unit',
          '11. Full test and inspection',
          '12. Issue EIC or MEIWC'
        ],
        safetyNotes: ['Asbestos check for old cabling', 'Dust from chasing - RPE required'],
        buildingRegsNotes: ['Part P notifiable work', 'Must achieve required test results per BS 7671']
      },
      {
        id: 'install_smoke_detectors',
        name: 'Install Mains Smoke Detectors',
        description: 'Fit interlinked mains smoke detectors to meet Building Regs',
        labourHours: 3,
        skillLevel: 'qualified',
        materials: [
          { name: 'Mains Smoke Detector', unit: 'nr', quantity: 3, unitCostTrade: 28, unitCostRetail: 38, wasteFactor: 0 },
          { name: '1.5mm 3-Core Cable', unit: 'm', quantity: 20, unitCostTrade: 1.80, unitCostRetail: 2.60, wasteFactor: 0.15 },
          { name: 'Junction Box', unit: 'nr', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Drill', 'Hole saw', 'Cable detector', 'Multimeter', 'Ladder'],
        instructions: [
          '1. Plan locations - hall, landing, each floor (min)',
          '2. Isolate lighting circuit',
          '3. Run 3-core cable between detector positions',
          '4. Connect permanent live, switched neutral, interlink',
          '5. Fix detector bases',
          '6. Connect wiring',
          '7. Fit detector heads',
          '8. Test interlink function',
          '9. Test each detector with test button'
        ],
        safetyNotes: ['Working at height', 'Test regularly after install'],
        buildingRegsNotes: [
          'Part B - Fire safety',
          'Required for new builds and material alterations',
          'One per floor minimum, interlinked'
        ]
      }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Joinery',
    icon: 'Hammer',
    description: 'First fix, second fix, fitted furniture, structural timber',
    hourlyRateTrade: 30,
    hourlyRateRetail: 36,
    jobs: [
      {
        id: 'fit_internal_door',
        name: 'Fit Internal Door',
        description: 'Hang new internal door including lining, stops, and ironmongery',
        labourHours: 2.5,
        skillLevel: 'qualified',
        materials: [
          { name: 'Oak Veneer Door', unit: 'nr', quantity: 1, unitCostTrade: 95, unitCostRetail: 145, wasteFactor: 0 },
          { name: 'Door Lining Set', unit: 'nr', quantity: 1, unitCostTrade: 45, unitCostRetail: 62, wasteFactor: 0 },
          { name: 'Door Hinges 100mm', unit: 'pair', quantity: 1.5, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Door Handle Set', unit: 'nr', quantity: 1, unitCostTrade: 22, unitCostRetail: 32, wasteFactor: 0 },
          { name: 'Door Stop', unit: 'm', quantity: 5, unitCostTrade: 1.20, unitCostRetail: 1.80, wasteFactor: 0.10 },
          { name: 'Architrave', unit: 'm', quantity: 10, unitCostTrade: 1.80, unitCostRetail: 2.40, wasteFactor: 0.10 },
          { name: 'Wood Screws', unit: 'pack', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Circular saw', 'Jigsaw', 'Router', 'Drill', 'Chisels', 'Spirit level', 'Tape measure', 'Mitre saw'],
        instructions: [
          '1. Measure opening and check for square',
          '2. Assemble door lining if required',
          '3. Fix lining to studwork/masonry (check plumb)',
          '4. Cut door to fit (3mm clearance sides, 8mm bottom)',
          '5. Mark hinge positions (225mm from top/bottom)',
          '6. Chisel hinge recesses in door and lining',
          '7. Screw hinges in place',
          '8. Hang door and check swing',
          '9. Mark and fit latch/lock',
          '10. Fit door handles',
          '11. Fix door stops',
          '12. Cut and fix architrave with mitred corners'
        ],
        safetyNotes: ['Sharp tools - cut away from body', 'Dust from cutting - wear mask'],
        buildingRegsNotes: ['Fire doors required in certain locations (FD30 minimum)']
      },
      {
        id: 'fit_skirting',
        name: 'Fit Skirting Board (per room)',
        description: 'Remove old and fit new skirting with scribed internal corners',
        labourHours: 3,
        skillLevel: 'qualified',
        materials: [
          { name: 'MDF Skirting 120mm', unit: 'm', quantity: 20, unitCostTrade: 2.80, unitCostRetail: 3.80, wasteFactor: 0.10 },
          { name: 'Grip Fill Adhesive', unit: 'tube', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Panel Pins', unit: 'pack', quantity: 1, unitCostTrade: 3, unitCostRetail: 5, wasteFactor: 0 },
          { name: 'Wood Filler', unit: 'tub', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Mitre saw', 'Coping saw', 'Nail gun or hammer', 'Adhesive gun', 'Tape measure', 'Pencil'],
        instructions: [
          '1. Remove existing skirting carefully',
          '2. Measure each wall length',
          '3. Cut external corners at 45° mitre',
          '4. Scribe internal corners (one square, one profiled)',
          '5. Apply adhesive to back of skirting',
          '6. Fix to wall with pins or brads',
          '7. Fill nail holes and gaps with filler',
          '8. Caulk top edge if required',
          '9. Sand filler when dry',
          '10. Ready for decoration'
        ],
        safetyNotes: ['Dust from cutting - use extraction', 'Knee pads for floor work']
      },
      {
        id: 'build_stud_wall',
        name: 'Build Stud Partition Wall',
        description: 'Construct timber stud wall with plasterboard both sides',
        labourHours: 8,
        skillLevel: 'qualified',
        materials: [
          { name: 'C16 Timber 50x100mm', unit: 'm', quantity: 25, unitCostTrade: 2.80, unitCostRetail: 3.60, wasteFactor: 0.10 },
          { name: '12.5mm Plasterboard', unit: 'm²', quantity: 20, unitCostTrade: 4.80, unitCostRetail: 6.50, wasteFactor: 0.10 },
          { name: '100mm Mineral Wool', unit: 'm²', quantity: 10, unitCostTrade: 6.50, unitCostRetail: 8.50, wasteFactor: 0.05 },
          { name: 'Drywall Screws', unit: 'box', quantity: 1, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'Jointing Tape', unit: 'roll', quantity: 1, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
          { name: 'Jointing Compound', unit: 'bucket', quantity: 1, unitCostTrade: 14, unitCostRetail: 20, wasteFactor: 0 },
        ],
        tools: ['Circular saw', 'Nail gun', 'Drill driver', 'Hammer', 'Spirit level', 'Chalk line', 'Plasterboard lifter'],
        instructions: [
          '1. Mark wall position on floor and ceiling',
          '2. Fix sole plate to floor (400mm centres)',
          '3. Fix head plate to ceiling (locate joists)',
          '4. Mark stud positions at 400mm or 600mm centres',
          '5. Cut studs to length (floor to ceiling minus plates)',
          '6. Fix studs plumb to plates',
          '7. Add noggins at mid-height',
          '8. Frame any door openings with header',
          '9. Run any services through wall',
          '10. Fit insulation between studs',
          '11. Board first side with plasterboard',
          '12. Board second side (offset joints)',
          '13. Tape and joint all seams',
          '14. Ready for skim coat or painting'
        ],
        safetyNotes: ['Dust from cutting boards', 'Heavy boards - two person lift', 'Eye protection when fixing overhead'],
        buildingRegsNotes: [
          'Sound insulation requirements for separating walls',
          'Fire resistance may be required (30 or 60 min)',
          'Check structural implications of load paths'
        ]
      },
      {
        id: 'fit_kitchen',
        name: 'Fit Kitchen Units',
        description: 'Install base units, wall units, worktop, and integrated appliances',
        labourHours: 16,
        skillLevel: 'qualified',
        materials: [
          { name: 'Base Units (linear)', unit: 'm', quantity: 4, unitCostTrade: 180, unitCostRetail: 250, wasteFactor: 0 },
          { name: 'Wall Units (linear)', unit: 'm', quantity: 3, unitCostTrade: 140, unitCostRetail: 195, wasteFactor: 0 },
          { name: 'Laminate Worktop', unit: 'm', quantity: 4, unitCostTrade: 45, unitCostRetail: 65, wasteFactor: 0.10 },
          { name: 'Unit Fixings Pack', unit: 'pack', quantity: 1, unitCostTrade: 25, unitCostRetail: 38, wasteFactor: 0 },
          { name: 'Worktop Joining Kit', unit: 'nr', quantity: 1, unitCostTrade: 15, unitCostRetail: 22, wasteFactor: 0 },
          { name: 'Worktop Edging Strip', unit: 'm', quantity: 3, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Silicone Sealant', unit: 'tube', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Circular saw', 'Jigsaw', 'Router (worktop joints)', 'Drill', 'Spirit level', 'Clamps', 'Tape measure'],
        instructions: [
          '1. Check walls are plumb and floors level',
          '2. Mark out unit positions from design',
          '3. Start with corner base units',
          '4. Level units using adjustable legs',
          '5. Fix units together through sides',
          '6. Fix to wall if required',
          '7. Install integrated appliances',
          '8. Template worktop cuts',
          '9. Cut sink and hob holes with jigsaw',
          '10. Join worktop sections with joining kit',
          '11. Fit worktop to units',
          '12. Seal worktop to wall with upstand or sealant',
          '13. Fit wall units at correct height (400mm above worktop)',
          '14. Fit doors and drawer fronts',
          '15. Adjust hinges and soft close',
          '16. Fit plinths and cornice'
        ],
        safetyNotes: ['Heavy units - two person lift', 'Sharp edges on laminate', 'Dust from cutting'],
        buildingRegsNotes: ['Electrical connections to be done by qualified electrician', 'Gas connections by Gas Safe']
      },
      {
        id: 'loft_boarding',
        name: 'Loft Boarding for Storage',
        description: 'Board loft area on raised legs over insulation',
        labourHours: 6,
        skillLevel: 'apprentice',
        materials: [
          { name: 'Loft Legs 175mm', unit: 'pack', quantity: 50, unitCostTrade: 0.85, unitCostRetail: 1.20, wasteFactor: 0 },
          { name: 'Loft Boards 18mm', unit: 'm²', quantity: 15, unitCostTrade: 12, unitCostRetail: 16, wasteFactor: 0.10 },
          { name: 'Screws', unit: 'pack', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Drill driver', 'Circular saw', 'Tape measure', 'Knee pads', 'Work light'],
        instructions: [
          '1. Clear loft area and check for services',
          '2. Mark out boarding area',
          '3. Screw loft legs to joists (one per 400mm)',
          '4. Check all legs level',
          '5. Lay first row of boards on legs',
          '6. Screw boards to legs',
          '7. Continue with subsequent rows',
          '8. Cut boards to fit around obstacles',
          '9. Ensure insulation not compressed',
          '10. Check boarding is stable'
        ],
        safetyNotes: [
          'Limited headroom - watch head',
          'Step only on joists until boards laid',
          'Good lighting essential',
          'Dust mask for insulation fibres'
        ],
        buildingRegsNotes: ['Must maintain 270mm minimum insulation depth', 'Ventilation must not be blocked']
      }
    ]
  },
  {
    id: 'plastering',
    name: 'Plastering',
    icon: 'PaintBucket',
    description: 'Rendering, skimming, dry lining, coving',
    hourlyRateTrade: 26,
    hourlyRateRetail: 32,
    jobs: [
      {
        id: 'skim_room',
        name: 'Skim Coat Room (3x4m)',
        description: 'Apply 2-3mm skim coat to plasterboard walls and ceiling',
        labourHours: 6,
        skillLevel: 'qualified',
        materials: [
          { name: 'Multi-Finish Plaster', unit: 'bag', quantity: 8, unitCostTrade: 8.50, unitCostRetail: 11, wasteFactor: 0.15 },
          { name: 'PVA', unit: 'litre', quantity: 2, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
          { name: 'Scrim Tape', unit: 'roll', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Angle Bead', unit: 'm', quantity: 12, unitCostTrade: 0.85, unitCostRetail: 1.20, wasteFactor: 0 },
        ],
        tools: ['Bucket trowel', 'Finishing trowel', 'Hawk', 'Mixing drill', 'Plastering buckets', 'Steps', 'Feather edge'],
        instructions: [
          '1. Prepare surfaces - tape joints, fix beads',
          '2. Apply PVA to walls (if not taped boards)',
          '3. Mix plaster to creamy consistency',
          '4. Apply first coat with firm pressure',
          '5. Flatten with trowel or feather edge',
          '6. Allow to firm up (not dry)',
          '7. Apply second coat, thinner layer',
          '8. Trowel up as plaster firms',
          '9. Final polish with wet trowel',
          '10. Allow 2-3 days drying before painting'
        ],
        safetyNotes: ['Plaster irritates skin - wear gloves', 'Knee pads for low areas', 'Ventilation for drying']
      },
      {
        id: 'plasterboard_ceiling',
        name: 'Plasterboard & Skim Ceiling',
        description: 'Board and skim ceiling with taped joints',
        labourHours: 8,
        skillLevel: 'qualified',
        materials: [
          { name: '12.5mm Plasterboard', unit: 'm²', quantity: 14, unitCostTrade: 4.80, unitCostRetail: 6.50, wasteFactor: 0.10 },
          { name: 'Drywall Screws', unit: 'box', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Multi-Finish Plaster', unit: 'bag', quantity: 4, unitCostTrade: 8.50, unitCostRetail: 11, wasteFactor: 0.15 },
          { name: 'Scrim Tape', unit: 'roll', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Board lifter or prop', 'Drill driver', 'Trowels', 'Mixing drill', 'Steps or platform'],
        instructions: [
          '1. Locate joists and mark positions',
          '2. Cut boards to size (stagger joints)',
          '3. Lift board with prop or helper',
          '4. Fix with screws at 150mm centres',
          '5. Repeat for all boards',
          '6. Tape all joints with scrim',
          '7. Apply skim coat as per room skim',
          '8. Polish to smooth finish'
        ],
        safetyNotes: ['Heavy boards overhead - board lifter essential', 'Eye protection from dust and falling debris']
      },
      {
        id: 'render_wall',
        name: 'Render External Wall',
        description: 'Apply sand/cement render to blockwork or brick',
        labourHours: 12,
        skillLevel: 'master',
        materials: [
          { name: 'Rendering Sand', unit: 'tonne', quantity: 0.5, unitCostTrade: 38, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Cement', unit: 'bag', quantity: 12, unitCostTrade: 5.20, unitCostRetail: 6.80, wasteFactor: 0.05 },
          { name: 'Plasticiser', unit: 'litre', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Render Stop Bead', unit: 'm', quantity: 15, unitCostTrade: 1.50, unitCostRetail: 2.20, wasteFactor: 0 },
          { name: 'Angle Bead', unit: 'm', quantity: 8, unitCostTrade: 1.20, unitCostRetail: 1.80, wasteFactor: 0 },
          { name: 'Primer/SBR', unit: 'litre', quantity: 5, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
        ],
        tools: ['Cement mixer', 'Rendering trowels', 'Darby/feather edge', 'Sponge float', 'Hawk', 'Scaffolding'],
        instructions: [
          '1. Prepare wall surface - clean, dampen',
          '2. Apply SBR bonding agent',
          '3. Fix render beads at corners and edges',
          '4. Mix render (4:1 sand:cement with plasticiser)',
          '5. Apply scratch coat 10-12mm',
          '6. Key surface with scratching tool',
          '7. Allow to cure (24-48 hours)',
          '8. Apply top coat 6-8mm',
          '9. Rule off with straight edge',
          '10. Finish with float (wood/sponge/plastic)',
          '11. Protect from rain until cured'
        ],
        safetyNotes: ['Cement burns - wear gloves', 'Working at height - scaffolding required', 'Weather dependent'],
        buildingRegsNotes: ['Must achieve weather resistance', 'Consider thermal bridging with EWI systems']
      },
      {
        id: 'fit_coving',
        name: 'Fit Coving (per room)',
        description: 'Install decorative plaster coving to ceiling/wall junction',
        labourHours: 3,
        skillLevel: 'qualified',
        materials: [
          { name: 'Plaster Coving 100mm', unit: 'm', quantity: 16, unitCostTrade: 4.50, unitCostRetail: 6.50, wasteFactor: 0.10 },
          { name: 'Coving Adhesive', unit: 'tub', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Filler', unit: 'tub', quantity: 1, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
        ],
        tools: ['Mitre box', 'Fine tooth saw', 'Filling knife', 'Sponge', 'Steps', 'Tape measure'],
        instructions: [
          '1. Mark coving line on wall and ceiling',
          '2. Score surfaces for adhesion',
          '3. Cut first internal corner with mitre',
          '4. Apply adhesive to back of coving',
          '5. Press firmly in position',
          '6. Support with pins if required',
          '7. Continue around room',
          '8. Mitre external corners',
          '9. Fill gaps at joints',
          '10. Clean off excess adhesive with sponge',
          '11. Sand smooth when dry'
        ],
        safetyNotes: ['Working at height', 'Dust from cutting plaster']
      }
    ]
  },
  {
    id: 'decorating',
    name: 'Painting & Decorating',
    icon: 'Palette',
    description: 'Interior/exterior painting, wallpapering, preparation',
    hourlyRateTrade: 23,
    hourlyRateRetail: 28,
    jobs: [
      {
        id: 'paint_room',
        name: 'Paint Room Complete',
        description: 'Prepare and paint walls, ceiling, and woodwork in one room',
        labourHours: 10,
        skillLevel: 'qualified',
        materials: [
          { name: 'Emulsion Paint', unit: 'litre', quantity: 10, unitCostTrade: 32, unitCostRetail: 45, wasteFactor: 0.10 },
          { name: 'Undercoat', unit: 'litre', quantity: 2, unitCostTrade: 18, unitCostRetail: 26, wasteFactor: 0.10 },
          { name: 'Gloss/Satin Trim Paint', unit: 'litre', quantity: 2, unitCostTrade: 24, unitCostRetail: 35, wasteFactor: 0.10 },
          { name: 'Filler', unit: 'tub', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Sandpaper Assorted', unit: 'pack', quantity: 1, unitCostTrade: 6, unitCostRetail: 10, wasteFactor: 0 },
          { name: 'Masking Tape', unit: 'roll', quantity: 2, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
          { name: 'Dust Sheets', unit: 'nr', quantity: 2, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Rollers', 'Brushes', 'Paint tray', 'Extension pole', 'Filler knife', 'Sanding block', 'Steps'],
        instructions: [
          '1. Clear room and lay dust sheets',
          '2. Fill all cracks, holes, and defects',
          '3. Sand when dry',
          '4. Sand woodwork and wipe down',
          '5. Mask edges where required',
          '6. Cut in ceiling edges with brush',
          '7. Roll ceiling - first coat',
          '8. Cut in wall edges',
          '9. Roll walls - first coat',
          '10. Apply undercoat to woodwork',
          '11. Allow drying time (4+ hours)',
          '12. Light sand and second coat ceiling',
          '13. Second coat walls',
          '14. Topcoat woodwork (gloss/satin)',
          '15. Touch up and remove masking'
        ],
        safetyNotes: ['Ventilation for paint fumes', 'Eye protection for overhead work', 'Ladder safety']
      },
      {
        id: 'exterior_paint',
        name: 'Paint House Exterior',
        description: 'Prepare and paint external render, windows, and doors',
        labourHours: 32,
        skillLevel: 'master',
        materials: [
          { name: 'Masonry Paint', unit: 'litre', quantity: 25, unitCostTrade: 38, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Exterior Gloss', unit: 'litre', quantity: 5, unitCostTrade: 28, unitCostRetail: 40, wasteFactor: 0.10 },
          { name: 'Primer/Sealer', unit: 'litre', quantity: 5, unitCostTrade: 18, unitCostRetail: 26, wasteFactor: 0.10 },
          { name: 'Exterior Filler', unit: 'tub', quantity: 2, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'Fungicidal Wash', unit: 'litre', quantity: 5, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Long-reach rollers', 'Masonry brushes', 'Scaffold tower', 'Pressure washer', 'Wire brush', 'Filling knives'],
        instructions: [
          '1. Erect scaffolding or tower',
          '2. Pressure wash walls (allow 48hr+ drying)',
          '3. Treat algae/moss with fungicidal wash',
          '4. Wire brush flaking paint',
          '5. Fill cracks with exterior filler',
          '6. Sand smooth defects',
          '7. Prime bare/repaired areas',
          '8. Apply first coat masonry paint',
          '9. Allow full drying (24 hours)',
          '10. Apply second coat',
          '11. Prepare woodwork - sand, fill',
          '12. Prime bare wood',
          '13. Undercoat woodwork',
          '14. Topcoat windows, doors, fascia',
          '15. Remove scaffolding'
        ],
        safetyNotes: [
          'Working at height - scaffold safety',
          'Weather dependent - no rain, frost',
          'Eye protection for overhead work',
          'PPE for pressure washing'
        ]
      },
      {
        id: 'wallpaper_room',
        name: 'Wallpaper Room',
        description: 'Strip old paper and hang new wallpaper in one room',
        labourHours: 12,
        skillLevel: 'qualified',
        materials: [
          { name: 'Wallpaper', unit: 'roll', quantity: 8, unitCostTrade: 22, unitCostRetail: 35, wasteFactor: 0.15 },
          { name: 'Wallpaper Paste', unit: 'pack', quantity: 2, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
          { name: 'Lining Paper', unit: 'roll', quantity: 4, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0.15 },
          { name: 'Size', unit: 'litre', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Pasting table', 'Paste brush', 'Papering brush', 'Seam roller', 'Craft knife', 'Plumb line', 'Steps'],
        instructions: [
          '1. Strip old wallpaper (steam or soak)',
          '2. Wash walls and fill defects',
          '3. Apply size to walls',
          '4. Hang lining paper horizontally (if required)',
          '5. Measure wall height, add 100mm',
          '6. Cut paper to length',
          '7. Paste paper evenly (or wall for paste-the-wall)',
          '8. Book paper to soak (5-10 mins)',
          '9. Start at centre of focal wall',
          '10. Mark vertical plumb line',
          '11. Hang first drop, smooth out bubbles',
          '12. Trim top and bottom',
          '13. Butt-join subsequent drops',
          '14. Match pattern carefully',
          '15. Work around windows/doors',
          '16. Finish at least visible corner'
        ],
        safetyNotes: ['Steam stripper burn risk', 'Sharp craft knives', 'Steps/ladder safety']
      }
    ]
  },
  {
    id: 'tiling',
    name: 'Wall & Floor Tiling',
    icon: 'Grid3X3',
    description: 'Ceramic, porcelain, natural stone installation',
    hourlyRateTrade: 29,
    hourlyRateRetail: 35,
    jobs: [
      {
        id: 'tile_bathroom_walls',
        name: 'Tile Bathroom Walls',
        description: 'Full height tiling to bathroom walls (approx 12m²)',
        labourHours: 12,
        skillLevel: 'qualified',
        materials: [
          { name: 'Ceramic Wall Tiles', unit: 'm²', quantity: 14, unitCostTrade: 28, unitCostRetail: 42, wasteFactor: 0.10 },
          { name: 'Tile Adhesive', unit: 'bag', quantity: 4, unitCostTrade: 16, unitCostRetail: 22, wasteFactor: 0.10 },
          { name: 'Tile Grout', unit: 'bag', quantity: 2, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0.15 },
          { name: 'Tile Spacers', unit: 'pack', quantity: 2, unitCostTrade: 3, unitCostRetail: 5, wasteFactor: 0 },
          { name: 'Tile Trim', unit: 'm', quantity: 8, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0.10 },
          { name: 'Silicone Sealant', unit: 'tube', quantity: 2, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
          { name: 'Tanking Kit', unit: 'kit', quantity: 1, unitCostTrade: 65, unitCostRetail: 90, wasteFactor: 0 },
        ],
        tools: ['Tile cutter', 'Grout float', 'Notched trowel', 'Spirit level', 'Tile saw', 'Sponge', 'Mixing bucket'],
        instructions: [
          '1. Prepare walls - remove loose material',
          '2. Apply tanking to shower areas (BS 5385)',
          '3. Mark horizontal datum line',
          '4. Mix adhesive to consistency',
          '5. Apply with notched trowel',
          '6. Fix batten at datum for first row',
          '7. Place tiles with spacers',
          '8. Work up from batten',
          '9. Cut tiles for edges using cutter/saw',
          '10. Fit external corner trim as needed',
          '11. Remove batten, tile below datum',
          '12. Allow 24 hours curing',
          '13. Mix grout, apply with float',
          '14. Clean excess grout with sponge',
          '15. Polish with dry cloth',
          '16. Silicone internal corners and sanitaryware'
        ],
        safetyNotes: ['Dust from cutting - wear mask', 'Sharp tile edges', 'Eye protection for cutting'],
        buildingRegsNotes: ['Tanking required in shower areas', 'Adhesive must suit substrate']
      },
      {
        id: 'tile_floor',
        name: 'Tile Floor (10m²)',
        description: 'Tile floor with porcelain tiles including prep',
        labourHours: 8,
        skillLevel: 'qualified',
        materials: [
          { name: 'Porcelain Floor Tiles', unit: 'm²', quantity: 12, unitCostTrade: 35, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Flexible Floor Adhesive', unit: 'bag', quantity: 3, unitCostTrade: 18, unitCostRetail: 25, wasteFactor: 0.10 },
          { name: 'Floor Grout', unit: 'bag', quantity: 2, unitCostTrade: 10, unitCostRetail: 15, wasteFactor: 0.15 },
          { name: 'Levelling Compound', unit: 'bag', quantity: 2, unitCostTrade: 22, unitCostRetail: 32, wasteFactor: 0.10 },
          { name: 'Tile Spacers 3mm', unit: 'pack', quantity: 1, unitCostTrade: 3, unitCostRetail: 5, wasteFactor: 0 },
          { name: 'Grout Sealer', unit: 'bottle', quantity: 1, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
        ],
        tools: ['Wet tile saw', 'Large notched trowel', 'Rubber mallet', 'Grout float', 'Mixing drill', 'Knee pads'],
        instructions: [
          '1. Clean and prepare subfloor',
          '2. Check for level, apply SLC if needed',
          '3. Allow levelling compound to cure',
          '4. Plan tile layout from centre or focal point',
          '5. Dry lay tiles to check pattern',
          '6. Mix adhesive, apply with large notched trowel',
          '7. Back-butter large tiles for solid bed',
          '8. Place tiles firmly, use rubber mallet',
          '9. Check level constantly',
          '10. Use levelling clips for large format tiles',
          '11. Cut edge tiles with wet saw',
          '12. Allow 24-48 hours curing',
          '13. Grout joints with suitable grout',
          '14. Clean with sponge, buff dry',
          '15. Apply grout sealer after 7 days'
        ],
        safetyNotes: ['Knee pads essential', 'Wet saw - eye protection', 'Heavy tiles - safe lifting'],
        buildingRegsNotes: ['Slip resistance ratings for bathrooms/wetrooms (R10 minimum)']
      }
    ]
  },
  {
    id: 'roofing',
    name: 'Roofing',
    icon: 'Home',
    description: 'Pitched roofs, flat roofs, guttering, fascias',
    hourlyRateTrade: 29,
    hourlyRateRetail: 35,
    jobs: [
      {
        id: 'replace_tiles',
        name: 'Replace Roof Tiles (10m²)',
        description: 'Strip and re-tile section of pitched roof',
        labourHours: 12,
        skillLevel: 'qualified',
        materials: [
          { name: 'Concrete Interlocking Tiles', unit: 'm²', quantity: 12, unitCostTrade: 22, unitCostRetail: 28, wasteFactor: 0.05 },
          { name: 'Breathable Membrane', unit: 'm²', quantity: 12, unitCostTrade: 3.20, unitCostRetail: 4.50, wasteFactor: 0.10 },
          { name: 'Roofing Battens', unit: 'm', quantity: 50, unitCostTrade: 0.85, unitCostRetail: 1.10, wasteFactor: 0.10 },
          { name: 'Tile Clips', unit: 'pack', quantity: 2, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0 },
          { name: 'Ridge Tiles', unit: 'nr', quantity: 5, unitCostTrade: 4.50, unitCostRetail: 6, wasteFactor: 0 },
          { name: 'Ridge Mortar/Dry Fix', unit: 'kit', quantity: 1, unitCostTrade: 65, unitCostRetail: 85, wasteFactor: 0 },
        ],
        tools: ['Roof ladder', 'Tile cutter', 'Slate ripper', 'Hammer', 'Measuring tape', 'Chalk line'],
        instructions: [
          '1. Erect scaffolding and roof ladder',
          '2. Strip existing tiles from section',
          '3. Remove old battens and felt',
          '4. Inspect rafters, repair if needed',
          '5. Roll out breathable membrane',
          '6. Nail battens at correct gauge',
          '7. Start tiling from eaves',
          '8. Work up to ridge',
          '9. Cut tiles for valleys/edges',
          '10. Fix ridge tiles with dry fix system',
          '11. Check for weathertightness',
          '12. Clear debris and clean gutters'
        ],
        safetyNotes: ['Working at height - full scaffolding required', 'Edge protection', 'Harness for steeper pitches'],
        buildingRegsNotes: ['Part C - resistance to weather', 'Ventilation requirements at eaves and ridge']
      },
      {
        id: 'flat_roof_repair',
        name: 'Flat Roof Replacement (15m²)',
        description: 'Strip and re-cover flat roof with EPDM',
        labourHours: 10,
        skillLevel: 'qualified',
        materials: [
          { name: 'EPDM Membrane', unit: 'm²', quantity: 18, unitCostTrade: 35, unitCostRetail: 45, wasteFactor: 0.10 },
          { name: 'Adhesive', unit: 'litre', quantity: 10, unitCostTrade: 28, unitCostRetail: 38, wasteFactor: 0.10 },
          { name: 'Edge Trim', unit: 'm', quantity: 18, unitCostTrade: 8, unitCostRetail: 12, wasteFactor: 0.10 },
          { name: 'OSB3 Board', unit: 'm²', quantity: 16, unitCostTrade: 14.50, unitCostRetail: 18.50, wasteFactor: 0.10 },
          { name: 'Insulation 100mm PIR', unit: 'm²', quantity: 16, unitCostTrade: 21, unitCostRetail: 26, wasteFactor: 0.05 },
        ],
        tools: ['Roofing felt knife', 'Roller', 'Hot air gun', 'Chalk line', 'Screwdriver'],
        instructions: [
          '1. Strip existing covering',
          '2. Inspect deck, replace damaged boards',
          '3. Ensure falls for drainage (1:80 minimum)',
          '4. Lay insulation if upgrading',
          '5. Dry lay EPDM to check fit',
          '6. Apply adhesive to deck and membrane',
          '7. Roll membrane into position',
          '8. Work out air bubbles with roller',
          '9. Fold and bond upstands',
          '10. Fit edge trim all round',
          '11. Seal at all penetrations',
          '12. Test drainage'
        ],
        safetyNotes: ['Edge protection required', 'Adhesive fumes - ventilation', 'No work in wet conditions']
      },
      {
        id: 'install_guttering',
        name: 'Replace Gutters & Downpipes',
        description: 'Remove old and install new uPVC rainwater goods',
        labourHours: 8,
        skillLevel: 'qualified',
        materials: [
          { name: 'uPVC Gutter', unit: 'm', quantity: 20, unitCostTrade: 8.50, unitCostRetail: 11, wasteFactor: 0.10 },
          { name: 'uPVC Downpipe', unit: 'm', quantity: 8, unitCostTrade: 6.80, unitCostRetail: 8.50, wasteFactor: 0.10 },
          { name: 'Gutter Brackets', unit: 'nr', quantity: 25, unitCostTrade: 1.50, unitCostRetail: 2.20, wasteFactor: 0 },
          { name: 'Downpipe Clips', unit: 'nr', quantity: 12, unitCostTrade: 1.20, unitCostRetail: 1.80, wasteFactor: 0 },
          { name: 'Outlets & Corners', unit: 'nr', quantity: 6, unitCostTrade: 4, unitCostRetail: 6, wasteFactor: 0 },
          { name: 'Gutter Sealant', unit: 'tube', quantity: 1, unitCostTrade: 6, unitCostRetail: 9, wasteFactor: 0 },
        ],
        tools: ['Ladder', 'Hacksaw', 'Drill', 'Spirit level', 'String line', 'Gutter notcher'],
        instructions: [
          '1. Safely access at height (scaffold/towers)',
          '2. Remove old guttering and brackets',
          '3. Mark fall line (1:350 minimum)',
          '4. Fix brackets at 1m centres max',
          '5. Cut gutter to length',
          '6. Fit outlets at low points',
          '7. Clip gutter sections together',
          '8. Install corners where needed',
          '9. Connect downpipes to outlets',
          '10. Fix downpipe clips at 1.8m max',
          '11. Connect to drainage/soakaway',
          '12. Test with water'
        ],
        safetyNotes: ['Ladder safety - three point contact', 'Scaffold for extended work']
      }
    ]
  },
  {
    id: 'bricklaying',
    name: 'Bricklaying',
    icon: 'Square',
    description: 'Brick and block work, pointing, repairs',
    hourlyRateTrade: 32,
    hourlyRateRetail: 38,
    jobs: [
      {
        id: 'build_garden_wall',
        name: 'Build Garden Wall (10m length x 1m high)',
        description: 'Build brick garden wall with foundations',
        labourHours: 20,
        skillLevel: 'qualified',
        materials: [
          { name: 'Facing Bricks (60/m²)', unit: 'nr', quantity: 720, unitCostTrade: 0.95, unitCostRetail: 1.20, wasteFactor: 0.05 },
          { name: 'Engineering Bricks', unit: 'nr', quantity: 120, unitCostTrade: 0.65, unitCostRetail: 0.85, wasteFactor: 0.05 },
          { name: 'Building Sand', unit: 'tonne', quantity: 1.5, unitCostTrade: 38, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Cement', unit: 'bag', quantity: 15, unitCostTrade: 5.20, unitCostRetail: 6.80, wasteFactor: 0.05 },
          { name: 'Concrete C25', unit: 'm³', quantity: 1.5, unitCostTrade: 105, unitCostRetail: 125, wasteFactor: 0.05 },
          { name: 'Wall Ties', unit: 'pack', quantity: 1, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'DPC', unit: 'm', quantity: 11, unitCostTrade: 2.50, unitCostRetail: 3.50, wasteFactor: 0.10 },
          { name: 'Pier Caps', unit: 'nr', quantity: 4, unitCostTrade: 15, unitCostRetail: 22, wasteFactor: 0 },
        ],
        tools: ['Brick trowel', 'Spirit level', 'String line', 'Brick hammer', 'Jointer', 'Spot board', 'Mixer'],
        instructions: [
          '1. Mark out wall position and set out piers',
          '2. Excavate trench 600mm deep x 400mm wide',
          '3. Pour concrete foundation 200mm thick',
          '4. Allow to cure (24+ hours)',
          '5. Lay first course of engineering bricks',
          '6. Build up corner/pier leads first',
          '7. Run string line between leads',
          '8. Fill in between leads',
          '9. Insert wall ties every 450mm',
          '10. Lay DPC at 150mm above ground',
          '11. Continue to full height',
          '12. Insert expansion joints if >12m',
          '13. Point joints as work proceeds',
          '14. Fit coping or pier caps',
          '15. Clean down and protect'
        ],
        safetyNotes: ['Heavy lifting - bricks 20kg per hod', 'Cement burns', 'Use knee pads'],
        buildingRegsNotes: ['Freestanding walls over 1m may need BC approval', 'Wall thickness relates to height']
      },
      {
        id: 'repoint_wall',
        name: 'Repoint Brickwork (20m²)',
        description: 'Rake out and repoint defective mortar joints',
        labourHours: 16,
        skillLevel: 'qualified',
        materials: [
          { name: 'Building Sand', unit: 'tonne', quantity: 0.25, unitCostTrade: 38, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Cement or Lime', unit: 'bag', quantity: 2, unitCostTrade: 5.20, unitCostRetail: 6.80, wasteFactor: 0.05 },
          { name: 'Plasticiser', unit: 'litre', quantity: 1, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Pointing trowel', 'Jointer', 'Rake-out tool', 'Hawk', 'Stiff brush', 'Scaffold'],
        instructions: [
          '1. Assess mortar condition and match colour',
          '2. Rake out joints to 15-20mm depth',
          '3. Brush out loose material',
          '4. Dampen joints before filling',
          '5. Mix mortar (lime mortar for old buildings)',
          '6. Press mortar firmly into joints',
          '7. Finish joints to match existing style',
          '8. Brush off excess when finger-dry',
          '9. Protect from rain for 24 hours',
          '10. Clean down brickwork'
        ],
        safetyNotes: ['Work from scaffold not ladders', 'Eye protection when raking out', 'Cement burns']
      }
    ]
  },
  {
    id: 'groundworks',
    name: 'Groundworks',
    icon: 'Shovel',
    description: 'Excavation, foundations, drainage, landscaping',
    hourlyRateTrade: 26,
    hourlyRateRetail: 32,
    jobs: [
      {
        id: 'strip_foundation',
        name: 'Strip Foundation (10m length)',
        description: 'Excavate and pour strip foundation for extension',
        labourHours: 16,
        skillLevel: 'qualified',
        materials: [
          { name: 'C25 Concrete', unit: 'm³', quantity: 4, unitCostTrade: 105, unitCostRetail: 125, wasteFactor: 0.05 },
          { name: 'Concrete Pump', unit: 'pour', quantity: 1, unitCostTrade: 380, unitCostRetail: 450, wasteFactor: 0 },
          { name: 'Steel Mesh A393', unit: 'm²', quantity: 5, unitCostTrade: 6.80, unitCostRetail: 8.50, wasteFactor: 0.08 },
          { name: 'Starter Bars', unit: 'nr', quantity: 20, unitCostTrade: 3.50, unitCostRetail: 5, wasteFactor: 0 },
        ],
        tools: ['Mini digger', 'Dumper', 'Compactor', 'Laser level', 'Concrete vibrator', 'Shovel', 'Rake'],
        instructions: [
          '1. Mark out foundation positions',
          '2. Set up profile boards and string lines',
          '3. Excavate trench to required depth (min 1m)',
          '4. Check soil bearing capacity',
          '5. Compact trench bottom',
          '6. Place blinding concrete if soft ground',
          '7. Position steel mesh and starter bars',
          '8. Order concrete for specified pour',
          '9. Pour concrete in layers',
          '10. Vibrate to remove air pockets',
          '11. Level top surface to datum',
          '12. Cure and protect for 7 days'
        ],
        safetyNotes: ['Trench collapse risk - shore if over 1.2m', 'Underground services check', 'Machine safety'],
        buildingRegsNotes: ['Part A - Structure', 'Building Control inspection before pour', 'Depth depends on tree proximity']
      },
      {
        id: 'lay_drainage',
        name: 'Lay Foul Drainage Run (15m)',
        description: 'Install 110mm foul drainage to main sewer',
        labourHours: 12,
        skillLevel: 'qualified',
        materials: [
          { name: '110mm Soil Pipe', unit: 'm', quantity: 18, unitCostTrade: 6.80, unitCostRetail: 8.50, wasteFactor: 0.10 },
          { name: 'Inspection Chamber 450mm', unit: 'nr', quantity: 2, unitCostTrade: 145, unitCostRetail: 195, wasteFactor: 0 },
          { name: 'Pea Gravel', unit: 'tonne', quantity: 1, unitCostTrade: 45, unitCostRetail: 62, wasteFactor: 0.10 },
          { name: 'Bends & Junctions', unit: 'nr', quantity: 4, unitCostTrade: 12, unitCostRetail: 18, wasteFactor: 0 },
          { name: 'Pipe Connectors', unit: 'nr', quantity: 6, unitCostTrade: 5, unitCostRetail: 8, wasteFactor: 0 },
        ],
        tools: ['Mini digger', 'Laser level', 'Pipe cutter', 'Spirit level', 'Compactor', 'Shovel'],
        instructions: [
          '1. Mark out drainage route',
          '2. Locate existing drainage/sewer connection',
          '3. Excavate trench to correct falls (1:40 minimum)',
          '4. Lay pea gravel bedding 100mm',
          '5. Lay pipes with sockets facing upstream',
          '6. Check falls with laser/level',
          '7. Install inspection chambers at junctions',
          '8. Surround pipes with pea gravel',
          '9. Connect to existing system',
          '10. Test with water/air test',
          '11. Backfill in layers, compacting',
          '12. Building Control sign off'
        ],
        safetyNotes: ['Trench safety - no lone working', 'Hand dig near other services', 'Hygiene with foul drainage'],
        buildingRegsNotes: ['Part H - Drainage', 'Water test or air test required', 'Building Control inspection before backfill']
      },
      {
        id: 'lay_patio',
        name: 'Lay Patio (20m²)',
        description: 'Excavate and lay paving slabs on sand/cement bed',
        labourHours: 10,
        skillLevel: 'apprentice',
        materials: [
          { name: 'Paving Slabs 600x600', unit: 'm²', quantity: 22, unitCostTrade: 28, unitCostRetail: 38, wasteFactor: 0.05 },
          { name: 'Building Sand', unit: 'tonne', quantity: 1, unitCostTrade: 38, unitCostRetail: 52, wasteFactor: 0.10 },
          { name: 'Cement', unit: 'bag', quantity: 6, unitCostTrade: 5.20, unitCostRetail: 6.80, wasteFactor: 0.05 },
          { name: 'MOT Type 1', unit: 'tonne', quantity: 2, unitCostTrade: 28, unitCostRetail: 38, wasteFactor: 0.10 },
          { name: 'Paving Jointing Compound', unit: 'tub', quantity: 2, unitCostTrade: 18, unitCostRetail: 26, wasteFactor: 0 },
        ],
        tools: ['Plate compactor', 'Spirit level', 'Rubber mallet', 'String line', 'Wheelbarrow', 'Slab lifter'],
        instructions: [
          '1. Mark out patio area',
          '2. Excavate to 200mm depth (turf, topsoil)',
          '3. Compact subgrade',
          '4. Lay geotextile membrane',
          '5. Lay and compact MOT Type 1 (100mm)',
          '6. Mix sand/cement bedding (4:1)',
          '7. Lay in sections, screeding level',
          '8. Set string line for first row',
          '9. Bed slabs on mortar spots',
          '10. Tap down and level each slab',
          '11. Maintain consistent gaps (10mm)',
          '12. Cut edge slabs with angle grinder',
          '13. Allow mortar to set 24 hours',
          '14. Apply jointing compound',
          '15. Seal if required'
        ],
        safetyNotes: ['Heavy slabs - use slab lifter', 'Dust from cutting - wear mask/eye protection', 'Cement burns']
      }
    ]
  }
];

// Get all trades as flat list for select options
export const getAllTrades = () => TRADE_CATEGORIES.map(cat => ({
  id: cat.id,
  name: cat.name,
  hourlyRateTrade: cat.hourlyRateTrade,
  hourlyRateRetail: cat.hourlyRateRetail
}));

// Get jobs for a specific trade
export const getJobsForTrade = (tradeId: string) => {
  const trade = TRADE_CATEGORIES.find(t => t.id === tradeId);
  return trade?.jobs || [];
};

// Get specific job details
export const getJobDetails = (tradeId: string, jobId: string) => {
  const trade = TRADE_CATEGORIES.find(t => t.id === tradeId);
  return trade?.jobs.find(j => j.id === jobId);
};

// Calculate job cost
export const calculateJobCost = (
  tradeId: string,
  jobId: string,
  isTradePrice: boolean = true,
  quantity: number = 1
) => {
  const trade = TRADE_CATEGORIES.find(t => t.id === tradeId);
  const job = trade?.jobs.find(j => j.id === jobId);
  
  if (!trade || !job) return null;
  
  const hourlyRate = isTradePrice ? trade.hourlyRateTrade : trade.hourlyRateRetail;
  const labourCost = job.labourHours * hourlyRate * quantity;
  
  let materialsCost = 0;
  const materialsBreakdown = job.materials.map(mat => {
    const unitCost = isTradePrice ? mat.unitCostTrade : mat.unitCostRetail;
    const qty = mat.quantity * quantity;
    const waste = qty * mat.wasteFactor;
    const totalQty = qty + waste;
    const cost = totalQty * unitCost;
    materialsCost += cost;
    
    return {
      ...mat,
      totalQuantity: Math.ceil(totalQty),
      totalCost: cost
    };
  });
  
  return {
    trade: trade.name,
    job: job.name,
    quantity,
    labourHours: job.labourHours * quantity,
    labourRate: hourlyRate,
    labourCost,
    materialsCost,
    totalCost: labourCost + materialsCost,
    materials: materialsBreakdown,
    tools: job.tools,
    instructions: job.instructions,
    safetyNotes: job.safetyNotes,
    buildingRegsNotes: job.buildingRegsNotes
  };
};
