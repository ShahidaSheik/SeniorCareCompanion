import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HeartPulse, PhoneCall, Pill, Dumbbell, HandHeart, Stethoscope } from "lucide-react";
import "./index.css";
import { api } from "./api";

function Card({ icon, title, children }) {
  return <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <div className="flex items-center gap-3 mb-3 text-slate-800">{icon}<h2 className="text-xl font-bold">{title}</h2></div>
    {children}
  </div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("senior@example.com");
  const [password, setPassword] = useState("secret123");
  const [message, setMessage] = useState("");

  async function login() {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    setMessage(`Welcome ${data.user.full_name}`);
  }

  async function sos() {
    await api("/emergency/sos", { method: "POST", body: JSON.stringify({ message: "Emergency help needed" }) });
    setMessage("SOS alert saved. In a serious emergency, call 112 or 108 immediately.");
  }

  async function checkin() {
    const today = new Date().toISOString().slice(0, 10);
    await api("/checkins", { method: "POST", body: JSON.stringify({ checkin_date: today, mood: "normal", pain_level: 2, notes: "I am okay today" }) });
    setMessage("Daily check-in completed.");
  }

  return <main className="min-h-screen p-4 md:p-8">
    <section className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-7 mb-6 shadow-lg">
        <h1 className="text-3xl md:text-5xl font-extrabold">Senior Care Companion</h1>
        <p className="mt-3 text-lg">Simple mobile-friendly care app for body, mind, medicine, family support, and emergency safety.</p>
      </div>

      {!token && <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <h2 className="font-bold text-xl mb-3">Login</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="border rounded-xl p-3" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border rounded-xl p-3" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-emerald-600 text-white rounded-xl p-3 font-bold" onClick={login}>Login</button>
        </div>
      </div>}

      {message && <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">{message}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card icon={<Dumbbell />} title="Exercise / Yoga"><p>Chair exercises, breathing practice, beginner yoga, and completion tracking.</p></Card>
        <Card icon={<HandHeart />} title="Prayer Support"><p>Religion-based prayers, general positive thoughts, audio support, and meditation timer.</p></Card>
        <Card icon={<Pill />} title="Medicine"><p>Reminder list and medicine-taken logging for daily care monitoring.</p></Card>
        <Card icon={<HeartPulse />} title="Daily Check-in"><p>Quick mood and pain-level check to help family monitor well-being.</p><button onClick={checkin} className="mt-3 bg-slate-900 text-white rounded-xl px-4 py-2">I am okay today</button></Card>
        <Card icon={<PhoneCall />} title="Emergency SOS"><p>One-tap SOS alert. Also clearly display official emergency numbers.</p><button onClick={sos} className="mt-3 bg-red-600 text-white rounded-xl px-4 py-2 font-bold">SOS Help</button></Card>
        <Card icon={<Stethoscope />} title="Home Care"><p>Request doctor, nurse, or physiotherapist home visit.</p></Card>
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
