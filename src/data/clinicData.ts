export type TreatmentCategoryId =
  | 'general'
  | 'advanced'
  | 'cosmetic'
  | 'orthodontics'
  | 'specialized';

export type IllustrationKind =
  | 'rct'
  | 'implant'
  | 'extraction'
  | 'braces'
  | 'invisible-braces'
  | 'filling'
  | 'laser-filling'
  | 'scaling'
  | 'xray'
  | 'metal-free-crown'
  | 'zirconia-crown'
  | 'cad-cam'
  | 'fpd'
  | 'veneers'
  | 'laminates'
  | 'complete-denture'
  | 'partial-denture'
  | 'whitening'
  | 'pediatric'
  | 'night-guard'
  | 'sealant'
  | 'consultation'
  | 'online-consultation'
  | 'post-op';

export interface TreatmentItem {
  id: string;
  title: string;
  category: TreatmentCategoryId;
  categoryLabel: string;
  shortDescription: string;
  clinicalSummary: string;
  focusPoints: string[];
  illustration: IllustrationKind;
  visualUrl: string;
  visualAlt: string;
  featuredOnHome?: boolean;
}

export interface BranchHours {
  mondayToSaturday: string[];
  sunday: string[];
  note: string;
  lastUpdated: string;
}

export interface BranchInfo {
  id: 'civil-lines' | 'zero-road';
  label: string;
  name: string;
  badge: string;
  addressLines: string[];
  fullAddress: string;
  phone: string;
  mapsUrl: string;
  embedMapUrl: string;
  googleProfileUrl: string;
  hours: BranchHours;
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  mobileNumber: string;
  branchId: 'civil-lines' | 'zero-road';
  branchName: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending_clinic_confirmation';
  createdAt: string;
}

export interface GalleryPhotoRecord {
  id: string;
  category: 'exterior' | 'reception' | 'treatment-area' | 'equipment' | 'doctor-portrait';
  title: string;
  branchId: 'civil-lines' | 'zero-road' | 'both';
  caption: string;
  imageDataUrl: string;
  uploadedAt: string;
}

export const CONCEPT_VISUALS = {
  studio: {
    url: '/src/assets/images/clinic_3d_dental_studio_1794836090151.jpg',
    alt: 'Conceptual 3D dental studio interior visualization with glass architecture and soft cyan ambient lighting',
    caption: '3D Architectural Dental Care Concept · Mittal Dental Clinic',
  },
  general: {
    url: '/src/assets/images/treatment_general_render_1794836092173.jpg',
    alt: 'Conceptual 3D visualization of digital dental radiography and preventive ultrasonic dental care',
    caption: '3D Preventive & Digital Diagnostics Concept',
  },
  rct: {
    url: '/src/assets/images/treatment_rct_render_1794836090893.jpg',
    alt: 'Conceptual 3D anatomical tooth cross-section showing glowing cyan root canal pathways',
    caption: '3D Endodontic Canal Visualization',
  },
  implant: {
    url: '/src/assets/images/treatment_implant_render_1794836089831.jpg',
    alt: 'Conceptual 3D zirconia dental crown mounted on a precision titanium implant fixture',
    caption: '3D Implant & Prosthetic Concept',
  },
  cosmetic: {
    url: '/src/assets/images/treatment_cosmetic_render_1794836092852.jpg',
    alt: 'Conceptual 3D porcelain dental veneers and translucent ceramic restorations on sapphire glass',
    caption: '3D Cosmetic Smile Craftsmanship Concept',
  },
  orthodontics: {
    url: '/src/assets/images/treatment_braces_render_1794836090778.jpg',
    alt: 'Conceptual 3D clear orthodontic aligner tray and precision bracket alignment model',
    caption: '3D Orthodontic Alignment Concept',
  },
};

export const CLINIC_INFO = {
  name: 'Mittal Dental Clinic',
  city: 'Prayagraj, Uttar Pradesh',
  description:
    'A well-established multispecialty dental and orthodontic centre in Prayagraj (Allahabad), Uttar Pradesh.',
  doctor: {
    name: 'Dr. Rishabh Mittal',
    qualification: 'BDS, Gold Medalist',
  },
  phoneDisplay: '098395 80829',
  phoneHref: 'tel:+919839580829',
  whatsappHref:
    'https://wa.me/919839580829?text=Hello%20Mittal%20Dental%20Clinic%2C%20I%20would%20like%20to%20enquire%20about%20a%20dental%20appointment.',
};

export const INITIAL_BRANCHES: BranchInfo[] = [
  {
    id: 'civil-lines',
    label: 'Primary Branch',
    name: 'Mittal Dental Clinic — Civil Lines',
    badge: 'Primary Branch · Civil Lines',
    addressLines: [
      '5, 1A, Tej Bahadur Sapru Road,',
      'Agnipath Colony, Civil Lines,',
      'Prayagraj, Uttar Pradesh – 211001.',
    ],
    fullAddress:
      '5, 1A, Tej Bahadur Sapru Road, Agnipath Colony, Civil Lines, Prayagraj, Uttar Pradesh – 211001',
    phone: '098395 80829',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+5+1A+Tej+Bahadur+Sapru+Road+Agnipath+Colony+Civil+Lines+Prayagraj+211001',
    embedMapUrl:
      'https://maps.google.com/maps?q=5%2C%201A%2C%20Tej%20Bahadur%20Sapru%20Road%2C%20Agnipath%20Colony%2C%20Civil%20Lines%2C%20Prayagraj%2C%20Uttar%20Pradesh%20211001&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleProfileUrl:
      'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+Civil+Lines+Prayagraj',
    hours: {
      mondayToSaturday: ['10:00 AM – 12:00 PM', '4:00 PM – 8:00 PM'],
      sunday: ['10:00 AM – 12:00 PM'],
      note: 'Listed clinic hours. Please call 098395 80829 to confirm branch-specific slot availability.',
      lastUpdated: '2026-11-16T00:00:00.000Z',
    },
  },
  {
    id: 'zero-road',
    label: 'Second Branch',
    name: 'Mittal Dental Clinic — Zero Road',
    badge: 'Second Branch · Zero Road',
    addressLines: [
      '90/78, Mahajani Tola,',
      'Near Sri Hatkeshwar Nath Mandir,',
      'Zero Road, Prayagraj, Uttar Pradesh – 211003.',
    ],
    fullAddress:
      '90/78, Mahajani Tola, Near Sri Hatkeshwar Nath Mandir, Zero Road, Prayagraj, Uttar Pradesh – 211003',
    phone: '098395 80829',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+90%2F78+Mahajani+Tola+Near+Sri+Hatkeshwar+Nath+Mandir+Zero+Road+Prayagraj+211003',
    embedMapUrl:
      'https://maps.google.com/maps?q=90%2F78%2C%20Mahajani%20Tola%2C%20Zero%20Road%2C%20Prayagraj%2C%20Uttar%20Pradesh%20211003&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleProfileUrl:
      'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+Zero+Road+Prayagraj',
    hours: {
      mondayToSaturday: ['10:00 AM – 12:00 PM', '4:00 PM – 8:00 PM'],
      sunday: ['10:00 AM – 12:00 PM'],
      note: 'Timings shown from supplied listing. Independently editable for Zero Road branch confirmation.',
      lastUpdated: '2026-11-16T00:00:00.000Z',
    },
  },
];

export const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mittal Dental Clinic, Prayagraj — Dr. Rishabh Mittal (BDS, Gold Medalist)',
    description:
      'Multispecialty dental and orthodontic care in Prayagraj at Civil Lines and Zero Road, led by Dr. Rishabh Mittal (BDS, Gold Medalist). Call 098395 80829.',
  },
  '/about': {
    title: 'About Us — Mittal Dental Clinic, Prayagraj',
    description:
      'Learn about Mittal Dental Clinic in Prayagraj, our patient-friendly philosophy, clinical hygiene protocols, modern equipment, and two city branches.',
  },
  '/treatments': {
    title: 'Dental Treatments & Services — Mittal Dental Clinic, Prayagraj',
    description:
      'Explore all 24 dental treatments across General, Advanced, Cosmetic, Orthodontics, and Specialized Dentistry at Mittal Dental Clinic, Prayagraj.',
  },
  '/doctor': {
    title: 'Dr. Rishabh Mittal (BDS, Gold Medalist) — Mittal Dental Clinic, Prayagraj',
    description:
      'Meet Dr. Rishabh Mittal (BDS, Gold Medalist), Lead Dental Surgeon at Mittal Dental Clinic across Civil Lines and Zero Road, Prayagraj.',
  },
  '/gallery': {
    title: 'Clinic Photo Gallery — Mittal Dental Clinic, Prayagraj',
    description:
      'Browse authentic clinic photographs and visual care concepts from Mittal Dental Clinic in Civil Lines and Zero Road, Prayagraj.',
  },
  '/locations': {
    title: 'Clinic Locations & Hours — Civil Lines & Zero Road, Prayagraj',
    description:
      'Find directions, verified addresses, and independently editable branch hours for Mittal Dental Clinic in Civil Lines and Zero Road, Prayagraj.',
  },
  '/contact': {
    title: 'Contact & Book Appointment — Mittal Dental Clinic, Prayagraj',
    description:
      'Request an appointment at Mittal Dental Clinic in Civil Lines or Zero Road, Prayagraj, or call 098395 80829 directly.',
  },
};

export const TREATMENT_CATEGORIES: { id: 'all' | TreatmentCategoryId; label: string }[] = [
  { id: 'all', label: 'All Services (24)' },
  { id: 'general', label: 'General Dentistry' },
  { id: 'advanced', label: 'Advanced Dentistry' },
  { id: 'cosmetic', label: 'Cosmetic Dentistry' },
  { id: 'orthodontics', label: 'Orthodontics' },
  { id: 'specialized', label: 'Specialized Dentistry' },
];

export const TREATMENTS: TreatmentItem[] = [
  // A. GENERAL DENTISTRY (8)
  {
    id: 'dental-consultation',
    title: 'Dental Consultation',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Thorough oral examination, clear diagnosis, and step-by-step treatment discussion before any procedure.',
    clinicalSummary:
      'Every visit begins with attentive listening to your concerns, careful oral examination, and transparent explanation of available options so you can decide comfortably.',
    focusPoints: [
      'Detailed oral and gum health screening',
      'Plain-language explanation of findings',
      'Personalized preventive and treatment roadmap',
    ],
    illustration: 'consultation',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'digital-xray',
    title: 'Digital X-ray',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Low-radiation digital dental radiography for immediate diagnostic clarity.',
    clinicalSummary:
      'Digital X-ray imaging captures high-resolution views of tooth roots, bone levels, and interproximal areas within seconds, helping Dr. Rishabh Mittal explain findings clearly on screen.',
    focusPoints: [
      'Immediate digital image review chairside',
      'Lower exposure compared to conventional film X-rays',
      'Supports accurate root canal, implant, and extraction planning',
    ],
    illustration: 'xray',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'dental-fillings',
    title: 'Dental Fillings',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Tooth-coloured restorative fillings to repair cavities and restore natural biting contour.',
    clinicalSummary:
      'Dental fillings remove decayed tooth structure and rebuild the surface using durable restorative composites matched to the surrounding enamel shade.',
    focusPoints: [
      'Conservative removal of carious tissue',
      'Shade-matched restorative layering',
      'Smooth bite adjustment and polishing',
    ],
    illustration: 'filling',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'laser-fillings',
    title: 'Laser Fillings',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Light-cured and laser-assisted restorative fillings designed for precise cavity repair.',
    clinicalSummary:
      'Laser-assisted restorative care supports precise cavity preparation and rapid light-cured composite bonding with minimal vibration and high patient comfort.',
    focusPoints: [
      'Focused cavity preparation and disinfection',
      'High-strength light-cured composite bonding',
      'Comfortable chairside experience for sensitive patients',
    ],
    illustration: 'laser-filling',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'scaling-teeth-cleaning',
    title: 'Scaling and Teeth Cleaning',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Ultrasonic removal of plaque, tartar deposits, and surface stains to support gum health.',
    clinicalSummary:
      'Professional scaling and polishing gently clears calcified calculus along and beneath the gumline, helping prevent gum inflammation and maintaining fresher oral hygiene.',
    focusPoints: [
      'Ultrasonic scaling with fine water irrigation',
      'Enamel polishing for smooth tooth surfaces',
      'Personalized brushing and flossing demonstration',
    ],
    illustration: 'scaling',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'dental-extractions',
    title: 'Dental Extractions',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Careful removal of severely damaged, decayed, or problematic teeth with attentive comfort measures.',
    clinicalSummary:
      'When a tooth cannot be conservatively restored or interferes with oral alignment, dental extraction is performed with gentle tissue handling and clear post-procedure care instructions.',
    focusPoints: [
      'Pre-extraction radiographic review',
      'Calm, step-by-step chairside communication',
      'Written and verbal post-operative guidance',
    ],
    illustration: 'extraction',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'online-consultation',
    title: 'Online Consultation for Outstation Patients',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Remote preliminary dental guidance and follow-up coordination for patients travelling from outside Prayagraj.',
    clinicalSummary:
      'Outstation patients can request preliminary guidance, review existing X-rays or reports, and plan travel-friendly appointment schedules prior to visiting Civil Lines or Zero Road.',
    focusPoints: [
      'Coordinated via 098395 80829 before your visit',
      'Preliminary discussion of symptoms and reports',
      'Helps plan multi-step treatments for outstation schedules',
    ],
    illustration: 'online-consultation',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'post-operative-guidance',
    title: 'Post-Operative Guidance',
    category: 'general',
    categoryLabel: 'General Dentistry',
    shortDescription:
      'Dedicated recovery instructions, dietary advice, and follow-up support after dental procedures.',
    clinicalSummary:
      'Clear post-operative support ensures patients know exactly how to care for healing tissues, manage temporary sensitivity, and reach the clinic if questions arise.',
    focusPoints: [
      'Clear oral hygiene and diet guidance after procedures',
      'Scheduled suture or healing follow-up checks',
      'Direct clinic contact support on 098395 80829',
    ],
    illustration: 'post-op',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },

  // B. ADVANCED DENTISTRY (6)
  {
    id: 'root-canal-treatment',
    title: 'Root Canal Treatment (RCT)',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'Endodontic care aimed at cleaning infected pulp canals, relieving toothache, and preserving the natural tooth structure.',
    clinicalSummary:
      'Root Canal Treatment addresses deep decay or pulp inflammation inside the tooth root canals. After careful isolation and canal disinfection, the space is sealed with biocompatible material to help preserve the natural tooth.',
    focusPoints: [
      'Digital radiographic assessment before treatment',
      'Thorough canal cleaning and sealing',
      'Clear explanation of post-RCT crown protection when indicated',
    ],
    illustration: 'rct',
    visualUrl: CONCEPT_VISUALS.rct.url,
    visualAlt: CONCEPT_VISUALS.rct.alt,
    featuredOnHome: true,
  },
  {
    id: 'dental-implants',
    title: 'Dental Implants',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'Biocompatible tooth root replacements designed to support fixed crowns or bridges for missing teeth.',
    clinicalSummary:
      'Dental implants provide a stable foundation anchored within the jawbone to replace one or more missing teeth without relying on adjacent healthy teeth for support.',
    focusPoints: [
      'Comprehensive evaluation of bone and oral health',
      'Precision titanium fixture and prosthetic crown planning',
      'Structured follow-up and hygiene guidance',
    ],
    illustration: 'implant',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
    featuredOnHome: true,
  },
  {
    id: 'cad-cam-fixed-teeth',
    title: 'CAD/CAM Fixed Teeth',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'Computer-aided design and precision-milled fixed restorations for accurate fit and contour.',
    clinicalSummary:
      'CAD/CAM fixed prosthetics utilize digital design and precision milling to achieve consistent marginal accuracy, natural anatomy, and reliable chewing function.',
    focusPoints: [
      'Precision digital design workflow',
      'Consistent marginal seal and occlusal balance',
      'Available in high-grade ceramic and zirconia options',
    ],
    illustration: 'cad-cam',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
  },
  {
    id: 'zirconia-crowns',
    title: 'Zirconia Crowns',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'High-strength monolithic or layered zirconia restorations suited for both front and back teeth.',
    clinicalSummary:
      'Zirconia crowns combine exceptional structural durability with tooth-coloured aesthetics, making them ideal for high-chewing-load molars as well as visible front teeth.',
    focusPoints: [
      'High flexural strength and wear resistance',
      'Custom shade matching to natural dentition',
      'Smooth glazed surface gentle on opposing teeth',
    ],
    illustration: 'zirconia-crown',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
    featuredOnHome: true,
  },
  {
    id: 'metal-free-crowns',
    title: 'Metal-Free Crowns',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'All-ceramic full-coverage crowns engineered for natural translucency without dark metal margins.',
    clinicalSummary:
      'Metal-free crowns restore strength and shape to weakened or root-canal-treated teeth while maintaining lifelike light transmission along the gumline.',
    focusPoints: [
      'Biocompatible all-ceramic construction',
      'Natural gumline aesthetics with zero grey margin',
      'Precision marginal fit and bite calibration',
    ],
    illustration: 'metal-free-crown',
    visualUrl: CONCEPT_VISUALS.cosmetic.url,
    visualAlt: CONCEPT_VISUALS.cosmetic.alt,
  },
  {
    id: 'fixed-teeth-fpd',
    title: 'Fixed Teeth (FPD)',
    category: 'advanced',
    categoryLabel: 'Advanced Dentistry',
    shortDescription:
      'Fixed Partial Dentures (dental bridges) to replace missing teeth anchored securely to adjacent teeth.',
    clinicalSummary:
      'A Fixed Partial Denture spans the space left by one or more missing teeth, restoring chewing efficiency, speech clarity, and arch stability without removable plates.',
    focusPoints: [
      'Non-removable fixed bridge stability',
      'Restores chewing function and prevents tooth shifting',
      'Designed for natural appearance and easy cleaning guidance',
    ],
    illustration: 'fpd',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
  },

  // C. COSMETIC DENTISTRY (3)
  {
    id: 'teeth-whitening',
    title: 'Teeth Whitening / Bleaching',
    category: 'cosmetic',
    categoryLabel: 'Cosmetic Dentistry',
    shortDescription:
      'Supervised clinical whitening protocols to safely lift extrinsic and deep tooth discolouration.',
    clinicalSummary:
      'Clinical teeth whitening uses controlled, gum-protected bleaching agents to brighten tooth shade evenly while monitoring tooth sensitivity.',
    focusPoints: [
      'Pre-whitening enamel and gum health check',
      'Protective gingival barrier isolation',
      'Shade comparison and sensitivity aftercare advice',
    ],
    illustration: 'whitening',
    visualUrl: CONCEPT_VISUALS.cosmetic.url,
    visualAlt: CONCEPT_VISUALS.cosmetic.alt,
    featuredOnHome: true,
  },
  {
    id: 'porcelain-veneers',
    title: 'Porcelain Veneers',
    category: 'cosmetic',
    categoryLabel: 'Cosmetic Dentistry',
    shortDescription:
      'Custom-crafted thin porcelain shells bonded to front teeth to refine shape, shade, and harmony.',
    clinicalSummary:
      'Porcelain veneers address discolouration, minor spacing, worn edges, or uneven tooth contours with stain-resistant ceramic surfaces.',
    focusPoints: [
      'Conservative front-surface tooth preparation',
      'Natural enamel-like lustre and stain resistance',
      'Tailored smile proportion planning',
    ],
    illustration: 'veneers',
    visualUrl: CONCEPT_VISUALS.cosmetic.url,
    visualAlt: CONCEPT_VISUALS.cosmetic.alt,
  },
  {
    id: 'dental-laminates',
    title: 'Dental Laminates',
    category: 'cosmetic',
    categoryLabel: 'Cosmetic Dentistry',
    shortDescription:
      'Ultra-thin aesthetic facings designed to enhance smile symmetry with minimal enamel alteration.',
    clinicalSummary:
      'Dental laminates offer a conservative cosmetic option for refining front tooth alignment, closing small gaps, and brightening stubborn intrinsic stains.',
    focusPoints: [
      'Minimal-preparation enamel preservation',
      'Fine shade and translucency customization',
      'Smooth glazed finish for natural feel',
    ],
    illustration: 'laminates',
    visualUrl: CONCEPT_VISUALS.cosmetic.url,
    visualAlt: CONCEPT_VISUALS.cosmetic.alt,
  },

  // D. ORTHODONTICS (2)
  {
    id: 'orthodontic-braces',
    title: 'Orthodontic Treatment (Braces)',
    category: 'orthodontics',
    categoryLabel: 'Orthodontics',
    shortDescription:
      'Structured tooth alignment and bite correction using fixed orthodontic bracket systems.',
    clinicalSummary:
      'Orthodontic braces gradually guide crowded, spaced, or misaligned teeth into balanced functional and aesthetic alignment over scheduled adjustment visits.',
    focusPoints: [
      'Detailed bite and facial symmetry evaluation',
      'Regular periodic adjustments and progress tracking',
      'Retention guidance upon completion of alignment',
    ],
    illustration: 'braces',
    visualUrl: CONCEPT_VISUALS.orthodontics.url,
    visualAlt: CONCEPT_VISUALS.orthodontics.alt,
    featuredOnHome: true,
  },
  {
    id: 'invisible-braces',
    title: 'Invisible Braces',
    category: 'orthodontics',
    categoryLabel: 'Orthodontics',
    shortDescription:
      'Clear, removable orthodontic aligner trays crafted for discreet tooth alignment.',
    clinicalSummary:
      'Invisible braces use sequential transparent aligners tailored to your dental arch, allowing comfortable oral hygiene and discreet daily wear during orthodontic movement.',
    focusPoints: [
      'Custom digital or impression-based arch planning',
      'Removable trays for convenient brushing and meals',
      'Scheduled clinical reviews to verify tooth tracking',
    ],
    illustration: 'invisible-braces',
    visualUrl: CONCEPT_VISUALS.orthodontics.url,
    visualAlt: CONCEPT_VISUALS.orthodontics.alt,
    featuredOnHome: true,
  },

  // E. SPECIALIZED DENTISTRY (5)
  {
    id: 'pediatric-dentistry',
    title: 'Pediatric Dentistry',
    category: 'specialized',
    categoryLabel: 'Specialized Dentistry',
    shortDescription:
      'Gentle, child-friendly preventive and restorative dental care tailored for young patients.',
    clinicalSummary:
      'Pediatric dental visits focus on building calm, positive habits early through gentle check-ups, primary tooth care, habit guidance, and preventive protection.',
    focusPoints: [
      'Patient, reassuring communication for children',
      'Monitoring erupting permanent teeth and jaw growth',
      'Preventive cavity guidance for parents and kids',
    ],
    illustration: 'pediatric',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'night-guards',
    title: 'Night Guards',
    category: 'specialized',
    categoryLabel: 'Specialized Dentistry',
    shortDescription:
      'Custom-fitted protective occlusal splints worn during sleep to reduce teeth grinding wear.',
    clinicalSummary:
      'Night guards cushion upper and lower teeth against nocturnal bruxism (clenching and grinding), helping protect enamel, crowns, and jaw comfort.',
    focusPoints: [
      'Custom dental arch impression for secure fit',
      'Protects natural enamel and ceramic restorations',
      'Easy care and storage instructions',
    ],
    illustration: 'night-guard',
    visualUrl: CONCEPT_VISUALS.orthodontics.url,
    visualAlt: CONCEPT_VISUALS.orthodontics.alt,
  },
  {
    id: 'dental-sealants',
    title: 'Dental Sealants',
    category: 'specialized',
    categoryLabel: 'Specialized Dentistry',
    shortDescription:
      'Protective resin coatings placed over deep molar grooves to help block plaque and decay.',
    clinicalSummary:
      'Dental sealants flow into the narrow pits and fissures of newly erupted back teeth, forming a smooth protective shield that makes daily brushing more effective.',
    focusPoints: [
      'Non-invasive preventive barrier for molars',
      'Quick, comfortable chairside application',
      'Ideal for children and cavity-prone grooves',
    ],
    illustration: 'sealant',
    visualUrl: CONCEPT_VISUALS.general.url,
    visualAlt: CONCEPT_VISUALS.general.alt,
  },
  {
    id: 'complete-dentures',
    title: 'Complete Dentures',
    category: 'specialized',
    categoryLabel: 'Specialized Dentistry',
    shortDescription:
      'Full-arch removable dentures crafted for comfortable facial support, speech, and chewing function.',
    clinicalSummary:
      'Complete dentures replace an entire upper or lower arch of missing teeth, carefully contoured to support lip posture, balanced bite contact, and everyday comfort.',
    focusPoints: [
      'Multi-step jaw relation and fit recordings',
      'Natural tooth size and shade selection',
      'Follow-up comfort adjustments after delivery',
    ],
    illustration: 'complete-denture',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
  },
  {
    id: 'partial-removable-dentures',
    title: 'Partial Removable Dentures',
    category: 'specialized',
    categoryLabel: 'Specialized Dentistry',
    shortDescription:
      'Custom removable prostheses that replace multiple missing teeth while preserving remaining natural teeth.',
    clinicalSummary:
      'Partial removable dentures fill gaps in the dental arch using comfortable acrylic or cast-framework bases designed for stable retention and simple daily cleaning.',
    focusPoints: [
      'Preserves alignment of remaining natural teeth',
      'Removable for thorough daily hygiene',
      'Balanced clasp and tissue support design',
    ],
    illustration: 'partial-denture',
    visualUrl: CONCEPT_VISUALS.implant.url,
    visualAlt: CONCEPT_VISUALS.implant.alt,
  },
];

export interface WhyChooseItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: 'gentle-approach',
    number: '01',
    title: 'Gentle & Patient-Friendly Approach',
    description:
      'Every examination and procedure is paced thoughtfully around patient comfort, with calm chairside handling from start to finish.',
  },
  {
    id: 'individual-attention',
    number: '02',
    title: 'Individual Attention to Patient Comfort',
    description:
      'Appointments allow dedicated one-on-one time with Dr. Rishabh Mittal so your questions, sensitivities, and preferences are heard.',
  },
  {
    id: 'anxiety-reduction',
    number: '03',
    title: 'Focus on Anxiety Reduction',
    description:
      'A reassuring clinical environment designed to help nervous children, first-time visitors, and anxious adults feel settled and respected.',
  },
  {
    id: 'cleanliness',
    number: '04',
    title: 'Cleanliness & Clinical Hygiene',
    description:
      'Strict instrument sterilization, clean operatory surfaces, and disciplined clinical hygiene protocols maintained across every treatment area.',
  },
  {
    id: 'clear-explanations',
    number: '05',
    title: 'Clear Explanations Before Care',
    description:
      'Findings, digital X-rays, and available treatment options are explained in straightforward language before any clinical step begins.',
  },
  {
    id: 'modern-equipment',
    number: '06',
    title: 'Modern Dental Equipment',
    description:
      'Equipped with digital radiography, CAD/CAM prosthetic workflows, ultrasonic scaling, and light-cured restorative systems.',
  },
];
