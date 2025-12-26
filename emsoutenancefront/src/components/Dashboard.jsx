"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircleIcon, HourglassIcon, UsersIcon } from "./icons/ModernIcons"

export default function Dashboard({ setCurrentView }) {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { label: "Soutenances Planifiées", value: "24", icon: CalendarIcon, accent: "from-[#0066ff] to-[#00d4ff]" },
    { label: "Étudiants Inscrits", value: "156", icon: UsersIcon, accent: "from-[#00d4ff] to-[#00bcd4]" },
    { label: "Rapports Validés", value: "142", icon: CheckCircleIcon, accent: "from-[#10b981] to-[#34d399]" },
    { label: "En Attente", value: "14", icon: HourglassIcon, accent: "from-[#f59e0b] to-[#f97316]" },
  ]

  const upcomingSessions = [
    { date: "2024-11-15", time: "09:00", student: "Ahmed Ben Ali", room: "A101", status: "Confirmée" },
    { date: "2024-11-15", time: "10:30", student: "Fatima Zahra", room: "A102", status: "Confirmée" },
    { date: "2024-11-16", time: "14:00", student: "Mohamed Karim", room: "B201", status: "En attente" },
    { date: "2024-11-16", time: "15:30", student: "Leila Mansouri", room: "B202", status: "Confirmée" },
  ]

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-[#a0aec0]">Bienvenue sur votre tableau de bord de gestion</p>
          </div>
          <button onClick={() => setCurrentView("home")} className="btn-secondary">
            ← Retour
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card glass-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                </div>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.accent} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#2d3748] animate-fade-in-up">
          {["overview", "sessions", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition-all ${
                activeTab === tab ? "text-[#0066ff] border-b-2 border-[#0066ff]" : "text-[#a0aec0] hover:text-white"
              }`}
            >
              {tab === "overview" && "Aperçu"}
              {tab === "sessions" && "Soutenances"}
              {tab === "reports" && "Rapports"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in-up">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 card glass">
                <h3 className="text-xl font-bold mb-4">Prochaines Soutenances</h3>
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#252d4a] rounded-lg hover:bg-[#2d3748] transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{session.student}</p>
                        <p className="text-sm text-[#a0aec0]">
                          {session.date} à {session.time}
                        </p>
                      </div>
                      <span className="badge badge-success">{session.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card glass">
                <h3 className="text-xl font-bold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#a0aec0]">Taux de Validation</span>
                      <span className="font-bold">91%</span>
                    </div>
                    <div className="w-full bg-[#252d4a] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#0066ff] to-[#00d4ff] h-2 rounded-full"
                        style={{ width: "91%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#a0aec0]">Planification</span>
                      <span className="font-bold">88%</span>
                    </div>
                    <div className="w-full bg-[#252d4a] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#00d4ff] to-[#ff6b35] h-2 rounded-full"
                        style={{ width: "88%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="card glass">
              <h3 className="text-xl font-bold mb-6">Calendrier des Soutenances</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2d3748]">
                      <th className="text-left py-3 px-4 text-[#a0aec0] font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-[#a0aec0] font-semibold">Étudiant</th>
                      <th className="text-left py-3 px-4 text-[#a0aec0] font-semibold">Salle</th>
                      <th className="text-left py-3 px-4 text-[#a0aec0] font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingSessions.map((session, index) => (
                      <tr key={index} className="border-b border-[#2d3748] hover:bg-[#252d4a] transition-colors">
                        <td className="py-3 px-4">
                          {session.date} {session.time}
                        </td>
                        <td className="py-3 px-4">{session.student}</td>
                        <td className="py-3 px-4">{session.room}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`badge ${session.status === "Confirmée" ? "badge-success" : "badge-warning"}`}
                          >
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="card glass">
              <h3 className="text-xl font-bold mb-6">Gestion des Rapports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Rapports Soumis", count: "156", color: "from-[#0066ff]" },
                  { name: "En Révision", count: "12", color: "from-[#f59e0b]" },
                  { name: "Validés", count: "142", color: "from-[#10b981]" },
                  { name: "Rejetés", count: "2", color: "from-[#ef4444]" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${item.color} to-transparent p-6 rounded-lg border border-[#2d3748]`}
                  >
                    <p className="text-[#a0aec0] text-sm mb-2">{item.name}</p>
                    <p className="text-3xl font-bold">{item.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
