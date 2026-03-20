import emailjs from '@emailjs/browser';
import { teams } from './teams';

export const sendPredictionEmail = async (data: any) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

  const championTeam = teams[data.champion]?.name || data.champion;
  
  const b = data.bracketSelections || {};
  const getS = (id: string) => {
    const s = b[id];
    if (!s) return 'TBD';
    return `${teams[s.winner]?.name} (${s.games})`;
  };

  const bracket_summary = `
WEST - FIRST ROUND:
1v8: ${getS('west_r1_s1')}
4v5: ${getS('west_r1_s2')}
3v6: ${getS('west_r1_s3')}
2v7: ${getS('west_r1_s4')}

WEST - SEMIFINALS:
Series 1: ${getS('west_r2_s1')}
Series 2: ${getS('west_r2_s2')}

EAST - FIRST ROUND:
1v8: ${getS('east_r1_s1')}
4v5: ${getS('east_r1_s2')}
3v6: ${getS('east_r1_s3')}
2v7: ${getS('east_r1_s4')}

EAST - SEMIFINALS:
Series 1: ${getS('east_r2_s1')}
Series 2: ${getS('east_r2_s2')}

CONFERENCE FINALS:
WEST: ${getS('west_cf')}
EAST: ${getS('east_cf')}

NBA FINALS:
Winner: ${getS('finals')}
`.trim();

  // Format the email variables
  const templateParams = {
    to_name: data.name,
    to_email: data.email,
    champion: championTeam,
    finals_mvp: data.finalsMVP,
    final_score: data.finalScore,
    playin_west_7: teams[data.westSunsVsClippersWinner]?.name,
    playin_west_8: teams[data.westEighthSeedWinner]?.name,
    playin_east_7: teams[data.eastHeatVsHawksWinner]?.name,
    playin_east_8: teams[data.eastEighthSeedWinner]?.name,
    bracket_summary: bracket_summary
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;
  } catch (err) {
    console.error('EmailJS error:', err);
    return false;
  }
};
