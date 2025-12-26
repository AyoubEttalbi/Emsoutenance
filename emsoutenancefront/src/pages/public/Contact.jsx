import { useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import api from "../../services/api"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-[#a0aec0] mb-8">
          Besoin d'aide ? Contactez l'administration ou envoyez-nous un message.
        </p>

        {success && (
          <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded mb-6">
            Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card glass p-6 rounded-lg space-y-4">
          <div>
            <label className="block mb-2">Votre nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#1a1f3a] border border-[#2d3748] text-white focus:border-blue-500 focus:outline-none"
              placeholder="Nom complet"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Votre email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#1a1f3a] border border-[#2d3748] text-white focus:border-blue-500 focus:outline-none"
              placeholder="vous@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Sujet</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#1a1f3a] border border-[#2d3748] text-white focus:border-blue-500 focus:outline-none"
              placeholder="Sujet du message"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#1a1f3a] border border-[#2d3748] text-white focus:border-blue-500 focus:outline-none"
              rows={5}
              placeholder="Votre message..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}