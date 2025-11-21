export const getBadge = (points) => {
  if (points >= 1000) return "🏆 Legend Reporter";
  if (points >= 500) return "🥇 Gold Reporter";
  if (points >= 200) return "🥈 Silver Reporter";
  if (points >= 50) return "🥉 Bronze Reporter";
  return "🟢 New Citizen";
};
