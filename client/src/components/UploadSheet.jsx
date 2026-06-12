import { useState } from 'react';
import api from '../api';

export default function UploadSheet({ onUploaded }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [mode, setMode] = useState('file');
  const [tab, setTab] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please choose a CSV or Excel file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title.trim()) formData.append('title', title.trim());
      if (tab.trim()) formData.append('tab', tab.trim());

      const response = await api.post('/sheets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Sheet uploaded successfully');
      setFile(null);
      setTitle('');
      onUploaded(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleImport = async (event) => {
    event.preventDefault();
    if (!googleSheetUrl.trim()) {
      setError('Please enter a Google Sheet URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/sheets/import-google', {
        title: title.trim() || undefined,
        tab: tab.trim() || undefined,
        googleSheetUrl: googleSheetUrl.trim(),
      });

      setSuccess('Google Sheet imported successfully');
      setGoogleSheetUrl('');
      setTitle('');
      onUploaded(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Upload Sheet</h2>
      <p style={{ color: 'var(--muted)' }}>
        Upload an exported CSV/Excel file from Google Sheets, or import directly using a public Google Sheet URL.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className={`btn ${mode === 'file' ? 'btn-admin' : 'btn-secondary'}`}
          onClick={() => setMode('file')}
        >
          File Upload
        </button>
        <button
          type="button"
          className={`btn ${mode === 'google' ? 'btn-admin' : 'btn-secondary'}`}
          onClick={() => setMode('google')}
        >
          Google Sheet URL
        </button>
      </div>

      <div className="field">
        <label htmlFor="sheet-title">Sheet title (optional)</label>
        <input
          id="sheet-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sales Report Q1"
        />
      </div>
      <div className="field">
        <label htmlFor="sheet-tab">Upload tab</label>
        <input
          id="sheet-tab"
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          placeholder="e.g. Sales, Inventory, HR"
        />
      </div>

      {mode === 'file' ? (
        <form onSubmit={handleFileUpload}>
          <div className="field">
            <label htmlFor="sheet-file">CSV or Excel file</label>
            <input
              id="sheet-file"
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <button className="btn btn-admin" type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleGoogleImport}>
          <div className="field">
            <label htmlFor="google-url">Google Sheet URL</label>
            <input
              id="google-url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              required
            />
          </div>
          <button className="btn btn-admin" type="submit" disabled={loading}>
            {loading ? 'Importing...' : 'Import Google Sheet'}
          </button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </section>
  );
}
