import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_META } from '../data/clinicData';

export function usePageMeta(customTitle?: string, customDescription?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = ROUTE_META[pathname] || ROUTE_META['/'];
    const title = customTitle || meta.title;
    const description = customDescription || meta.description;

    document.title = title;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
  }, [pathname, customTitle, customDescription]);
}
