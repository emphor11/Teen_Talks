import React, { useEffect, useRef } from "react";
import { GOOGLE_CLIENT_ID } from "../utils/config";

let googleScriptPromise = null;
let initializedClientId = null;
let latestCredentialHandler = null;

function loadGoogleScript() {
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || disabled) return undefined;

    let cancelled = false;
    latestCredentialHandler = onCredential;

    loadGoogleScript()
      .then((google) => {
        if (cancelled || !buttonRef.current || !google?.accounts?.id) return;

        buttonRef.current.innerHTML = "";

        if (initializedClientId !== GOOGLE_CLIENT_ID) {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => latestCredentialHandler?.(response),
          });
          initializedClientId = GOOGLE_CLIENT_ID;
        }

        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: buttonRef.current.offsetWidth || 360,
          text: "continue_with",
        });
      })
      .catch((error) => {
        console.error("Google button load error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [disabled, onCredential]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="google-auth-note">
        Set <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.
      </div>
    );
  }

  return <div ref={buttonRef} className="google-auth-button" />;
}
