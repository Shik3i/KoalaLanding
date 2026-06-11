import type { Locale } from '../i18n/config';

export type ProjectCategory = 'desktop' | 'web' | 'extensions';
export type ProjectStatus = 'active' | 'wip' | 'experimental' | 'early' | 'archived';

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** If true, rendered as a large featured showcase block */
  featured: boolean;
  /** If false, project is in the data but not rendered in UI anywhere */
  listed: boolean;
  /** If true, project is displayed on the homepage */
  homepage: boolean;
  accentColor?: string;
  shortDescription: Partial<Record<Locale, string>> & { en: string };
  longDescription?: Partial<Record<Locale, string>> & { en: string };
  tags: string[];
  lastUpdated?: string; // e.g. "2026-06"
  links: {
    website?: string;
    github?: string;
    chrome?: string;
    firefox?: string;
    docs?: string;
    devlog?: string;
  };
  assets: {
    icon?: string;
    logo?: string;
    screenshot?: string;
    mascot?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'koalasync',
    name: 'KoalaSync',
    category: 'extensions',
    status: 'active',
    featured: true,
    listed: true,
    homepage: true,
    accentColor: 'hsl(210, 90%, 55%)',
    lastUpdated: '2026-06',
    shortDescription: {
      en: 'Browser watch parties for any video. Sync playback across YouTube, Netflix, Emby, Jellyfin, Plex and more.',
      de: 'Browser-Watch-Partys für jedes Video. Synchronisierte Wiedergabe auf YouTube, Netflix, Emby, Jellyfin, Plex und mehr.',
    },
    longDescription: {
      en: 'KoalaSync is a browser extension and self-hostable relay server for synchronized video playback on almost any website with a video element. Works with YouTube, Twitch, Netflix, Amazon Prime, Disney+, Emby, Jellyfin, Plex and more. Includes smart audio compression, episode auto-sync, and invitation links. No account required — just install, create a room, and share the link.',
      de: 'KoalaSync ist eine Browser-Erweiterung und ein selbst hostbarer Relay-Server für synchronisierte Videowiedergabe auf fast jeder Website mit einem Video-Element. Funktioniert mit YouTube, Twitch, Netflix, Amazon Prime, Disney+, Emby, Jellyfin, Plex und mehr. Enthält smarte Audio-Kompression, Episode Auto-Sync und Einladungslinks. Kein Account erforderlich — einfach installieren, Raum erstellen und Link teilen.',
    },
    tags: ['Open Source', 'Browser Extension', 'Self-hostable', 'Free', 'Watch Party'],
    links: {
      website: 'https://sync.koalastuff.net',
      github: 'https://github.com/Shik3i/KoalaSync',
      chrome: 'https://chromewebstore.google.com/detail/koalasync/obbnmkmlaaddodakcbdljknjpagklifc',
      firefox: 'https://addons.mozilla.org/de/firefox/addon/koalasync/',
      devlog: 'https://dev.to/hungrykoala',
    },
    assets: {
      icon: '/assets/projects/koalasync/icon.webp',
      mascot: '/assets/projects/koalasync/mascot.webp',
    },
  },
  {
    id: 'koalapull',
    name: 'KoalaPull',
    category: 'desktop',
    status: 'active',
    featured: false,
    listed: true,
    homepage: true,
    accentColor: 'hsl(260, 65%, 58%)',
    lastUpdated: '2026-05',
    shortDescription: {
      en: 'A native desktop download manager for yt-dlp. Download videos, audio and playlists from hundreds of sites — without using a terminal.',
      de: 'Ein nativer Desktop-Download-Manager für yt-dlp. Videos, Audio und Playlists von hunderten Sites herunterladen — ohne Terminal.',
    },
    longDescription: {
      en: 'KoalaPull wraps yt-dlp and ffmpeg in a native desktop UI for macOS, Windows and Linux. Zero-config setup — it automatically downloads and configures its own engine binaries on first run. Features a metadata preview, format selection, download queue, presets and history. Privacy-first: local-only, no telemetry, no cloud, no accounts.',
      de: 'KoalaPull verpackt yt-dlp und ffmpeg in eine native Desktop-UI für macOS, Windows und Linux. Zero-Config-Setup — beim ersten Start werden die Engine-Binaries automatisch heruntergeladen und konfiguriert. Enthält Metadaten-Vorschau, Format-Auswahl, Download-Warteschlange, Presets und Verlauf. Privacy-first: nur lokal, kein Telemetry, keine Cloud, keine Accounts.',
    },
    tags: ['Open Source', 'Desktop App', 'Free', 'Local-first', 'Privacy-first'],
    links: {
      github: 'https://github.com/Shik3i/KoalaPull',
    },
    assets: {
      icon: '/assets/projects/koalapull/icon.png',
    },
  },
  {
    id: 'koalaclicker',
    name: 'KoalaClicker',
    category: 'extensions',
    status: 'active',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(330, 70%, 55%)',
    lastUpdated: '2026-04',
    shortDescription: {
      en: 'A privacy-first auto-clicker for idle games and repetitive web tasks. Zero tracking, zero permissions beyond the active tab.',
      de: 'Ein datenschutzorientierter Auto-Clicker für Idle-Games und sich wiederholende Web-Aufgaben. Kein Tracking, keine Berechtigungen über den aktiven Tab hinaus.',
    },
    tags: ['Open Source', 'Browser Extension', 'Free', 'Privacy-first'],
    links: {
      github: 'https://github.com/Shik3i/KoalaClicker',
    },
    assets: {
      icon: '/assets/projects/koalaclicker/icon-128.png',
    },
  },
  {
    id: 'koalacookies',
    name: 'KoalaCookies',
    category: 'extensions',
    status: 'wip',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(15, 80%, 55%)',
    shortDescription: {
      en: 'A lightweight cookie manager extension to view, edit, block, and export HTTP cookies with ease.',
      de: 'Eine schlanke Cookie-Manager-Erweiterung zum einfachen Anzeigen, Bearbeiten, Blockieren und Exportieren von HTTP-Cookies.',
    },
    tags: ['Open Source', 'Browser Extension', 'Privacy-first', 'WIP'],
    links: {
      github: 'https://github.com/Shik3i/KoalaCookies',
    },
    assets: {},
  },
  {
    id: 'koalaflyff',
    name: 'KoalaFlyff',
    category: 'extensions',
    status: 'wip',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(280, 75%, 55%)',
    shortDescription: {
      en: 'Utility extension for Flyff Universe players to track stats, buff timers, and party layouts.',
      de: 'Erweiterung für Flyff Universe Spieler zum Tracken von Stats, Buff-Timern und Party-Layouts.',
    },
    tags: ['Open Source', 'Browser Extension', 'Gaming', 'WIP'],
    links: {
      github: 'https://github.com/Shik3i/KoalaFlyff',
    },
    assets: {},
  },
  {
    id: 'koalasound',
    name: 'KoalaSound',
    category: 'extensions',
    status: 'experimental',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(160, 60%, 45%)',
    lastUpdated: '2026-03',
    shortDescription: {
      en: 'Real-time audio processing for browser video tabs. Compressor and EQ presets. Chromium-only proof of concept.',
      de: 'Echtzeit-Audioverarbeitung für Browser-Video-Tabs. Kompressor- und EQ-Presets. Nur für Chromium, Proof of Concept.',
    },
    tags: ['Open Source', 'Browser Extension', 'Free', 'Audio', 'Experimental'],
    links: {
      github: 'https://github.com/Shik3i/KoalaSound',
    },
    assets: {
      icon: '/assets/projects/koalasound/icon.svg',
    },
  },
  {
    id: 'koalastartpage',
    name: 'KoalaStartpage',
    category: 'web',
    status: 'active',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(220, 80%, 55%)',
    lastUpdated: '2026-06',
    shortDescription: {
      en: 'A personal bento-box dashboard linking KoalaStuff projects, server status and daily tools. Moving to startpage.koalastuff.net.',
      de: 'Ein persönliches Bento-Box-Dashboard mit Links zu KoalaStuff-Projekten, Serverstatus und täglichen Tools. Zieht um zu startpage.koalastuff.net.',
    },
    tags: ['Open Source', 'Web App', 'Dashboard', 'Self-hosted'],
    links: {
      github: 'https://github.com/Shik3i/KoalaStartpage',
    },
    assets: {},
  },
  {
    id: 'koalasnippets',
    name: 'KoalaSnippets',
    category: 'web',
    status: 'early',
    featured: false,
    listed: true,
    homepage: true,
    accentColor: 'hsl(45, 80%, 50%)',
    lastUpdated: '2026-06',
    shortDescription: {
      en: 'A polished self-hosted code snippet manager to capture, organize, and share code snippets easily.',
      de: 'Ein ausgereifter, selbst gehosteter Code-Snippet-Manager zum einfachen Erfassen, Organisieren und Teilen von Code-Snippets.',
    },
    tags: ['Open Source', 'Web App', 'Self-hostable', 'Developer Tools'],
    links: {
      github: 'https://github.com/Shik3i/KoalaSnippets',
    },
    assets: {},
  },
  {
    id: 'koalaweb',
    name: 'KoalaWeb',
    category: 'web',
    status: 'active',
    featured: false,
    listed: true,
    homepage: true,
    accentColor: 'hsl(190, 75%, 45%)',
    lastUpdated: '2026-05',
    shortDescription: {
      en: 'Shared online timer application for synchronized countdowns and session tracking.',
      de: 'Gemeinsame Online-Timer-Anwendung für synchronisierte Countdowns und Sitzungsverfolgung.',
    },
    tags: ['Open Source', 'Web App', 'Developer Tools', 'Shared Timer'],
    links: {
      github: 'https://github.com/Shik3i/Antigrav',
    },
    assets: {},
  },
  {
    id: 'koalanews',
    name: 'KoalaNews',
    category: 'web',
    status: 'early',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(30, 80%, 50%)',
    lastUpdated: '2026-02',
    shortDescription: {
      en: 'Early news-related experiment. More details will be added once the project is ready to be shown publicly.',
      de: 'Frühes Nachrichten-Experiment. Details werden ergänzt, sobald das Projekt bereit ist, öffentlich gezeigt zu werden.',
    },
    tags: ['Experiment', 'Early'],
    links: {
      github: 'https://github.com/Shik3i/KoalaNews',
    },
    assets: {},
  },
  {
    id: 'koalablog',
    name: 'Koalablog',
    category: 'web',
    status: 'wip',
    featured: false,
    listed: true,
    homepage: false,
    accentColor: 'hsl(340, 75%, 55%)',
    shortDescription: {
      en: 'A minimal, privacy-focused blog platform using Astro and markdown for technical writings.',
      de: 'Eine minimalistische, datenschutzorientierte Blog-Plattform mit Astro und Markdown für technische Beiträge.',
    },
    tags: ['Open Source', 'Blog', 'Astro', 'WIP'],
    links: {
      github: 'https://github.com/Shik3i/Koalablog',
    },
    assets: {},
  },
];

export function getListedProjects(): Project[] {
  return projects.filter((p) => p.listed);
}

export function getHomepageProjects(): Project[] {
  return projects.filter((p) => p.listed && p.homepage);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured && p.listed);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category && p.listed);
}

export function getProjectDescription(
  project: Project,
  locale: Locale,
  long: boolean = false,
): string {
  if (long && project.longDescription) {
    return project.longDescription[locale] ?? project.longDescription.en;
  }
  return project.shortDescription[locale] ?? project.shortDescription.en;
}
