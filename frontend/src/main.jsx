import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Dumbbell,
  HandHeart,
  HeartPulse,
  Home,
  Phone,
  PhoneCall,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Contrast,
} from "lucide-react";
import "./index.css";
import { api, makeMediaUrl } from "./api";

const religions = ["General", "Hindu", "Muslim", "Christian", "Sikh"];
const languages = ["English", "Tamil", "Hindi", "Urdu", "Arabic", "Telugu", "Kannada", "Malayalam", "Punjabi"];
const careSettings = [
  { value: "home", label: "At home with family" },
  { value: "living_alone", label: "Living alone" },
  { value: "old_age_home", label: "Old age home" },
];

const i18n = {
  English: {
    home: "Home", prayers: "Prayers", exercises: "Exercises", medicine: "Medicine", emergency: "Emergency",
    checkin: "Check-in", homecare: "Home Care", addMedicine: "Add medicine", selectSenior: "Select Senior",
    safety: "Consult doctor before changing or stopping medicine.", call: "Call", whatsapp: "WhatsApp",
    history: "History", highContrast: "High contrast",
  },
  Tamil: {
    home: "முகப்பு", prayers: "பிரார்த்தனை", exercises: "உடற்பயிற்சி", medicine: "மருந்து", emergency: "அவசரம்",
    checkin: "நலச் சோதனை", homecare: "வீட்டு பராமரிப்பு", addMedicine: "மருந்து சேர்க்க", selectSenior: "மூத்தவரை தேர்வு செய்யவும்",
    safety: "மருந்தை மாற்றுவதற்கு முன் மருத்துவரை அணுகவும்.", call: "அழை", whatsapp: "வாட்ஸ்அப்",
    history: "வரலாறு", highContrast: "உயர் மாறுபாடு",
  },
  Hindi: {
    home: "होम", prayers: "प्रार्थना", exercises: "व्यायाम", medicine: "दवा", emergency: "आपातकाल",
    checkin: "चेक-इन", homecare: "होम केयर", addMedicine: "दवा जोड़ें", selectSenior: "वरिष्ठ नागरिक चुनें",
    safety: "दवा बदलने या बंद करने से पहले डॉक्टर से सलाह लें।", call: "कॉल", whatsapp: "व्हाट्सऐप",
    history: "इतिहास", highContrast: "हाई कॉन्ट्रास्ट",
  },
};

function t(user, key) {
  return (i18n[user?.preferred_language] || i18n.English)[key] || i18n.English[key] || key;
}

function getYouTubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
  } catch {}
  return null;
}

function Card({ icon, title, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-left bg-white rounded-3xl p-6 min-h-[150px] shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-400 focus:ring-4 focus:ring-emerald-200 transition">
      <div className="flex items-center gap-3 mb-3 text-slate-900">{icon}<h2 className="text-2xl font-extrabold">{title}</h2></div>
      <div className="text-lg leading-relaxed text-slate-700">{children}</div>
    </button>
  );
}
function Input(props) { return <input {...props} className="w-full border rounded-2xl p-4 mt-1 text-lg bg-white text-slate-900" />; }
function Select({ children, ...props }) { return <select {...props} className="w-full border rounded-2xl p-4 mt-1 text-lg bg-white text-slate-900">{children}</select>; }
function TextArea(props) { return <textarea {...props} className="w-full border rounded-2xl p-4 mt-1 text-lg bg-white text-slate-900" />; }
function Btn({ children, className = "", ...props }) { return <button type="button" {...props} className={`rounded-2xl px-5 py-4 text-lg font-extrabold disabled:opacity-50 ${className}`}>{children}</button>; }
function Panel({ title, children }) { return <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-slate-900"><h2 className="text-3xl font-extrabold mb-5">{title}</h2>{children}</div>; }
function List({ items, empty, children }) { return !items?.length ? <p className="text-slate-500 text-lg">{empty}</p> : <div className="space-y-4">{items.map(item => <div key={item.id} className="border rounded-2xl p-5 bg-white">{children(item)}</div>)}</div>; }
function Field({ label, children }) { return <label className="block"><span className="font-bold text-slate-700">{label}</span>{children}</label>; }

function MediaBlock({ audio_url, video_url, source_url }) {
  const ytId = getYouTubeId(source_url || video_url || audio_url);
  return (
    <div className="mt-4 space-y-4">
      {ytId && <div className="overflow-hidden rounded-2xl bg-black"><iframe width="100%" height="315" src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`} title="YouTube content" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}
      {audio_url && !getYouTubeId(audio_url) && <audio controls className="w-full" src={makeMediaUrl(audio_url)} />}
      {video_url && !getYouTubeId(video_url) && <video controls className="w-full rounded-2xl bg-black" src={makeMediaUrl(video_url)} />}
      {source_url && <a className="inline-block underline font-bold text-emerald-700" href={source_url} target="_blank" rel="noreferrer">Open free source link</a>}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [mode, setMode] = useState("login");
  const [active, setActive] = useState("home");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [highContrast, setHighContrast] = useState(localStorage.getItem("highContrast") === "true");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [reg, setReg] = useState({ full_name: "", email: "", phone: "", password: "", role: "senior", religion_preference: "Hindu", preferred_language: "Tamil", care_setting: "home" });
  const [prayers, setPrayers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicineLogs, setMedicineLogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [careRequests, setCareRequests] = useState([]);
  const [checkHistory, setCheckHistory] = useState([]);
  const [assignedSeniors, setAssignedSeniors] = useState([]);
  const [allSeniors, setAllSeniors] = useState([]);
  const [allCaregivers, setAllCaregivers] = useState([]);
  const [adminPrayers, setAdminPrayers] = useState([]);
  const [adminExercises, setAdminExercises] = useState([]);

  const today = new Date().toISOString().slice(0, 10);
  const [medicineForm, setMedicineForm] = useState({
    senior_id: "",
    medicine_name: "",
    dosage: "",

    morning: true,
    afternoon: false,
    night: false,

    frequency: "daily",
    
    start_date: today,
    end_date: "",

    prescribed_by: "",
    notes: "",
    instructions: ""
  });
  const [assignForm, setAssignForm] = useState({ caregiver_id: "", senior_id: "" });
  const [contactForm, setContactForm] = useState({ name: "", relation: "", phone: "", is_primary: true });
  const [careForm, setCareForm] = useState({ request_type: "doctor", description: "", preferred_time: "" });
  const [checkForm, setCheckForm] = useState({ mood: "normal", pain_level: 0, notes: "I am okay today" });
  const [prayerForm, setPrayerForm] = useState({ id: null, title: "", religion: "Hindu", language: "Tamil", content_text: "", audio_url: "", source_url: "" });
  const [exerciseForm, setExerciseForm] = useState({ id: null, title: "", description: "", category: "chair_yoga", difficulty: "beginner", duration_minutes: 10, language: "Tamil", audio_url: "", video_url: "", source_url: "" });

  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === "admin";
  const isSenior = userRole === "senior";
  const isCaregiver = userRole === "caregiver";

  function ok(m) { setMessage(m); setError(""); }
  function showError(e) { setError(e.message || String(e)); setMessage(""); }
  function toggleContrast() { const next = !highContrast; setHighContrast(next); localStorage.setItem("highContrast", String(next)); }

  async function login() {
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(loginForm) });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      setActive("home");
      ok(`Welcome ${data.user.full_name}`);
    } catch (e) { showError(e); }
  }
  async function register() {
    try {
      const data = await api("/auth/register", { method: "POST", body: JSON.stringify(reg) });
      ok(`Registered ${data.full_name}. Please login now.`);
      setMode("login");
      setLoginForm({ email: reg.email, password: reg.password });
    } catch (e) { showError(e); }
  }
  function logout() { localStorage.clear(); setToken(null); setUser(null); setActive("home"); }

  async function loadPrayers() { try { setPrayers(await api("/prayers/my")); } catch (e) { showError(e); } }
  async function loadExercises() { try { setExercises(await api("/exercises/my")); } catch (e) { showError(e); } }
  async function loadMedicines() { try { setMedicines(await api("/medicines/my")); } catch (e) { showError(e); } }
  async function loadMedicineHistory() { try { setMedicineLogs(await api("/medicines/history")); } catch (e) { showError(e); } }
  async function loadContacts() { try { setContacts(await api("/emergency/contacts")); } catch (e) { showError(e); } }
  async function loadCareRequests() { try { setCareRequests(await api("/care-requests")); } catch (e) { showError(e); } }
  async function loadCheckHistory() { try { setCheckHistory(await api("/checkins/history")); } catch (e) { showError(e); } }
  async function loadAssignedSeniors() { try { setAssignedSeniors(await api("/caregivers/my-seniors")); } catch (e) { showError(e); } }
  async function loadAdminUsers() { try { setAllSeniors(await api("/users?role=senior&include_inactive=true")); setAllCaregivers(await api("/users?role=caregiver&include_inactive=true")); } catch (e) { showError(e); } }
  async function loadAdminContent() { try { setAdminPrayers(await api("/prayers/admin")); setAdminExercises(await api("/exercises/admin")); } catch (e) { showError(e); } }

  useEffect(() => {
    if (!token) return;
    if (active === "prayers") loadPrayers();
    if (active === "exercises") loadExercises();
    if (active === "medicine") { loadMedicines(); loadMedicineHistory(); if (isCaregiver) loadAssignedSeniors(); }
    if (active === "emergency") loadContacts();
    if (active === "homecare") loadCareRequests();
    if (active === "checkin") loadCheckHistory();
    if (active === "admin" && isAdmin) { loadAdminUsers(); loadAdminContent(); loadCareRequests(); }
  }, [active, token, isCaregiver, isAdmin]);

  useEffect(() => { if (token && isCaregiver) loadAssignedSeniors(); }, [token, isCaregiver]);

  async function addMedicine() {
    try {
      if (!medicineForm.senior_id) {
        throw new Error("Please select a senior.");
      }
      if (!medicineForm.medicine_name.trim()) {
        throw new Error("Please enter medicine name.");
      }
      if (!medicineForm.dosage.trim()) {
        throw new Error("Please enter dosage.");
      }
      if (!medicineForm.morning && !medicineForm.afternoon && !medicineForm.night) {
        throw new Error("Please select at least one schedule: Morning, Afternoon, or Night.");
      }

      const payload = {
        ...medicineForm,
        senior_id: Number(medicineForm.senior_id),
        end_date: medicineForm.end_date || null,
        prescribed_by: medicineForm.prescribed_by || null,
        notes: medicineForm.notes || null,
        instructions: medicineForm.instructions || null,
      };

      await api("/medicines", { method: "POST", body: JSON.stringify(payload) });
      ok("Medicine reminder added for the selected senior.");

      setMedicineForm({
        senior_id: "",
        medicine_name: "",
        dosage: "",
        morning: true,
        afternoon: false,
        night: false,
        frequency: "daily",
        start_date: today,
        end_date: "",
        prescribed_by: "",
        notes: "",
        instructions: "",
      });

      loadMedicines();
    } catch (e) { showError(e); }
  }
  async function markTaken(id) { try { await api(`/medicines/${id}/mark-taken`, { method: "POST", body: JSON.stringify({ status: "taken", remarks: "Taken today" }) }); ok("Medicine marked as taken."); loadMedicines(); loadMedicineHistory(); } catch (e) { showError(e); } }
  async function assignCaregiver() { try { await api("/caregivers/assignments", { method: "POST", body: JSON.stringify({ caregiver_id: Number(assignForm.caregiver_id), senior_id: Number(assignForm.senior_id) }) }); ok("Caregiver assigned to senior."); setAssignForm({ caregiver_id: "", senior_id: "" }); } catch (e) { showError(e); } }
  async function completeExercise(id) { try { await api("/exercises/complete", { method: "POST", body: JSON.stringify({ activity_id: id, completed_on: today }) }); ok("Exercise marked completed."); } catch (e) { showError(e); } }
  async function checkin() { try { await api("/checkins", { method: "POST", body: JSON.stringify({ checkin_date: today, ...checkForm }) }); ok("Daily check-in completed."); loadCheckHistory(); } catch (e) { showError(e); } }
  async function sos() { try { await api("/emergency/sos", { method: "POST", body: JSON.stringify({ message: "Emergency help needed. Please contact family/caregiver immediately." }) }); ok("SOS alert saved. In serious emergency, call 112 or 108 immediately."); } catch (e) { showError(e); } }
  async function addContact() { try { await api("/emergency/contacts", { method: "POST", body: JSON.stringify(contactForm) }); ok("Emergency contact added."); setContactForm({ name: "", relation: "", phone: "", is_primary: true }); loadContacts(); } catch (e) { showError(e); } }
  async function addCareRequest() { try { await api("/care-requests", { method: "POST", body: JSON.stringify({ ...careForm, preferred_time: careForm.preferred_time ? new Date(careForm.preferred_time).toISOString() : null }) }); ok("Home care request submitted."); setCareForm({ request_type: "doctor", description: "", preferred_time: "" }); loadCareRequests(); } catch (e) { showError(e); } }
  async function updateCareRequestStatus(id, status) { try { await api(`/care-requests/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); ok("Home care request status updated."); loadCareRequests(); } catch (e) { showError(e); } }
  async function uploadMedia(file, setUrl) { try { const fd = new FormData(); fd.append("file", file); const data = await api("/media/upload", { method: "POST", body: fd }); setUrl(data.url); ok("Media uploaded."); } catch (e) { showError(e); } }
  async function savePrayer() { try { const { id, ...payload } = prayerForm; id ? await api(`/prayers/${id}`, { method: "PUT", body: JSON.stringify(payload) }) : await api("/prayers", { method: "POST", body: JSON.stringify(payload) }); ok(id ? "Prayer updated." : "Prayer added."); setPrayerForm({ id: null, title: "", religion: "Hindu", language: "Tamil", content_text: "", audio_url: "", source_url: "" }); loadAdminContent(); } catch (e) { showError(e); } }
  async function deletePrayer(id) { try { await api(`/prayers/${id}`, { method: "DELETE" }); ok("Prayer deactivated."); loadAdminContent(); } catch (e) { showError(e); } }
  async function saveExercise() { try { const { id, ...payload } = { ...exerciseForm, duration_minutes: Number(exerciseForm.duration_minutes) }; id ? await api(`/exercises/${id}`, { method: "PUT", body: JSON.stringify(payload) }) : await api("/exercises", { method: "POST", body: JSON.stringify(payload) }); ok(id ? "Exercise updated." : "Exercise added."); setExerciseForm({ id: null, title: "", description: "", category: "chair_yoga", difficulty: "beginner", duration_minutes: 10, language: "Tamil", audio_url: "", video_url: "", source_url: "" }); loadAdminContent(); } catch (e) { showError(e); } }
  async function deleteExercise(id) { try { await api(`/exercises/${id}`, { method: "DELETE" }); ok("Exercise deactivated."); loadAdminContent(); } catch (e) { showError(e); } }
  async function deactivateUser(id) { try { await api(`/users/${id}`, { method: "DELETE" }); ok("User deactivated."); loadAdminUsers(); } catch (e) { showError(e); } }

  const headerText = useMemo(() => user?.preferred_language === "Tamil" ? "இந்தியா மையப்படுத்திய மூத்தோர் பராமரிப்பு செயலி" : user?.preferred_language === "Hindi" ? "भारत के वरिष्ठ नागरिकों के लिए देखभाल ऐप" : "India-focused care app for seniors at home or in old age homes.", [user]);
  const rootClass = highContrast ? "min-h-screen p-4 md:p-8 bg-black text-white" : "min-h-screen p-4 md:p-8 bg-slate-50 text-slate-950";

  return (
    <main className={rootClass}>
      <section className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-3xl p-7 mb-6 shadow-lg">
          <div className="flex justify-between gap-4 items-start">
            <div><h1 className="text-4xl md:text-6xl font-black">Senior Care Companion</h1><p className="mt-3 text-xl">{headerText}</p></div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Btn onClick={toggleContrast} className="bg-yellow-300 text-slate-900"><Contrast className="inline h-5"/> {t(user,"highContrast")}</Btn>
              {token && <Btn onClick={logout} className="bg-white text-emerald-800">Logout</Btn>}
            </div>
          </div>
        </div>
        {message && <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 text-lg text-green-900">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-lg text-red-900">{error}</div>}
        {!token && <AuthPanel mode={mode} setMode={setMode} loginForm={loginForm} setLoginForm={setLoginForm} login={login} reg={reg} setReg={setReg} register={register} />}
        {token && <div className="bg-white border rounded-2xl p-4 mb-4 text-lg text-slate-900">Welcome <b>{user?.full_name}</b> ({user?.role})</div>}
        {token && <div className="flex flex-wrap gap-3 mb-5"><Btn onClick={() => setActive("home")} className="bg-slate-900 text-white"><Home className="inline h-5"/> {t(user,"home")}</Btn>{isAdmin && <Btn onClick={() => setActive("admin")} className="bg-purple-700 text-white"><ShieldCheck className="inline h-5"/> Admin</Btn>}</div>}

        {(!token || active === "home") && (token && isCaregiver ? <MedicinePanel user={user} isCaregiver assignedSeniors={assignedSeniors} medicineForm={medicineForm} setMedicineForm={setMedicineForm} addMedicine={addMedicine} medicines={medicines} markTaken={markTaken} medicineLogs={medicineLogs} t={t} /> : <HomeCards token={token} setActive={setActive} setMode={setMode} user={user} />)}
        {active === "prayers" && !isCaregiver && <PrayerPanel user={user} prayers={prayers} loadPrayers={loadPrayers} />}
        {active === "exercises" && !isCaregiver && <ExercisePanel user={user} exercises={exercises} loadExercises={loadExercises} completeExercise={completeExercise} isSenior={isSenior} />}
        {active === "medicine" && <MedicinePanel user={user} isCaregiver={isCaregiver} assignedSeniors={assignedSeniors} medicineForm={medicineForm} setMedicineForm={setMedicineForm} addMedicine={addMedicine} medicines={medicines} markTaken={markTaken} medicineLogs={medicineLogs} t={t} />}
        {active === "checkin" && !isCaregiver && <CheckInPanel user={user} checkForm={checkForm} setCheckForm={setCheckForm} checkin={checkin} checkHistory={checkHistory} />}
        {active === "emergency" && !isCaregiver && <EmergencyPanel user={user} contacts={contacts} contactForm={contactForm} setContactForm={setContactForm} addContact={addContact} sos={sos} />}
        {active === "homecare" && !isCaregiver && <HomeCarePanel user={user} careForm={careForm} setCareForm={setCareForm} addCareRequest={addCareRequest} careRequests={careRequests} />}
        {active === "admin" && isAdmin && <AdminPanel allSeniors={allSeniors} allCaregivers={allCaregivers} assignForm={assignForm} setAssignForm={setAssignForm} assignCaregiver={assignCaregiver} prayerForm={prayerForm} setPrayerForm={setPrayerForm} exerciseForm={exerciseForm} setExerciseForm={setExerciseForm} uploadMedia={uploadMedia} savePrayer={savePrayer} saveExercise={saveExercise} adminPrayers={adminPrayers} adminExercises={adminExercises} deletePrayer={deletePrayer} deleteExercise={deleteExercise} deactivateUser={deactivateUser} careRequests={careRequests} updateCareRequestStatus={updateCareRequestStatus} />}
      </section>
    </main>
  );
}

function HomeCards({ token, setActive, setMode, user }) {
  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
    <Card onClick={() => token ? setActive("exercises") : setMode("register")} icon={<Dumbbell size={32} />} title={t(user, "exercises")}>Chair exercises and safe elderly-friendly YouTube videos.</Card>
    <Card onClick={() => token ? setActive("prayers") : setMode("register")} icon={<HandHeart size={32} />} title={t(user, "prayers")}>Religion and language-based prayer videos are shown after login.</Card>
    <Card onClick={() => token ? setActive("medicine") : setMode("register")} icon={<Pill size={32} />} title={t(user, "medicine")}>Senior can view medicines and mark them as taken.</Card>
    <Card onClick={() => token ? setActive("checkin") : setMode("register")} icon={<HeartPulse size={32} />} title={t(user, "checkin")}>Simple mood and pain-level check.</Card>
    <Card onClick={() => token ? setActive("emergency") : setMode("register")} icon={<PhoneCall size={32} />} title={t(user, "emergency")}>Family contacts, call, WhatsApp, 112 and 108.</Card>
    <Card onClick={() => token ? setActive("homecare") : setMode("register")} icon={<Stethoscope size={32} />} title={t(user, "homecare")}>Request doctor, nurse, or physiotherapist home visit.</Card>
  </div>;
}

function AuthPanel({ mode, setMode, loginForm, setLoginForm, login, reg, setReg, register }) {
  return <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm text-slate-900"><h2 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h2><button onClick={() => setMode(mode === "login" ? "register" : "login")}className="text-emerald-700 underline">{mode === "login"? "New user? Register here": "Already registered? Login here"}</button>{mode === "login" ? <div className="grid md:grid-cols-3 gap-4"><Input placeholder="Email" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/><Input type="password" placeholder="Password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/><Btn onClick={login} className="bg-emerald-700 text-white">Login</Btn></div> : <div><h2 className="font-black text-2xl mb-4">Register Senior / Caregiver / Admin</h2><div className="grid md:grid-cols-3 gap-4"><Input placeholder="Full name" value={reg.full_name} onChange={e=>setReg({...reg,full_name:e.target.value})}/><Input placeholder="Email" value={reg.email} onChange={e=>setReg({...reg,email:e.target.value})}/><Input placeholder="Phone" value={reg.phone} onChange={e=>setReg({...reg,phone:e.target.value})}/><Input type="password" placeholder="Password" value={reg.password} onChange={e=>setReg({...reg,password:e.target.value})}/><Select value={reg.role} onChange={e=>setReg({...reg,role:e.target.value})}><option value="senior">Senior</option><option value="caregiver">Caregiver</option><option value="admin">Admin</option></Select><Select value={reg.care_setting} onChange={e=>setReg({...reg,care_setting:e.target.value})}>{careSettings.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</Select><Select value={reg.religion_preference} onChange={e=>setReg({...reg,religion_preference:e.target.value})}>{religions.map(r=><option key={r}>{r}</option>)}</Select><Select value={reg.preferred_language} onChange={e=>setReg({...reg,preferred_language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><Btn onClick={register} className="bg-emerald-700 text-white">Register</Btn></div></div>}</div>;
}

function PrayerPanel({ user, prayers, loadPrayers }) { return <Panel title={`${t(user,"prayers")} - ${user?.religion_preference} / ${user?.preferred_language}`}><Btn onClick={loadPrayers} className="bg-emerald-700 text-white mb-4">Refresh prayers</Btn><List items={prayers} empty="No prayers added yet. Admin should add YouTube source links.">{p => <div><h3 className="font-black text-xl">{p.title}</h3><p className="text-slate-600">{p.religion} • {p.language}</p><p className="text-lg">{p.content_text}</p><MediaBlock {...p}/></div>}</List></Panel>; }
function ExercisePanel({ user, exercises, loadExercises, completeExercise, isSenior }) { return <Panel title={`${t(user,"exercises")} - ${user?.preferred_language}`}><Btn onClick={loadExercises} className="bg-emerald-700 text-white mb-4">Refresh exercises</Btn><List items={exercises} empty="No exercises added yet. Admin should add YouTube exercise links.">{x => <div><h3 className="font-black text-xl">{x.title}</h3><p className="text-slate-600">{x.category} • {x.difficulty} • {x.duration_minutes} min • {x.language}</p><p className="text-lg">{x.description}</p><MediaBlock {...x}/>{isSenior && <Btn onClick={()=>completeExercise(x.id)} className="bg-slate-900 text-white mt-3">I completed this</Btn>}</div>}</List></Panel>; }

function MedicinePanel({
  user,
  isCaregiver,
  assignedSeniors = [],
  medicineForm,
  setMedicineForm,
  addMedicine,
  medicines = [],
  markTaken,
  medicineLogs = [],
  t = (_user, key) => key,
}) {
  const schedulePattern = (m) =>
    `${m.morning ? 1 : 0}-${m.afternoon ? 1 : 0}-${m.night ? 1 : 0}`;

  return (
    <Panel title={t(user, "medicine")}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 text-lg">
        <b>Safety:</b> {t(user, "safety")}
      </div>

      {isCaregiver ? (
        <div className="bg-slate-50 rounded-2xl p-4 mb-5">
          <h3 className="font-black text-xl mb-3">
            Caregiver: add medicine for assigned senior
          </h3>

          <div className="grid md:grid-cols-3 gap-3">
            <Select
              value={medicineForm.senior_id}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  senior_id: e.target.value,
                })
              }
            >
              <option value="">{t(user, "selectSenior")}</option>
              {assignedSeniors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </Select>

            <Input
              placeholder="Medicine name"
              value={medicineForm.medicine_name}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  medicine_name: e.target.value,
                })
              }
            />

            <Input
              placeholder="Dosage e.g. 75mg, 500mg, 5ml"
              value={medicineForm.dosage}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  dosage: e.target.value,
                })
              }
            />

            <div className="md:col-span-3 flex flex-wrap gap-6 mt-2 bg-white border rounded-2xl p-4 text-lg">
              <label className="font-semibold">
                <input
                  type="checkbox"
                  checked={medicineForm.morning}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      morning: e.target.checked,
                    })
                  }
                />{" "}
                Morning
              </label>

              <label className="font-semibold">
                <input
                  type="checkbox"
                  checked={medicineForm.afternoon}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      afternoon: e.target.checked,
                    })
                  }
                />{" "}
                Afternoon
              </label>

              <label className="font-semibold">
                <input
                  type="checkbox"
                  checked={medicineForm.night}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      night: e.target.checked,
                    })
                  }
                />{" "}
                Night
              </label>

              <span className="font-bold text-emerald-700">
                Pattern:{" "}
                {`${medicineForm.morning ? 1 : 0}-${
                  medicineForm.afternoon ? 1 : 0
                }-${medicineForm.night ? 1 : 0}`}
              </span>
            </div>

            <Select
              value={medicineForm.frequency}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  frequency: e.target.value,
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="alternate_days">Alternate days</option>
              <option value="weekly">Weekly</option>
              <option value="as_needed">As needed</option>
            </Select>

            <Input
              type="date"
              value={medicineForm.start_date}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  start_date: e.target.value,
                })
              }
            />

            <Input
              type="date"
              value={medicineForm.end_date}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  end_date: e.target.value,
                })
              }
            />

            <Input
              placeholder="Prescribed by"
              value={medicineForm.prescribed_by}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  prescribed_by: e.target.value,
                })
              }
            />

            <Input
              placeholder="Instructions"
              value={medicineForm.instructions}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  instructions: e.target.value,
                })
              }
            />

            <TextArea
              placeholder="Notes"
              value={medicineForm.notes}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  notes: e.target.value,
                })
              }
            />

            <Btn
              onClick={addMedicine}
              className="bg-emerald-700 text-white md:col-span-3"
            >
              {t(user, "addMedicine")}
            </Btn>
          </div>
        </div>
      ) : (
        <p className="mb-5 text-lg text-slate-600">
          Medicine reminders can be added only by the caregiver. Seniors can
          view and mark medicine as taken.
        </p>
      )}

      <List items={medicines} empty="No medicine reminders.">
        {(m) => (
          <div>
            <b className="text-xl">{m.medicine_name}</b> - {m.dosage}

            <div className="font-bold text-emerald-700 mt-1">
              Schedule: {schedulePattern(m)}
            </div>

            <span>Frequency: {m.frequency}</span>
            <br />

            <span>
              Start: {m.start_date}
              {m.end_date ? ` | End: ${m.end_date}` : ""}
            </span>
            <br />

            {m.prescribed_by && (
              <span>
                Prescribed by: {m.prescribed_by}
                <br />
              </span>
            )}

            {m.instructions && (
              <span>
                Instructions: {m.instructions}
                <br />
              </span>
            )}

            {m.notes && (
              <span>
                Notes: {m.notes}
                <br />
              </span>
            )}

            <div className="text-red-700 font-bold mt-2">
              {m.safety_warning}
            </div>

            {user?.role === "senior" && (
              <Btn
                onClick={() => markTaken(m.id)}
                className="bg-slate-900 text-white mt-3"
              >
                Mark taken today
              </Btn>
            )}
          </div>
        )}
      </List>

      <h3 className="text-2xl font-black mt-8 mb-3">
        {t(user, "history")} - Taken Medicines
      </h3>

      <List items={medicineLogs} empty="No medicine taken history yet.">
        {(l) => (
          <div>
            Reminder ID: <b>{l.reminder_id || l.medicine_id}</b> • Date:{" "}
            <b>{l.taken_on || l.created_at}</b> • Status:{" "}
            {l.is_taken || l.status === "taken" ? "Taken" : "Not taken"}
          </div>
        )}
      </List>
    </Panel>
  );
}

function CheckInPanel({ user, checkForm, setCheckForm, checkin, checkHistory }) { return <Panel title={t(user,"checkin")}><div className="grid md:grid-cols-4 gap-3 mb-6"><Select value={checkForm.mood} onChange={e=>setCheckForm({...checkForm, mood:e.target.value})}><option>happy</option><option>normal</option><option>sad</option><option>anxious</option></Select><Input type="number" min="0" max="10" value={checkForm.pain_level} onChange={e=>setCheckForm({...checkForm, pain_level:Number(e.target.value)})}/><Input placeholder="Notes" value={checkForm.notes} onChange={e=>setCheckForm({...checkForm, notes:e.target.value})}/><Btn onClick={checkin} className="bg-emerald-700 text-white">Submit</Btn></div><h3 className="text-2xl font-black mb-3">Daily check-in history</h3><List items={checkHistory} empty="No check-in history yet.">{c => <div><b>{c.checkin_date}</b> • Mood: {c.mood} • Pain: {c.pain_level}/10<br/>{c.notes}</div>}</List></Panel>; }
function EmergencyPanel({ user, contacts, contactForm, setContactForm, addContact, sos }) { return <Panel title={t(user,"emergency")}><div className="bg-red-50 border border-red-200 p-5 rounded-2xl mb-5 text-lg"><b>India emergency numbers:</b><div className="flex flex-wrap gap-3 mt-3"><a className="rounded-2xl px-5 py-4 bg-red-600 text-white font-black" href="tel:112">Call 112</a><a className="rounded-2xl px-5 py-4 bg-red-600 text-white font-black" href="tel:108">Call 108 Ambulance</a><a className="rounded-2xl px-5 py-4 bg-red-600 text-white font-black" href="tel:100">Call 100 Police</a></div></div><Btn onClick={sos} className="bg-red-700 text-white mb-5">SOS Help</Btn><h3 className="font-black text-xl mb-3">Add Family / Caregiver Contact</h3><div className="grid md:grid-cols-4 gap-3 mb-5"><Input placeholder="Name" value={contactForm.name} onChange={e=>setContactForm({...contactForm, name:e.target.value})}/><Input placeholder="Relation" value={contactForm.relation} onChange={e=>setContactForm({...contactForm, relation:e.target.value})}/><Input placeholder="Phone" value={contactForm.phone} onChange={e=>setContactForm({...contactForm, phone:e.target.value})}/><Btn onClick={addContact} className="bg-emerald-700 text-white">Add contact</Btn></div><List items={contacts} empty="No contacts added.">{c => <div><b className="text-xl">{c.name}</b> ({c.relation}) - {c.phone}<div className="flex flex-wrap gap-2 mt-3"><a className="rounded-xl px-4 py-3 bg-slate-900 text-white font-bold" href={`tel:${c.phone}`}><Phone className="inline h-4"/> {t(user,"call")}</a><a className="rounded-xl px-4 py-3 bg-green-600 text-white font-bold" href={`https://wa.me/91${String(c.phone).replace(/\D/g, "").slice(-10)}?text=Emergency%20help%20needed`} target="_blank" rel="noreferrer">{t(user,"whatsapp")}</a></div></div>}</List></Panel>; }
function HomeCarePanel({ user, careForm, setCareForm, addCareRequest, careRequests }) { return <Panel title={t(user,"homecare")}><div className="grid md:grid-cols-4 gap-3 mb-4"><Select value={careForm.request_type} onChange={e=>setCareForm({...careForm, request_type:e.target.value})}><option value="doctor">Doctor</option><option value="nurse">Nurse</option><option value="physiotherapist">Physiotherapist</option></Select><Input placeholder="Description" value={careForm.description} onChange={e=>setCareForm({...careForm, description:e.target.value})}/><Input type="datetime-local" value={careForm.preferred_time} onChange={e=>setCareForm({...careForm, preferred_time:e.target.value})}/><Btn onClick={addCareRequest} className="bg-emerald-700 text-white">Submit</Btn></div><List items={careRequests} empty="No requests.">{r => <div><b>{r.request_type}</b> - {r.status}<br/>{r.description}</div>}</List></Panel>; }

function AdminPanel({ allSeniors, allCaregivers, assignForm, setAssignForm, assignCaregiver, prayerForm, setPrayerForm, exerciseForm, setExerciseForm, uploadMedia, savePrayer, saveExercise, adminPrayers, adminExercises, deletePrayer, deleteExercise, deactivateUser, careRequests, updateCareRequestStatus }) {
  return <Panel title="Admin Management"><div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5">Admin manages residents, caregivers, assignments, prayers, exercises, and home-care statuses. Admin cannot add personal medicine schedules.</div><div className="bg-slate-50 p-4 rounded-2xl mb-5"><h3 className="font-black text-xl mb-3">Assign caregiver to senior</h3><div className="grid md:grid-cols-3 gap-3"><Select value={assignForm.caregiver_id} onChange={e=>setAssignForm({...assignForm, caregiver_id:e.target.value})}><option value="">Select caregiver</option>{allCaregivers.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</Select><Select value={assignForm.senior_id} onChange={e=>setAssignForm({...assignForm, senior_id:e.target.value})}><option value="">Select senior</option>{allSeniors.map(s=><option key={s.id} value={s.id}>{s.full_name}</option>)}</Select><Btn onClick={assignCaregiver} className="bg-purple-700 text-white">Assign</Btn></div></div><div className="grid lg:grid-cols-2 gap-5"><div className="bg-slate-50 p-4 rounded-2xl"><h3 className="font-black text-xl mb-3">Add / Edit Prayer</h3><AdminPrayerForm form={prayerForm} setForm={setPrayerForm} uploadMedia={uploadMedia} savePrayer={savePrayer}/><AdminContentList title="Existing Prayers" items={adminPrayers} edit={setPrayerForm} remove={deletePrayer}/></div><div className="bg-slate-50 p-4 rounded-2xl"><h3 className="font-black text-xl mb-3">Add / Edit Exercise</h3><AdminExerciseForm form={exerciseForm} setForm={setExerciseForm} uploadMedia={uploadMedia} saveExercise={saveExercise}/><AdminContentList title="Existing Exercises" items={adminExercises} edit={setExerciseForm} remove={deleteExercise}/></div></div><AdminUsers allSeniors={allSeniors} allCaregivers={allCaregivers} deactivateUser={deactivateUser}/><AdminCareRequests careRequests={careRequests} updateCareRequestStatus={updateCareRequestStatus}/></Panel>;
}
function AdminContentList({ title, items, edit, remove }) { return <div className="mt-6"><h4 className="font-black text-lg mb-2">{title}</h4><List items={items} empty="No records.">{item => <div><b>{item.title}</b> {item.is_active ? "" : "(Inactive)"}<div className="flex gap-2 mt-2"><Btn onClick={()=>edit(item)} className="bg-slate-800 text-white">Edit</Btn><Btn onClick={()=>remove(item.id)} className="bg-red-700 text-white">Deactivate</Btn></div></div>}</List></div>; }
function AdminUsers({ allSeniors, allCaregivers, deactivateUser }) { return <div className="grid lg:grid-cols-2 gap-5 mt-6"><div className="bg-slate-50 p-4 rounded-2xl"><h3 className="font-black text-xl mb-3">Manage Seniors</h3><List items={allSeniors} empty="No seniors.">{u => <div>{u.full_name} • {u.email} • {u.is_active ? "Active" : "Inactive"}<Btn onClick={()=>deactivateUser(u.id)} className="bg-red-700 text-white mt-2">Deactivate</Btn></div>}</List></div><div className="bg-slate-50 p-4 rounded-2xl"><h3 className="font-black text-xl mb-3">Manage Caregivers</h3><List items={allCaregivers} empty="No caregivers.">{u => <div>{u.full_name} • {u.email} • {u.is_active ? "Active" : "Inactive"}<Btn onClick={()=>deactivateUser(u.id)} className="bg-red-700 text-white mt-2">Deactivate</Btn></div>}</List></div></div>; }
function AdminCareRequests({ careRequests, updateCareRequestStatus }) { return <div className="bg-slate-50 p-4 rounded-2xl mt-6"><h3 className="font-black text-xl mb-3">Home Care Requests</h3><List items={careRequests} empty="No home care requests.">{r => <div><b>{r.request_type}</b> • Senior ID: {r.senior_id} • Status: {r.status}<br/>{r.description}<div className="flex flex-wrap gap-2 mt-2">{["pending","accepted","completed","cancelled","rejected"].map(s=><Btn key={s} onClick={()=>updateCareRequestStatus(r.id, s)} className="bg-blue-700 text-white">{s}</Btn>)}</div></div>}</List></div>; }
function AdminPrayerForm({ form, setForm, uploadMedia, savePrayer }) { return <div className="space-y-3"><Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><Select value={form.religion} onChange={e=>setForm({...form,religion:e.target.value})}>{religions.map(r=><option key={r}>{r}</option>)}</Select><Select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><TextArea placeholder="Prayer text / positive thought" value={form.content_text} onChange={e=>setForm({...form,content_text:e.target.value})}/><Input placeholder="Direct audio URL / uploaded URL only" value={form.audio_url || ""} onChange={e=>setForm({...form,audio_url:e.target.value})}/><Input placeholder="YouTube or free source URL" value={form.source_url || ""} onChange={e=>setForm({...form,source_url:e.target.value})}/><Field label="Upload prayer audio"><input type="file" accept="audio/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,audio_url:url}))}/></Field><Btn onClick={savePrayer} className="bg-purple-700 text-white">{form.id ? "Update Prayer" : "Add Prayer"}</Btn></div>; }
function AdminExerciseForm({ form, setForm, uploadMedia, saveExercise }) { return <div className="space-y-3"><Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><TextArea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><Input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><Select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{languages.map(l=><option key={l}>{l}</option>)}</Select><Input type="number" placeholder="Duration minutes" value={form.duration_minutes} onChange={e=>setForm({...form,duration_minutes:e.target.value})}/><Input placeholder="Direct audio URL / uploaded URL" value={form.audio_url || ""} onChange={e=>setForm({...form,audio_url:e.target.value})}/><Input placeholder="Direct video URL / uploaded URL" value={form.video_url || ""} onChange={e=>setForm({...form,video_url:e.target.value})}/><Input placeholder="YouTube or free source URL" value={form.source_url || ""} onChange={e=>setForm({...form,source_url:e.target.value})}/><Field label="Upload exercise audio"><input type="file" accept="audio/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,audio_url:url}))}/></Field><Field label="Upload exercise video"><input type="file" accept="video/*" onChange={e=>e.target.files[0] && uploadMedia(e.target.files[0], url=>setForm({...form,video_url:url}))}/></Field><Btn onClick={saveExercise} className="bg-purple-700 text-white">{form.id ? "Update Exercise" : "Add Exercise"}</Btn></div>; }

createRoot(document.getElementById("root")).render(<App />);
