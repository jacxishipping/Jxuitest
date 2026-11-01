import fs from 'fs';
import path from 'path';

const CATEGORY_MAP: { file: string; folder: string }[] = [
  { file: 'category01Buttons.tsx', folder: 'buttons' },
  { file: 'category02Glassmorphism.tsx', folder: 'glassmorphism' },
  { file: 'category03Navigation.tsx', folder: 'navigation' },
  { file: 'category04Inputs.tsx', folder: 'inputs' },
  { file: 'category05Toggles.tsx', folder: 'toggles' },
  { file: 'category06Modals.tsx', folder: 'modals' },
  { file: 'category07Feedback.tsx', folder: 'feedback' },
  { file: 'category08Loading.tsx', folder: 'loading' },
  { file: 'category09Cards.tsx', folder: 'cards' },
  { file: 'category10DataViz.tsx', folder: 'dataviz' },
  { file: 'category11DataGrids.tsx', folder: 'datagrids' },
  { file: 'category12DragDrop.tsx', folder: 'dragdrop' },
  { file: 'category13Layout.tsx', folder: 'layout' },
  { file: 'category14Animation.tsx', folder: 'animation' },
  { file: 'category15AI.tsx', folder: 'ai' },
  { file: 'category16Editors.tsx', folder: 'editors' },
  { file: 'category17Time.tsx', folder: 'time' },
  { file: 'category18Utilities.tsx', folder: 'utilities' },
];

const BASE_DIR = path.resolve('c:/Users/Administrator/Pictures/JXUI/src/components/library');

let totalComponentsCreated = 0;

for (const { file, folder } of CATEGORY_MAP) {
  const filePath = path.join(BASE_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const targetDir = path.join(BASE_DIR, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Extract top imports block before the category banner
  const bannerIndex = content.indexOf('/* =========================================================================');
  if (bannerIndex === -1) {
    console.error(`Banner not found in ${file}`);
    continue;
  }

  let topImports = content.slice(0, bannerIndex).trim();
  // Adjust JXThemeContext relative path from '../../context/' to '../../../context/'
  topImports = topImports.replace(/'\.\.\/\.\.\/context\/JXThemeContext'/g, "'../../../context/JXThemeContext'");

  // The components start after the banner block
  const bannerEndIndex = content.indexOf('========================================================================= */', bannerIndex);
  const bodyContent = content.slice(bannerEndIndex + '========================================================================= */'.length);

  // Split by "// <number>."
  const chunks = bodyContent.split(/\n(?=\/\/\s*\d+\.\s+)/);

  const componentNames: string[] = [];

  // Extract Lucide import exactly as written in topImports:
  const lucideImportMatch = topImports.match(/import\s*\{[^}]*\}\s*from\s*'lucide-react';?/);
  const categoryLucideImport = lucideImportMatch ? lucideImportMatch[0] + '\n' : '';

  for (const rawChunk of chunks) {
    const chunk = rawChunk.trim();
    if (!chunk) continue;

    // Find component name from "export const ComponentName"
    const match = chunk.match(/export\s+const\s+([A-Za-z0-9_]+)/);
    if (!match) {
      console.warn(`Could not extract component name in chunk from ${file}: ${chunk.slice(0, 50)}...`);
      continue;
    }

    const componentName = match[1];
    componentNames.push(componentName);

    // Build the standalone file content
    const reactImport = `import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';\n`;
    const themeImport = `import { useJXTheme } from '../../../context/JXThemeContext';\n`;

    const singleComponentContent = `${reactImport}${themeImport}${categoryLucideImport}\n${chunk}\n`;

    const outFilePath = path.join(targetDir, `${componentName}.tsx`);
    fs.writeFileSync(outFilePath, singleComponentContent, 'utf-8');
    totalComponentsCreated++;
  }

  // Create folder index.ts
  const folderIndexContent = componentNames
    .map((name) => `export * from './${name}';`)
    .join('\n') + '\n';
  fs.writeFileSync(path.join(targetDir, 'index.ts'), folderIndexContent, 'utf-8');

  // Update category file to re-export from folder
  const categoryReExport = `// Re-export from modular component directory\nexport * from './${folder}';\n`;
  fs.writeFileSync(filePath, categoryReExport, 'utf-8');

  console.log(`✓ Processed ${folder}: ${componentNames.length} components`);
}

console.log(`\n🎉 Total components separated into individual files: ${totalComponentsCreated}`);
