import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

function getOtherParticipant(conversation, currentUserId) {
  if (!conversation) return { id: null, name: "Unknown" };

  if (conversation.user1_id === currentUserId) {
    return { id: conversation.user2_id, name: conversation.user2_name };
  }

  return { id: conversation.user1_id, name: conversation.user1_name };
}

export default function ChatPage() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const recipientFromState = location.state?.recipient ?? null;

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingRecipient, setPendingRecipient] = useState(recipientFromState);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId
      ) ?? null,
    [conversations, selectedConversationId]
  );

  const activeRecipient = selectedConversation
    ? getOtherParticipant(selectedConversation, user?.id)
    : pendingRecipient;

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const { data } = await API.get("/chat/conversations");
      setConversations(data);

      if (selectedConversationId) return;

      if (pendingRecipient) {
        const existingConversation = data.find((conversation) => {
          const other = getOtherParticipant(conversation, user?.id);
          return other.id === pendingRecipient.id;
        });

        if (existingConversation) {
          setSelectedConversationId(existingConversation.id);
          setPendingRecipient(null);
          return;
        }
      }

      if (data.length > 0) {
        setSelectedConversationId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      const { data } = await API.get(`/chat/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (recipientFromState?.id) {
      setPendingRecipient(recipientFromState);
    }
  }, [recipientFromState]);

  useEffect(() => {
    if (recipientFromState?.id) {
      setSearchedUser(recipientFromState);
    }
  }, [recipientFromState]);

  useEffect(() => {
    fetchMessages(selectedConversationId);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return undefined;

    const interval = window.setInterval(() => {
      fetchMessages(selectedConversationId);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [selectedConversationId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeRecipient?.id || sending) return;

    try {
      setSending(true);
      await API.post("/chat/send", {
        receiverId: activeRecipient.id,
        content: draft.trim(),
      });
      setDraft("");

      const { data } = await API.get("/chat/conversations");
      setConversations(data);

      const matchingConversation = data.find((conversation) => {
        const other = getOtherParticipant(conversation, user?.id);
        return other.id === activeRecipient.id;
      });

      if (matchingConversation) {
        setSelectedConversationId(matchingConversation.id);
        setPendingRecipient(null);
        const messagesResponse = await API.get(
          `/chat/messages/${matchingConversation.id}`
        );
        setMessages(messagesResponse.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleUserSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchingUser(true);
      const { data } = await API.get(`/users/${searchQuery.trim()}`);
      setSearchedUser(data.user);
    } catch (error) {
      console.error("Error searching user:", error);
      setSearchedUser(null);
      alert(error?.response?.data?.message || "User not found");
    } finally {
      setSearchingUser(false);
    }
  };

  const handleStartChat = (targetUser) => {
    if (!targetUser?.id) return;

    const existingConversation = conversations.find((conversation) => {
      const other = getOtherParticipant(conversation, user?.id);
      return other.id === targetUser.id;
    });

    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
      setPendingRecipient(null);
      return;
    }

    setPendingRecipient({ id: targetUser.id, name: targetUser.name });
    setSelectedConversationId(null);
    setMessages([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="social-shell">
      <div className="page-frame">
        <div className="panel topbar">
          <div className="brand-mark">
            <div className="brand-badge">TT</div>
            <div>
              <p className="headline text-lg font-extrabold text-slate-900">
                Chat
              </p>
              <p className="text-sm text-slate-500">
                Conversations and direct messages are back in the app.
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <Link to="/" className="btn-ghost">
              Home
            </Link>
            <Link to="/feed" className="btn-secondary">
              Feed
            </Link>
            <Link to={`/profile/${user?.id ?? ""}`} className="btn-primary">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-ghost">
              Logout
            </button>
          </div>
        </div>

        <div className="chat-layout fade-up">
          <aside className="chat-sidebar">
            <div className="sidebar-card">
              <span className="eyebrow">Inbox</span>
              <h1 className="headline mt-4 text-3xl font-extrabold text-slate-900">
                Messages
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Pick an existing conversation or search for someone here to
                start a new one.
              </p>
            </div>

            <div className="sidebar-card">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
                Search User
              </p>
              <form onSubmit={handleUserSearch} className="mt-4 search-row">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by username"
                  className="text-input"
                />
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={searchingUser}
                >
                  {searchingUser ? "Searching..." : "Search"}
                </button>
              </form>

              {searchedUser && (
                <div className="chat-search-result">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      {searchedUser.name?.slice(0, 1) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{searchedUser.name}</p>
                      <p className="text-sm text-slate-500">{searchedUser.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-ghost mt-4 w-full"
                    disabled={searchedUser.id === user?.id}
                    onClick={() => handleStartChat(searchedUser)}
                  >
                    {searchedUser.id === user?.id ? "This is you" : "Start chat"}
                  </button>
                </div>
              )}
            </div>

            {pendingRecipient && !selectedConversation && (
              <button
                type="button"
                className="chat-conversation-card is-active"
                onClick={() => setSelectedConversationId(null)}
              >
                <div className="avatar">{pendingRecipient.name?.slice(0, 1) || "U"}</div>
                <div>
                  <p className="font-bold text-slate-900">{pendingRecipient.name}</p>
                  <p className="text-sm text-slate-500">New conversation</p>
                </div>
              </button>
            )}

            <div className="chat-conversation-list">
              {loadingConversations ? (
                <div className="sidebar-card text-sm text-slate-500">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="sidebar-card text-sm text-slate-500">
                  No conversations yet.
                </div>
              ) : (
                conversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(
                    conversation,
                    user?.id
                  );

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      className={`chat-conversation-card ${
                        selectedConversationId === conversation.id ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setSelectedConversationId(conversation.id);
                        setPendingRecipient(null);
                      }}
                    >
                      <div className="avatar">
                        {otherParticipant.name?.slice(0, 1) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {otherParticipant.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Conversation #{conversation.id}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="chat-panel">
            <div className="chat-panel-header">
              <div>
                <span className="eyebrow">Direct Chat</span>
                <h2 className="headline mt-4 text-3xl font-extrabold text-slate-900">
                  {activeRecipient?.name || "Select a conversation"}
                </h2>
              </div>
              {activeRecipient?.id && (
                <div className="info-pill">User #{activeRecipient.id}</div>
              )}
            </div>

            <div className="chat-thread">
              {loadingMessages ? (
                <div className="chat-empty">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="chat-empty">
                  {activeRecipient?.id
                    ? "No messages yet. Send the first one."
                    : "Open a conversation from the left to begin chatting."}
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = message.sender_id === user?.id;
                  return (
                    <article
                      key={message.id}
                      className={`chat-bubble ${isMine ? "is-mine" : "is-theirs"}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {isMine ? "You" : message.sender_name}
                      </p>
                      <p className="mt-2 text-[1rem] leading-7 text-slate-800">
                        {message.content}
                      </p>
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </article>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSend} className="chat-composer">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={
                  activeRecipient?.id
                    ? `Message ${activeRecipient.name}...`
                    : "Select someone to start chatting"
                }
                className="text-area"
                disabled={!activeRecipient?.id || sending}
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="info-pill">
                  {activeRecipient?.id
                    ? "Messages send through your existing backend chat APIs"
                    : "Choose a recipient first"}
                </div>
                <button
                  type="submit"
                  disabled={!activeRecipient?.id || sending}
                  className="btn-primary"
                >
                  {sending ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
