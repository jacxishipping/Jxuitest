import { CopyableComponentInput, generateRawImplementationCode } from './jxuiLogic';

// Lazy raw file loaders across all JXUI component directories
const rawModules: Record<string, () => Promise<string>> =
  typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function'
    ? ((import.meta as any).glob('../components/**/*.tsx', {
        query: '?raw',
        import: 'default',
      }) as Record<string, () => Promise<string>>)
    : {};

const rawSourceCache: Record<string, string> = {};

function findLoaderForComponent(componentName: string): (() => Promise<string>) | null {
  const cleanName = componentName.split(/[ &/]/)[0].trim();
  const exactSuffix = `/${cleanName}.tsx`;
  for (const [path, loader] of Object.entries(rawModules)) {
    if (path.endsWith(exactSuffix)) {
      return loader;
    }
  }
  // Fallback for JXToggleButtonGroup -> JXToggleButton.tsx, JXAvatarGroup -> JXAvatar.tsx
  const strippedGroup = cleanName.replace(/Group$/, '');
  if (strippedGroup !== cleanName) {
    const fallbackSuffix = `/${strippedGroup}.tsx`;
    for (const [path, loader] of Object.entries(rawModules)) {
      if (path.endsWith(fallbackSuffix)) {
        return loader;
      }
    }
  }
  return null;
}

export function getCachedRawSource(spec: CopyableComponentInput): string {
  const cleanName = spec.name.split(/[ &/]/)[0].trim();
  if (rawSourceCache[cleanName]) {
    return rawSourceCache[cleanName];
  }
  return generateRawImplementationCode(spec);
}

export async function resolveRawComponentSource(
  spec: CopyableComponentInput
): Promise<string> {
  const cleanName = spec.name.split(/[ &/]/)[0].trim();
  if (rawSourceCache[cleanName]) {
    return rawSourceCache[cleanName];
  }

  const loader = findLoaderForComponent(cleanName);
  if (loader) {
    try {
      const rawText = await loader();
      if (typeof rawText === 'string' && rawText.trim().length > 0) {
        const trimmed = rawText.trim();
        const withV3Header = trimmed.includes('@jxui/react v3.0')
          ? trimmed
          : `// @jxui/react v3.0.0 — ${cleanName} (JXUI v3.0 Unified Component Suite)\n${trimmed}`;
        rawSourceCache[cleanName] = withV3Header;
        return rawSourceCache[cleanName];
      }
    } catch {
      // fall through to generated implementation
    }
  }

  const generated = generateRawImplementationCode(spec);
  rawSourceCache[cleanName] = generated;
  return generated;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below when Clipboard API permission is restricted in iframes/headless browsers
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

