"use client";
import { useState } from "react";

const TABS = [
  { id: "search", label: "1. Buscar prospectos" },
  { id: "outreach", label: "2. Armar outreach" },
  { id: "meeting", label: "3. Preparar reunión" },
];

export default function Home() {
  const [tab, setTab] = useState("search");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [prospects, setProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState(null);

  // Outreach
  const [outreachBusiness, setOutreachBusiness] = useState("");
  const [outreachContext, setOutreachContext] = useState("");

  // Meeting
  const [meetingBusiness, setMeetingBusiness] = useState("");

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResult("");
    setProspects([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setProspects(data.prospects || []);
      setResult(data.analysis || "");
    } catch {
      setResult("Error al buscar. Revisá tu conexión.");
    }
    setLoading(false);
  }

  async function handleOutreach() {
    if (!outreachBusiness.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: outreachBusiness, context: outreachContext }),
      });
      const data = await res.json();
      setResult(data.email || "");
    } catch {
      setResult("Error al generar el mail.");
    }
    setLoading(false);
  }

  async function handleMeeting() {
    if (!meetingBusiness.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: meetingBusiness }),
      });
      const data = await res.json();
      setResult(data.brief || "");
    } catch {
      setResult("Error al generar el brief.");
    }
    setLoading(false);
  }

  function selectProspect(p) {
    setSelectedProspect(p);
    setOutreachBusiness(p.name + (p.website ? ` (${p.website})` : ""));
    setTab("outreach");
    setResult("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0066FF]">AyM Prospector</h1>
        <p className="text-gray-400 text-sm mt-1">Tu asistente comercial personalizado</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-[#0066FF] text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Buscar */}
      {tab === "search" && (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Ingresá un rubro y zona. Ej: <span className="text-[#0066FF]">restaurantes en Palermo</span> o <span className="text-[#0066FF]">clínicas dentales en Córdoba</span></p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rubro y zona..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF]"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#0066FF] hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {prospects.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Prospectos encontrados — hacé clic para armar el outreach</p>
              {prospects.map((p, i) => (
                <div
                  key={i}
                  onClick={() => selectProspect(p)}
                  className="bg-gray-800 border border-gray-700 hover:border-[#0066FF] rounded-lg px-4 py-3 cursor-pointer transition-colors"
                >
                  <p className="font-medium text-white">{p.name}</p>
                  {p.website && <p className="text-gray-400 text-sm">{p.website}</p>}
                  {p.description && <p className="text-gray-500 text-sm mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          )}

          {result && !prospects.length && (
            <ResultBox text={result} />
          )}

          {result && prospects.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Análisis del rubro</p>
              <ResultBox text={result} />
            </div>
          )}
        </div>
      )}

      {/* Tab: Outreach */}
      {tab === "outreach" && (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Ingresá el nombre del negocio o pegá su descripción. Te genero un mail frío personalizado.</p>
          <input
            type="text"
            value={outreachBusiness}
            onChange={(e) => setOutreachBusiness(e.target.value)}
            placeholder="Nombre del negocio o URL..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF]"
          />
          <textarea
            value={outreachContext}
            onChange={(e) => setOutreachContext(e.target.value)}
            placeholder="Contexto extra (opcional): qué viste en sus redes, qué problema tiene, etc."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF] resize-none"
          />
          <button
            onClick={handleOutreach}
            disabled={loading}
            className="bg-[#0066FF] hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Generando..." : "Generar mail"}
          </button>
          {result && <ResultBox text={result} />}
        </div>
      )}

      {/* Tab: Reunión */}
      {tab === "meeting" && (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Ingresá el negocio con el que te reunís. Te preparo un briefing para cerrar.</p>
          <input
            type="text"
            value={meetingBusiness}
            onChange={(e) => setMeetingBusiness(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMeeting()}
            placeholder="Nombre del negocio..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0066FF]"
          />
          <button
            onClick={handleMeeting}
            disabled={loading}
            className="bg-[#0066FF] hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Preparando..." : "Preparar reunión"}
          </button>
          {result && <ResultBox text={result} />}
        </div>
      )}
    </div>
  );
}

function ResultBox({ text }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative mt-4">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
      <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 text-sm whitespace-pre-wrap leading-relaxed pr-16">
        {text}
      </pre>
    </div>
  );
}
