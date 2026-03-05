export type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: { user?: TgUser };
        ready: () => void;
        expand: () => void;
        disableVerticalSwipes?: () => void;
      };
    };
  }
}

export function getWebApp() {
  if (typeof window === 'undefined') return null;
  if (!window.Telegram?.WebApp) return null;
  return window.Telegram.WebApp;
}

export function getUserData(): TgUser | null {
  const wa = getWebApp();
  if (!wa) return null;

  try {
    const unsafe = wa.initDataUnsafe;
    if (unsafe?.user) return unsafe.user;

    const initDataStr = wa.initData?.trim();
    if (initDataStr) {
      const params = new URLSearchParams(initDataStr);
      const userEncoded = params.get('user');
      if (userEncoded) {
        return JSON.parse(decodeURIComponent(userEncoded)) as TgUser;
      }
    }
  } catch (e) {
    console.error('Telegram user parse:', e);
  }
  return null;
}
