#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Get all UI component files
const uiComponentsDir = join(projectRoot, 'src/components/ui');
const uiComponents = readdirSync(uiComponentsDir)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
  .map(file => file.replace(/\.(tsx|ts)$/, ''));

console.log(`Found ${uiComponents.length} UI components\n`);

// Find all source files to check for imports
function getAllSourceFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        getAllSourceFiles(filePath, fileList);
      }
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const srcDir = join(projectRoot, 'src');
const sourceFiles = getAllSourceFiles(srcDir);

console.log(`Scanning ${sourceFiles.length} source files...\n`);

// Check which components are imported
const usedComponents = new Set();
const componentUsageMap = new Map();

sourceFiles.forEach(filePath => {
  const content = readFileSync(filePath, 'utf-8');

  uiComponents.forEach(component => {
    // Check for imports like: from "@/components/ui/button"
    const importRegex = new RegExp(`from ['"]@/components/ui/${component}['"]`, 'g');
    const relativeImportRegex = new RegExp(`from ['"].*components/ui/${component}['"]`, 'g');

    if (importRegex.test(content) || relativeImportRegex.test(content)) {
      usedComponents.add(component);
      if (!componentUsageMap.has(component)) {
        componentUsageMap.set(component, []);
      }
      componentUsageMap.get(component).push(filePath.replace(projectRoot, ''));
    }
  });
});

// Identify unused components
const unusedComponents = uiComponents.filter(c => !usedComponents.has(c));

console.log('=== USED COMPONENTS ===');
console.log(`${usedComponents.size} components are being used:\n`);
Array.from(usedComponents).sort().forEach(component => {
  const usageCount = componentUsageMap.get(component).length;
  console.log(`✓ ${component} (used in ${usageCount} file${usageCount > 1 ? 's' : ''})`);
});

console.log('\n=== UNUSED COMPONENTS ===');
console.log(`${unusedComponents.length} components are NOT being used:\n`);
unusedComponents.sort().forEach(component => {
  console.log(`✗ ${component}`);
});

console.log('\n=== DEPENDENCY MAPPING ===');
console.log('Checking which npm packages correspond to unused components...\n');

// Map components to their dependencies
const componentDependencyMap = {
  'accordion': '@radix-ui/react-accordion',
  'alert-dialog': '@radix-ui/react-alert-dialog',
  'aspect-ratio': '@radix-ui/react-aspect-ratio',
  'avatar': '@radix-ui/react-avatar',
  'calendar': ['react-day-picker', 'date-fns'],
  'carousel': 'embla-carousel-react',
  'checkbox': '@radix-ui/react-checkbox',
  'collapsible': '@radix-ui/react-collapsible',
  'command': 'cmdk',
  'context-menu': '@radix-ui/react-context-menu',
  'dialog': '@radix-ui/react-dialog',
  'drawer': 'vaul',
  'dropdown-menu': '@radix-ui/react-dropdown-menu',
  'form': ['react-hook-form', '@hookform/resolvers'],
  'hover-card': '@radix-ui/react-hover-card',
  'input-otp': 'input-otp',
  'label': '@radix-ui/react-label',
  'menubar': '@radix-ui/react-menubar',
  'navigation-menu': '@radix-ui/react-navigation-menu',
  'popover': '@radix-ui/react-popover',
  'progress': '@radix-ui/react-progress',
  'radio-group': '@radix-ui/react-radio-group',
  'resizable': 'react-resizable-panels',
  'scroll-area': '@radix-ui/react-scroll-area',
  'select': '@radix-ui/react-select',
  'separator': '@radix-ui/react-separator',
  'sheet': '@radix-ui/react-dialog',
  'slider': '@radix-ui/react-slider',
  'switch': '@radix-ui/react-switch',
  'tabs': '@radix-ui/react-tabs',
  'toast': '@radix-ui/react-toast',
  'toggle': '@radix-ui/react-toggle',
  'toggle-group': '@radix-ui/react-toggle-group',
  'tooltip': '@radix-ui/react-tooltip',
};

const unusedDependencies = new Set();

unusedComponents.forEach(component => {
  const deps = componentDependencyMap[component];
  if (deps) {
    const depArray = Array.isArray(deps) ? deps : [deps];
    depArray.forEach(dep => unusedDependencies.add(dep));
  }
});

if (unusedDependencies.size > 0) {
  console.log('The following dependencies may be safe to remove:\n');
  Array.from(unusedDependencies).sort().forEach(dep => {
    console.log(`  - ${dep}`);
  });
} else {
  console.log('All component dependencies appear to be in use.');
}

console.log('\n=== SUMMARY ===');
console.log(`Total UI components: ${uiComponents.length}`);
console.log(`Used: ${usedComponents.size}`);
console.log(`Unused: ${unusedComponents.length}`);
console.log(`Potentially removable dependencies: ${unusedDependencies.size}`);

// Export results for further processing
const results = {
  total: uiComponents.length,
  used: Array.from(usedComponents).sort(),
  unused: unusedComponents.sort(),
  unusedDependencies: Array.from(unusedDependencies).sort(),
  componentUsageMap: Object.fromEntries(componentUsageMap)
};

// Write results to JSON file
import { writeFileSync } from 'fs';
const outputPath = join(projectRoot, 'scripts/unused-components-report.json');
writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\nDetailed report saved to: ${outputPath.replace(projectRoot, '')}`);
