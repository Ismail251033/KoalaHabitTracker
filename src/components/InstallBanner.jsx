import React, { useState, useEffect } from 'react';

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('install_dismissed') === 'true'
  );

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
    } else {
      // Fallback: show share/add to homescreen hint
      alert('Pour installer : appuyez sur "Partager" puis "Sur l\'écran d\'accueil" dans votre navigateur.');
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('install_dismissed', 'true');
    setDismissed(true);
  };

  if (installed || dismissed) return null;

  return (
    <div className="install-bar">
      <div className="install-bar-left">
        <div className="install-bar-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v13M8 12l4 4 4-4"/>
            <path d="M5 19h14"/>
          </svg>
        </div>
        <span className="install-bar-text">Installer l'application</span>
      </div>
      <div className="install-bar-right">
        <button className="install-bar-btn" onClick={handleInstall}>
          Installer
        </button>
        <button className="install-bar-close" onClick={handleDismiss} aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
