const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs');

async function main() {
  const project = new Project({});
  project.addSourceFilesAtPaths('src/**/*.tsx');
  project.addSourceFilesAtPaths('src/**/*.ts');

  const appFile = project.getSourceFileOrThrow('src/app/App.tsx');
  
  const screensDir = 'src/app/screens';
  const componentsDir = 'src/app/components/ui';
  
  if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir, { recursive: true });
  if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

  const functionsToExtract = appFile.getFunctions().filter(f => {
    const name = f.getName();
    return name && name !== 'App' && name !== 'shuffle' && name !== 'speak';
  });

  const importsToAdd = [];

  for (const func of functionsToExtract) {
    const name = func.getName();
    const isScreen = name.endsWith('Page') || name.endsWith('Game');
    const targetDir = isScreen ? 'src/app/screens' : 'src/app/components/ui';
    const filePath = `${targetDir}/${name}.tsx`;

    console.log(`Extracting ${name} to ${filePath}`);

    const newFile = project.createSourceFile(filePath, '', { overwrite: true });
    
    // Copy function text and make it exported
    func.setIsExported(true);
    func.setIsDefaultExport(true);
    newFile.addStatements(func.getText());
    
    // We will fix imports later
    importsToAdd.push({ name, path: `./${isScreen ? 'screens' : 'components/ui'}/${name}` });
  }

  // Add imports to App.tsx
  for (const imp of importsToAdd) {
    appFile.addImportDeclaration({
      defaultImport: imp.name,
      moduleSpecifier: imp.path
    });
  }

  // Remove the extracted functions from App.tsx
  for (const func of functionsToExtract) {
    func.remove();
  }

  // Fix missing imports for all files
  console.log('Fixing missing imports...');
  const allFiles = project.getSourceFiles();
  for (const file of allFiles) {
    if (file.getFilePath().includes('screens') || file.getFilePath().includes('components') || file.getFilePath().includes('App.tsx')) {
      file.fixMissingImports();
    }
  }

  // Format and save
  console.log('Formatting and saving...');
  for (const file of project.getSourceFiles()) {
      if (file.getFilePath().includes('screens') || file.getFilePath().includes('components') || file.getFilePath().includes('App.tsx')) {
        file.formatText();
      }
  }
  
  await project.save();
  console.log('Done!');
}

main().catch(console.error);
