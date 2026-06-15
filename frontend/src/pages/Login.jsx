import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { loginUser, forgotPassword, resetPassword } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password Modal States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = Email submission, 2 = Code and new password
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  // General page success feedback
  const [pageSuccess, setPageSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setPageSuccess('');
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Please enter your email.');
      return;
    }

    setResetLoading(true);
    setResetError('');
    try {
      const response = await forgotPassword(resetEmail);
      setSimulatedCode(response.data.resetToken);
      setResetStep(2);
    } catch (err) {
      console.error(err);
      setResetError(err.response?.data?.error || 'Failed to send reset code.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setResetError('Please fill in all fields.');
      return;
    }

    setResetLoading(true);
    setResetError('');
    try {
      await resetPassword({
        email: resetEmail,
        token: resetCode,
        password: newPassword
      });
      setShowResetModal(false);
      setPageSuccess('Password successfully reset! You can now log in.');
      setEmail(resetEmail);
      setPassword('');
    } catch (err) {
      console.error(err);
      setResetError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-card border-0">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-4 shadow-md">
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your Xeno CRM account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {pageSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 text-success rounded-lg text-sm font-medium">
            {pageSuccess}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="arjun@xenocrm.io"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <button 
                type="button" 
                onClick={() => {
                  setShowResetModal(true);
                  setResetStep(1);
                  setResetEmail('');
                  setResetCode('');
                  setNewPassword('');
                  setSimulatedCode('');
                  setResetError('');
                }} 
                className="text-xs text-primary font-bold hover:underline hover:text-indigo-600 bg-transparent border-0 outline-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-6 py-2.5">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </div>
      </Card>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Reset Password</h3>
              <button 
                onClick={() => setShowResetModal(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none bg-transparent border-0 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {resetError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
                {resetError}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="p-6 space-y-4">
                <p className="text-sm text-slate-500">
                  Enter the email address registered with your account to receive a simulation code.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="arjun@xenocrm.io"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowResetModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={resetLoading}>
                    {resetLoading ? 'Sending...' : 'Send Reset Code'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
                {/* Simulation Banner */}
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-primary text-sm font-semibold flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs text-indigo-600 uppercase tracking-wider">
                    <Sparkles size={12} /> SMS/Email Simulation
                  </span>
                  <span>Simulated reset code generated:</span>
                  <span className="text-xl font-mono tracking-widest text-indigo-700 font-bold mt-1">
                    {simulatedCode}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  We have simulated sending a code to your email. Enter the code below along with your new password.
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Simulated Code</label>
                  <input 
                    type="text" 
                    required
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono tracking-wider"
                    placeholder="Enter 6-digit code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setResetStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={resetLoading}>
                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}