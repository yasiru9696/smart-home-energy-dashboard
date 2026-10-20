import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Zap, Cpu, CarFront, Sun, ChartNoAxesCombined, Settings, SlidersHorizontal,
  Wifi, CloudSun, MapPin, BatteryCharging, Lightbulb, Fan, Droplets, PlugZap,
  ChevronDown, ArrowUpRight, ArrowDownRight, Bell, Search, Menu, X, Power,
  CircleHelp, CalendarDays, Download, Activity, Gauge, Leaf, Waves, Clock3,
  CheckCircle2, AlertTriangle, Moon, RotateCcw, Plus, ArrowRight, Sparkles
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import './styles.css'

type Device = { id: number; name: string; room: string; kind: 'light'|'fan'|'pump'|'plug'; on: boolean; watts: number }
const initialDevices: Device[] = [
  {id:1,name:'Living room lights',room:'Living Room',kind:'light',on:true,watts:42},
  {id:2,name:'Bedroom fan',room:'Bedroom',kind:'fan',on:true,watts:65},
  {id:3,name:'Kitchen lights',room:'Kitchen',kind:'light',on:true,watts:28},
  {id:4,name:'Water pump',room:'Utility',kind:'pump',on:false,watts:750},
  {id:5,name:'Garden lights',room:'Outdoor',kind:'light',on:false,watts:24},
  {id:6,name:'TV & media',room:'Living Room',kind:'plug',on:true,watts:110},
]
const dayData = [
 {t:'06:00',solar:1.1,grid:1.6,home:1.8},{t:'08:00',solar:2.8,grid:1.2,home:2.4},{t:'10:00',solar:4.3,grid:.5,home:2.7},
 {t:'12:00',solar:5.1,grid:.2,home:3.1},{t:'14:00',solar:4.7,grid:.3,home:2.9},{t:'16:00',solar:3.2,grid:.8,home:2.5},
 {t:'18:00',solar:.8,grid:2.4,home:3.2},{t:'20:00',solar:0,grid:2.8,home:2.8},{t:'22:00',solar:0,grid:1.9,home:1.9}
]
const monthData = [
 {m:'May',solar:480,grid:315,ev:86},{m:'Jun',solar:502,grid:298,ev:94},{m:'Jul',solar:465,grid:340,ev:112},
 {m:'Aug',solar:530,grid:276,ev:105},{m:'Sep',solar:498,grid:290,ev:121},{m:'Oct',solar:524,grid:264,ev:116}
]
const nav = [
 {label:'Overview',icon:Home},{label:'Energy Flow',icon:Zap},{label:'Devices',icon:Cpu},{label:'EV Charging',icon:CarFront},
 {label:'Solar & Grid',icon:Sun},{label:'Analytics',icon:ChartNoAxesCombined},{label:'Automation',icon:SlidersHorizontal},{label:'Settings',icon:Settings}
]
const fmt = (n:number) => n.toLocaleString('en-US',{maximumFractionDigits:1})
function HouseScene({devices}:{devices:Device[]}) {
 const lights = devices.filter(d=>d.kind==='light'&&d.on).length
 const fanOn = devices.some(d=>d.kind==='fan'&&d.on)
 const pumpOn = devices.some(d=>d.kind==='pump'&&d.on)
 return <div className="house-scene scene-redesign">
   <div className="scene-stars"></div>
   <div className="scene-orbit scene-orbit-one"></div><div className="scene-orbit scene-orbit-two"></div>
   <div className="scene-label solar-label"><Sun size={22}/><span>Solar <b>4.8 kW</b></span></div>
   <div className="scene-label grid-label"><Zap size={21}/><span>Grid <b>2.1 kW</b></span></div>
   <svg className="energy-lines" viewBox="0 0 900 430" preserveAspectRatio="none" aria-hidden="true">
     <defs>
       <linearGradient id="solarCable" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe17b"/><stop offset="1" stopColor="#f5a623"/></linearGradient>
       <linearGradient id="gridCable" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6effe4"/><stop offset="1" stopColor="#13c8ca"/></linearGradient>
       <linearGradient id="evCable" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#60c9ff"/><stop offset="1" stopColor="#168bff"/></linearGradient>
     </defs>
     <path d="M315 95 L408 150 L408 242 L574 327" stroke="url(#solarCable)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
     <path d="M730 112 L645 151 L645 260 L574 327" stroke="url(#gridCable)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
     <path d="M574 327 L680 365" stroke="url(#evCable)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
     <circle cx="408" cy="242" r="5" fill="#ffd45e"/><circle cx="645" cy="260" r="5" fill="#46f4db"/>
   </svg>
   <svg className="isometric-house" viewBox="0 0 900 430" role="img" aria-label="Illustrated isometric smart home with solar panels, rooms, garden and an electric vehicle">
     <defs>
       <linearGradient id="plotTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#173d4b"/><stop offset=".55" stopColor="#0d2a3a"/><stop offset="1" stopColor="#081a2a"/></linearGradient>
       <linearGradient id="wallFront" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0d9ad"/><stop offset=".5" stopColor="#b8a487"/><stop offset="1" stopColor="#887e70"/></linearGradient>
       <linearGradient id="wallSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a7b2b0"/><stop offset="1" stopColor="#526c7a"/></linearGradient>
       <linearGradient id="roofTile" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4da0d1"/><stop offset=".55" stopColor="#1c5a88"/><stop offset="1" stopColor="#103552"/></linearGradient>
       <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="1"><stop stopColor={lights ? "#fff2a3" : "#b7edff"}/><stop offset="1" stopColor={lights ? "#ffbd52" : "#4ba9d4"}/></linearGradient>
       <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f3fbff"/><stop offset=".5" stopColor="#a4d6ea"/><stop offset="1" stopColor="#4d819b"/></linearGradient>
       <filter id="houseShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000" floodOpacity=".38"/></filter>
       <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
     </defs>
     <ellipse cx="458" cy="333" rx="310" ry="47" fill="#000" opacity=".25" filter="url(#softGlow)"/>
     <polygon points="95,285 430,150 810,285 470,411" fill="url(#plotTop)" stroke="#3b7888" strokeOpacity=".65" strokeWidth="1.5"/>
     <path d="M135 286L470 410M205 259L540 384M275 231L610 359M345 203L680 333M415 176L750 307" stroke="#3e8793" strokeOpacity=".2" strokeWidth="1"/>
     <path d="M210 330L548 195M310 367L648 232M410 400L748 267" stroke="#3e8793" strokeOpacity=".16" strokeWidth="1"/>
     <g filter="url(#houseShadow)">
       <polygon points="275,190 465,105 664,171 474,259" fill="#365b70" stroke="#9ab4bf" strokeWidth="2"/>
       <polygon points="275,190 474,259 474,284 275,214" fill="#607d8c"/>
       <polygon points="474,259 664,171 664,195 474,284" fill="#2d4e62"/>
       <polygon points="300,190 465,120 638,177 474,249" fill="url(#roofTile)" stroke="#8ad2f5" strokeOpacity=".75" strokeWidth="1.4"/>
       {Array.from({length:3},(_,i)=><path key={"pv-row-"+i} d={`M${321+i*5} ${199-i*24} L${493+i*48} ${255-i*24}`} stroke="#8dd8ff" strokeOpacity=".8" strokeWidth="1.5"/>)}
       {Array.from({length:4},(_,i)=><path key={"pv-col-"+i} d={`M${343+i*42} ${172-i*17} L${516+i*31} ${229-i*17}`} stroke="#80c9f0" strokeOpacity=".8" strokeWidth="1.5"/>)}
       <polygon points="326,222 474,274 474,355 326,303" fill="url(#wallFront)" stroke="#f3dfbc" strokeWidth="1.5"/>
       <polygon points="474,274 633,203 633,285 474,355" fill="url(#wallSide)" stroke="#d2e1e2" strokeOpacity=".7" strokeWidth="1.5"/>
       <polygon points="348,236 400,254 400,296 348,278" fill="url(#windowGlow)" stroke="#eaf7fa" strokeWidth="3"/>
       <polygon points="414,260 457,275 457,313 414,298" fill="#314e60" stroke="#d4c5a9" strokeWidth="3"/>
       <polygon points="495,283 535,265 535,301 495,320" fill="url(#windowGlow)" stroke="#d9f4ff" strokeWidth="3"/>
       <polygon points="561,254 600,237 600,273 561,290" fill="#80d8f5" stroke="#d7f6ff" strokeWidth="3"/>
       <path d="M326 303L474 355L633 285" fill="none" stroke="#f7e4c3" strokeWidth="3" strokeOpacity=".8"/>
       <polygon points="410,173 465,149 516,166 461,191" fill="#285b7b" stroke="#7fc7eb" strokeWidth="1.5"/>
       <polygon points="410,173 461,191 461,211 410,193" fill="#6e8995"/>
       <polygon points="461,191 516,166 516,186 461,211" fill="#294b60"/>
     </g>
     <g>
       <path d="M198 300L217 281L236 288L236 309L217 316Z" fill="#164a3c"/><ellipse cx="217" cy="281" rx="17" ry="22" fill="#2d9b68"/><ellipse cx="211" cy="275" rx="8" ry="12" fill="#75d68a" opacity=".7"/><path d="M217 300L217 321" stroke="#79583d" strokeWidth="6" strokeLinecap="round"/>
       <path d="M690 294L704 281L719 286L719 304L704 311Z" fill="#164a3c"/><ellipse cx="704" cy="279" rx="14" ry="18" fill="#24885c"/><ellipse cx="699" cy="273" rx="6" ry="9" fill="#76d78b" opacity=".7"/><path d="M704 294L704 312" stroke="#79583d" strokeWidth="5" strokeLinecap="round"/>
       <circle cx="270" cy="336" r="3" fill="#6cdbb1"/><circle cx="287" cy="343" r="2.5" fill="#f3cb61"/><circle cx="654" cy="325" r="3" fill="#6cdbb1"/>
     </g>
     <g>
       <polygon points="579,329 666,294 758,325 671,362" fill="#253f50" stroke="#6c9aaf" strokeWidth="1.5"/>
       <polygon points="603,326 659,304 713,322 659,345" fill="#193044" stroke="#60869a" strokeWidth="1"/>
       <path d="M610 329L621 316Q627 310 640 310L677 313Q687 314 697 324L708 328L711 337L605 344Z" fill="url(#carPaint)" stroke="#bfeafa" strokeWidth="1.5"/>
       <path d="M636 313L649 307L674 311L687 321L637 321Z" fill="#3b6d83" stroke="#a5dff2" strokeWidth="1.2"/>
       <path d="M653 309L654 320M674 311L682 321" stroke="#a8dff0" strokeWidth="1.3"/>
       <ellipse cx="626" cy="343" rx="10" ry="6" fill="#08131e"/><ellipse cx="691" cy="337" rx="10" ry="6" fill="#08131e"/>
       <ellipse cx="626" cy="342" rx="4" ry="2.5" fill="#8faab6"/><ellipse cx="691" cy="336" rx="4" ry="2.5" fill="#8faab6"/>
     </g>
     <g>
       <circle cx="374" cy="315" r="15" fill={lights ? "#f7c957" : "#15384b"} fillOpacity=".25"/><circle cx="374" cy="315" r="6" fill={lights ? "#ffd56a" : "#8bb7c7"}/>
       <circle cx="548" cy="279" r="12" fill={fanOn ? "#4ce0c2" : "#193d4c"} fillOpacity=".3"/><circle cx="548" cy="279" r="4" fill={fanOn ? "#4ce0c2" : "#6d98a8"}/>
       <circle cx="454" cy="337" r="11" fill={pumpOn ? "#49d5ef" : "#1a4054"} fillOpacity=".35"/><circle cx="454" cy="337" r="4" fill={pumpOn ? "#49d5ef" : "#6d98a8"}/>
     </g>
   </svg>
   <div className="hotspot hotspot-light"><Lightbulb size={17}/><span>{lights} lights on</span></div>
   <div className="hotspot hotspot-fan"><Fan size={17}/></div>
   <div className="hotspot hotspot-water"><Droplets size={17}/></div>
   <div className="hotspot hotspot-car"><CarFront size={18}/><span>EV · 2.2 kW</span></div>
   <div className="scene-caption"><span className="live-dot"></span> Smart Home <span>•</span> 3D concept view <small>Illustrative model</small></div>
 </div>
}
function App(){
 const [active,setActive]=useState('Overview')
 const [devices,setDevices]=useState(initialDevices)
 const [period,setPeriod]=useState('Month')
 const [range,setRange]=useState('Today')
 const [mode,setMode]=useState<'Auto'|'Manual'>('Auto')
 const [mobileNav,setMobileNav]=useState(false)
 const [search,setSearch]=useState('')
 const [showAdd,setShowAdd]=useState(false)
 const [newName,setNewName]=useState('')
 const [newRoom,setNewRoom]=useState('Living Room')
 const [newKind,setNewKind]=useState<'light'|'fan'|'pump'|'plug'>('light')
 const [toast,setToast]=useState('')
 const [events,setEvents]=useState([{color:'green',text:'EV charging started',time:'14:12'},{color:'yellow',text:'Solar generation increased',time:'12:45'},{color:'blue',text:'Water pump turned off (schedule)',time:'10:30'},{color:'green',text:'Grid power usage reduced',time:'09:15'}])
 const activeDevices=devices.filter(d=>d.on)
 const deviceWatts=activeDevices.reduce((sum,d)=>sum+d.watts,0)
 const filtered=devices.filter(d=>(d.name+' '+d.room).toLowerCase().includes(search.toLowerCase()))
 const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2600)}
 const toggle=(id:number)=>{const d=devices.find(x=>x.id===id);if(!d)return;setDevices(prev=>prev.map(x=>x.id===id?{...x,on:!x.on}:x));setEvents(prev=>[{color:'blue',text:`${d.name} turned ${d.on?'off':'on'}`,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})},...prev].slice(0,5));notify(`${d.name} ${d.on?'turned off':'turned on'} (demo)`)}
 const quick=(kind:'light'|'fan'|'pump',on:boolean)=>{setDevices(prev=>prev.map(d=>d.kind===kind?{...d,on}:d));notify(`${kind==='light'?'Lights':kind==='fan'?'Fans':'Water pump'} ${on?'turned on':'turned off'} (demo)`)}
 const addDevice=()=>{if(!newName.trim())return;setDevices(prev=>[...prev,{id:Date.now(),name:newName.trim(),room:newRoom,kind:newKind,on:false,watts:newKind==='pump'?750:newKind==='fan'?65:newKind==='light'?24:100}]);setNewName('');setShowAdd(false);notify('Device added to demo dashboard')}
 const solarTotal=period==='Month'?524:period==='Week'?132:24.6
 const gridTotal=period==='Month'?264:period==='Week'?67:11.4
 const useTotal=period==='Month'?389:period==='Week'?96:16.8
 return <div className="app-shell">
  <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
   <div className="brand"><div className="brand-mark"><Home size={25}/><span></span></div><div><strong>My Smart Home</strong><small>Solar <i>•</i> IoT <i>•</i> EV <i>•</i> Energy</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X/></button></div>
   <nav>{nav.map(n=>{const I=n.icon;return <button key={n.label} className={`nav-item ${active===n.label?'selected':''}`} onClick={()=>{setActive(n.label);setMobileNav(false)}}><I size={19}/><span>{n.label}</span>{n.label==='Devices'&&<small>{devices.length}</small>}</button>})}</nav>
   <div className="sidebar-bottom"><div className="eco-card"><div className="eco-orb"><Leaf size={22}/></div><strong>A smarter home</strong><span>for a <b>greener tomorrow</b></span><div className="eco-sun"></div></div><div className="connection"><span className="live-dot"></span><div><b>Local dashboard</b><small>Demo mode · Not connected</small></div></div><div className="brand-foot"><Sparkles size={15}/> Built for your home</div></div>
  </aside>
  <main className="main-area">
   <header className="topbar"><button className="menu-btn" onClick={()=>setMobileNav(true)}><Menu/></button><div className="mobile-brand"><Home size={19}/> My Smart Home</div><div className="weather"><div className="weather-icon"><CloudSun size={25}/></div><div><b>28°</b><small>Partly cloudy</small></div><span className="location"><MapPin size={13}/> Sri Lanka</span></div><div className="top-spacer"></div><div className="header-date"><span>MON, 19 OCT 2026</span><b>{new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</b></div><div className="wifi"><Wifi size={19}/></div><button className="profile" onClick={()=>setActive('Settings')}><div className="avatar">Y</div><span><b>Home Owner</b><small>Personal dashboard</small></span><ChevronDown size={15}/></button></header>
   <div className="content">
    <div className="page-heading"><div><div className="eyebrow"><span className="live-dot"></span> YOUR HOME AT A GLANCE</div><h1>{active==='Overview'?'Good afternoon':active} <span className="heading-spark">✦</span></h1><p>Here’s what’s happening at your home right now.</p></div><div className="heading-actions"><button className="icon-button" onClick={()=>notify('All systems overview refreshed (demo)')}><RotateCcw size={16}/></button><button className="icon-button notification" onClick={()=>notify('You are all caught up')}><Bell size={17}/><i></i></button><button className="date-select" onClick={()=>setRange(range==='Today'?'This week':'Today')}><CalendarDays size={15}/>{range}<ChevronDown size={14}/></button></div></div>
    <div className="metric-grid">
     <Metric icon={<Sun/>} iconClass="sun" title="Solar generation" value="4.8" unit="kW" detail={`Today ${solarTotal} kWh`} change="↑ 12%" changeText="vs yesterday"/>
     <Metric icon={<Zap/>} iconClass="grid" title="Grid usage" value="2.1" unit="kW" detail={`Today ${gridTotal} kWh`} change="↓ 18%" changeText="vs yesterday"/>
     <Metric icon={<Home/>} iconClass="home" title="Home consumption" value="3.7" unit="kW" detail={`Today ${useTotal} kWh`} change="↓ 9%" changeText="vs yesterday"/>
     <Metric icon={<CarFront/>} iconClass="ev" title="EV charging" value="2.2" unit="kW" detail="SOC · 62%" change="● Charging" changeText="Dongfeng BOX"/>
    </div>
    {active==='Devices'?<section className="panel devices-page"><div className="section-head"><div><h2>Device management</h2><p>Manage your rooms and connected devices</p></div><button className="primary-btn" onClick={()=>setShowAdd(true)}><Plus size={16}/> Add device</button></div><div className="device-toolbar"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search devices or rooms..."/></div><span>{activeDevices.length} of {devices.length} active</span></div><div className="device-grid">{filtered.map(d=><DeviceCard key={d.id} device={d} onToggle={()=>toggle(d.id)}/>)}</div></section>
    :active==='Analytics'?<section className="analytics-page"><div className="panel chart-panel wide-chart"><div className="section-head"><div><h2>Energy trends</h2><p>Compare generation and consumption over time</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>Day</option><option>Week</option><option>Month</option><option>Year</option></select></div><EnergyChart data={dayData}/></div><div className="panel chart-panel"><h2>Monthly energy comparison</h2><p>Solar, grid and EV energy (kWh)</p><MonthChart data={monthData}/></div></section>
    :active==='Automation'?<section className="panel automation-page"><div className="section-head"><div><h2>Smart automations</h2><p>Schedules and energy-saving ideas</p></div><button className="primary-btn" onClick={()=>notify('Automation builder is a demo placeholder')}><Plus size={16}/> New automation</button></div>{[{icon:<Sun/>,title:'Solar surplus → EV charging',desc:'Start charging when excess solar power is available',tag:'Energy saving',on:true},{icon:<Droplets/>,title:'Water pump schedule',desc:'Run the water pump on a defined schedule',tag:'Schedule',on:true},{icon:<Moon/>,title:'Night mode',desc:'Turn off selected lights at bedtime',tag:'Comfort',on:false}].map((a,i)=><div className="automation-row" key={a.title}><div className="device-icon">{a.icon}</div><div className="automation-copy"><b>{a.title}</b><p>{a.desc}</p><span>{a.tag}</span></div><Toggle value={a.on} onChange={()=>notify('Automation control is demo-only until integration is connected')}/></div>)}</section>
    :active==='Settings'?<section className="panel settings-page"><h2>Dashboard settings</h2><p>Prepare integrations and customize your home dashboard.</p><div className="settings-row"><div><b>eWeLink</b><small>Smart switches, lights and plugs</small></div><span className="status-pill offline">Not connected</span><button className="outline-btn" onClick={()=>notify('Add your eWeLink API credentials in the backend .env file')}>Configure</button></div><div className="settings-row"><div><b>Solex / Solar inverter</b><small>Solar generation and grid measurements</small></div><span className="status-pill offline">Not connected</span><button className="outline-btn" onClick={()=>notify('Confirm your inverter model and API availability first')}>Configure</button></div><div className="settings-row"><div><b>Electricity tariff</b><small>Used for estimated cost calculations</small></div><span className="status-pill">Not set</span><button className="outline-btn" onClick={()=>notify('Tariff configuration form can be added next')}>Set tariff</button></div><div className="notice"><AlertTriangle size={17}/> This is a functional UI prototype. Device readings and controls are simulated until real APIs and a compatible meter are connected.</div></section>
    :<div className="dashboard-grid">
      <section className="center-column">
       <div className="house-panel"><div className="house-panel-head"><div><span className="panel-kicker">SPATIAL OVERVIEW</span><h2>Your home <span>in 3D</span></h2></div><div className="view-switch"><button className="active">3D View</button><button onClick={()=>notify('2D floor plan view is a future extension')}>2D Plan</button></div></div><HouseScene devices={devices}/><div className="house-footer"><div><span className="live-dot"></span><b>Smart Home</b><span>•</span><small>Illustrative visualization</small></div><button onClick={()=>setActive('Devices')}>Manage devices <ArrowRight size={14}/></button></div></div>
       <div className="lower-grid"><div className="panel flow-panel"><div className="section-head"><div><h2>Energy flow</h2><p>Today · kWh</p></div><button className="tiny-link" onClick={()=>setActive('Energy Flow')}>Details <ArrowUpRight size={13}/></button></div><div className="flow-graphic"><div className="flow-source solar-source"><Sun/><b>{solarTotal} kWh</b><small>Solar</small></div><div className="flow-ribbons"><span className="ribbon gold"></span><span className="ribbon cyan"></span><span className="ribbon purple"></span></div><div className="flow-home"><Home size={24}/><b>{useTotal}</b><small>Home kWh</small></div><div className="flow-targets"><div><Zap/><span><b>{gridTotal} kWh</b><small>Grid</small></span></div><div><CarFront/><span><b>8.2 kWh</b><small>EV charging</small></span></div></div></div><div className="flow-legend"><span><i className="gold-dot"></i>Solar</span><span><i className="blue-dot"></i>Grid</span><span><i className="purple-dot"></i>EV</span></div></div>
        <div className="panel chart-panel consumption-panel"><div className="section-head"><div><h2>Generation & use</h2><p>Power profile · kW</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>Day</option><option>Week</option><option>Month</option><option>Year</option></select></div><div className="chart-legend"><span><i className="gold-dot"></i>Solar</span><span><i className="blue-dot"></i>Grid</span><span><i className="purple-dot"></i>Home</span></div><EnergyChart data={dayData}/></div>
       </div>
       <div className="panel comparison-panel"><div className="section-head"><div><h2>This month vs last month</h2><p>Energy summary · illustrative data</p></div><button className="tiny-link" onClick={()=>setActive('Analytics')}>Full analytics <ArrowUpRight size={13}/></button></div><div className="comparison-grid"><Compare title="Solar generation" current="524 kWh" previous="476 kWh" change="+10.1%" positive/><Compare title="Grid usage" current="264 kWh" previous="298 kWh" change="−11.4%" positive/><Compare title="EV charging" current="116 kWh" previous="108 kWh" change="+7.4%" /></div></div>
      </section>
      <aside className="right-column">
       <div className="panel load-panel"><div className="section-head"><h2>Home load</h2><span className="live-label"><i></i> LIVE DEMO</span></div><div className="load-content"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'Lights',value:16},{name:'Fans',value:22},{name:'Pump',value:14},{name:'Other',value:48}]} dataKey="value" innerRadius="68%" outerRadius="90%" paddingAngle={4} stroke="none">{['#259dff','#8b7dff','#37dfb0','#f5b83d'].map((c,i)=><Cell key={i} fill={c}/>)}</Pie></PieChart></ResponsiveContainer><div className="donut-center"><b>3.7</b><span>kW</span><small>Current load</small></div></div><div className="load-legend">{[{n:'Lights',v:'0.6 kW',p:'16%',c:'blue'},{n:'Fans',v:'0.8 kW',p:'22%',c:'violet'},{n:'Water pump',v:'0.5 kW',p:'14%',c:'green'},{n:'Other devices',v:'1.8 kW',p:'48%',c:'gold'}].map(x=><div key={x.n}><i className={x.c}></i><span>{x.n}</span><b>{x.v}</b><small>{x.p}</small></div>)}</div></div></div>
       <div className="panel controls-panel"><div className="section-head"><h2>Device controls</h2><div className="mode-switch"><button className={mode==='Manual'?'active':''} onClick={()=>setMode('Manual')}>Manual</button><button className={mode==='Auto'?'active':''} onClick={()=>setMode('Auto')}>Auto</button></div></div>{[{kind:'light' as const,name:'Lights',sub:`${devices.filter(d=>d.kind==='light'&&d.on).length} / ${devices.filter(d=>d.kind==='light').length} on`,icon:<Lightbulb/>},{kind:'fan' as const,name:'Fans',sub:`${devices.filter(d=>d.kind==='fan'&&d.on).length} active`,icon:<Fan/>},{kind:'pump' as const,name:'Water pump',sub:devices.find(d=>d.kind==='pump')?.on?'Running':'Off',icon:<Droplets/>}].map(x=>{const group=devices.filter(d=>d.kind===x.kind);const on=group.some(d=>d.on);return <div className="control-row" key={x.kind}><div className={`control-icon ${x.kind}`}>{x.icon}</div><div className="control-label"><b>{x.name}</b><small>{x.sub}</small></div><Toggle value={on} onChange={()=>{if(mode==='Auto'){notify('Switch to Manual mode to override device controls');return}quick(x.kind,!on)}}/></div>})}<div className="control-row"><div className="control-icon ev"><CarFront/></div><div className="control-label"><b>EV charger</b><small>Charging · 2.2 kW</small></div><Toggle value onChange={()=>notify('EV charging is display-only until charger integration is available')}/></div><button className="all-devices-link" onClick={()=>setActive('Devices')}>All devices <ArrowRight size={14}/></button></div>
       <div className="panel quick-panel"><h2>Quick actions</h2><div className="quick-grid"><button onClick={()=>quick('light',false)}><Lightbulb/>Turn off lights</button><button onClick={()=>quick('fan',false)}><Fan/>Turn off fans</button><button onClick={()=>quick('pump',false)}><Droplets/>Stop water pump</button><button onClick={()=>notify('EV start command is disabled until safely integrated')}><CarFront/>Start EV charging</button></div></div>
       <div className="panel events-panel"><div className="section-head"><h2>Recent events</h2><button className="tiny-link" onClick={()=>notify('Showing latest dashboard events')}>View all</button></div>{events.slice(0,4).map((e,i)=><div className="event-row" key={i}><i className={e.color}></i><span>{e.text}</span><small>{e.time}</small></div>)}</div>
       <div className="panel integration-card"><div className="integration-art"><div className="mini-house"><div></div><span></span></div><div className="integration-copy"><b>Connect your ecosystem</b><small>eWeLink · Solex · Energy meter</small></div></div><button onClick={()=>setActive('Settings')}>Configure integrations <ArrowRight size={14}/></button></div>
      </aside>
     </div>}
    <footer className="page-footer"><span>MY SMART HOME <i>•</i> ENERGY CONTROL CENTER</span><span><span className="live-dot"></span> Prototype · Demo data only</span></footer>
   </div>
  </main>
  <AnimatePresence>{showAdd&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowAdd(false)}><motion.div className="modal" initial={{y:18,scale:.97}} animate={{y:0,scale:1}} exit={{y:18,scale:.97}} onClick={e=>e.stopPropagation()}><div className="section-head"><h2>Add a device</h2><button className="icon-button" onClick={()=>setShowAdd(false)}><X size={17}/></button></div><p>Add a device to the local prototype. API pairing is configured separately.</p><label>Device name<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Upstairs bedroom light"/></label><label>Room<select value={newRoom} onChange={e=>setNewRoom(e.target.value)}>{['Living Room','Bedroom','Kitchen','Utility','Outdoor','Garage'].map(r=><option key={r}>{r}</option>)}</select></label><label>Device type<select value={newKind} onChange={e=>setNewKind(e.target.value as typeof newKind)}><option value="light">Light</option><option value="fan">Fan</option><option value="pump">Water pump</option><option value="plug">Smart plug / Other</option></select></label><div className="modal-actions"><button className="outline-btn" onClick={()=>setShowAdd(false)}>Cancel</button><button className="primary-btn" onClick={addDevice}>Add device</button></div></motion.div></motion.div>}</AnimatePresence>
  <AnimatePresence>{toast&&<motion.div className="toast" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}><CheckCircle2 size={17}/>{toast}</motion.div>}</AnimatePresence>
 </div>
}
function Metric({icon,iconClass,title,value,unit,detail,change,changeText}:{icon:React.ReactNode;iconClass:string;title:string;value:string;unit:string;detail:string;change:string;changeText:string}){
 return <motion.div className="metric-card" whileHover={{y:-3}} transition={{duration:.18}}><div className={`metric-icon ${iconClass}`}>{icon}</div><div className="metric-main"><span>{title}</span><div className="metric-value">{value}<small>{unit}</small></div><div className="metric-detail">{detail}</div><div className={`metric-change ${iconClass==='ev'?'charging':''}`}>{change} <small>{changeText}</small></div></div><div className="metric-spark"><Activity size={18}/></div></motion.div>
}
function Toggle({value,onChange}:{value:boolean;onChange:()=>void}){return <button className={`toggle ${value?'on':''}`} aria-label={value?'Turn off':'Turn on'} onClick={onChange}><span/></button>}
function DeviceCard({device,onToggle}:{device:Device;onToggle:()=>void}){
 const I=device.kind==='light'?Lightbulb:device.kind==='fan'?Fan:device.kind==='pump'?Droplets:PlugZap
 return <div className="device-card"><div className={`device-icon ${device.kind}`}><I/></div><div className="device-card-info"><b>{device.name}</b><small>{device.room}</small><span className={device.on?'device-on':'device-off'}><i/>{device.on?'On':'Off'} · {device.watts} W</span></div><Toggle value={device.on} onChange={onToggle}/></div>
}
function EnergyChart({data}:{data:typeof dayData}){
 return <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{top:6,right:4,left:-22,bottom:0}}><defs><linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f7bd41" stopOpacity={.28}/><stop offset="100%" stopColor="#f7bd41" stopOpacity={0}/></linearGradient><linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b83ff" stopOpacity={.22}/><stop offset="100%" stopColor="#9b83ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#1c3046" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="t" tick={{fill:'#7690aa',fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#7690aa',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#0b1b2d',border:'1px solid #26445f',borderRadius:10,color:'#eaf4ff'}}/><Area type="monotone" dataKey="solar" name="Solar" stroke="#f7bd41" strokeWidth={2} fill="url(#solarGrad)"/><Area type="monotone" dataKey="home" name="Home" stroke="#9b83ff" strokeWidth={2} fill="url(#homeGrad)"/><Line type="monotone" dataKey="grid" name="Grid" stroke="#2c9fff" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer></div>
}
function MonthChart({data}:{data:typeof monthData}){return <div className="chart month-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:8,right:4,left:-20,bottom:0}}><CartesianGrid stroke="#1c3046" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="m" tick={{fill:'#7690aa',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#7690aa',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#0b1b2d',border:'1px solid #26445f',borderRadius:10,color:'#eaf4ff'}}/><Bar dataKey="solar" name="Solar" fill="#f7bd41" radius={[4,4,0,0]}/><Bar dataKey="grid" name="Grid" fill="#2c9fff" radius={[4,4,0,0]}/><Bar dataKey="ev" name="EV" fill="#9b83ff" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>}
function Compare({title,current,previous,change,positive=false}:{title:string;current:string;previous:string;change:string;positive?:boolean}){
 return <div className="compare-item"><span>{title}</span><b>{current}</b><div className="compare-bars"><i style={{width:'84%'}}></i><i style={{width:'70%'}}></i></div><div className="compare-foot"><small>Last month {previous}</small><strong className={positive?'good':'neutral'}>{change}</strong></div></div>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
