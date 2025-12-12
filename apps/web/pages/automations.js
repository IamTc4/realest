import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { Workflow, Mail, MessageSquare, Clock, ArrowRight, Zap, Play, Plus } from 'lucide-react';

const iconMap = {
    Mail: <Mail className="h-4 w-4 text-blue-500" />,
    MessageSquare: <MessageSquare className="h-4 w-4 text-green-500" />,
    Clock: <Clock className="h-4 w-4 text-gray-400" />,
    Play: <Play className="h-4 w-4 text-purple-500" />,
    Zap: <Zap className="h-4 w-4 text-yellow-500" />
};

const AutomationCard = ({ automation }) => {
    const steps = JSON.parse(automation.actions || '[]');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rounded-full ${automation.isActive ? 'bg-emerald-100' : 'bg-gray-100'}`}></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Workflow className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">{automation.name}</h3>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${automation.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${automation.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span>{automation.isActive ? 'Active' : 'Paused'}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trigger</div>
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
                        <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                        {automation.triggerType === 'STATUS_CHANGE' ? `Status Changed to '${automation.triggerValue}'` : automation.triggerType}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Workflow</div>
                    <div className="space-y-2">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                                {idx < steps.length - 1 && <div className="absolute left-6 mt-6 h-4 w-px bg-gray-200"></div>}
                                <div className="flex-shrink-0 w-6 flex justify-center">
                                    {iconMap[step.icon] || <Play className="h-4 w-4" />}
                                </div>
                                <span className="ml-2">{step.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="text-sm font-medium text-primary hover:text-emerald-700 flex items-center">
                        Edit Workflow <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const res = await api.get('/automations');
      setAutomations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Automation Workflows</h1>
              <p className="text-gray-500">Manage your automated responses and lead nurturing flows.</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
            <div>Loading...</div>
        ) : automations.map(automation => (
            <AutomationCard key={automation.id} automation={automation} />
        ))}
      </div>
    </Layout>
  );
}
