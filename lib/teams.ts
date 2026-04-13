export const teams: Record<string, { name: string; logo: string; gif?: string }> = {
  okc: { name: 'Thunder', logo: '/assets/thunder.png', gif: '/assets/thunder.gif' },
  sas: { name: 'Spurs', logo: '/assets/spurs.png', gif: '/assets/spurs.gif' },
  lal: { name: 'Lakers', logo: '/assets/lakers.png', gif: '/assets/lakers.gif' },
  hou: { name: 'Rockets', logo: '/assets/rockets.png', gif: '/assets/rockets.gif' },
  den: { name: 'Nuggets', logo: '/assets/nuggets.png', gif: '/assets/nuggets.gif' },
  min: { name: 'Timberwolves', logo: '/assets/timberwolves.png' },
  phx: { name: 'Suns', logo: '/assets/Suns.png' },
  lac: { name: 'Clippers', logo: '/assets/clippers.png', gif: '/assets/clippers.gif' },
  gsw: { name: 'Warriors', logo: '/assets/warriors.png', gif: '/assets/warriors.gif' },
  por: { name: 'Trail Blazers', logo: '/assets/blazers.png' },

  det: { name: 'Pistons', logo: '/assets/pistons.png', gif: '/assets/pistons.gif' },
  bos: { name: 'Celtics', logo: '/assets/celtics.png', gif: '/assets/celtics.gif' },
  nyk: { name: 'Knicks', logo: '/assets/knicks.png', gif: '/assets/knicks.gif' },
  cle: { name: 'Cavaliers', logo: '/assets/cavaliers.png', gif: '/assets/cavaliers.gif' },
  orl: { name: 'Magic', logo: '/assets/magic.png', gif: '/assets/magic.gif' },
  tor: { name: 'Raptors', logo: '/assets/raptors.png' },
  mia: { name: 'Heat', logo: '/assets/heat.png', gif: '/assets/heat.gif' },
  atl: { name: 'Hawks', logo: '/assets/hawks.png' },
  phi: { name: '76ers', logo: '/assets/76ers.png', gif: '/assets/76ers.gif' }, 
  cha: { name: 'Hornets', logo: '/assets/hornets.png' }, 
};

// Based on the screenshot
export const initialSeeds = {
  west: {
    1: 'okc',
    2: 'sas',
    3: 'den',
    4: 'lal',
    5: 'hou',
    6: 'min',
    playin: {
      game1: ['phx', 'por'], // 7 vs 8 (winner gets 7 seed, loser goes to game 3)
      game2: ['lac', 'gsw'], // 9 vs 10 (winner goes to game 3, loser out)
    }
  },
  east: {
    1: 'det',
    2: 'bos',
    3: 'nyk',
    4: 'cle',
    5: 'tor',
    6: 'atl',
    playin: {
      game1: ['phi', 'orl'], // 7 vs 8
      game2: ['cha', 'mia'], // 9 vs 10
    }
  }
};
