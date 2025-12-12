import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Phone, Mail, MapPin, Calendar, Clock, User, Send, CheckSquare } from 'lucide-react';

const InteractionItem = ({ interaction }) => {
    const icons = {
        NOTE: <CheckSquare className="h-4 w-4" />,
        CALL: <Phone className="h-4 w-4" />,
        EMAIL: <Mail className="h-4 w-4" />,
        SITE_VISIT: <MapPin className="h-4 w-4" />,
        SYSTEM: <User className="h-4 w-4" />
    };
    return (
        <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-8 ring-white">
                {icons[interaction.type] || <CheckSquare className="h-4 w-4" />}
            </span>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="items-center justify-between mb-3 sm:flex">
                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                        {format(new Date(interaction.createdAt), 'MMM d, yyyy HH:mm')}
                    </time>
                    <div className="text-sm font-normal text-gray-500 lex">
                        <span className="font-semibold text-gray-900">{interaction.type}</span>
                    </div>
                </div>
                <div className="p-3 text-sm italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                    {interaction.content}
                </div>
            </div>
        </li>
    );
};

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addInteraction = async (e) => {
      e.preventDefault();
      if (!newNote.trim()) return;
      try {
          await api.post(`/leads/${id}/interaction`, {
              type: 'NOTE',
              content: newNote
          });
          setNewNote('');
          fetchLead();
      } catch (err) {
          console.error(err);
      }
  };

  const updateStatus = async (newStatus) => {
      try {
          await api.put(`/leads/${id}`, { status: newStatus });
          fetchLead();
      } catch (err) {
          console.error(err);
      }
  }

  if (loading || !lead) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                        {lead.name[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {lead.intent}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        {lead.location || 'No location preference'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Assigned: {lead.agent?.name || 'Unassigned'}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Lead Score</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${lead.score}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">{lead.score}/100</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline Status</h3>
                <div className="space-y-2">
                    {['NEW', 'CONTACTED', 'SITE_VISIT', 'NEGOTIATION', 'CLOSED_WON'].map((status, idx) => (
                        <button
                            key={status}
                            onClick={() => updateStatus(status)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                lead.status === status ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Note</h3>
                <form onSubmit={addInteraction} className="relative">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                        rows="3"
                        placeholder="Log a call, note, or update..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-full hover:bg-emerald-600 transition-colors"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Timeline</h3>
                <ol className="relative border-l border-gray-200 ml-4">
                    {lead.interactions?.map((interaction) => (
                        <InteractionItem key={interaction.id} interaction={interaction} />
                    ))}
                    <li className="mb-6 ml-6">
                         <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 rounded-full -left-4 ring-8 ring-white">
                            <User className="h-4 w-4" />
                        </span>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                             <time className="mb-1 text-xs font-normal text-gray-400">
                                {format(new Date(lead.createdAt), 'MMM d, yyyy HH:mm')}
                            </time>
                            <div className="text-sm font-normal text-gray-500">
                                Lead captured via {lead.source}
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
      </div>
    </Layout>
  );
}
