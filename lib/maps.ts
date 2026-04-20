export interface Blueprint {
  floor: number;
  label: string;
  file: string;
}

export interface MapInfo {
  slug: string;
  name: string;
  tier: 'A' | 'B' | 'C';
  blueprints: Blueprint[];
}

export const MAPS: MapInfo[] = [
  { slug: 'coastline', name: 'Coastline', tier: 'A', blueprints: [
    { floor: 1, label: '1F', file: 'coastline-floor-1.jpg' },
    { floor: 2, label: '2F', file: 'coastline-floor-2.jpg' },
    { floor: 3, label: 'ROOF', file: 'coastline-floor-3.jpg' },
  ]},
  { slug: 'bank', name: 'Bank', tier: 'A', blueprints: [
    { floor: 1, label: 'B', file: 'bank-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'bank-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'bank-floor-3.jpg' },
    { floor: 4, label: 'ROOF', file: 'bank-floor-4.jpg' },
  ]},
  { slug: 'chalet', name: 'Chalet', tier: 'A', blueprints: [] },
  { slug: 'nighthaven-labs', name: 'Nighthaven Labs', tier: 'A', blueprints: [
    { floor: 1, label: 'B', file: 'nighthaven-labs-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'nighthaven-labs-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'nighthaven-labs-floor-3.jpg' },
    { floor: 4, label: 'ROOF', file: 'nighthaven-labs-floor-4.jpg' },
  ]},
  { slug: 'clubhouse', name: 'Clubhouse', tier: 'B', blueprints: [
    { floor: 1, label: 'B', file: 'clubhouse-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'clubhouse-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'clubhouse-floor-3.jpg' },
    { floor: 4, label: 'ROOF', file: 'clubhouse-floor-4.jpg' },
  ]},
  { slug: 'oregon', name: 'Oregon', tier: 'B', blueprints: [
    { floor: 1, label: 'B', file: 'oregon-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'oregon-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'oregon-floor-3.jpg' },
    { floor: 4, label: 'ATTIC', file: 'oregon-floor-4.jpg' },
    { floor: 5, label: 'ROOF', file: 'oregon-floor-5.jpg' },
  ]},
  { slug: 'border', name: 'Border', tier: 'B', blueprints: [
    { floor: 1, label: '1F', file: 'border-floor-1.jpg' },
    { floor: 2, label: '2F', file: 'border-floor-2.jpg' },
    { floor: 3, label: 'ROOF', file: 'border-floor-3.jpg' },
  ]},
  { slug: 'consulate', name: 'Consulate', tier: 'B', blueprints: [
    { floor: 1, label: 'B', file: 'consulate-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'consulate-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'consulate-floor-3.jpg' },
    { floor: 4, label: 'ROOF', file: 'consulate-floor-4.jpg' },
  ]},
  { slug: 'kafe-dostoyevsky', name: 'Kafe Dostoyevsky', tier: 'B', blueprints: [] },
  { slug: 'villa', name: 'Villa', tier: 'B', blueprints: [
    { floor: 1, label: 'B', file: 'villa-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'villa-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'villa-floor-3.jpg' },
    { floor: 4, label: 'ATTIC', file: 'villa-floor-4.jpg' },
    { floor: 5, label: 'ROOF', file: 'villa-floor-5.jpg' },
  ]},
  { slug: 'skyscraper', name: 'Skyscraper', tier: 'C', blueprints: [] },
  { slug: 'theme-park', name: 'Theme Park', tier: 'C', blueprints: [
    { floor: 1, label: '1F', file: 'theme-park-floor-1.jpg' },
    { floor: 2, label: '2F', file: 'theme-park-floor-2.jpg' },
    { floor: 3, label: 'ROOF', file: 'theme-park-floor-3.jpg' },
  ]},
  { slug: 'lair', name: 'Lair', tier: 'C', blueprints: [
    { floor: 1, label: 'B', file: 'lair-floor-1.jpg' },
    { floor: 2, label: '1F', file: 'lair-floor-2.jpg' },
    { floor: 3, label: '2F', file: 'lair-floor-3.jpg' },
    { floor: 4, label: 'ROOF', file: 'lair-floor-4.jpg' },
  ]},
];

export function findMap(slugOrName: string): MapInfo | undefined {
  const lower = slugOrName.toLowerCase();
  return MAPS.find(m => m.slug === lower || m.name.toLowerCase() === lower);
}
