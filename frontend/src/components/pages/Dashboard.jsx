import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/useAuth"
import { Heart, Share2, Repeat, MessageSquare, Send, Trash, Trash2 } from "lucide-react"

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts")
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Backend expects title and body
        body: JSON.stringify({ title: "Status Update", body: newPost }),
      })

      if (res.ok) {
        setNewPost("")
        fetchPosts()
      }
    } catch (err) {
      console.error("Error creating post:", err)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== postId))
      }
    } catch (err) {
      console.error("Error deleting post:", err)
    }
  }

  const handleLike = async (postId) => {
    // Backend does not support likes yet
    console.log("Like feature not implemented on backend yet")
    /*
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        fetchPosts()
      }
    } catch (err) {
      console.error("Error liking post:", err)
    }
    */
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mb-4">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <h3 className="font-bold text-lg">{user?.name || "User"}</h3>
                <p className="text-gray-500 text-sm mb-4">{user?.role || "Member"}</p>
                <div className="w-full border-t pt-4 text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Profile Views</span>
                    <span className="font-semibold text-indigo-600">128</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Post Impressions</span>
                    <span className="font-semibold text-indigo-600">1.2k</span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="mt-6 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center font-bold text-indigo-600">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <form onSubmit={handleCreatePost} className="flex-1">
                  <input
                    type="text"
                    placeholder="Start a post..."
                    className="w-full bg-gray-50 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-3 px-2">
                    <div className="flex gap-4 text-gray-500 text-sm font-medium">
                      <button type="button" className="hover:text-indigo-600 flex items-center gap-1 transition">
                        Media
                      </button>
                      <button type="button" className="hover:text-indigo-600 flex items-center gap-1 transition">
                        Event
                      </button>
                      <button type="button" className="hover:text-indigo-600 flex items-center gap-1 transition">
                        Article
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newPost.trim()}
                      className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {post.authorId?.fullName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.authorId?.fullName || "Unknown User"}</div>
                        <div className="text-xs text-gray-500">
                          {post.authorId?.role || "Member"} • {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {user && user.id === post.authorId?._id && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="text-gray-800 mb-4 whitespace-pre-wrap">{post.body}</div>

                  <div className="flex items-center justify-between pt-3 border-t text-gray-500 text-sm">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1.5 hover:text-indigo-600 transition ${
                        post.likes?.includes(user?.id) ? "text-indigo-600" : ""
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likes?.includes(user?.id) ? "fill-current" : ""}`} />
                      <span>{post.likes?.length || 0} Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                      <Repeat className="w-4 h-4" />
                      <span>Repost</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar - Recommendations */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Recommended for you</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Tech Startup {i}</div>
                      <div className="text-xs text-gray-500 mb-1">Software Company</div>
                      <button className="text-indigo-600 text-xs font-semibold hover:underline">
                        + Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/offers"
                className="block mt-4 text-sm text-gray-500 hover:text-indigo-600 font-medium text-center"
              >
                View all recommendations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
