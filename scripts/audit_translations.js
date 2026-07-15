import fs from 'fs';
import path from 'path';

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'pt-BR', 'tr', 'ru', 'ja', 'ko', 'zh', 'uk'];

const stopWords = {
  en: ['the', 'and', 'of', 'to', 'is', 'for', 'with', 'that', 'this', 'have'],
  de: ['der', 'die', 'das', 'und', 'ist', 'mit', 'auf', 'von', 'dass', 'eine', 'nicht'],
  fr: ['le', 'la', 'les', 'et', 'est', 'un', 'une', 'dans', 'pour', 'dans', 'mais'],
  es: ['el', 'la', 'los', 'y', 'es', 'un', 'una', 'en', 'para', 'con', 'del', 'como'],
  it: ['il', 'la', 'i', 'e', 'è', 'un', 'una', 'in', 'per', 'con', 'del', 'sono'],
  nl: ['de', 'het', 'en', 'is', 'een', 'in', 'voor', 'met', 'van', 'op', 'dat'],
  pl: ['i', 'w', 'z', 'na', 'do', 'jest', 'nie', 'dla', 'się', 'to', 'który'],
  pt: ['o', 'a', 'os', 'e', 'é', 'um', 'uma', 'em', 'para', 'com', 'do', 'como'],
  tr: ['ve', 'bir', 'bu', 'da', 'de', 'için', 'ile', 'en', 'olarak', 'ama', 'çok'],
};

const allowedIdentical = [
  'faq', 'github', 'dev.to', 'koalastuff', 'mit-lizenz', 'mit license', 'mit-lizenz.',
  'koalasync', 'koalapull', 'koalaclicker', 'koalacookies', 'koalaflyff', 'koalasound',
  'koalastartpage', 'koalasnippets', 'koalaweb', 'koalasnap', 'koalanews', 'koalaworld',
  'koalabye', 'flatland td', 'koalatower', 'svelte', 'astro', 'node.js', 'docker', 'sqlite',
  'chrome web store', 'firefox add-ons'
];

function hasCyrillic(text) {
  return /[\u0400-\u04FF]/.test(text);
}

function hasCJK(text) {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(text);
}

function hasJapanese(text) {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function hasKorean(text) {
  return /[\uAC00-\uD7AF]/.test(text);
}

function detectIssue(text, expectedLang, englishText) {
  if (!text || typeof text !== 'string') return 'Missing or invalid type';
  const cleanText = text.trim();
  if (cleanText.length === 0) return 'Empty string';

  const lower = cleanText.toLowerCase();

  // Check for placeholders/TODOs using word boundaries, ignoring "todo" for Spanish/Portuguese
  const regexTodo = ['es', 'pt', 'pt-BR'].includes(expectedLang)
    ? /\b(temp|draft|fallback|placeholder|tbd)\b/i
    : /\b(todo|temp|draft|fallback|placeholder|tbd)\b/i;
  const regexBracket = /\[insert/i;
  if (regexTodo.test(cleanText) || regexBracket.test(cleanText)) {
    return 'Contains TODO/placeholder keyword';
  }

  // If expected is non-English, but it looks like English
  if (expectedLang !== 'en') {
    // Check if it's identical to English (excluding short/allowed words)
    if (englishText && cleanText === englishText.trim()) {
      if (cleanText.length > 15 && !allowedIdentical.includes(lower)) {
        return 'Identical to English translation';
      }
    }

    // Exclude brand names, technical terms, and acronyms under 35 characters
    const isLatinOnly = /^[a-zA-Z0-9\s.,\-\/()!#&:+]*$/.test(cleanText);
    if (isLatinOnly && cleanText.length < 35) {
      return null;
    }

    // Check non-latin alphabets
    if (expectedLang === 'uk' && !hasCyrillic(cleanText)) {
      return 'Expected Ukrainian but contains no Cyrillic characters';
    }
    if (['zh', 'ja', 'ko'].includes(expectedLang) && !hasCJK(cleanText)) {
      return `Expected ${expectedLang.toUpperCase()} but contains no CJK characters`;
    }
    if (expectedLang === 'ja' && cleanText.length > 10 && !hasJapanese(cleanText) && hasCJK(cleanText)) {
      return 'Expected Japanese but contains no Kana (only Hanzi/Chinese characters)';
    }
    if (expectedLang === 'ko' && !hasKorean(cleanText)) {
      return 'Expected Korean but contains no Hangul characters';
    }

    // Heuristic: English stopword count vs target stopword count
    const words = cleanText.toLowerCase().split(/\s+/);
    let enCount = 0;
    let targetCount = 0;

    words.forEach(w => {
      const cleanW = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '');
      if (stopWords.en.includes(cleanW)) enCount++;
      if (stopWords[expectedLang] && stopWords[expectedLang].includes(cleanW)) targetCount++;
    });

    if (stopWords[expectedLang] && cleanText.length > 30) {
      if (enCount > 2 && targetCount === 0) {
        return `Looks like English (found ${enCount} English stopwords, 0 ${expectedLang} stopwords)`;
      }
    }
  }

  return null;
}

async function runAudit() {
  console.log('=== STARTING TRANSLATION AUDIT ===\n');
  let totalErrors = 0;

  // 1. Audit JSON Locales
  console.log('--- Auditing JSON Locale Files ---');
  const localesDir = path.join('src', 'i18n', 'locales');
  const parsedLocales = {};

  for (const locale of locales) {
    const filePath = path.join(localesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR] File missing: ${filePath}`);
      totalErrors++;
      continue;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      parsedLocales[locale] = JSON.parse(content);
    } catch (e) {
      console.error(`[ERROR] Failed to parse JSON for ${locale}: ${e.message}`);
      totalErrors++;
    }
  }

  const enKeys = Object.keys(parsedLocales.en || {});
  
  // Check key consistency and values
  for (const locale of locales) {
    if (!parsedLocales[locale]) continue;
    const currentKeys = Object.keys(parsedLocales[locale]);
    
    // Key consistency
    const missingKeys = enKeys.filter(k => !currentKeys.includes(k));
    const extraKeys = currentKeys.filter(k => !enKeys.includes(k));

    if (missingKeys.length > 0) {
      console.error(`[ERROR] ${locale}.json is missing keys: ${JSON.stringify(missingKeys)}`);
      totalErrors += missingKeys.length;
    }
    if (extraKeys.length > 0) {
      console.error(`[ERROR] ${locale}.json has extra keys: ${JSON.stringify(extraKeys)}`);
      totalErrors += extraKeys.length;
    }

    // Check individual values
    for (const key of currentKeys) {
      const val = parsedLocales[locale][key];
      const enVal = parsedLocales.en[key];
      const issue = detectIssue(val, locale, enVal);
      if (issue) {
        console.error(`[ERROR] ${locale}.json -> Key "${key}": ${issue}\n  Value: "${val}"`);
        totalErrors++;
      }
    }
  }

  // 2. Audit projects.ts Data
  console.log('\n--- Auditing projects.ts ---');
  try {
    const projectsFile = fs.readFileSync(path.join('src', 'data', 'projects.ts'), 'utf-8');
    const startIndex = projectsFile.indexOf('export const projects');
    const endIndex = projectsFile.indexOf('export function getListedProjects');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find projects array bounds in projects.ts');
    }

    let projectsStr = projectsFile.substring(startIndex, endIndex);
    projectsStr = projectsStr.replace(/export const projects: Project\[\]\s*=\s*/, 'const projects = ');
    
    const tempFilePath = path.join('scripts', 'temp_projects.js');
    fs.writeFileSync(tempFilePath, projectsStr + '\nexport { projects };\n', 'utf-8');

    const { projects } = await import('./temp_projects.js');
    fs.unlinkSync(tempFilePath);

    for (const project of projects) {
      console.log(`Checking project: ${project.name} (${project.id})`);

      const textFields = ['shortDescription', 'longDescription', 'backstory'];
      for (const field of textFields) {
        const fieldData = project[field];
        if (!fieldData) {
          if (field === 'shortDescription') {
            console.error(`[ERROR] Project ${project.name} is missing required field ${field}`);
            totalErrors++;
          }
          continue;
        }

        // English must exist as the base
        if (!fieldData.en) {
          console.error(`[ERROR] Project ${project.name} -> ${field}: Missing English ("en") base text`);
          totalErrors++;
        }

        // Every published text field must support every locale. Optional means the
        // whole field may be absent, not that individual translations may be absent.
        for (const locale of locales) {
          const val = fieldData[locale];
          if (!val) {
            console.error(`[ERROR] Project ${project.name} -> ${field}: Missing translation for locale "${locale}"`);
            totalErrors++;
            continue;
          }

          const issue = detectIssue(val, locale, fieldData.en);
          if (issue) {
            console.error(`[ERROR] Project ${project.name} -> ${field} -> locale "${locale}": ${issue}\n  Value: "${val.substring(0, 80)}..."`);
            totalErrors++;
          }
        }
      }
    }
  } catch (e) {
    console.error(`[ERROR] Failed to audit projects.ts: ${e.stack}`);
    totalErrors++;
  }

  console.log(`\n=== AUDIT COMPLETE ===`);
  if (totalErrors === 0) {
    console.log('[OK] Translation audit passed with 0 errors.');
    process.exit(0);
  } else {
    console.error(`[FAIL] Translation audit failed with ${totalErrors} errors.`);
    process.exit(1);
  }
}

runAudit();
