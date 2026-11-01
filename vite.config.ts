import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function inlineCssPlugin(): Plugin {
  return {
    name: 'inline-css-plugin',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      let inlinedHtml = html;
      for (const [fileName, asset] of Object.entries(ctx.bundle)) {
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          const cssContent = asset.source.toString();
          // Remove external <link> tag referencing this css file
          const linkRegex = new RegExp(`<link[^>]*href="[^"]*${fileName}"[^>]*>`, 'g');
          inlinedHtml = inlinedHtml.replace(linkRegex, '');
          // Embed CSS directly in <style> tag in <head> to completely eliminate CSS 404s
          inlinedHtml = inlinedHtml.replace(
            '</head>',
            `<style id="jxui-embedded-styles">\n${cssContent}\n</style>\n</head>`
          );
        }
      }
      return inlinedHtml;
    },
  };
}

function githubPagesHelperPlugin(): Plugin {
  return {
    name: 'github-pages-helper',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const assetsDir = path.resolve(distDir, 'assets');
      const indexHtmlPath = path.resolve(distDir, 'index.html');
      const errorHtmlPath = path.resolve(distDir, '404.html');
      const noJekyllPath = path.resolve(distDir, '.nojekyll');

      if (!fs.existsSync(distDir)) return;

      // 1. Ensure .nojekyll exists
      fs.writeFileSync(noJekyllPath, '# Disable Jekyll on GitHub Pages\n', 'utf8');

      // 2. Mirror index.html to 404.html for SPA routing on GitHub Pages
      if (fs.existsSync(indexHtmlPath)) {
        fs.copyFileSync(indexHtmlPath, errorHtmlPath);
      }

      // 3. Mirror all asset files to dist root as well, ensuring resilience against missing /assets/ prefix
      if (fs.existsSync(assetsDir)) {
        const assetFiles = fs.readdirSync(assetsDir);
        for (const file of assetFiles) {
          const srcFile = path.resolve(assetsDir, file);
          const destFile = path.resolve(distDir, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  // Prevent Vite CLI from exiting if parent supervisor closes stdin in non-TTY container mode
  if (!process.stdin.isTTY && !process.env.CI) {
    process.env.CI = 'true';
  }

  const isGitHubPages = Boolean(process.env.GITHUB_ACTIONS);
  const base = process.env.BASE_PATH || (isGitHubPages ? '/JXUI-react/' : '/');

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      inlineCssPlugin(),
      githubPagesHelperPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-core';
            }
            if (id.includes('src/components/library/')) {
              return 'jxui-library-290';
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
