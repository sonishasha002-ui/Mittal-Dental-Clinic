import { MessageCircle } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { buildWhatsappHref } from '../services/clinicFirestore';

export function FloatingWhatsApp() {
  const { clinicInfo } = useClinic();

  return (
    <a
      href={buildWhatsappHref(clinicInfo.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Enquire on WhatsApp with ${clinicInfo.name}`}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#061525] to-[#082B48] hover:from-[#176BFF] hover:to-[#00C6B7] text-white text-xs font-semibold shadow-[0_8px_28px_rgba(0,217,255,0.28)] border border-[#00D9FF]/45 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D9FF]"
    >
      <MessageCircle className="w-5 h-5 sm:w-4 sm:h-4 text-[#00D9FF] shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp Enquiry</span>
    </a>
  );
}
