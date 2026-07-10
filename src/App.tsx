import React, { useEffect } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { MainCalendarGrid } from './components/organisms/MainCalendarGrid'
import { SidebarRight } from './components/organisms/SidebarRight'
import { ModalRoot } from './components/layout/ModalRoot'
import { useAppStore } from './store/useAppStore'

function App() {
  const theme = useAppStore(state => state.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      <MainLayout>
        {/* Container responsivo: stack no mobile, lado a lado no desktop */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          paddingTop: '1rem',
          paddingBottom: '2rem',
          minWidth: 0
        }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          flex: 1,
          minWidth: 0
        }} className="desktop-row">
          <MainCalendarGrid />
          <SidebarRight />
        </div>
      </div>
      
      {/* CSS inline apenas para evitar mais um arquivo na raiz para layout macro */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-row {
            flex-direction: row !important;
          }
        }
      `}</style>
      </MainLayout>
      <ModalRoot />
    </>
  )
}

export default App
