import { KpiTrendLineChart } from './KpiTrendLineChart'

export function KpiPanel() {
  return (
    <div className="space-y-5 pb-5">
      <div className="px-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden />
          KPI Trend (Last 6 Months)
        </h3>
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
          <KpiTrendLineChart />
        </div>
      </div>
    </div>
  )
}
