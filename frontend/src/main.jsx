import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { ContextProvider } from './context/contextProvider.jsx'
import { ForumDataProvider } from './context/ForumDataContext.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <ContextProvider>
      <ForumDataProvider>
        <RouterProvider router={router} />
      </ForumDataProvider>
    </ContextProvider>
  //</StrictMode>,
)
