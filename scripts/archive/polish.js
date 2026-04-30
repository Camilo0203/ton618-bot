const fs = require('fs');
const path = require('path');

function polish() {
  const esPath = path.join(__dirname, 'src/locales/es.js');
  let content = fs.readFileSync(esPath, 'utf8');

  // Spelling corrections for Spanish (case-insensitive where possible)
  const map = {
    'razon': 'razón',
    'descripcion': 'descripción',
    'configuracion': 'configuración',
    'operacion': 'operación',
    'sesion': 'sesión',
    'exito': 'éxito',
    'atencion': 'atención',
    'duracion': 'duración',
    'categoria': 'categoría',
    'estatus': 'estado', // Prefer "estado" for better UI
    'notificacion': 'notificación',
    'verificacion': 'verificación',
    'autenticacion': 'autenticación'
  };

  for (const [old, newVal] of Object.entries(map)) {
    // Replace standalone words using regex boundaries
    const regex = new RegExp(`\\b${old}\\b`, 'gi');
    content = content.replace(regex, (match) => {
      // Preserve case
      if (match === match.toUpperCase()) return newVal.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return newVal[0].toUpperCase() + newVal.slice(1);
      return newVal;
    });
  }

  // Common UI refinements
  content = content.replace(/Utilidades de gestión y moderación exclusivas para el staff/g, '✨ Utilidades de gestión y moderación exclusivas para el personal');

  fs.writeFileSync(esPath, content);
  console.log('[POLISHED] es.js');
}

polish();
