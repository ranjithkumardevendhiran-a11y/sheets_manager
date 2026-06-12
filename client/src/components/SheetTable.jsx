import { useMemo } from 'react';

export default function SheetTable({ headers, rows, searchQuery = '', editable = false, onCellChange, onAddRow, onDeleteRow }) {
  const filteredRows = useMemo(() => {
    if (!searchQuery?.trim()) return rows;

    const query = searchQuery.trim().toLowerCase();
    return rows.filter((row) =>
      row.some((cell) => String(cell ?? '').toLowerCase().includes(query))
    );
  }, [rows, searchQuery]);

  return (
    <div>
      {searchQuery?.trim() && (
        <p style={{ margin: '0 0 1rem', color: 'var(--muted)' }}>
          Showing {filteredRows.length} of {rows.length} matching rows.
        </p>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {editable && <th style={{ width: 60 }}>#</th>}
              {headers.map((header, index) => (
                <th key={`header-${index}`}>{header}</th>
              ))}
              {editable && <th style={{ width: 90 }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + (editable ? 2 : 0)} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No matching rows
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {editable && <td>{rowIndex + 1}</td>}
                  {headers.map((_, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`}>
                      {editable ? (
                        <input
                          value={row[colIndex] ?? ''}
                          onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
                        />
                      ) : (
                        String(row[colIndex] ?? '')
                      )}
                    </td>
                  ))}
                  {editable && (
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => onDeleteRow(rowIndex)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editable && (
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: '1rem' }}
          onClick={onAddRow}
        >
          Add Row
        </button>
      )}
    </div>
  );
}
