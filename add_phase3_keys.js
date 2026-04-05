const fs = require('fs');

const enPath = 'c:/Users/Camilo/Desktop/ton618-bot/src/locales/en.js';
const esPath = 'c:/Users/Camilo/Desktop/ton618-bot/src/locales/es.js';

function flattenKeys(obj, prefix = '') {
    let result = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(result, flattenKeys(obj[key], fullKey));
        } else {
            result[fullKey] = obj[key];
        }
    }
    return result;
}

function updateLocale(path, newKeys) {
    let content = fs.readFileSync(path, 'utf8');
    const lastBraceIndex = content.lastIndexOf('};');
    if (lastBraceIndex === -1) {
        console.error(`Could not find closing brace in ${path}`);
        return;
    }

    const flatKeys = flattenKeys(newKeys);
    let entries = '';
    for (const [fullKeyName, value] of Object.entries(flatKeys)) {
        const quotedKey = `"${fullKeyName}"`;
        if (!content.includes(quotedKey)) {
            entries += `  ${quotedKey}: "${String(value).replace(/"/g, '\\"')}",\n`;
        }
    }

    if (entries) {
        const newContent = content.slice(0, lastBraceIndex) + entries + content.slice(lastBraceIndex);
        fs.writeFileSync(path, newContent);
        console.log(`Updated ${path} with ${entries.split('\n').length - 1} keys.`);
    } else {
        console.log(`No new keys to add to ${path}.`);
    }
}

const finalKeysEn = {
    economy: {
        buy: {
            not_found: "Item not found in the shop.",
            insufficient_funds: "You need {{price}} coins. You have {{wallet}}.",
            crate_win: "You won {{reward}} coins from the crate!",
            success: "You bought {{name}}!",
            error: "Error processing the purchase."
        }
    },
    common: {
        units: {
            minutes_short: "m",
            hours_short: "h",
            days_short: "d",
            weeks_short: "w"
        }
    },
    ticket: {
        workflow: {
            waiting_staff: "Waiting for staff",
            waiting_user: "Waiting for user",
            triage: "Under review",
            assigned: "Assigned",
            open: "Open",
            closed: "Closed"
        },
        labels: {
            category: "Category",
            priority: "Priority",
            assigned: "Assigned to",
            claimed: "Claimed by",
            status: "Status"
        }
    },
    giveaway: {
        embed: {
            prize: "Prize",
            winners: "Winners",
            ends: "Ends",
            hosted_by: "Hosted by",
            click_participant: "Click the button below to join!",
            participate_label: "Join Giveaway",
            status_ended: "Giveaway Ended",
            status_no_participants: "No valid participants.",
            status_cancelled: "Giveaway cancelled.",
            winners_announcement: "Congratulations {{winners}}! You won **{{prize}}**!",
            reroll_announcement: "New winner(s): {{winners}}! Congratulations, you won **{{prize}}**!"
        },
        requirements: {
            role: "Required Role: {{role}}",
            level: "Required Level: {{level}}",
            account_age: "Minimum Account Age: {{days}} days"
        },
        success: {
            created: "Giveaway created in {{channel}}! [Jump to Message]({{url}})",
            ended: "Giveaway ended! Winners: {{winners}}",
            rerolled: "Reroll complete! New winners: {{winners}}",
            cancelled: "Giveaway cancelled successfully."
        },
        errors: {
            not_found: "Giveaway not found.",
            already_ended: "This giveaway has already ended.",
            no_participants: "No participants joined the giveaway.",
            no_active: "There are no active giveaways.",
            create_failed: "Failed to create the giveaway.",
            end_failed: "Failed to end the giveaway.",
            reroll_failed: "Failed to reroll the giveaway.",
            cancel_failed: "Failed to cancel the giveaway."
        }
    },
    suggest: {
        audit: {
            approved: "Suggestion approved by {{user}}",
            rejected: "Suggestion rejected by {{user}}",
            thread_reason: "Debate thread for suggestion #{{num}}"
        }
    },
    verify: {
        audit: {
            completed: "Verification completed",
            removed: "Verification removed"
        }
    },
    help: {
        embed: {
            home_title: "TON618 Help Center",
            home_desc: "Welcome to the help center for **{{guild}}**. Select a category below to explore commands.",
            home_footer: "TON618 Security & Support • {{guild}}",
            home_overview: "System Overview",
            home_overview_value: "Advanced ticket management, multi-language support, and utility tools for pro-tier servers.",
            home_visibility: "Your Access",
            home_visibility_value: "Tier: **{{access}}**\nAvailable: **{{commands}}** commands across **{{categories}}** categories.\n{{simple_help}}",
            home_categories: "Available Categories",
            home_quick_start: "Quick Start Suggestions",
            category_title: "{{category}} Commands",
            category_desc: "Detailed documentation for this command group.",
            category_footer: "TON618 System • {{guild}}",
            command_footer: "TON618 Manual • {{guild}}",
            command_desc: "**Overview:** {{summary}}\n**Category:** {{category}}\n**Access:** \`{{access}}\`",
            focused_match: "Focused match: \`{{usage}}\`",
            and_word: "and",
            required_label: "Required",
            optional_label: "Optional",
            no_description: "No description provided.",
            command_not_found: "Command Not Found",
            command_not_found_desc: "Could not find any command matching \`{{command}}\`.",
            page_label: "Page",
            continued_suffix: " (cont.)",
            overview_prefix: "Overview",
            visible_commands_label: "Interactive Commands",
            visible_entries_label: "Unique Usages",
            command_singular: "command",
            command_plural: "commands",
            visible_entry_singular: "usage",
            visible_entry_plural: "usages",
            simple_help_note: "*(Note: Some advanced commands are hidden due to Simple Help mode)*",
            categories: {
                utility: "Utility",
                tickets: "Tickets",
                fun: "Community & Fun",
                moderation: "Moderation",
                config: "Configuration",
                system: "System & Internal",
                general: "General",
                other: "Other",
                owner: "Owner",
                admin: "Administrator",
                staff: "Staff Member",
                member: "Regular Member"
            },
            quick_start_notes: {
                ticket_open: "Open a support ticket",
                help_base: "Return to this menu",
                staff_my_tickets: "View your assigned tickets",
                ticket_claim: "Take control of a ticket",
                ticket_note_add: "Add internal staff note",
                modlogs_info: "Check moderation history",
                setup_wizard: "Launch setup assistant",
                config_status: "Check guild configuration",
                verify_panel: "Deploy verification system",
                stats_sla: "View ticket SLA reports",
                debug_status: "Check bot vitals"
            }
        }
    }
};

const finalKeysEs = {
    economy: {
        buy: {
            not_found: "El item no existe en la tienda.",
            insufficient_funds: "Necesitas {{price}} monedas. Tienes {{wallet}}.",
            crate_win: "¡Ganaste {{reward}} monedas de la caja!",
            success: "¡Compraste {{name}}!",
            error: "Error al procesar la compra."
        }
    },
    common: {
        units: {
            minutes_short: "m",
            hours_short: "h",
            days_short: "d",
            weeks_short: "sem"
        }
    },
    ticket: {
        workflow: {
            waiting_staff: "Esperando staff",
            waiting_user: "Esperando usuario",
            triage: "En revisión",
            assigned: "Asignado",
            open: "Abierto",
            closed: "Cerrado"
        },
        labels: {
            category: "Categoría",
            priority: "Prioridad",
            assigned: "Asignado a",
            claimed: "Reclamado por",
            status: "Estado"
        }
    },
    giveaway: {
        embed: {
            prize: "Premio",
            winners: "Ganadores",
            ends: "Finaliza",
            hosted_by: "Organizado por",
            click_participant: "¡Haz clic en el botón de abajo para participar!",
            participate_label: "Participar",
            status_ended: "Sorteo Finalizado",
            status_no_participants: "No hubo participantes válidos.",
            status_cancelled: "Sorteo cancelado.",
            winners_announcement: "¡Felicidades {{winners}}! Ganaste **{{prize}}**!",
            reroll_announcement: "¡Nuevos ganadores: {{winners}}! Felicidades, ganaron **{{prize}}**!"
        },
        requirements: {
            role: "Rol Requerido: {{role}}",
            level: "Nivel Requerido: {{level}}",
            account_age: "Antigüedad mínima: {{days}} días"
        },
        success: {
            created: "¡Sorteo creado en {{channel}}! [Ir al mensaje]({{url}})",
            ended: "¡Sorteo finalizado! Ganadores: {{winners}}",
            rerolled: "¡Reroll completado! Nuevos ganadores: {{winners}}",
            cancelled: "Sorteo cancelado correctamente."
        },
        errors: {
            not_found: "Sorteo no encontrado.",
            already_ended: "Este sorteo ya ha finalizado.",
            no_participants: "No se unieron participantes al sorteo.",
            no_active: "No hay sorteos activos.",
            create_failed: "Error al crear el sorteo.",
            end_failed: "Error al finalizar el sorteo.",
            reroll_failed: "Error al realizar el reroll.",
            cancel_failed: "Error al cancelar el sorteo."
        }
    },
    suggest: {
        audit: {
            approved: "Sugerencia aprobada por {{user}}",
            rejected: "Sugerencia rechazada por {{user}}",
            thread_reason: "Hilo de debate para sugerencia #{{num}}"
        }
    },
    verify: {
        audit: {
            completed: "Verificación completada",
            removed: "Verificación eliminada"
        }
    },
    help: {
        embed: {
            home_title: "Centro de Ayuda TON618",
            home_desc: "Bienvenido al centro de ayuda de **{{guild}}**. Selecciona una categoría abajo para explorar los comandos.",
            home_footer: "Seguridad y Soporte TON618 • {{guild}}",
            home_overview: "Resumen del Sistema",
            home_overview_value: "Gestión avanzada de tickets, soporte multi-idioma y herramientas de utilidad para servidores Pro.",
            home_visibility: "Tu Acceso",
            home_visibility_value: "Nivel: **{{access}}**\nDisponible: **{{commands}}** comandos en **{{categories}}** categorías.\n{{simple_help}}",
            home_categories: "Categorías Disponibles",
            home_quick_start: "Sugerencias de Inicio Rápido",
            category_title: "Comandos de {{category}}",
            category_desc: "Documentación detallada para este grupo de comandos.",
            category_footer: "Sistema TON618 • {{guild}}",
            command_footer: "Manual TON618 • {{guild}}",
            command_desc: "**Resumen:** {{summary}}\n**Categoría:** {{category}}\n**Acceso:** \`{{access}}\`",
            focused_match: "Coincidencia: \`{{usage}}\`",
            and_word: "y",
            required_label: "Requerido",
            optional_label: "Opcional",
            no_description: "Sin descripción proporcionada.",
            command_not_found: "Comando no encontrado",
            command_not_found_desc: "No se pudo encontrar ningún comando que coincida con \`{{command}}\`.",
            page_label: "Página",
            continued_suffix: " (cont.)",
            overview_prefix: "Resumen",
            visible_commands_label: "Comandos Interactivos",
            visible_entries_label: "Usos Únicos",
            command_singular: "comando",
            command_plural: "comandos",
            visible_entry_singular: "uso",
            visible_entry_plural: "usos",
            simple_help_note: "*(Nota: Algunos comandos avanzados están ocultos debido al modo Ayuda Simple)*",
            categories: {
                utility: "Utilidad",
                tickets: "Tickets",
                fun: "Comunidad y Diversión",
                moderation: "Moderación",
                config: "Configuración",
                system: "Sistema e Interno",
                general: "General",
                other: "Otros",
                owner: "Propietario",
                admin: "Administrador",
                staff: "Miembro del Staff",
                member: "Miembro Regular"
            },
            quick_start_notes: {
                ticket_open: "Abrir un ticket de soporte",
                help_base: "Volver a este menú",
                staff_my_tickets: "Ver tus tickets asignados",
                ticket_claim: "Tomar control de un ticket",
                ticket_note_add: "Añadir nota interna de staff",
                modlogs_info: "Consultar historial de moderación",
                setup_wizard: "Lanzar asistente de configuración",
                config_status: "Verificar configuración del servidor",
                verify_panel: "Desplegar sistema de verificación",
                stats_sla: "Ver reportes de SLA de tickets",
                debug_status: "Verificar estado del bot"
            }
        }
    }
};

updateLocale(enPath, finalKeysEn);
updateLocale(esPath, finalKeysEs);
