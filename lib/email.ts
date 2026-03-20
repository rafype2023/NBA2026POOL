import emailjs from '@emailjs/browser';
import { teams } from './teams';

export const sendPredictionEmail = async (data: any) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

  const championTeam = teams[data.champion]?.name || data.champion;

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
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return true;
  } catch (err) {
    console.error('EmailJS error:', err);
    return false;
  }
};
