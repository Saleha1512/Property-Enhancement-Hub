import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [session, setSession] = useState({ active: false, role: null, id: '' });
  const [authView, setAuthView] = useState('gateway');
  const [inputs, setInputs] = useState({ adminName: '', adminPass: '', phone: '', userPass: '', captcha: '' });
  const [propertyAge, setPropertyAge] = useState('');
  const [locationData, setLocationData] = useState({ city: '', state: '', postcode: '' });
  const [captchaValue, setCaptchaValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dynamicResults, setDynamicResults] = useState([]);

  const MASTER_DATABASE = [
    { id: 1, title: "Smart Home Integration", roi: "+5.2%", ageLimit: 5, effort: "1 Week", region: "All", detail: "IoT automation and AI security protocols." },
    { id: 2, title: "Modular Kitchen Upgrade", roi: "+8.5%", ageLimit: 12, effort: "3 Weeks", region: "All", detail: "Premium Italian-style cabinetry with ergonomic layouts." },
    { id: 3, title: "Solar Power Systems", roi: "+12.0%", ageLimit: 100, effort: "4 Weeks", region: "All", detail: "Sustainable PV energy harvesting solutions." },
    { id: 4, title: "Coastal Protection Coating", roi: "+18.0%", minAge: 5, effort: "2 Weeks", region: "Andhra Pradesh", detail: "Specialized anti-corrosive treatments for coastal properties." },
    { id: 5, title: "Earthquake Retrofitting", roi: "+14.0%", minAge: 10, effort: "6 Weeks", region: "Delhi", detail: "Seismic reinforcement for high-risk zones." },
    { id: 6, title: "Metropolitan Vertical Garden", roi: "+9.0%", minAge: 0, effort: "2 Weeks", region: "Karnataka", detail: "Space-saving greenery for urban Bengaluru apartments." }
  ];

  const refreshCaptcha = useCallback(() => {
    const code = Math.random().toString(36).toUpperCase().substring(2, 8);
    setCaptchaValue(code);
  }, []);

  useEffect(() => { refreshCaptcha(); }, [refreshCaptcha]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (inputs.captcha.toUpperCase() !== captchaValue) {
      setError("CAPTCHA Mismatch");
      return;
    }

    if (authView === 'admin_login') {
      if (/^[a-zA-Z]+@123$/.test(inputs.adminName) && inputs.adminPass === "admin123") {
        setSession({ active: true, role: 'admin', id: inputs.adminName });
        setError('');
      } else { setError("Invalid Admin Format. Use name@123."); }
    } else {
      if (inputs.phone.length === 10 && inputs.userPass === inputs.phone.slice(-4)) {
        setSession({ active: true, role: 'user', id: inputs.phone });
        setError('');
      } else { setError("Invalid Phone/Password (Last 4 digits)."); }
    }
  };

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const age = parseInt(propertyAge) || 0;
      const filtered = MASTER_DATABASE.filter(item => {
        const matchesAge = item.minAge ? age >= item.minAge : age <= item.ageLimit;
        const matchesRegion = item.region === "All" || item.region.toLowerCase() === locationData.state.toLowerCase();
        return matchesAge && matchesRegion;
      });
      setDynamicResults(filtered);
      setLoading(false);
    }, 1200);
  };

  if (!session.active) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="logo">GV PRO</h1>
          {authView === 'gateway' ? (
            <div className="portal-buttons">
              <button className="btn-portal" onClick={() => setAuthView('admin_login')}>Admin Portal</button>
              <button className="btn-portal user" onClick={() => setAuthView('user_login')}>Resident Access</button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="login-form">
              <h3>{authView === 'admin_login' ? 'Administrator' : 'User'} Login</h3>
              <input placeholder={authView === 'admin_login' ? "ID (name@123)" : "10-Digit Phone"} onChange={e => setInputs({ ...inputs, [authView === 'admin_login' ? 'adminName' : 'phone']: e.target.value })} required />
              <input type="password" placeholder="Password" onChange={e => setInputs({ ...inputs, [authView === 'admin_login' ? 'adminPass' : 'userPass']: e.target.value })} required />
              <div className="captcha-container">
                <div className="captcha-box">{captchaValue}</div>
                <button type="button" className="refresh-btn" onClick={refreshCaptcha}>↻</button>
              </div>
              <input placeholder="Verify CAPTCHA" onChange={e => setInputs({ ...inputs, captcha: e.target.value })} required />
              {error && <p className="error-text">{error}</p>}
              <button className="btn-primary" type="submit">Authenticate</button>
              <button type="button" className="back-btn" onClick={() => setAuthView('gateway')}>← Back</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">GV PRO</div>
        <div className="user-pill">{session.role.toUpperCase()}</div>
        <nav className="side-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item logout" onClick={() => setSession({ active: false })}>Terminate</button>
        </nav>
      </aside>
      <main className="main-content">
        <div className="dashboard-body">
          <div className="card analyzer-card">
            <h3>Asset Growth Profiler</h3>
            <div className="input-grid">
              <input placeholder="City" onChange={e => setLocationData({...locationData, city: e.target.value})} />
              <input placeholder="State (e.g. Andhra Pradesh)" onChange={e => setLocationData({...locationData, state: e.target.value})} />
              <input placeholder="Postcode" maxLength="6" onChange={e => setLocationData({...locationData, postcode: e.target.value})} />
              <input type="number" placeholder="Property Age" onChange={e => setPropertyAge(e.target.value)} />
            </div>
            <button className="btn-execute" onClick={runAnalysis}>{loading ? 'Analyzing...' : 'Execute Analysis'}</button>
          </div>
          <div className="results-grid">
            {dynamicResults.map(res => (
              <div key={res.id} className="modern-card">
                <div className="card-top"><span className="tag">⚡ {res.effort}</span><span className="roi">{res.roi} ROI</span></div>
                <h4>{res.title}</h4><p>{res.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;