import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatWidget.css";

const CHAT_ORIGIN = "http://88.198.61.70";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef(null);

  const sessionSentRef = useRef(false);
  const autoInitDoneRef = useRef(false); // 🔥 NEW

  const [session, setSession] = useState({
    accessToken: null,
    refreshToken: null,
    userInfo: null,
    dbType: "postgres",
  });

  // ===============================
  // TOGGLE CHAT (USER ACTION)
  // ===============================
  const toggleChat = () => {
    setOpen(prev => !prev);
  };

  // ===============================
  // LOGIN SECONDARY
  // ===============================
  const LoginSecondary = async (userId, username, name) => {
    try {
      const res = await axios.post(
        `${CHAT_ORIGIN}/api/auth/userloginSecondary`,
        { dbType: "postgres", id: userId, username, name },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data.success) return;

      setSession({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        userInfo: res.data.user,
        dbType: "postgres",
      });

      // 🔥 Open chat ONLY for initial loading
      setOpen(true);
    } catch (err) {
      console.error("LoginSecondary error:", err);
    }
  };

  // ===============================
  // INITIAL LOGIN
  // ===============================
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;

    const user = JSON.parse(userRaw);

    LoginSecondary(
      user.userid,
      `${user.firstname} ${user.lastname}`,
      user.email
    );
  }, []);

  // ===============================
  // SEND SESSION + AUTO CLOSE
  // ===============================
  useEffect(() => {
    if (!open) return;
    if (!session?.accessToken) return;
    if (!iframeRef.current) return;
    if (sessionSentRef.current) return;

    const iframe = iframeRef.current;

    const onIframeLoad = () => {
      // 1️⃣ Send session
      iframe.contentWindow.postMessage(
        { type: "SET_CHAT_SESSION", payload: session },
        CHAT_ORIGIN
      );

      // 2️⃣ Scroll AFTER render delay
      setTimeout(() => {
        iframe.contentWindow.postMessage(
          { type: "SCROLL_TO_BOTTOM" },
          CHAT_ORIGIN
        );
      }, 500); // 🔥 REQUIRED

      sessionSentRef.current = true;

      // 3️⃣ AUTO-CLOSE after first init
      if (!autoInitDoneRef.current) {
        autoInitDoneRef.current = true;
        setTimeout(() => setOpen(false), 700); // 🔥 CLOSE AFTER LOAD
      }
    };

    iframe.addEventListener("load", onIframeLoad);
    return () => iframe.removeEventListener("load", onIframeLoad);
  }, [session, open]);

  // ===============================
  // RENDER
  // ===============================
  return (
    <>
      {/* CHAT WINDOW (ALWAYS MOUNTED) */}
      <div className={`chat-window ${open ? "open" : "closed"}`}>
        <iframe
          ref={iframeRef}
          className="chat-iframe"
          src={`${CHAT_ORIGIN}/`}
          title="Chat"
        />
      </div>

      {/* CHAT ICON */}
      <div className="chat-icon" onClick={toggleChat}>
        💬
      </div>
    </>
  );
};

export default ChatWidget;
