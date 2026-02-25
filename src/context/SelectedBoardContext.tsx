import { createContext, useContext, useState, type ReactNode } from 'react'

interface SelectedBoardContextValue {
  selectedBoard: string | null
  setSelectedBoard: (board: string | null) => void
}

const SelectedBoardContext = createContext<SelectedBoardContextValue | null>(null)

export function SelectedBoardProvider({ children }: { children: ReactNode }) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  return (
    <SelectedBoardContext.Provider value={{ selectedBoard, setSelectedBoard }}>
      {children}
    </SelectedBoardContext.Provider>
  )
}

export function useSelectedBoard() {
  const ctx = useContext(SelectedBoardContext)
  if (!ctx) throw new Error('useSelectedBoard must be used within SelectedBoardProvider')
  return ctx
}
