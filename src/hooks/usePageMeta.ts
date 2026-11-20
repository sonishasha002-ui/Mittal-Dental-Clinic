import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CLINIC_INFO, ROUTE_META } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';

export function usePageMeta(customTitle?: string, customDescription?: string) {
  const { pathname } = useLocation();
  const { clinicInfo, doctorProfile } = useClinic();

  useEffect(() => {
    const meta = ROUTE_META[pathname] || ROUTE_META['/'];
    const applyLiveOverrides = (text: string) =>
      text
        .replaceAll(CLINIC_INFO.name, clinicInfo.name)
        .replaceAll(CLINIC_INFO.doctor.name, doctorProfile.name)
        .replaceAll(CLINIC_INFO.doctor.qualification, doctorProfile.qualification)
        .replaceAll(CLINIC_INFO.phoneDisplay, clinicInfo.phoneDisplay);

    const title = customTitle || applyLiveOverrides(meta.title);
    const description = customDescription || applyLiveOverrides(meta.description);

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
  }, [
    pathname,
    customTitle,
    customDescription,
    clinicInfo.name,
    clinicInfo.phoneDisplay,
    doctorProfile.name,
    doctorProfile.qualification,
  ]);
}
