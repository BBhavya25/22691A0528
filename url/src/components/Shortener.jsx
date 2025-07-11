import React, { useState } from "react";
import logger from "../utils/logger"; // Import the logger
import "../App.css";

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateShortcode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const DEFAULT_VALIDITY = 30;

export default function UrlShortener() {
  const [urls, setUrls] = useState([
    { longUrl: "", validity: "", shortcode: "" }
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (idx, field, value) => {
    const updated = [...urls];
    updated[idx][field] = value;
    setUrls(updated);
    logger.logEvent("FIELD_CHANGE", { row: idx, field, value });
  };

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
      logger.logEvent("ADD_ROW", { totalRows: urls.length + 1 });
    }
  };

  const removeRow = (idx) => {
    setUrls(urls.filter((_, i) => i !== idx));
    logger.logEvent("REMOVE_ROW", { row: idx });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const usedShortcodes = new Set();
    const newResults = [];

    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortcode } = urls[i];
      if (!longUrl || !isValidUrl(longUrl)) {
        setError(`Please enter a valid URL for row ${i + 1}.`);
        logger.logEvent("ERROR", { type: "INVALID_URL", row: i, value: longUrl });
        return;
      }
      let code = shortcode.trim() || generateShortcode();
      if (usedShortcodes.has(code)) {
        setError(`Duplicate shortcode "${code}" at row ${i + 1}.`);
        logger.logEvent("ERROR", { type: "DUPLICATE_SHORTCODE", row: i, code });
        return;
      }
      usedShortcodes.add(code);

      let expiry = validity.trim() === "" ? DEFAULT_VALIDITY : parseInt(validity, 10);
      if (isNaN(expiry) || expiry <= 0) {
        setError(`Please enter a valid positive integer for validity at row ${i + 1}.`);
        logger.logEvent("ERROR", { type: "INVALID_VALIDITY", row: i, value: validity });
        return;
      }

      newResults.push({
        longUrl,
        shortUrl: `${window.location.origin}/${code}`,
        expiry,
        code
      });
    }

    setResults(newResults);
    logger.logEvent("SHORTEN_URLS", { count: newResults.length, results: newResults });
  };

  return (
    <div className="shortener-container">
      <div className="shortener-title">URL Shortener</div>
      <form onSubmit={handleSubmit}>
        {urls.map((row, idx) => (
          <div key={idx} className="shortener-form-row">
            <input
              type="text"
              placeholder="Original Long URL"
              value={row.longUrl}
              onChange={e => handleChange(idx, "longUrl", e.target.value)}
              required
            />
            <input
              type="number"
              className="validity-input"
              placeholder="Validity (min)"
              value={row.validity}
              min={1}
              onChange={e => handleChange(idx, "validity", e.target.value)}
            />
            <input
              type="text"
              className="shortcode-input"
              placeholder="Shortcode (opt)"
              value={row.shortcode}
              onChange={e => handleChange(idx, "shortcode", e.target.value)}
            />
            {urls.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeRow(idx)}
                tabIndex={-1}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="shortener-actions">
          <button
            type="button"
            onClick={addRow}
            disabled={urls.length >= 5}
          >
            Add URL
          </button>
          <button type="submit">
            Shorten URLs
          </button>
        </div>
        {error && <div className="shortener-error">{error}</div>}
      </form>

      {results.length > 0 && (
        <div className="shortener-results">
          {results.map((res, idx) => (
            <div className="shortener-result-item" key={idx}>
              <div>
                <strong>Original:</strong> {res.longUrl}
              </div>
              <div>
                <strong>Shortened:</strong>{" "}
                <a href={res.longUrl} target="_blank" rel="noopener noreferrer">
                  {res.shortUrl}
                </a>
              </div>
              <div>
                <strong>Shortcode:</strong> {res.code}
              </div>
              <div>
                <strong>Expires in:</strong> {res.expiry} minutes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
