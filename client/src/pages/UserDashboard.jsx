import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SheetTable from '../components/SheetTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sheetSearch, setSheetSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSheets = async (searchTerm = '', tabFilter = 'All') => {
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());
    if (tabFilter && tabFilter !== 'All') query.append('tab', tabFilter);
    const response = await api.get(`/sheets?${query.toString()}`);
    setSheets(response.data);
  };

  useEffect(() => {
    loadSheets()
      .catch(() => setError('Failed to load sheets'))
      .finally(() => setLoading(false));
  }, []);

  const openSheet = async (sheetId) => {
    try {
      const response = await api.get(`/sheets/${sheetId}`);
      setSelectedSheet(response.data);
      setSheetSearch('');
    } catch {
      setError('Failed to load sheet data');
    }
  };

  const tabOptions = ['All', ...Array.from(new Set(sheets.map((sheet) => sheet.tab || 'General')))].filter(Boolean);

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>User Dashboard</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn btn-secondary">Home</Link>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Available Sheets</h2>
          <span className="badge badge-readonly">Read Only</span>
        </div>
        <p style={{ color: 'var(--muted)' }}>
          Search uploaded sheets and filter by tabs.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sheets..."
            className="field-input"
            style={{ flex: 1, minWidth: '12rem' }}
          />
          <button className="btn btn-primary" type="button" onClick={() => loadSheets(search, selectedTab)}>
            Search
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {tabOptions.map((tabName) => (
            <button
              key={tabName}
              className={`btn ${selectedTab === tabName ? 'btn-admin' : 'btn-secondary'}`}
              type="button"
              onClick={() => {
                setSelectedTab(tabName);
                loadSheets(search, tabName);
              }}
            >
              {tabName}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading sheets...</p>
        ) : sheets.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No sheets available yet. Please check back after an admin uploads data.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {sheets.map((sheet) => (
              <button
                key={sheet._id}
                type="button"
                className="btn btn-secondary"
                style={{
                  textAlign: 'left',
                  border: selectedSheet?._id === sheet._id ? '2px solid var(--user)' : '1px solid var(--border)',
                }}
                onClick={() => {
                  openSheet(sheet._id);
                  setSheetSearch('');
                }}
              >
                <strong>{sheet.title}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  Updated {new Date(sheet.updatedAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedSheet && (
        <section className="card sheet-open-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ marginTop: 0, flex: 1 }}>{selectedSheet.title}</h2>
            <div style={{ minWidth: '18rem' }}>
              <input
                value={sheetSearch}
                onChange={(e) => setSheetSearch(e.target.value)}
                placeholder="Search within sheet..."
                className="field-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <SheetTable
            headers={selectedSheet.headers}
            rows={selectedSheet.rows}
            searchQuery={sheetSearch}
            editable={false}
          />
        </section>
      )}

      {error && <p className="error">{error}</p>}
    </main>
  );
}
