const fs = require('fs');

// Load locale files
const en = require('./src/locales/en.js');
const es = require('./src/locales/es.js');

// Load missing keys
const missingInEs = JSON.parse(fs.readFileSync('./missing_in_es.json', 'utf8'));
const missingInEn = JSON.parse(fs.readFileSync('./missing_in_en.json', 'utf8'));

// Helper to set nested value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Smart translator EN -> ES based on context
function translateEnToEs(key, value) {
  // Keep template variables intact
  const vars = value.match(/\{\{[^}]+\}\}/g) || [];
  
  // Domain-based translations
  if (key.includes('slash.description')) {
    // Command descriptions - translate action words
    return value
      .replace(/Configure/g, 'Configurar')
      .replace(/Manage/g, 'Gestionar')
      .replace(/View/g, 'Ver')
      .replace(/List/g, 'Listar')
      .replace(/Add/g, 'Agregar')
      .replace(/Remove/g, 'Quitar')
      .replace(/Create/g, 'Crear')
      .replace(/Set/g, 'Establecer')
      .replace(/Interactive/g, 'Sistema interactivo')
      .replace(/system/g, 'de niveles')
      .replace(/leveling/g, 'de niveles')
      .replace(/auto-role/g, 'auto-rol')
      .replace(/assignment/g, 'asignación')
      .replace(/automatic/g, 'automática')
      .replace(/reaction roles/g, 'roles por reacción')
      .replace(/join roles/g, 'roles de entrada')
      .replace(/level roles/g, 'roles de nivel')
      .replace(/Server/g, 'Servidor')
      .replace(/staff/g, 'staff')
      .replace(/statistics/g, 'estadísticas')
      .replace(/Weekly/g, 'Reporte semanal')
      .replace(/Report/g, 'Reporte')
      .replace(/wizard/g, 'asistente')
      .replace(/suggestions/g, 'sugerencias')
      .replace(/premium/g, 'premium')
      .replace(/PRO/g, 'PRO');
  }
  
  if (key.includes('slash.options') || key.includes('slash.subcommands.') && key.includes('.options')) {
    // Option descriptions
    return value
      .replace(/The target user/g, 'El usuario objetivo')
      .replace(/user/g, 'usuario')
      .replace(/Page number/g, 'Número de página')
      .replace(/to view/g, 'a ver')
      .replace(/Role to/g, 'Rol para')
      .replace(/assign/g, 'asignar')
      .replace(/when users join/g, 'cuando los usuarios se unan')
      .replace(/when reacting/g, 'al reaccionar')
      .replace(/Delay in seconds/g, 'Retraso en segundos')
      .replace(/before assigning/g, 'antes de asignar')
      .replace(/default:/g, 'predeterminado:')
      .replace(/Exclude bots/g, 'Excluir bots')
      .replace(/from receiving role/g, 'de recibir el rol')
      .replace(/Level required/g, 'Nivel requerido')
      .replace(/to receive/g, 'para recibir')
      .replace(/at this level/g, 'en este nivel')
      .replace(/Mode for/g, 'Modo para')
      .replace(/level/g, 'nivel')
      .replace(/stack or replace/g, 'acumular o reemplazar')
      .replace(/Level to remove/g, 'Nivel a quitar')
      .replace(/role from/g, 'rol de')
      .replace(/Emoji to/g, 'Emoji para')
      .replace(/react with/g, 'reaccionar con')
      .replace(/Message ID/g, 'ID del mensaje')
      .replace(/to add/g, 'para agregar')
      .replace(/reaction role/g, 'rol por reacción')
      .replace(/to remove/g, 'para quitar')
      .replace(/Channel to create/g, 'Canal donde crear')
      .replace(/the panel/g, 'el panel')
      .replace(/current/g, 'actual')
      .replace(/Description for/g, 'Descripción para')
      .replace(/Title for/g, 'Título para')
      .replace(/Channel to post/g, 'Canal donde publicar')
      .replace(/default/g, 'predeterminado')
      .replace(/Emoji to remove/g, 'Emoji a quitar')
      .replace(/channel/g, 'canal')
      .replace(/duration/g, 'duración')
      .replace(/period/g, 'período');
  }
  
  if (key.includes('crons.messageDelete')) {
    return value
      .replace(/Author/g, 'Autor')
      .replace(/Channel/g, 'Canal')
      .replace(/Content/g, 'Contenido')
      .replace(/Message ID/g, 'ID de Mensaje')
      .replace(/no text/g, 'sin texto')
      .replace(/Deleted message/g, 'Mensaje eliminado')
      .replace(/Unknown/g, 'Desconocido');
  }
  
  if (key.includes('crons.modlog')) {
    return value
      .replace(/User Banned/g, 'Usuario Baneado')
      .replace(/User Unbanned/g, 'Usuario Desbaneado')
      .replace(/Message Edited/g, 'Mensaje Editado')
      .replace(/Author/g, 'Autor')
      .replace(/Before/g, 'Antes')
      .replace(/After/g, 'Después')
      .replace(/Channel/g, 'Canal')
      .replace(/Executed by/g, 'Ejecutado por')
      .replace(/Message Link/g, 'Enlace del Mensaje')
      .replace(/Reason/g, 'Razón')
      .replace(/User/g, 'Usuario')
      .replace(/No reason specified/g, 'Sin razón especificada');
  }
  
  if (key.includes('poll')) {
    return value
      .replace(/You can only vote for up to/g, 'Solo puedes votar hasta')
      .replace(/options/g, 'opciones')
      .replace(/You must have the/g, 'Debes tener el')
      .replace(/role to vote/g, 'rol para votar')
      .replace(/Your current votes/g, 'Tus votos actuales')
      .replace(/You voted for/g, 'Votaste por')
      .replace(/Your vote has been removed/g, 'Tu voto ha sido removido');
  }
  
  if (key.includes('proadmin')) {
    return value
      .replace(/Assigned To/g, 'Asignado A')
      .replace(/Available/g, 'Disponible')
      .replace(/Codes/g, 'Códigos')
      .replace(/days/g, 'días')
      .replace(/Lifetime/g, 'Vitalicio')
      .replace(/Here is your exclusive PRO/g, 'Aquí está tu código PRO exclusivo')
      .replace(/redemption code/g, 'de canje')
      .replace(/Code/g, 'Código')
      .replace(/Duration/g, 'Duración')
      .replace(/Use this code/g, 'Usa este código')
      .replace(/to activate PRO/g, 'para activar PRO')
      .replace(/Failed/g, 'Fallido')
      .replace(/Sent/g, 'Enviado')
      .replace(/Error/g, 'Error')
      .replace(/Expired/g, 'Expirado')
      .replace(/Generated By/g, 'Generado Por')
      .replace(/How to Redeem/g, 'Cómo Canjear')
      .replace(/There was an error/g, 'Hubo un error')
      .replace(/generating/g, 'generando')
      .replace(/listing/g, 'listando')
      .replace(/Please try again/g, 'Por favor intenta de nuevo')
      .replace(/Here are your new/g, 'Aquí están tus nuevos')
      .replace(/PRO codes/g, 'códigos PRO')
      .replace(/with/g, 'con')
      .replace(/duration/g, 'duración')
      .replace(/Generated/g, 'Generado')
      .replace(/Code/g, 'Código')
      .replace(/count/g, 'cantidad');
  }
  
  if (key.includes('serverstats')) {
    return value
      .replace(/Current Stats/g, 'Estadísticas Actuales')
      .replace(/Growth/g, 'Crecimiento')
      .replace(/30-Day/g, '30 Días')
      .replace(/Channel Activity/g, 'Actividad por Canal')
      .replace(/Role Distribution/g, 'Distribución de Roles')
      .replace(/Support Statistics/g, 'Estadísticas de Soporte')
      .replace(/Response Times/g, 'Tiempos de Respuesta')
      .replace(/Avg Response/g, 'Promedio Respuesta')
      .replace(/Avg Resolution/g, 'Promedio Resolución')
      .replace(/Top Staff/g, 'Staff Destacado')
      .replace(/All Time/g, 'Histórico')
      .replace(/messages/g, 'mensajes')
      .replace(/Top/g, 'Top')
      .replace(/channels/g, 'canales')
      .replace(/Most Active Users/g, 'Usuarios más Activos')
      .replace(/Peak Hour/g, 'Hora Pico')
      .replace(/with/g, 'con')
      .replace(/Period/g, 'Período')
      .replace(/Showing top/g, 'Mostrando top');
  }
  
  if (key.includes('staff_rating')) {
    return value
      .replace(/Average/g, 'Promedio')
      .replace(/Distribution/g, 'Distribución')
      .replace(/Leaderboard/g, 'Tabla de Clasificación')
      .replace(/No ratings/g, 'Sin calificaciones')
      .replace(/yet/g, 'aún')
      .replace(/This staff member/g, 'Este miembro del staff')
      .replace(/hasn't been rated/g, 'no ha sido calificado')
      .replace(/Total Ratings/g, 'Calificaciones Totales')
      .replace(/Star/g, 'Estrella')
      .replace(/Rating/g, 'Calificación')
      .replace(/Trend/g, 'Tendencia')
      .replace(/Excellent/g, 'Excelente')
      .replace(/Good/g, 'Bueno')
      .replace(/Average/g, 'Promedio')
      .replace(/Needs Improvement/g, 'Necesita Mejora');
  }
  
  if (key.includes('suggest')) {
    return value
      .replace(/approved/g, 'aprobado')
      .replace(/rejected/g, 'rechazado')
      .replace(/Status updated/g, 'Estado actualizado')
      .replace(/via thread/g, 'vía hilo')
      .replace(/Staff Comment/g, 'Comentario del Staff')
      .replace(/Reviewed/g, 'Revisado')
      .replace(/on/g, 'el')
      .replace(/Please wait/g, 'Por favor espera')
      .replace(/minutes between/g, 'minutos entre')
      .replace(/suggestions/g, 'sugerencias')
      .replace(/Cooldown/g, 'Enfriamiento')
      .replace(/Your suggestion/g, 'Tu sugerencia')
      .replace(/has been/g, 'ha sido')
      .replace(/Suggestion/g, 'Sugerencia')
      .replace(/Auto-thread created/g, 'Hilo auto-creado')
      .replace(/Staff note updated/g, 'Nota del staff actualizada');
  }
  
  if (key.includes('ticket.labels')) {
    return value
      .replace(/Assigned/g, 'Asignado')
      .replace(/Category/g, 'Categoría')
      .replace(/Claimed/g, 'Reclamado')
      .replace(/Priority/g, 'Prioridad')
      .replace(/Status/g, 'Estado');
  }
  
  if (key.includes('verify.audit')) {
    return value
      .replace(/completed/g, 'completado')
      .replace(/removed/g, 'removido')
      .replace(/Verification/g, 'Verificación');
  }
  
  if (key.includes('weekly_report')) {
    return value
      .replace(/Weekly Activity Report/g, 'Reporte Semanal de Actividad')
      .replace(/Tickets Opened/g, 'Tickets Abiertos')
      .replace(/Tickets Closed/g, 'Tickets Cerrados')
      .replace(/Currently Open/g, 'Actualmente Abiertos')
      .replace(/Active Categories/g, 'Categorías Activas')
      .replace(/Avg Response Time/g, 'Tiempo Promedio de Respuesta')
      .replace(/Avg Rating/g, 'Calificación Promedio')
      .replace(/Top Staff This Week/g, 'Staff Destacado Esta Semana')
      .replace(/No data available/g, 'No hay datos disponibles')
      .replace(/Report for/g, 'Reporte para');
  }
  
  if (key.includes('wizard')) {
    return value
      .replace(/Setup Wizard/g, 'Asistente de Configuración')
      .replace(/Complete server setup/g, 'Configuración completa del servidor')
      .replace(/in a few steps/g, 'en pocos pasos')
      .replace(/Next Step/g, 'Siguiente Paso')
      .replace(/Summary/g, 'Resumen')
      .replace(/Free Plan/g, 'Plan Gratuito')
      .replace(/PRO Plan/g, 'Plan PRO')
      .replace(/Panel Status/g, 'Estado del Panel')
      .replace(/Published/g, 'Publicado')
      .replace(/Skipped/g, 'Omitido')
      .replace(/Error/g, 'Error')
      .replace(/Missing Permissions/g, 'Faltan Permisos');
  }
  
  if (key.includes('setup.slash.groups.tickets.playbook')) {
    return value
      .replace(/Manage ticket playbooks/g, 'Gestionar playbooks de tickets')
      .replace(/View and manage/g, 'Ver y gestionar')
      .replace(/automation playbooks/g, 'playbooks de automatización')
      .replace(/List all/g, 'Listar todos')
      .replace(/available playbooks/g, 'playbooks disponibles')
      .replace(/Enable a/g, 'Habilitar un')
      .replace(/playbook for/g, 'playbook para')
      .replace(/this server/g, 'este servidor')
      .replace(/Disable/g, 'Deshabilitar')
      .replace(/Confirm/g, 'Confirmar')
      .replace(/Dismiss/g, 'Descartar')
      .replace(/Apply macro/g, 'Aplicar macro')
      .replace(/from playbook/g, 'del playbook')
      .replace(/to ticket/g, 'al ticket')
      .replace(/Catalog/g, 'Catálogo')
      .replace(/Current Plan/g, 'Plan Actual')
      .replace(/Enabled Count/g, 'Cantidad Habilitada')
      .replace(/Enabled Playbooks/g, 'Playbooks Habilitados')
      .replace(/Pending Recommendations/g, 'Recomendaciones Pendientes')
      .replace(/Event/g, 'Evento')
      .replace(/Applied/g, 'Aplicado')
      .replace(/Confirmed/g, 'Confirmado')
      .replace(/Dismissed/g, 'Descartado')
      .replace(/Macro Applied/g, 'Macro Aplicada')
      .replace(/Internal Note/g, 'Nota Interna')
      .replace(/empty/g, 'vacío')
      .replace(/Staff Only/g, 'Solo Staff')
      .replace(/Admin Only/g, 'Solo Admin')
      .replace(/Ticket Only/g, 'Solo Ticket')
      .replace(/Not Found/g, 'No Encontrado')
      .replace(/No macro/g, 'Sin macro')
      .replace(/Unknown subcommand/g, 'Subcomando desconocido')
      .replace(/Recommendation/g, 'Recomendación')
      .replace(/Recommendation staff only/g, 'Recomendación solo para staff')
      .replace(/Playbook not found/g, 'Playbook no encontrado');
  }
  
  if (key.includes('staff.staff_no_data')) {
    return value
      .replace(/No Data Available/g, 'No Hay Datos Disponibles')
      .replace(/No staff activity/g, 'Sin actividad de staff')
      .replace(/has been recorded/g, 'ha sido registrada')
      .replace(/for this period/g, 'para este período');
  }
  
  // Default: return original with common word replacements
  return value
    .replace(/\bLevel\b/g, 'Nivel')
    .replace(/\bAuthor\b/g, 'Autor')
    .replace(/\bChannel\b/g, 'Canal')
    .replace(/\bContent\b/g, 'Contenido')
    .replace(/\bDeleted\b/g, 'Eliminado')
    .replace(/\bMessage\b/g, 'Mensaje')
    .replace(/\bUnknown\b/g, 'Desconocido')
    .replace(/\bUser\b/g, 'Usuario')
    .replace(/\bBanned\b/g, 'Baneado')
    .replace(/\bUnbanned\b/g, 'Desbaneado')
    .replace(/\bReason\b/g, 'Razón')
    .replace(/\bBefore\b/g, 'Antes')
    .replace(/\bAfter\b/g, 'Después')
    .replace(/\bExecuted by\b/g, 'Ejecutado por')
    .replace(/\bLink\b/g, 'Enlace')
    .replace(/\bDescription\b/g, 'Descripción')
    .replace(/\boptions\b/g, 'opciones')
    .replace(/\bvote\b/g, 'voto')
    .replace(/\bremoved\b/g, 'removido')
    .replace(/\bActive\b/g, 'Activo')
    .replace(/\bAssigned To\b/g, 'Asignado A')
    .replace(/\bAvailable\b/g, 'Disponible')
    .replace(/\bCodes\b/g, 'Códigos')
    .replace(/\bdays\b/g, 'días')
    .replace(/\bLifetime\b/g, 'Vitalicio')
    .replace(/\bFailed\b/g, 'Fallido')
    .replace(/\bSent\b/g, 'Enviado')
    .replace(/\bError\b/g, 'Error')
    .replace(/\bExpired\b/g, 'Expirado')
    .replace(/\bGenerated By\b/g, 'Generado Por')
    .replace(/\bHow to Redeem\b/g, 'Cómo Canjear')
    .replace(/\boverview\b/g, 'vista general')
    .replace(/\bOpen\b/g, 'Abierto')
    .replace(/\bClosed\b/g, 'Cerrado')
    .replace(/\bPeriod\b/g, 'Período')
    .replace(/\bShowing\b/g, 'Mostrando')
    .replace(/\bStaff\b/g, 'Staff')
    .replace(/\bRating\b/g, 'Calificación')
    .replace(/\bAverage\b/g, 'Promedio')
    .replace(/\bDistribution\b/g, 'Distribución')
    .replace(/\bNo ratings\b/g, 'Sin calificaciones')
    .replace(/\bTotal\b/g, 'Total')
    .replace(/\bExcellent\b/g, 'Excelente')
    .replace(/\bGood\b/g, 'Bueno')
    .replace(/\bNeeds Improvement\b/g, 'Necesita Mejora')
    .replace(/\bTrend\b/g, 'Tendencia')
    .replace(/\bapproved\b/g, 'aprobado')
    .replace(/\brejected\b/g, 'rechazado')
    .replace(/\bAudit\b/g, 'Auditoría')
    .replace(/\bReviewed\b/g, 'Revisado')
    .replace(/\bCooldown\b/g, 'Enfriamiento')
    .replace(/\bminutes\b/g, 'minutos')
    .replace(/\bassigned\b/g, 'asignado')
    .replace(/\bclaimed\b/g, 'reclamado')
    .replace(/\bpriority\b/g, 'prioridad')
    .replace(/\bstatus\b/g, 'estado')
    .replace(/\bcategory\b/g, 'categoría')
    .replace(/\bcompleted\b/g, 'completado')
    .replace(/\bWeekly\b/g, 'Semanal')
    .replace(/\bReport\b/g, 'Reporte')
    .replace(/\bResponse\b/g, 'Tiempo de Respuesta')
    .replace(/\bTime\b/g, 'Tiempo')
    .replace(/\bTickets\b/g, 'Tickets')
    .replace(/\bWizard\b/g, 'Asistente')
    .replace(/\bSummary\b/g, 'Resumen')
    .replace(/\bNext Step\b/g, 'Siguiente Paso')
    .replace(/\bPublished\b/g, 'Publicado')
    .replace(/\bSkipped\b/g, 'Omitido')
    .replace(/\bMissing\b/g, 'Faltan')
    .replace(/\bPermissions\b/g, 'Permisos')
    .replace(/\bno data\b/g, 'sin datos')
    .replace(/\bFree\b/g, 'Gratis')
    .replace(/\bPRO\b/g, 'PRO')
    .replace(/\bMacro\b/g, 'Macro')
    .replace(/\bPlaybook\b/g, 'Playbook')
    .replace(/\bCatalog\b/g, 'Catálogo')
    .replace(/\bEnabled\b/g, 'Habilitado')
    .replace(/\bPending\b/g, 'Pendiente')
    .replace(/\bRecommendation\b/g, 'Recomendación')
    .replace(/\bConfirm\b/g, 'Confirmar')
    .replace(/\bDismiss\b/g, 'Descartar')
    .replace(/\bApply\b/g, 'Aplicar')
    .replace(/\bEvent\b/g, 'Evento')
    .replace(/\bPlan\b/g, 'Plan')
    .replace(/\bStaff Only\b/g, 'Solo Staff')
    .replace(/\bAdmin Only\b/g, 'Solo Admin')
    .replace(/\bTicket Only\b/g, 'Solo Ticket')
    .replace(/\bNot Found\b/g, 'No Encontrado')
    .replace(/\bevents\b/g, 'eventos')
    .replace(/\brecommendations\b/g, 'recomendaciones')
    .replace(/\bempty\b/g, 'vacío')
    .replace(/\bcurrent\b/g, 'actual')
    .replace(/\bplan\b/g, 'plan')
    .replace(/\bfield\b/g, 'campo')
    .replace(/\bcount\b/g, 'cantidad')
    .replace(/\bfooter\b/g, 'pie de página')
    .replace(/\btitle\b/g, 'título')
    .replace(/\bsuccess\b/g, 'éxito')
    .replace(/\berror\b/g, 'error')
    .replace(/\bgroup\b/g, 'grupo')
    .replace(/\bdisabled\b/g, 'deshabilitado')
    .replace(/\benabled\b/g, 'habilitado')
    .replace(/\binternal\b/g, 'interno')
    .replace(/\bnote\b/g, 'nota')
    .replace(/\boption\b/g, 'opción')
    .replace(/\bWarning\b/g, 'Advertencia')
    .replace(/\bError\b/g, 'Error')
    .replace(/\bInaccessible\b/g, 'Inaccesible')
    .replace(/\bTranscript\b/g, 'Transcripción')
    .replace(/\bManual\b/g, 'Manual')
    .replace(/\bArchive\b/g, 'Archivar');
}

// Smart translator ES -> EN based on context
function translateEsToEn(key, value) {
  // Reverse translations - ES to EN
  // For slash commands and options
  if (key.includes('slash.description') || key.includes('.options.') || key.includes('slash.subcommands')) {
    return value
      .replace(/Configurar/g, 'Configure')
      .replace(/Gestionar/g, 'Manage')
      .replace(/Ver/g, 'View')
      .replace(/Listar/g, 'List')
      .replace(/Agregar/g, 'Add')
      .replace(/Quitar/g, 'Remove')
      .replace(/Crear/g, 'Create')
      .replace(/Establecer/g, 'Set')
      .replace(/Sistema interactivo/g, 'Interactive system')
      .replace(/de niveles/g, 'leveling')
      .replace(/auto-rol/g, 'auto-role')
      .replace(/asignación/g, 'assignment')
      .replace(/automática/g, 'automatic')
      .replace(/roles por reacción/g, 'reaction roles')
      .replace(/roles de entrada/g, 'join roles')
      .replace(/roles de nivel/g, 'level roles')
      .replace(/Servidor/g, 'Server')
      .replace(/staff/g, 'staff')
      .replace(/estadísticas/g, 'statistics')
      .replace(/Reporte semanal/g, 'Weekly Report')
      .replace(/asistente/g, 'wizard')
      .replace(/sugerencias/g, 'suggestions')
      .replace(/premium/g, 'premium')
      .replace(/El usuario objetivo/g, 'The target user')
      .replace(/usuario/g, 'user')
      .replace(/Número de página/g, 'Page number')
      .replace(/a ver/g, 'to view')
      .replace(/Rol para/g, 'Role to')
      .replace(/asignar/g, 'assign')
      .replace(/cuando los usuarios se unan/g, 'when users join')
      .replace(/al reaccionar/g, 'when reacting')
      .replace(/Retraso en segundos/g, 'Delay in seconds')
      .replace(/antes de asignar/g, 'before assigning')
      .replace(/predeterminado/g, 'default')
      .replace(/Excluir bots/g, 'Exclude bots')
      .replace(/de recibir el rol/g, 'from receiving role')
      .replace(/Nivel requerido/g, 'Level required')
      .replace(/para recibir/g, 'to receive')
      .replace(/en este nivel/g, 'at this level')
      .replace(/Modo para/g, 'Mode for')
      .replace(/nivel/g, 'level')
      .replace(/acumular o reemplazar/g, 'stack or replace')
      .replace(/Nivel a quitar/g, 'Level to remove')
      .replace(/rol de/g, 'role from')
      .replace(/Emoji para/g, 'Emoji to')
      .replace(/reaccionar con/g, 'react with')
      .replace(/ID del mensaje/g, 'Message ID')
      .replace(/para agregar/g, 'to add')
      .replace(/rol por reacción/g, 'reaction role')
      .replace(/para quitar/g, 'to remove')
      .replace(/Canal donde crear/g, 'Channel to create')
      .replace(/el panel/g, 'the panel')
      .replace(/actual/g, 'current')
      .replace(/Descripción para/g, 'Description for')
      .replace(/Título para/g, 'Title for')
      .replace(/Canal donde publicar/g, 'Channel to post')
      .replace(/canal/g, 'channel')
      .replace(/duración/g, 'duration')
      .replace(/período/g, 'period');
  }
  
  // Common reverse translations
  return value
    .replace(/\bNivel\b/g, 'Level')
    .replace(/\bAutor\b/g, 'Author')
    .replace(/\bCanal\b/g, 'Channel')
    .replace(/\bContenido\b/g, 'Content')
    .replace(/\bEliminado\b/g, 'Deleted')
    .replace(/\bMensaje\b/g, 'Message')
    .replace(/\bDesconocido\b/g, 'Unknown')
    .replace(/\bUsuario\b/g, 'User')
    .replace(/\bBaneado\b/g, 'Banned')
    .replace(/\bDesbaneado\b/g, 'Unbanned')
    .replace(/\bRazón\b/g, 'Reason')
    .replace(/\bAntes\b/g, 'Before')
    .replace(/\bDespués\b/g, 'After')
    .replace(/\bEjecutado por\b/g, 'Executed by')
    .replace(/\bEnlace\b/g, 'Link')
    .replace(/\bDescripción\b/g, 'Description')
    .replace(/\bopciones\b/g, 'options')
    .replace(/\bvoto\b/g, 'vote')
    .replace(/\bremovido\b/g, 'removed')
    .replace(/\bActivo\b/g, 'Active')
    .replace(/\bAsignado A\b/g, 'Assigned To')
    .replace(/\bDisponible\b/g, 'Available')
    .replace(/\bCódigos\b/g, 'Codes')
    .replace(/\bdías\b/g, 'days')
    .replace(/\bVitalicio\b/g, 'Lifetime')
    .replace(/\bFallido\b/g, 'Failed')
    .replace(/\bEnviado\b/g, 'Sent')
    .replace(/\bError\b/g, 'Error')
    .replace(/\bExpirado\b/g, 'Expired')
    .replace(/\bGenerado Por\b/g, 'Generated By')
    .replace(/\bCómo Canjear\b/g, 'How to Redeem')
    .replace(/\bvista general\b/g, 'overview')
    .replace(/\bAbierto\b/g, 'Open')
    .replace(/\bCerrado\b/g, 'Closed')
    .replace(/\bPeríodo\b/g, 'Period')
    .replace(/\bMostrando\b/g, 'Showing')
    .replace(/\bStaff\b/g, 'Staff')
    .replace(/\bCalificación\b/g, 'Rating')
    .replace(/\bPromedio\b/g, 'Average')
    .replace(/\bDistribución\b/g, 'Distribution')
    .replace(/\bSin calificaciones\b/g, 'No ratings')
    .replace(/\bTotal\b/g, 'Total')
    .replace(/\bExcelente\b/g, 'Excellent')
    .replace(/\bBueno\b/g, 'Good')
    .replace(/\bNecesita Mejora\b/g, 'Needs Improvement')
    .replace(/\bTendencia\b/g, 'Trend')
    .replace(/\baprobado\b/g, 'approved')
    .replace(/\brechazado\b/g, 'rejected')
    .replace(/\bAuditoría\b/g, 'Audit')
    .replace(/\bRevisado\b/g, 'Reviewed')
    .replace(/\bEnfriamiento\b/g, 'Cooldown')
    .replace(/\bminutos\b/g, 'minutes')
    .replace(/\basignado\b/g, 'assigned')
    .replace(/\breclamado\b/g, 'claimed')
    .replace(/\bprioridad\b/g, 'priority')
    .replace(/\bestado\b/g, 'status')
    .replace(/\bcategoría\b/g, 'category')
    .replace(/\bcompletado\b/g, 'completed')
    .replace(/\bSemanal\b/g, 'Weekly')
    .replace(/\bReporte\b/g, 'Report')
    .replace(/\bTiempo de Respuesta\b/g, 'Response Time')
    .replace(/\bTiempo\b/g, 'Time')
    .replace(/\bTickets\b/g, 'Tickets')
    .replace(/\bAsistente\b/g, 'Wizard')
    .replace(/\bResumen\b/g, 'Summary')
    .replace(/\bSiguiente Paso\b/g, 'Next Step')
    .replace(/\bPublicado\b/g, 'Published')
    .replace(/\bOmitido\b/g, 'Skipped')
    .replace(/\bFaltan\b/g, 'Missing')
    .replace(/\bPermisos\b/g, 'Permissions')
    .replace(/\bsin datos\b/g, 'no data')
    .replace(/\bGratis\b/g, 'Free')
    .replace(/\bPRO\b/g, 'PRO')
    .replace(/\bMacro\b/g, 'Macro')
    .replace(/\bPlaybook\b/g, 'Playbook')
    .replace(/\bCatálogo\b/g, 'Catalog')
    .replace(/\bHabilitado\b/g, 'Enabled')
    .replace(/\bPendiente\b/g, 'Pending')
    .replace(/\bRecomendación\b/g, 'Recommendation')
    .replace(/\bConfirmar\b/g, 'Confirm')
    .replace(/\bDescartar\b/g, 'Dismiss')
    .replace(/\bAplicar\b/g, 'Apply')
    .replace(/\bEvento\b/g, 'Event')
    .replace(/\bPlan\b/g, 'Plan')
    .replace(/\bSolo Staff\b/g, 'Staff Only')
    .replace(/\bSolo Admin\b/g, 'Admin Only')
    .replace(/\bSolo Ticket\b/g, 'Ticket Only')
    .replace(/\bNo Encontrado\b/g, 'Not Found')
    .replace(/\beventos\b/g, 'events')
    .replace(/\brecomendaciones\b/g, 'recommendations')
    .replace(/\bvacío\b/g, 'empty')
    .replace(/\bactual\b/g, 'current')
    .replace(/\bplan\b/g, 'plan')
    .replace(/\bcampo\b/g, 'field')
    .replace(/\bcantidad\b/g, 'count')
    .replace(/\bpie de página\b/g, 'footer')
    .replace(/\btítulo\b/g, 'title')
    .replace(/\béxito\b/g, 'success')
    .replace(/\berror\b/g, 'error')
    .replace(/\bgrupo\b/g, 'group')
    .replace(/\bdeshabilitado\b/g, 'disabled')
    .replace(/\bhabilitado\b/g, 'enabled')
    .replace(/\binterno\b/g, 'internal')
    .replace(/\bnota\b/g, 'note')
    .replace(/\bopción\b/g, 'option')
    .replace(/\bAdvertencia\b/g, 'Warning')
    .replace(/\bInaccesible\b/g, 'Inaccessible')
    .replace(/\bTranscripción\b/g, 'Transcript')
    .replace(/\bManual\b/g, 'Manual')
    .replace(/\bArchivar\b/g, 'Archive')
    // Additional common terms
    .replace(/\bReemplazar\b/g, 'Replace')
    .replace(/\bAcumular\b/g, 'Stack')
    .replace(/\bRemover roles de nivel anteriores\b/g, 'Remove previous level roles')
    .replace(/\bMantener todos los roles de nivel anteriores\b/g, 'Keep all previous level roles')
    .replace(/\bdías\b/g, 'days')
    .replace(/\bsemanas\b/g, 'weeks')
    .replace(/\bhoras\b/g, 'hours')
    .replace(/\bminutos\b/g, 'minutes');
}

console.log('Aplicando traducciones...');

// Helper to generate default value from key
function generateDefaultValue(key) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  // Convert snake_case or camelCase to readable text
  return lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Apply translations to missing keys
for (const item of missingInEs) {
  const key = typeof item === 'string' ? item : item.key;
  const value = typeof item === 'string' ? generateDefaultValue(item) : (item.value || generateDefaultValue(item.key));
  const translated = translateEnToEs(key, value);
  setNestedValue(es, key, translated);
}

for (const item of missingInEn) {
  const key = typeof item === 'string' ? item : item.key;
  const value = typeof item === 'string' ? generateDefaultValue(item) : (item.value || generateDefaultValue(item.key));
  const translated = translateEsToEn(key, value);
  setNestedValue(en, key, translated);
}

// Sort keys recursively
function sortKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeys(obj[key]);
  }
  return sorted;
}

const sortedEn = sortKeys(en);
const sortedEs = sortKeys(es);

// Write back to files
const enContent = 'module.exports = ' + JSON.stringify(sortedEn, null, 2) + ';\n';
const esContent = 'module.exports = ' + JSON.stringify(sortedEs, null, 2) + ';\n';

fs.writeFileSync('./src/locales/en.js', enContent);
fs.writeFileSync('./src/locales/es.js', esContent);

console.log('✅ Traducciones aplicadas:');
console.log(`- Agregadas ${missingInEs.length} claves a es.js`);
console.log(`- Agregadas ${missingInEn.length} claves a en.js`);
console.log('\n✅ Archivos guardados:');
console.log('- src/locales/en.js');
console.log('- src/locales/es.js');
