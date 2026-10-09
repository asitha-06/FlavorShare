import React, { useEffect, useState } from 'react';
import { supabase } from '../lib_supabase';
import { useApp } from '../context/AppContext';

const SIGNUP_COOLDOWN_SECONDS = 60;

export default function Auth({ mode, onSuccess, setMode }) {
  const signup = mode === 'signup';
  const { notify } = useApp();
  const [form, setForm] = useState({ first: '', last: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => {
      setCooldown(value => value <= 1 ? 0 : value - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const email = form.username.trim().toLowerCase();
    if (!email || !form.password) {
      setError('Enter your email and password.');
      return;
    }
    if (signup && cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before trying Create account again. This is an email security limit from Supabase.`);
      return;
    }
    if (signup && (!form.first.trim() || form.password !== form.confirm)) {
      setError('Please complete the form and make sure passwords match.');
      return;
    }

    setBusy(true);
    try {
      if (signup) {
        const fullName = `${form.first.trim()} ${form.last.trim()}`.trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            data: {
              username: email.split('@')[0],
              display_name: fullName
            }
          }
        });

        if (error) {
          const message = error.message || '';
          if (/security purposes|after \d+ seconds|rate limit|too many requests/i.test(message)) {
            setCooldown(SIGNUP_COOLDOWN_SECONDS);
            setError('Supabase is temporarily rate-limiting signup emails. Wait about 60 seconds, then try once. Do not repeatedly click Create account.');
          } else if (/already registered|already exists/i.test(message)) {
            setError('This email is already registered. Switch to Login and use this email and password.');
          } else {
            setError(message || 'Could not create the account.');
          }
          return;
        }

        if (!data.session) {
          // Supabase email confirmation is enabled: only one confirmation email
          // should be requested at a time.
          setCooldown(SIGNUP_COOLDOWN_SECONDS);
          notify('Account created. Check your email to confirm it, then log in.');
          setError('Account created. Check your email for the confirmation link, then use Login.');
        } else {
          onSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: form.password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setError('');
    setCooldown(0);
    setMode(signup ? 'login' : 'signup');
  };

  return (
    <main className="auth-page">
      <div className="auth-doodle">✦</div>
      <div className="auth-card">
        <img className="auth-logo" src="/logo.svg" alt="" />
        <span className="kicker">a little kitchen on your screen</span>
        <h1>{signup ? 'Come cook with us.' : 'Welcome back.'}</h1>
        <p>{signup ? 'Create your FlavorShare kitchen corner.' : 'Your recipes are waiting at the table.'}</p>

        <form onSubmit={submit}>
          {signup && (
            <div className="two-inputs">
              <input placeholder="First name" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} />
              <input placeholder="Last name" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} />
            </div>
          )}
          <input type="email" placeholder="Email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {signup && <input type="password" placeholder="Confirm password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />}

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" disabled={busy || (signup && cooldown > 0)}>
            {busy ? 'Please wait…' : signup && cooldown > 0 ? `Try again in ${cooldown}s` : signup ? 'Create account' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          {signup ? 'Already have an account?' : 'New to FlavorShare?'}
          <button type="button" onClick={switchMode}>{signup ? 'Login' : 'Sign up'}</button>
        </div>
      </div>
    </main>
  );
}
