import { TaskProvider } from './context/TaskContext'
import { SelectedBoardProvider } from './context/SelectedBoardContext'
import { DashboardLayout } from './components/Layout/DashboardLayout'
import { BoardKpiPanel } from './components/BoardKpiPanel/BoardKpiPanel'
import { TaskGrid } from './components/TaskGrid/TaskGrid'
import { TaskKpiStrip } from './components/TaskGrid/TaskKpiStrip'
import { KpiPanel } from './components/KpiPanel/KpiPanel'
import { ResourcePanel } from './components/ResourcePanel/ResourcePanel'

function App() {
  return (
    <TaskProvider>
      <SelectedBoardProvider>
        <DashboardLayout
          boardPanel={<BoardKpiPanel />}
          center={
            <div className="space-y-5">
              <TaskKpiStrip />
              <TaskGrid />
            </div>
          }
          rightTop={<ResourcePanel />}
          rightBottom={<KpiPanel />}
        />
      </SelectedBoardProvider>
    </TaskProvider>
  )
}

export default App
