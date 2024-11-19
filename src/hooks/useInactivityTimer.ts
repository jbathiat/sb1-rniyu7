import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export const useInactivityTimer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = useAdminStore((state) => state.settings);

  const resetTimer = useCallback(() => {
    // Only proceed if settings are loaded and inactivity timeout is enabled
    if (!settings?.uiux?.inactivityTimeout?.enabled || location.pathname === '/') {
      return;
    }

    const duration = settings.uiux.inactivityTimeout.duration ?? 60;
    const timeout = duration * 1000; // Convert seconds to milliseconds

    const timer = setTimeout(() => {
      navigate('/');
    }, timeout);

    return () => clearTimeout(timer);
  }, [navigate, location.pathname, settings?.uiux?.inactivityTimeout]);

  useEffect(() => {
    // Don't set up listeners if settings aren't loaded yet
    if (!settings?.uiux?.inactivityTimeout) {
      return;
    }

    // Don't proceed if timeout is disabled or we're on the welcome screen
    if (!settings.uiux.inactivityTimeout.enabled || location.pathname === '/') {
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const cleanup = resetTimer();

    const handleActivity = () => {
      if (cleanup) cleanup();
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      if (cleanup) cleanup();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, settings?.uiux?.inactivityTimeout, location.pathname]);
};