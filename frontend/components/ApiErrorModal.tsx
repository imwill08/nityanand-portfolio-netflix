"use client";
import { useEffect, useRef } from "react";
import type { ApiError } from "@/lib/store";

interface Props {
  error: ApiError | null;
  onClose: () => void;
  onRetry?: () => void;
}

export default function ApiErrorModal({ error, onClose, onRetry }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!error) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [error, onClose]);

  if (!error) return null;

  const rawResponse =
    typeof error.responseBody === "object"
      ? JSON.stringify(error.responseBody, null, 2)
      : error.responseBody || error.message || "Unknown Error";

  return (
    <div
      className="api-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-error-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="api-modal-card">
        <button
          ref={closeRef}
          className="api-modal-close"
          aria-label="Close error modal"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="api-modal-header">
          <div className="api-modal-badge">API ERROR</div>
          <h2 id="api-error-title">Backend Connection Failed</h2>
          <p className="api-modal-desc">
            The frontend attempted to connect to the backend API but received an error.
            Fallback offline data is being shown so the site continues working.
          </p>
        </div>

        <div className="api-modal-meta">
          <div>
            <span className="api-label">Endpoint:</span>
            <code>{error.url || "N/A"}</code>
          </div>
          <div>
            <span className="api-label">HTTP Status:</span>
            <code className="api-status">
              {error.status ? `${error.status} ${error.statusText || ""}` : "Network / Connection Error"}
            </code>
          </div>
          <div>
            <span className="api-label">Timestamp:</span>
            <span>{error.timestamp}</span>
          </div>
        </div>

        <div className="api-modal-body">
          <div className="api-body-title">Exact API Response:</div>
          <pre className="api-pre">{rawResponse}</pre>
        </div>

        <div className="api-modal-actions">
          {onRetry && (
            <button className="abtn sm" onClick={onRetry}>
              ↻ Retry Connection
            </button>
          )}
          <button className="abtn ghost sm" onClick={onClose}>
            Dismiss &amp; View Offline Data
          </button>
        </div>
      </div>
    </div>
  );
}
