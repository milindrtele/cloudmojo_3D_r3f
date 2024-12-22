import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App_old.jsx'
import App from './App_with_physical_material.jsx'
//import App from './App_with_transmission_material.jsx'
//import App from './App_with_transmission_material_with_cubeCamera.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
