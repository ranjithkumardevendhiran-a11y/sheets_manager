import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import SheetTable from '../components/SheetTable.jsx';
import UploadSheet from '../components/UploadSheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sheetSearch, setSheetSearch] = useState('');
  const [tab, setTab] = useState('General');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSheets = async (searchTerm = '', tabFilter = 'All') => {
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());
    if (tabFilter && tabFilter !== 'All') query.append('tab', tabFilter);

    const response = await api.get(`/sheets?${query.toString()}`);
    setSheets(response.data);
  };

  const loadSheet = async (sheetId) => {
    const response = await api.get(`/sheets/${sheetId}`);
    setSelectedSheet(response.data);
    setTitle(response.data.title);
    setTab(response.data.tab || 'General');
    setHeaders(response.data.headers);
    setRows(response.data.rows);
    setSheetSearch('');
  };

  const tabOptions = useMemo(
    () => ['All', ...Array.from(new Set(sheets.map((sheet) => sheet.tab || 'General')))],
    [sheets]
  );

  useEffect(() => {
    loadSheets(search, selectedTab)
      .catch(() => setError('Failed to load sheets'))
      .finally(() => setLoading(false));
  }, []);

  const handleCellChange = (rowIndex, colIndex, value) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? row.map((cell, cellIndex) => (cellIndex === colIndex ? value : cell)) : row
      )
    );
  };

  const handleAddRow = () => {
    setRows((current) => [...current, headers.map(() => '')]);
  };

  const handleDeleteRow = (rowIndex) => {
    setRows((current) => current.filter((_, index) => index !== rowIndex));
  };

  const handleSave = async () => {
    if (!selectedSheet) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put(`/sheets/${selectedSheet._id}`, {
        title: title.trim() || selectedSheet.title,
        tab: tab.trim() || 'General',
        headers,
        rows,
      });
      setSelectedSheet(response.data);
      setMessage('Sheet saved successfully');
      await loadSheets(search, selectedTab);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sheet');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSheet = async () => {
    if (!selectedSheet) return;
    if (!window.confirm('Delete this sheet permanently?')) return;

    try {
      await api.delete(`/sheets/${selectedSheet._id}`);
      setSelectedSheet(null);
      setHeaders([]);
      setRows([]);
      setTitle('');
      await loadSheets();
      setMessage('Sheet deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sheet');
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn btn-secondary">Home</Link>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <UploadSheet
        onUploaded={async (sheet) => {
          await loadSheets();
          await loadSheet(sheet._id);
        }}
      />

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ marginTop: 0 }}>Uploaded Sheets</h2>
            <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
              Filter by tab or search keywords across titles and uploaded data.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', width: '100%', maxWidth: '28rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sheets..."
                className="field-input"
                style={{ flex: 1, minWidth: '12rem' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => loadSheets(search, selectedTab)}
              >
                Search
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {useMemo(() => ['All', ...Array.from(new Set(sheets.map((sheet) => sheet.tab || 'General')))], [sheets]).map((tabName) => (
                <button
                  type="button"
                  key={tabName}
                  className={`btn ${selectedTab === tabName ? 'btn-admin' : 'btn-secondary'}`}
                  onClick={() => {
                    setSelectedTab(tabName);
                    loadSheets(search, tabName);
                  }}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading sheets...</p>
        ) : sheets.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No sheets uploaded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {sheets.map((sheet) => (
              <button
                key={sheet._id}
                type="button"
                className="btn btn-secondary"
                style={{
                  textAlign: 'left',
                  border: selectedSheet?._id === sheet._id ? '2px solid var(--admin)' : '1px solid var(--border)',
                }}
                onClick={() => loadSheet(sheet._id)}
              >
                <strong>{sheet.title}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {sheet.tab ? `${sheet.tab} · ` : ''}{sheet.sourceType === 'google' ? 'Google Sheet' : 'File upload'} · Updated {new Date(sheet.updatedAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedSheet && (
        <section className="card sheet-open-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0 }}>Edit Sheet</h2>
              <span className="badge badge-admin" style={{ marginTop: '0.5rem' }}>Admin Edit Mode</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteSheet}>Delete Sheet</button>
            </div>
          </div>

          <div className="field" style={{ marginTop: '1rem' }}>
            <label htmlFor="edit-title">Sheet title</label>
            <input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="edit-tab">Sheet tab</label>
            <input id="edit-tab" value={tab} onChange={(e) => setTab(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="sheet-search">Search within sheet</label>
            <input
              id="sheet-search"
              value={sheetSearch}
              onChange={(e) => setSheetSearch(e.target.value)}
              placeholder="Search rows in this sheet"
            />
          </div>

          <SheetTable
            headers={headers}
            rows={rows}
            searchQuery={sheetSearch}
            editable
            onCellChange={handleCellChange}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
          />

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </section>
      )}
    </main>
  );
}
