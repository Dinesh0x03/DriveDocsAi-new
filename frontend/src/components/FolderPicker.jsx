import { useEffect, useState } from "react";
import api from "../lib/api";

import {
  Folder,
  MagnifyingGlass,
  X,
  CaretRight,
  House,
} from "@phosphor-icons/react";

export default function FolderPicker({ onClose, onSelect, allowClose }) {
  const [parents, setParents] = useState([{ id: "root", name: "My Drive" }]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const current = parents[parents.length - 1];

  useEffect(() => {
    load(current.id);
  }, [current.id]);

  async function load(parentId) {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/drive/folders", {
        params: { parent: parentId },
      });
      setFolders(data.folders || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function runSearch(q) {
    if (!q.trim()) {
      load(current.id);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/drive/folders/search", {
        params: { q },
      });
      setFolders(data.folders || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  function enter(f) {
    setParents((p) => [...p, f]);
  }

  function jumpTo(idx) {
    setParents((p) => p.slice(0, idx + 1));
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && allowClose) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white border shadow-lg flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Select Folder</h2>
          {allowClose && (
            <button onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="flex border">
            <MagnifyingGlass size={16} className="ml-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch(query);
              }}
              placeholder="Search folders..."
              className="flex-1 p-2 outline-none"
            />
          </div>

          {/* Breadcrumbs */}
          <div className="flex gap-2 mt-2 text-sm">
            {parents.map((p, i) => (
              <span key={p.id}>
                {i > 0 && " > "}
                <button onClick={() => jumpTo(i)}>
                  {p.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4">Loading...</div>}
          {error && <div className="p-4 text-red-500">{error}</div>}

          {!loading &&
            folders.map((f) => (
              <div
                key={f.id}
                className="flex justify-between p-3 border-b hover:bg-gray-100"
              >
                <button onClick={() => enter(f)} className="flex gap-2">
                  <Folder size={16} />
                  {f.name}
                </button>

                <button onClick={() => onSelect(f)} className="text-blue-600">
                  Select
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}