export const formatWaterLevel = (meters) => {
  if (meters === undefined || meters === null) return '-- m';
  return `${Number(meters).toFixed(2)} m`;
};

export const formatRainfall = (mm) => {
  if (mm === undefined || mm === null) return '-- mm';
  return `${Number(mm).toFixed(1)} mm`;
};

export const getRiskBadgeColor = (riskLevel) => {
  switch (riskLevel) {
    case 2:
    case 'critical':
      return { bg: '#ef4444', text: '#ffffff', label: 'CRITICAL' };
    case 1:
    case 'warning':
      return { bg: '#f59e0b', text: '#000000', label: 'WARNING' };
    case 0:
    case 'normal':
    default:
      return { bg: '#10b981', text: '#ffffff', label: 'NORMAL' };
  }
};
