const unitsByFrequency = {
  DAILY: { primary: ['día', 'días'], secondary: ['hora', 'horas'], factor: 24 },
  WEEKLY: { primary: ['semana', 'semanas'], secondary: ['día', 'días'], factor: 7 },
  MONTHLY: { primary: ['mes', 'meses'], secondary: ['día', 'días'], factor: 30 },
  YEARLY: { primary: ['año', 'años'], secondary: ['mes', 'meses'], factor: 12 },
};

export const getGoalTimeDetails = (goal) => {
  const estimate = goal?.estimatedTime;
  if (!estimate || typeof estimate !== 'object') return null;
  const value = Number(estimate.periodsRemaining);
  if (!Number.isFinite(value) || value < 0) return null;
  return { value, frequency: estimate.frequency || goal.savingFrequency };
};

export const formatGoalTime = (value, frequency) => {
  const unit = unitsByFrequency[frequency];
  if (!unit || !Number.isFinite(value)) return null;
  if (value <= 0) return 'Meta alcanzada';

  let primaryValue = Math.floor(value);
  let secondaryValue = Math.round((value - primaryValue) * unit.factor);
  if (secondaryValue === unit.factor) {
    primaryValue += 1;
    secondaryValue = 0;
  }

  const parts = [];
  if (primaryValue > 0) parts.push(`${primaryValue} ${primaryValue === 1 ? unit.primary[0] : unit.primary[1]}`);
  if (secondaryValue > 0) parts.push(`${secondaryValue} ${secondaryValue === 1 ? unit.secondary[0] : unit.secondary[1]}`);
  return parts.join(' y ') || `menos de 1 ${unit.secondary[0]}`;
};
