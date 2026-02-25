export interface KpiTrendMonth {
  month: string
  healthyPercent: number
  needsAttentionPercent: number
  atRiskPercent: number
}

const monthNames = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']

export const sampleKpiTrend: KpiTrendMonth[] = [
  { month: monthNames[0], healthyPercent: 62, needsAttentionPercent: 28, atRiskPercent: 10 },
  { month: monthNames[1], healthyPercent: 58, needsAttentionPercent: 30, atRiskPercent: 12 },
  { month: monthNames[2], healthyPercent: 55, needsAttentionPercent: 32, atRiskPercent: 13 },
  { month: monthNames[3], healthyPercent: 52, needsAttentionPercent: 35, atRiskPercent: 13 },
  { month: monthNames[4], healthyPercent: 56, needsAttentionPercent: 32, atRiskPercent: 12 },
  { month: monthNames[5], healthyPercent: 60, needsAttentionPercent: 28, atRiskPercent: 12 },
]
