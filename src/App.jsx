import './App.css'
import CyberThreat from './Components/Cyber Threat/CyberThreat'
import Navbar from './Components/Common/Navbar'
import Home from './Components/Home/Home'
import WorldMap from './Components/Common/WorldMap'
import { Routes, Route } from 'react-router-dom'
import CountryView from './Components/Country View/CountryView'
import WarThreatMap from './Components/WarZone/WarThreatMap'
import PassportHome from './Components/Passport/PassportHome'
import CountryPassportData from './Components/Passport/CountryPassportData'
import PassportComparision from './Components/Passport/PassportComparision'


function App() {

  return (
   <div>

  
    <Navbar/>
    <Routes>
      <Route path='' element={<Home/>} />
      <Route path='/CyberThreat' element={<CyberThreat/>} />
      <Route path='/world-map' element={ <WorldMap/>} />
      <Route path='/country/:country' element={ <CountryView/>} />
      <Route path='/warzone' element={ <WarThreatMap/>} />
      <Route path='/Passport/Home' element={ <PassportHome/>} />
      <Route path='/Passport/:country' element={ <CountryPassportData/>} />
      <Route path='/Passport/compare' element={ <PassportComparision/>} />


   
    </Routes>
   </div>
  )
}

export default App
