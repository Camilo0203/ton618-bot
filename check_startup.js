
const path = require('path');
const fs = require('fs');

console.log("=== SIMULACIÓN DE INICIO DEL BOT ===");

try {
    // 1. Cargar traducciones
    console.log("Checking locales...");
    const en = require('./src/locales/en.js');
    const es = require('./src/locales/es.js');
    console.log("✅ Locales cargados correctamente.");

    // 2. Probar la función t()
    const { t } = require('./src/utils/i18n.js');
    const testKey = "common.yes";
    if (t('en', testKey) === 'Yes' && t('es', testKey) === 'Sí') {
        console.log("✅ Función t() operativa.");
    } else {
        throw new Error("t() no devolvió las traducciones esperadas para " + testKey);
    }

    // 3. Simular carga de comandos (como lo hace index.js)
    console.log("Checking command loading...");
    const { loadAndValidateCommands } = require('./src/utils/commandLoader');
    const commandsPath = path.join(__dirname, 'src/commands');
    const { commands, validationErrors } = loadAndValidateCommands(commandsPath);
    
    if (validationErrors.length > 0) {
        console.error("❌ Errores de validación en comandos:");
        validationErrors.forEach(e => console.error("   - " + e));
        process.exit(1);
    }
    console.log(`✅ ${commands.length} comandos validados sin errores de estructura.`);

    // 4. Verificar archivos de eventos
    console.log("Checking events...");
    const eventsPath = path.join(__dirname, 'src/events');
    const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
    for (const file of eventFiles) {
        require(path.join(eventsPath, file));
    }
    console.log(`✅ ${eventFiles.length} archivos de eventos cargados sin errores de sintaxis.`);

    console.log("\n🚀 RESULTADO: El bot pasaría las pruebas de inicio (sintaxis y estructura).");
    process.exit(0);

} catch (err) {
    console.error("\n❌ ERROR CRÍTICO EN EL INICIO:");
    console.error(err.stack);
    process.exit(1);
}
