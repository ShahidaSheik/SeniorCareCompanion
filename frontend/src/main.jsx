import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HeartPulse, PhoneCall, Pill, Dumbbell, HandHeart, Stethoscope, UserPlus, ShieldCheck, Home, Download } from "lucide-react";
import "./index.css";
import { api, makeMediaUrl } from "./api";

const religions = ["General", "Hindu", "Muslim", "Christian", "Sikh"];
const languages = ["English", "Tamil", "Telugu", "Kannada", "Malayalam", "Hindi", "Punjabi"];

function Card({ icon, title, children, onClick }) {
  return <button type="button" onClick={onClick} className="text-left bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-300 transition">
    <div className="flex items-center gap-3 mb-3 text-slate-800">{icon}<h2 className="text-xl font-bold">{title}</h2></div>
    <div>{children}</div>
  </button>;
}

function Field({ label, children }) {
  return <label className="block"><span className="text-sm font-semibold text-slate-700">{label}</span>{children}</label>;
}
function Input(props) { return <input {...props} className="w-full border rounded-xl p-3 mt-1" />; }
function Select({ children, ...props }) { return <select {...props} className="w-full border rounded-xl p-3 mt-1 bg-white">{children}</select>; }
function Btn({ children, className = "", ...props }) { return <button type="button" {...props} className={`rounded-xl px-4 py-3 font-bold ${className}`}>{children}</button>; }

function MediaButtons({ audio_url, video_url, source_url }) {
  return <div className="mt-3 space-y-2">
    {audio_url && <audio controls className="w-full"><source src={makeMediaUrl(audio_url)} /></audio>}
    {video_url && <video controls className="w-full rounded-xl max-h-72"><source src={makeMediaUrl(video_url)} /></video>}
    <div className="flex flex-wrap gap-2">
      {audio_url && <a className="text-sm bg-emerald-50 px-3 py-2 rounded-lg" href={makeMediaUrl(audio_url)} download><Download className="inline h-4"/> Download audio</a>}
      {video_url && <a className="text-sm bg-emerald-50 px-3 py-2 rounded-lg" href={makeMediaUrl(video_url)} download><Download className="inline h-4"/> Download video</a>}
      {source_url && <a className="text-sm bg-slate-100 px-3 py-2 rounded-lg" href={source_url} target="_blank">Open free source link</a>}
    </div>
  </div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [mode, setMode] = useState("login");
  const [active, setActive] = useState("home");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "senior@example.com", password: "secret123" });
  const [reg, setReg] = useState({ full_name: "", email: "", phone: "", password: "secret123", role: "senior", religion_preference: "Hindu", preferred_language: "Tamil", care_setting: "home" });
  const [prayers, setPrayers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [careRequests, setCareRequests] = useState([]);

  const [medicineForm, setMedicineForm] = useState({ medicine_name: "", dosage: "", reminder_time: "08:00", instructions: "" });
  const [contactForm, setContactForm] = useState({ name: "", relation: "", phone: "", is_primary: true });
  const [careForm, setCareForm] = useState({ request_type: "doctor", description: "", preferred_time: "" });
  const [checkForm, setCheckForm] = useState({ mood: "normal", pain_level: 0, notes: "I am okay today" });
  const [prayerForm, setPrayerForm] = useState({ title: "", religion: "Hindu", language: "Tamil", content_text: "", audio_url: "", source_url: "" });
  const [exerciseForm, setExerciseForm] = useState({ title: "", description: "", category: "chair_yoga", difficulty: "beginner", duration_minutes: 10, language: "Tamil", audio_url: "", video_url: "", source_url: "" });

  function showError(e) { setError(e.message || String(e)); setMessage(""); }
  function ok(m) { setMessage(m); setError(""); }

  async function login() {
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(loginForm) });
      localStorage.setItem("token", data.access_token); localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.access_token); setUser(data.user); setActive("home"); ok(`Welcome ${data.user.full_name}`);
    } catch (e) { showError(e); }
  }
  async function register() {
    try {
      const data = await api("/auth/register", { method: "POST", body: JSON.stringify(reg) });
      ok(`Registered ${data.full_name}. Please login now.`); setMode("login"); setLoginForm({ email: reg.email, password: reg.password });
    } catch (e) { showError(e); }
  }
  function logout() { localStorage.clear(); setToken(null); setUser(null); setActive("home"); }

  async function loadPrayers() { try { setPrayers(await api("/prayers/my")); } catch (e) { showError(e); } }
  async function loadExercises() { try { setExercises(await api("/exercises/my")); } catch (e) { showError(e); } }
  async function loadMedicines() { try { setMedicines(await api("/medicines")); } catch (e) { showError(e); } }
  async function loadContacts() { try { setContacts(await api("/emergency/contacts")); } catch (e) { showError(e); } }
  async function loadCareRequests() { try { setCareRequests(await api("/care-requests")); } catch (e) { showError(e); } }

  useEffect(() => { if (token && active === "prayers") loadPrayers(); if (token && active === "exercises") loadExercises(); if (token && active === "medicine") loadMedicines(); if (token && active === "emergency") loadContacts(); if (token && active === "homecare") loadCareRequests(); }, [active, token]);

  async function completeExercise(id) { try { await api("/exercises/complete", { method: "POST", body: JSON.stringify({ activity_id: id, completed_on: new Date().toISOString().slice(0,10) }) }); ok("Exercise marked completed."); } catch (e) { showError(e); } }
  async function addMedicine() { try { await api("/medicines", { method: "POST", body: JSON.stringify(medicineForm) }); ok("Medicine reminder added."); setMedicineForm({ medicine_name: "", dosage: "", reminder_time: "08:00", instructions: "" }); loadMedicines(); } catch (e) { showError(e); } }
  async function markTaken(id) { try { await api("/medicines/taken", { method: "POST", body: JSON.stringify({ reminder_id: id, taken_on: new Date().toISOString().slice(0,10) }) }); ok("Medicine marked as taken."); } catch (e) { showError(e); } }
  async function checkin() { try { await api("/checkins", { method: "POST", body: JSON.stringify({ checkin_date: new Date().toISOString().slice(0,10), ...checkForm }) }); ok("Daily check-in completed."); } catch (e) { showError(e); } }
  async function sos() { try { await api("/emergency/sos", { method: "POST", body: JSON.stringify({ message: "Emergency help needed. Please contact family/caregiver immediately." }) }); ok("SOS alert saved. In a serious emergency, call 112 or 108 immediately."); } catch (e) { showError(e); } }
  async function addContact() { try { await api("/emergency/contacts", { method: "POST", body: JSON.stringify(contactForm) }); ok("Emergency contact added."); setContactForm({ name: "", relation: "", phone: "", is_primary: true }); loadContacts(); } catch (e) { showError(e); } }
  async function addCareRequest() { try { const payload = { ...careForm, preferred_time: careForm.preferred_time ? new Date(careForm.preferred_time).toISOString() : null }; await api("/care-requests", { method: "POST", body: JSON.stringify(payload) }); ok("Home care request submitted."); setCareForm({ request_type: "doctor", description: "", preferred_time: "" }); loadCareRequests(); } catch (e) { showError(e); } }
  async function uploadMedia(file, setUrl) { try { const fd = new FormData(); fd.append("file", file); const data = await api("/media/upload", { method: "POST", body: fd }); setUrl(data.url); ok("Media uploaded. URL added to form."); } catch (e) { showError(e); } }
  async function addPrayer() { try { await api("/prayers", { method: "POST", body: JSON.stringify(prayerForm) }); ok("Prayer added."); setPrayerForm({ title: "", religion: "Hindu", language: "Tamil", content_text: "", audio_url: "", source_url: "" }); } catch (e) { showError(e); } }
  async function addExercise() { try { await api("/exercises", { method: "POST", body: JSON.stringify({ ...exerciseForm, duration_minutes: Number(exerciseForm.duration_minutes) }) }); ok("Exercise added."); setExerciseForm({ title: "", description: "", category: "chair_yoga", difficulty: "beginner", duration_minutes: 10, language: "Tamil", audio_url: "", video_url: "", source_url: "" }); } catch (e) { showError(e); } }

  const isAdmin = user?.role === "admin";

  return <main className="min-h-screen p-4 md:p-8 bg-slate-50">
    <section className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-7 mb-6 shadow-lg">
        <div className="flex justify-between gap-4 items-start"><div><h1 className="text-3xl md:text-5xl font-extrabold">Senior Care Companion</h1><p className="mt-3 text-lg">India-focused care app for seniors at home or in old age homes.</p></div>{token && <Btn onClick={logout} className="bg-white text-emerald-700">Logout</Btn>}</div>
      </div>

      {!token && <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex gap-2 mb-4"><Btn onClick={() => setMode("login")} className={mode === "login" ? "bg-emerald-600 text-white" : "bg-slate-100"}>Login</Btn><Btn onClick={() => setMode("register")} className={mode === "register" ? "bg-emerald-600 text-white" : "bg-slate-100"}><UserPlus className="inline h-4"/> Register Senior</Btn></div>
        {mode === "login" ? <div><h2 className="font-bold text-xl mb-3">Login</h2><div className="grid md:grid-cols-3 gap-3"><Input value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})} placeholder="Email"/><Input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password:e.target.value})} placeholder="Password"/><Btn className="bg-emerald-600 text-white" onClick={login}>Login</Btn></div></div>
        : <div><h2 className="font-bold text-xl mb-3">Register Senior / Admin</h2><div className="grid md:grid-cols-3 gap-3"><Input placeholder="Full name" value={reg.full_name} onChange={e=>setReg({...reg, full_name:e.target.value})}/><Input placeholder="Email" value={reg.email} onChange={e=>setReg({...reg, email:e.target.value})}/><Input placeholder="Phone" value={reg.phone} onChange={e=>setReg({...reg, phone:e.target.value})}/><Input type="password" placeholder="Password" value={reg.password} onChange={e=>setReg({...reg, password:e.target.value})}/><Select value={reg.role} onChange={e=>setReg({...reg, role:e.target.value})}><option value="senior">Senior</option><option value="caregiver">Caregiver</option><option value="admin">Admin</option></Select><Select value={reg.care_setting} onChange={e=>setReg({...reg, care_setting:e.target.value})}><option value="home">At home with family</option><option value="old_age_home">Old age home</option></Select><Select value={reg.religion_preference} onChange={e=>setReg({...reg, religion_preference:e.target.value})}>{religions.map(r=><option key={r}>{r}</option>)}</Select><Select value={reg.preferred_language} onChange={e=>setReg({...reg, preferred_language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><Btn className="bg-emerald-600 text-white" onClick={register}>Register</Btn></div></div>}
      </div>}

      {message && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">{error}</div>}

      {token && <div className="flex flex-wrap gap-2 mb-5"><Btn onClick={()=>setActive("home")} className="bg-slate-900 text-white"><Home className="inline h-4"/> Home</Btn>{isAdmin && <Btn onClick={()=>setActive("admin")} className="bg-purple-700 text-white"><ShieldCheck className="inline h-4"/> Admin Content</Btn>}</div>}

      {active === "home" && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card onClick={()=> token ? setActive("exercises") : setMode("register")} icon={<Dumbbell />} title="Exercise / Yoga"><p>Chair exercises, breathing practice, beginner yoga, audio/video, and completion tracking.</p></Card>
        <Card onClick={()=> token ? setActive("prayers") : setMode("register")} icon={<HandHeart />} title="Prayer Support"><p>Religion and language based prayers shown automatically after login.</p></Card>
        <Card onClick={()=> token ? setActive("medicine") : setMode("register")} icon={<Pill />} title="Medicine"><p>Reminder list and medicine-taken logging.</p></Card>
        <Card onClick={()=> token ? setActive("checkin") : setMode("register")} icon={<HeartPulse />} title="Daily Check-in"><p>Mood and pain check to help family monitor well-being.</p></Card>
        <Card onClick={()=> token ? setActive("emergency") : setMode("register")} icon={<PhoneCall />} title="Emergency SOS"><p>One-tap SOS alert and Indian emergency numbers.</p></Card>
        <Card onClick={()=> token ? setActive("homecare") : setMode("register")} icon={<Stethoscope />} title="Home Care"><p>Request doctor, nurse, or physiotherapist visit.</p></Card>
      </div>}

      {active === "prayers" && <Panel title={`Prayer Support - ${user?.religion_preference || "General"} / ${user?.preferred_language || "English"}`}><Btn onClick={loadPrayers} className="bg-emerald-600 text-white mb-4">Refresh prayers</Btn><List items={prayers} empty="No prayers added yet. Admin should add prayer links/content.">{p => <div><h3 className="font-bold">{p.title}</h3><p className="text-sm text-slate-600">{p.religion} • {p.language}</p><p>{p.content_text}</p><MediaButtons {...p}/></div>}</List></Panel>}

      {active === "exercises" && <Panel title={`Exercises - ${user?.preferred_language || "English"}`}><Btn onClick={loadExercises} className="bg-emerald-600 text-white mb-4">Refresh exercises</Btn><List items={exercises} empty="No exercises added yet. Admin should add elderly-friendly exercises.">{x => <div><h3 className="font-bold">{x.title}</h3><p className="text-sm text-slate-600">{x.category} • {x.difficulty} • {x.duration_minutes} min • {x.language}</p><p>{x.description}</p><MediaButtons {...x}/><Btn onClick={()=>completeExercise(x.id)} className="bg-slate-900 text-white mt-3">I completed this</Btn></div>}</List></Panel>}

      {active === "medicine" && <Panel title="Medicine Reminders"><div className="grid md:grid-cols-4 gap-3 mb-4"><Input placeholder="Medicine name" value={medicineForm.medicine_name} onChange={e=>setMedicineForm({...medicineForm, medicine_name:e.target.value})}/><Input placeholder="Dosage" value={medicineForm.dosage} onChange={e=>setMedicineForm({...medicineForm, dosage:e.target.value})}/><Input type="time" value={medicineForm.reminder_time} onChange={e=>setMedicineForm({...medicineForm, reminder_time:e.target.value})}/><Btn onClick={addMedicine} className="bg-emerald-600 text-white">Add reminder</Btn></div><List items={medicines} empty="No medicine reminders.">{m => <div><b>{m.medicine_name}</b> - {m.dosage} at {m.reminder_time}<br/><span>{m.instructions}</span><br/><Btn onClick={()=>markTaken(m.id)} className="bg-slate-900 text-white mt-2">Mark taken today</Btn></div>}</List></Panel>}

      {active === "checkin" && <Panel title="Daily Check-in"><div className="grid md:grid-cols-4 gap-3"><Select value={checkForm.mood} onChange={e=>setCheckForm({...checkForm, mood:e.target.value})}><option>happy</option><option>normal</option><option>sad</option><option>anxious</option></Select><Input type="number" min="0" max="10" value={checkForm.pain_level} onChange={e=>setCheckForm({...checkForm, pain_level:Number(e.target.value)})}/><Input placeholder="Notes" value={checkForm.notes} onChange={e=>setCheckForm({...checkForm, notes:e.target.value})}/><Btn onClick={checkin} className="bg-emerald-600 text-white">Submit check-in</Btn></div></Panel>}

      {active === "emergency" && <Panel title="Emergency SOS & Contacts"><div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4"><b>In serious emergency call official numbers immediately:</b> 112 Emergency, 108 Ambulance, 100 Police.</div><Btn onClick={sos} className="bg-red-600 text-white mb-4">SOS Help</Btn><h3 className="font-bold mb-2">Add Emergency Contact</h3><div className="grid md:grid-cols-4 gap-3 mb-4"><Input placeholder="Name" value={contactForm.name} onChange={e=>setContactForm({...contactForm, name:e.target.value})}/><Input placeholder="Relation" value={contactForm.relation} onChange={e=>setContactForm({...contactForm, relation:e.target.value})}/><Input placeholder="Phone" value={contactForm.phone} onChange={e=>setContactForm({...contactForm, phone:e.target.value})}/><Btn onClick={addContact} className="bg-emerald-600 text-white">Add contact</Btn></div><List items={contacts} empty="No contacts added.">{c => <div><b>{c.name}</b> ({c.relation}) - {c.phone}</div>}</List></Panel>}

      {active === "homecare" && <Panel title="Doctor / Nurse / Physiotherapist Home Care"><div className="grid md:grid-cols-4 gap-3 mb-4"><Select value={careForm.request_type} onChange={e=>setCareForm({...careForm, request_type:e.target.value})}><option value="doctor">Doctor</option><option value="nurse">Nurse</option><option value="physiotherapist">Physiotherapist</option></Select><Input placeholder="Description" value={careForm.description} onChange={e=>setCareForm({...careForm, description:e.target.value})}/><Input type="datetime-local" value={careForm.preferred_time} onChange={e=>setCareForm({...careForm, preferred_time:e.target.value})}/><Btn onClick={addCareRequest} className="bg-emerald-600 text-white">Submit request</Btn></div><List items={careRequests} empty="No requests.">{r => <div><b>{r.request_type}</b> - {r.status}<br/>{r.description}</div>}</List></Panel>}

      {active === "admin" && isAdmin && <Panel title="Admin Content Management"><p className="mb-4 text-sm text-slate-600">Add only free/legal public links or upload files for which you have permission. For YouTube links, use “Open source link”; direct download works only for uploaded media/direct media URLs.</p><div className="grid lg:grid-cols-2 gap-6"><div className="bg-slate-50 p-4 rounded-xl"><h3 className="font-bold mb-3">Add Prayer</h3><AdminPrayerForm form={prayerForm} setForm={setPrayerForm} uploadMedia={uploadMedia} addPrayer={addPrayer}/></div><div className="bg-slate-50 p-4 rounded-xl"><h3 className="font-bold mb-3">Add Exercise</h3><AdminExerciseForm form={exerciseForm} setForm={setExerciseForm} uploadMedia={uploadMedia} addExercise={addExercise}/></div></div></Panel>}
    </section>
  </main>;
}

function Panel({ title, children }) { return <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"><h2 className="text-2xl font-extrabold mb-4">{title}</h2>{children}</div>; }
function List({ items, empty, children }) { return !items?.length ? <p className="text-slate-500">{empty}</p> : <div className="space-y-3">{items.map(item => <div key={item.id} className="border rounded-xl p-4">{children(item)}</div>)}</div>; }
function AdminPrayerForm({ form, setForm, uploadMedia, addPrayer }) { return <div className="space-y-3"><Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><Select value={form.religion} onChange={e=>setForm({...form,religion:e.target.value})}>{religions.map(r=><option key={r}>{r}</option>)}</Select><Select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><textarea className="w-full border rounded-xl p-3" placeholder="Prayer text / positive thought" value={form.content_text} onChange={e=>setForm({...form,content_text:e.target.value})}/><Input placeholder="Audio URL or uploaded URL" value={form.audio_url} onChange={e=>setForm({...form,audio_url:e.target.value})}/><Input placeholder="Free source URL" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/><Field label="Upload prayer audio"><input type="file" accept="audio/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,audio_url:url}))}/></Field><Btn onClick={addPrayer} className="bg-purple-700 text-white">Add Prayer</Btn></div>; }
function AdminExerciseForm({ form, setForm, uploadMedia, addExercise }) { return <div className="space-y-3"><Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea className="w-full border rounded-xl p-3" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><Input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><Select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><Input type="number" placeholder="Duration minutes" value={form.duration_minutes} onChange={e=>setForm({...form,duration_minutes:e.target.value})}/><Input placeholder="Audio URL or uploaded URL" value={form.audio_url} onChange={e=>setForm({...form,audio_url:e.target.value})}/><Input placeholder="Video URL or uploaded URL" value={form.video_url} onChange={e=>setForm({...form,video_url:e.target.value})}/><Input placeholder="Free source URL" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/><Field label="Upload exercise audio"><input type="file" accept="audio/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,audio_url:url}))}/></Field><Field label="Upload exercise video"><input type="file" accept="video/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,video_url:url}))}/></Field><Btn onClick={addExercise} className="bg-purple-700 text-white">Add Exercise</Btn></div>; }

createRoot(document.getElementById("root")).render(<App />);
