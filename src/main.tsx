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
 return <div className="house-scene">
   <div className="scene-stars"></div>
   <div className="scene-label solar-label"><Sun size={23}/><span>Solar <b>4.8 kW</b></span></div>
   <div className="scene-label grid-label"><Zap size={22}/><span>Grid <b>2.1 kW</b></span></div>
   <svg className="energy-lines" viewBox="0 0 800 390" preserveAspectRatio="none" aria-hidden="true">
     <path d="M310 78 L420 140 L420 218 L560 275" stroke="#f6c74a" strokeWidth="3" fill="none" strokeLinecap="round"/>
     <path d="M675 90 L590 130 L590 220 L560 275" stroke="#24e9d0" strokeWidth="3" fill="none" strokeLinecap="round"/>
     <path d="M560 275 L630 315" stroke="#26a9ff" strokeWidth="3" fill="none" strokeLinecap="round"/>
   </svg>
   <div className="house-ground"></div>
   <div className="house-illustration">
     <div className="roof-back"></div><div className="roof-main">
       {Array.from({length:12},(_,i)=><span key={i} className="solar-tile"/>)}
     </div>
     <div className="house-body">
       <div className="room room-living"><span className={lights?'window-lit':''}></span><i></i><em></em></div>
       <div className="room room-bed"><span></span><i></i></div>
       <div className="room room-kitchen"><span></span><i></i></div>
       <div className="house-door"></div>
       <div className="house-window"></div>
     </div>
     <div className="garage"><div className="car-shape"><span></span></div></div>
     <div className="garden tree tree-a"></div><div className="garden tree tree-b"></div><div className="garden tree tree-c"></div>
   </div>
   <div className="hotspot hotspot-light"><Lightbulb size={18}/><span>{lights} lights on</span></div>
   <div className="hotspot hotspot-fan"><Fan size={18}/></div>
   <div className="hotspot hotspot-water"><Droplets size={18}/></div>
   <div className="hotspot hotspot-car"><CarFront size={19}/><span>EV · 2.2 kW</span></div>
   <div className="scene-caption"><span className="live-dot"></span> Smart Home <span>•</span> Live visualization <small>Illustrative 3D view</small></div>
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
