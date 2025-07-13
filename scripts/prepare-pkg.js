// scripts/prepare-pkg.js
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const serverJsPath = path.join(standaloneDir, 'server.js'); // Ruta al archivo que necesitamos parchear

async function prepareAndPackage() {
  console.log('--- Preparando archivos para empaquetar ---');

  // 1. Parchear el archivo server.js para prevenir el error 'chdir'
  try {
    console.log(`📝 Leyendo ${serverJsPath} para parchearlo...`);
    let serverJsContent = await fs.readFile(serverJsPath, 'utf8');
    
    // Buscamos y comentamos la línea problemática
    const problematicLine = 'process.chdir(__dirname);';
    if (serverJsContent.includes(problematicLine)) {
      serverJsContent = serverJsContent.replace(problematicLine, `// ${problematicLine} // Patched by prepare-pkg.js`);
      await fs.writeFile(serverJsPath, serverJsContent, 'utf8');
      console.log('✅ server.js parcheado exitosamente.');
    } else {
      console.log('⚠️ No se encontró la línea "process.chdir(__dirname);" en server.js. Puede que ya esté parcheado.');
    }
  } catch (err) {
    // Si el archivo no existe (porque 'next build' falló), lo indicamos.
    if (err.code === 'ENOENT') {
        console.error(`🔥 Error: No se encuentra el archivo ${serverJsPath}. Asegúrate de que 'npm run build' se completó sin errores.`);
    } else {
        console.error('🔥 Error al parchear server.js:', err);
    }
    process.exit(1);
  }

  // 2. Copiar nuestro start.js al directorio standalone
  await fs.copy(
    path.join(projectRoot, 'start.js'),
    path.join(standaloneDir, 'start.js'),
    { overwrite: true }
  );
  console.log('✅ start.js copiado.');

  // 3. Copiar la carpeta 'scripts' completa al directorio standalone
  await fs.copy(
    path.join(projectRoot, 'scripts'),
    path.join(standaloneDir, 'scripts'),
    { overwrite: true }
  );
  console.log('✅ Carpeta de scripts copiada.');

  console.log('\n--- Iniciando empaquetado con pkg ---');
  
  // 4. Ejecutar pkg desde el directorio standalone, apuntando a nuestro 'start.js'
  const command = `pkg start.js --targets node18-win-x64 --output ${path.join(projectRoot, 'dist', 'liceo-app.exe')}`;
  
  const pkgProcess = exec(command, { cwd: standaloneDir });

  // Mostrar la salida de pkg en tiempo real
  pkgProcess.stdout.on('data', (data) => process.stdout.write(data));
  pkgProcess.stderr.on('data', (data) => process.stderr.write(data));

  pkgProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 ¡Empaquetado completado exitosamente!');
      console.log(`✨ Tu ejecutable está en la carpeta: dist`);
    } else {
      console.error(`\n❌ pkg finalizó con código de error: ${code}`);
      process.exit(1);
    }
  });
}

prepareAndPackage().catch(err => {
  console.error('🔥 Error durante el proceso de preparación y empaquetado:', err);
  process.exit(1);
});
