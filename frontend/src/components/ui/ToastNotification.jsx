import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { Mail, MessageSquare, Phone, Bell, X, CheckCircle, Eye, MousePointer, Info, AlertTriangle } from 'lucide-react';

const ToastItem = ({ notif, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine Icon & Colors based on type & status
  let Icon = Info;
  let statusColor = 'text-primary bg-indigo-50 border-indigo-100';
  let badgeText = notif.status;
  
  if (notif.type === 'campaign') {
    Icon = Bell;
    if (notif.status === 'running') {
      statusColor = 'text-warning bg-amber-50 border-amber-100';
    } else if (notif.status === 'completed') {
      statusColor = 'text-success bg-green-50 border-green-100';
    } else {
      statusColor = 'text-danger bg-red-50 border-red-100';
    }
  } else {
    // Channel icons
    const channelLower = notif.channel?.toLowerCase();
    if (channelLower === 'email') Icon = Mail;
    else if (channelLower === 'sms') Icon = MessageSquare;
    else if (channelLower === 'whatsapp') Icon = Phone;
    
    // Status colors
    const statusLower = notif.status?.toLowerCase();
    if (statusLower === 'sent') {
      statusColor = 'text-primary bg-indigo-50 border-indigo-100';
    } else if (statusLower === 'delivered') {
      statusColor = 'text-blue-500 bg-blue-50 border-blue-100';
      Icon = CheckCircle;
    } else if (statusLower === 'opened' || statusLower === 'read') {
      statusColor = 'text-purple-500 bg-purple-50 border-purple-100';
      Icon = Eye;
    } else if (statusLower === 'clicked') {
      statusColor = 'text-teal-600 bg-teal-50 border-teal-100';
      Icon = MousePointer;
    } else if (statusLower === 'failed') {
      statusColor = 'text-red-500 bg-red-50 border-red-100';
      Icon = AlertTriangle;
    }
  }

  return (
    <div className="animate-slide-in relative flex flex-col w-80 md:w-96 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-card overflow-hidden pointer-events-auto">
      <div className="p-4 flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl border flex items-center justify-center ${statusColor} shrink-0`}>
          <Icon size={18} />
        </div>
        
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {notif.type === 'campaign' ? 'Campaign Update' : `${notif.channel} Receipt`}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          
          <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
            {notif.type === 'campaign' ? notif.name : notif.campaignName}
          </h4>
          
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {notif.type === 'campaign' ? notif.message : (
              <span>
                Message to <strong className="text-slate-800 font-semibold">{notif.customerName}</strong> was <span className="font-semibold">{badgeText}</span>.
              </span>
            )}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      
      {/* Progress timer bar */}
      <div className="h-1 bg-slate-100 w-full overflow-hidden">
        <div className={`h-full animate-progress-bar ${
          notif.status === 'failed' ? 'bg-danger' : 
          ['opened', 'read'].includes(notif.status) ? 'bg-purple-500' :
          notif.status === 'clicked' ? 'bg-teal-500' :
          notif.status === 'delivered' ? 'bg-blue-500' :
          'bg-primary'
        }`} />
      </div>
    </div>
  );
};

export default function ToastNotification() {
  const { notifications, removeNotification } = useSocket();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
      {notifications.map((notif) => (
        <ToastItem 
          key={notif.id} 
          notif={notif} 
          onClose={() => removeNotification(notif.id)} 
        />
      ))}
    </div>
  );
}
