import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { postsApi } from "../context/utils/api";
import { Edit3, Save, X, Trash2, Plus, User, Calendar as Cal } from "lucide-react";

export default function Posts() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "" });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await postsApi.list();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createPost(e) {
    e?.preventDefault();
    try {
      const payload = { ...createForm };
      const created = await postsApi.create(payload, token);
      setItems((prev) => [created, ...prev]);
      setCreateForm({ title: "", body: "" });
      setCreating(false);
    } catch (err) {
      alert(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setEditForm({ title: p.title, body: p.body });
  }
  function cancelEdit() { setEditingId(null); }

  async function saveEdit(e) {
    e?.preventDefault();
    try {
      const updated = await postsApi.update(editingId, editForm, token);
      setItems((prev) => prev.map((p) => p._id === editingId ? updated : p));
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    try {
      await postsApi.remove(id, token);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const canEdit = (p) => user && (p.authorId?._id === user._id || p.authorId === user._id);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Community Posts</h1>
          {token && (
            <button onClick={() => setCreating((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> New Post
            </button>
          )}
        </div>

        {creating && (
          <form onSubmit={createPost} className="mt-4 bg-white border rounded-lg p-4 space-y-3">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Write something..."
              rows={4}
              value={createForm.body}
              onChange={(e) => setCreateForm((f) => ({ ...f, body: e.target.value }))}
              required
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                <Save className="w-4 h-4 inline" /> Post
              </button>
              <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                <X className="w-4 h-4 inline" /> Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {loading && <div className="text-gray-500">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && items.length === 0 && (
            <div className="text-gray-600">No posts yet. Be the first to share!</div>
          )}
          {items.map((p) => (
            <div key={p._id} className="bg-white border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{p.authorId?.fullName || "Unknown"}</span>
                  <span>•</span>
                  <Cal className="w-4 h-4" />
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                </div>
                {canEdit(p) && (
                  <div className="flex gap-2">
                    {editingId !== p._id ? (
                      <button onClick={() => startEdit(p)} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700">
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <>
                        <button onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700">
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </>
                    )}
                    <button onClick={() => remove(p._id)} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-50 text-red-700">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>

              {editingId === p._id ? (
                <div className="mt-3 space-y-3">
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  />
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                    value={editForm.body}
                    onChange={(e) => setEditForm((f) => ({ ...f, body: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="mt-3">
                  <div className="text-lg font-semibold">{p.title}</div>
                  <div className="text-gray-700 mt-1 whitespace-pre-wrap">{p.body}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
