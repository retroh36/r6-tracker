# R6 Map Blueprints Manifest

Official Ubisoft top-down blueprints for 11 competitive maps. Each blueprint shows one floor of the map, annotated with:
- Breakable walls (yellow/black diagonal stripes)
- Breakable floor traps (yellow/black diamond pattern)
- Line-of-sight walls and floor indicators (red)

## Naming convention

`{map-slug}-floor-{N}.jpg`

- Lower floor numbers = lower floors (basement = 1, roof = highest N)
- Some maps have basements that count as floor 1; others start at ground level

## Maps included

| Map slug | Display name | Blueprints | Lowest floor | Notes |
|----------|--------------|------------|--------------|-------|
| bank | Bank | 4 | Basement | Vault basement + 2 floors + roof |
| border | Border | 3 | 1F | No basement; 1F, 2F, roof |
| clubhouse | Clubhouse | 4 | Basement | CCTV basement + 1F + 2F + roof |
| coastline | Coastline | 3 | 1F | No basement; 1F, 2F, roof |
| consulate | Consulate | 4 | Basement | 2023 rework version |
| lair | Lair | 4 | Basement | Newer map (Y8S2) |
| nighthaven-labs | Nighthaven Labs | 4 | Basement | Newer map (Y7S4) |
| oregon | Oregon | 5 | Basement | Basement + 1F + 2F + attic + roof |
| outback | Outback | 3 | 1F | No basement; 1F, 2F, roof |
| theme-park | Theme Park | 3 | 1F | No basement; 1F, 2F, roof |
| villa | Villa | 5 | Basement | Basement + 1F + 2F + attic + roof |

## Maps NOT included (need to be sourced separately if wanted)

- Chalet (A-tier competitive)
- Kafe Dostoyevsky (B-tier competitive)
- Skyscraper (C-tier competitive)

## Usage

1. Copy all `.jpg` files from `public-maps/` into your project's `public/maps/` folder
2. Update `lib/maps.ts` to reference blueprints per map (count + floor labels)
3. The strategy generation endpoint can load these as base64 for Claude vision
4. The `/strategy` page should display the set of floors for the selected map

## Source

Official Ubisoft Rainbow Six Siege press kit blueprints. Free to use for fan projects.
