import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/useAuth"
import { Heart, Share2, Repeat, MessageSquare, Send, Trash, Trash2 } from "lucide-react"


export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [postDraft, setPostDraft] = useState({ content: "", media: [] })
  const [postError, setPostError] = useState("")
  const [commentDrafts, setCommentDrafts] = useState({})

  const getEmail = () => {
    if (user?.email) return user.email
    try {
      const rawUser = localStorage.getItem('user')
      if (rawUser) {
        const u = JSON.parse(rawUser)
        if (u?.email) return u.email
      }
      const rawAcc = localStorage.getItem('account')
      if (rawAcc) {
        const a = JSON.parse(rawAcc)
        if (a?.email) return a.email
      }
    } catch { /* ignore */ }
    return ""
  }
  const postsKey = () => {
    const email = getEmail()
    return email ? `posts:${email}` : 'posts:anon'
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(postsKey())
      if (raw) setPosts(JSON.parse(raw))
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const savePosts = (next) => {
    setPosts(next)
    try {
      localStorage.setItem(postsKey(), JSON.stringify(next))
    } catch { /* ignore */ }
  }

  const createPost = (e) => {
    e?.preventDefault()
    setPostError("")
    const content = (postDraft.content || "").trim()
    if (!content) {
      setPostError(t('feed.error.contentRequired'))
      return
    }
    const mentions = Array.from(new Set((content.match(/@([\w.-]+)/g) || []).map(m => m.slice(1))))
    const newPost = {
      id: Date.now(),
      content,
      media: postDraft.media || [],
      mentions,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      shares: 0,
      reposts: 0,
      comments: [],
    }
    const next = [...posts, newPost]
    savePosts(next)
    setPostDraft({ content: "", media: [] })
  }

  const likePost = (postId) => {
    const next = posts.map((p) => {
      if (p.id !== postId) return p
      const liked = !p.liked
      const likes = Math.max(0, (p.likes || 0) + (liked ? 1 : -1))
      return { ...p, liked, likes }
    })
    savePosts(next)
  }

  const sharePost = async (postId) => {
    const p = posts.find((x) => x.id === postId)
    if (!p) return
    try {
      if (navigator?.share) {
        await navigator.share({ title: "Worksy", text: p.content })
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(p.content)
      }
    } catch { /* ignore */ }
    const next = posts.map((x) => x.id === postId ? { ...x, shares: (x.shares || 0) + 1 } : x)
    savePosts(next)
  }

  const repostPost = (postId) => {
    const clicked = posts.find((x) => x.id === postId)
    if (!clicked) return
    const baseId = clicked.repostOf || clicked.id
    const baseIdx = posts.findIndex((x) => x.id === baseId)
    if (baseIdx === -1) return
    const base = posts[baseIdx]
    // Undo repost if already done
    if (base.repostedByMe && base.repostRefId) {
      const withoutRepost = posts.filter((x) => x.id !== base.repostRefId)
      const next = withoutRepost.map((x) => x.id === baseId
        ? { ...x, reposts: Math.max(0, (x.reposts || 0) - 1), repostedByMe: false, repostRefId: null }
        : x)
      savePosts(next)
      return
    }
    // Create repost of the base original
    const repostId = Date.now() + Math.floor(Math.random() * 1000)
    const repost = {
      id: repostId,
      content: `${t('feed.repostPrefix')}${base.content}`,
      media: base.media || [],
      mentions: base.mentions || [],
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      shares: 0,
      reposts: 0,
      comments: [],
      repostOf: baseId,
    }
    const next = posts.map((x) => x.id === baseId
      ? { ...x, reposts: (x.reposts || 0) + 1, repostedByMe: true, repostRefId: repostId }
      : x)
    savePosts([...next, repost])
  }

  const addComment = (postId) => {
    const text = (commentDrafts[postId] || "").trim()
    if (!text) return
    const next = posts.map((p) => {
      if (p.id !== postId) return p
      const comments = [...(p.comments || []), { id: Date.now(), content: text, createdAt: new Date().toISOString() }]
      return { ...p, comments }
    })
    savePosts(next)
    setCommentDrafts((d) => ({ ...d, [postId]: "" }))
  }

  const deleteRepost = (repostId) => {
    const r = posts.find((x) => x.id === repostId)
    if (!r || !r.repostOf) return
    const baseId = r.repostOf
    const nextWithout = posts.filter((x) => x.id !== repostId)
    const next = nextWithout.map((x) => {
      if (x.id !== baseId) return x
      const dec = Math.max(0, (x.reposts || 0) - 1)
      const clearMine = x.repostRefId === repostId ? { repostedByMe: false, repostRefId: null } : {}
      return { ...x, reposts: dec, ...clearMine }
    })
    savePosts(next)
  }

  const deletePost = (postId) => {
    const target = posts.find((x) => x.id === postId)
    if (!target) return
    // Remove the original post and any reposts referencing it
    const next = posts.filter((x) => x.id !== postId && x.repostOf !== postId)
    savePosts(next)
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-gray-900">{t('feed.title')}</h2>
          <form onSubmit={createPost} className="mt-3 space-y-3">
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows={4}
              placeholder={t('feed.contentPlaceholder')}
              value={postDraft.content}
              onChange={(e) => setPostDraft((d) => ({ ...d, content: e.target.value }))}
            />
            <div>
              <label className="text-xs text-gray-500">{t('feed.mediaLabel')}</label>
              <div className="mt-1">
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md cursor-pointer">
                  <span>{t('feed.chooseFiles')}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length === 0) return
                      const readers = files.map((file) => new Promise((resolve) => {
                        const reader = new FileReader()
                        reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result })
                        reader.readAsDataURL(file)
                      }))
                      Promise.all(readers).then((items) => {
                        setPostDraft((d) => ({ ...d, media: [...(d.media || []), ...items] }))
                      })
                    }}
                  />
                </label>
                {postDraft.media?.length ? (
                  <div className="mt-2 text-xs text-gray-600">{postDraft.media.length} {t('feed.filesSelected')}</div>
                ) : (
                  <div className="mt-2 text-xs text-gray-400">{t('feed.noFilesSelected')}</div>
                )}
              </div>
              {postDraft.media?.length ? (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {postDraft.media.map((m, idx) => (
                    <div key={idx} className="relative border rounded-md overflow-hidden">
                      {m.type.startsWith('image/') ? (
                        <img src={m.dataUrl} alt={m.name} className="w-full h-28 object-cover" />
                      ) : (
                        <video src={m.dataUrl} className="w-full h-28 object-cover" controls />
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 text-gray-700 text-xs px-2 py-1 rounded"
                        onClick={() => setPostDraft((d) => ({ ...d, media: d.media.filter((_, i) => i !== idx) }))}
                      >
                        {t('feed.remove')}
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {postError ? (<div className="text-sm text-red-600">{postError}</div>) : null}
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">{t('feed.publish')}</button>
          </form>

          <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <div className="text-sm text-gray-500">{t('feed.noPosts')}</div>
            ) : (
              posts.map((p) => {
                const baseId = p.repostOf || p.id
                const base = posts.find((x) => x.id === baseId)
                const repostedByMe = !!(base && base.repostedByMe)
                const repostCount = base?.reposts || 0
                const isMyRepost = !!(p.repostOf && base && base.repostRefId === p.id)
                return (
                <article key={p.id} className="border rounded-md p-4">
                  <div className="mt-1 text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{p.content}</p>
                  {p.mentions?.length ? (
                    <div className="mt-2 text-xs text-indigo-700">{t('feed.mentions')} {p.mentions.map((m) => `@${m}`).join(', ')}</div>
                  ) : null}
                  {p.media?.length ? (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {p.media.map((m, idx) => (
                        <div key={idx} className="border rounded-md overflow-hidden">
                          {m.type.startsWith('image/') ? (
                            <img src={m.dataUrl} alt={m.name} className="w-full h-28 object-cover" />
                          ) : (
                            <video src={m.dataUrl} className="w-full h-28 object-cover" controls />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <button type="button" onClick={() => likePost(p.id)} className={`inline-flex items-center gap-1 hover:text-indigo-600 ${p.liked ? 'text-red-600' : 'text-gray-600'}`}>
                      <Heart className="w-4 h-4" />
                      <span>{p.likes || 0}</span>
                    </button>
                    <button type="button" onClick={() => sharePost(p.id)} className="inline-flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                      <Share2 className="w-4 h-4" />
                      <span>{p.shares || 0}</span>
                    </button>
                    <button type="button" onClick={() => repostPost(baseId)} className={`inline-flex items-center gap-1 ${repostedByMe ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600`}>
                      <Repeat className="w-4 h-4" />
                      <span>{repostCount}</span>
                    </button>
                    {isMyRepost && (
                      <button type="button" onClick={() => deleteRepost(p.id)} className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600">
                        <Trash className="w-4 h-4" />
                        <span>{t('feed.deleteRepost')}</span>
                      </button>
                    )}
                    {!p.repostOf && (
                      <button type="button" onClick={() => deletePost(p.id)} className="inline-flex items-center gap-1 text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                        <span>{t('feed.deletePost')}</span>
                      </button>
                    )}
                    <div className="inline-flex items-center gap-1 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{(p.comments || []).length}</span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(p.comments || []).map((c) => (
                      <div key={c.id} className="text-sm text-gray-700">
                        <span className="text-gray-500 text-xs mr-2">{new Date(c.createdAt).toLocaleString()}</span>
                        {c.content}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        className="flex-1 border rounded-md px-3 py-2 text-sm"
                        placeholder={t('feed.commentPlaceholder')}
                        value={commentDrafts[p.id] || ''}
                        onChange={(e) => setCommentDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addComment(p.id) } }}
                      />
                      <button type="button" onClick={() => addComment(p.id)} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 inline-flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">{t('feed.send')}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )})
            )}
          </div>
        </div>
      </section>
    </main>
  )
}