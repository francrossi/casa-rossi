import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installCloudSync, loadCloudStateBeforeApp } from './cloudSync'

async function startApp() {
  await loadCloudStateBeforeApp()
  installCloudSync()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void startApp()
