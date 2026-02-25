import { useState } from 'react'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  boardPanel: ReactNode
  center: ReactNode
  rightTop: ReactNode
  rightBottom: ReactNode
}

export function DashboardLayout({ boardPanel, center, rightTop, rightBottom }: DashboardLayoutProps) {
  const [rightPanelHidden, setRightPanelHidden] = useState(false)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100/80">
      {/* Left: Board KPI & Board List */}
      <section className="lg:w-[240px] xl:w-[280px] flex-shrink-0 flex flex-col border-r border-slate-200/80 bg-white shadow-sm max-h-screen">
        {boardPanel}
      </section>

      {/* Center: Task Grid */}
      <section className="lg:flex-1 lg:min-w-0 flex flex-col border-r border-slate-200/80 bg-white shadow-sm">
        <div className="flex-1 overflow-auto p-5 lg:p-6">{center}</div>
      </section>

      {/* Right: Resource + KPI (collapsible) */}
      {rightPanelHidden ? (
        <section className="flex flex-col justify-center border-l border-slate-200/80 bg-slate-50/80 w-10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setRightPanelHidden(false)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition-colors rounded-l-md"
            aria-label="Show resource panel"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </section>
      ) : (
        <section className="lg:w-[35%] lg:max-w-[480px] flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 shadow-sm">
          <div className="sticky top-0 z-10 flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 flex items-center gap-1 py-1 pr-1">
            <button
              type="button"
              onClick={() => setRightPanelHidden(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
              aria-label="Hide resource panel"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex-1 min-w-0 overflow-hidden">
              {rightTop}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">{rightBottom}</div>
        </section>
      )}
    </div>
  )
}
