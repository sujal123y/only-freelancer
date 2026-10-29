import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    discord_url: 'https://discord.gg/onlyfreelancer',
    instagram_url: 'https://www.instagram.com/only.freelancer?dlrf=ZDNlZDc0MzIxNw==',
    registration_open: true,
    agency_email: 'contact@onlyfreelancer.com',
    agency_phone: '+1 (555) 019-2834',
    site_announcement: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/public/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.warn('Using fallback configuration:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
