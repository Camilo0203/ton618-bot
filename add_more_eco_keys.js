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
    }
}

const moreEconomyKeysEn = {
    economy: {
        deposit: {
            insufficient: "You don't have enough coins in your wallet.",
            success: "Deposited {{amount}} coins.",
            error: "Error processing the deposit."
        },
        withdraw: {
            insufficient: "You don't have enough coins in the bank.",
            success: "Withdrawn {{amount}} coins.",
            error: "Error processing the withdrawal."
        },
        daily: {
            already_claimed: "You already claimed your daily coins today.",
            success: "You claimed {{reward}} coins! (Streak: {{streak}})",
            error: "Error claiming daily rewards."
        },
        transfer: {
            self_transfer: "You cannot transfer coins to yourself.",
            insufficient: "You don't have enough coins.",
            success: "Transferred {{amount}} coins to {{user}}.",
            error: "Error processing the transfer."
        },
        work: {
            no_job: "You don't have a job. Use \`/work set\` to get one.",
            cooldown: "Wait {{remaining}} minutes to work again.",
            success: "You worked as a **{{job}}** and earned {{amount}} coins!",
            error: "Error while working."
        }
    }
};

const moreEconomyKeysEs = {
    economy: {
        deposit: {
            insufficient: "No tienes suficientes monedas en tu wallet.",
            success: "Has depositado {{amount}} monedas.",
            error: "Error al depositar."
        },
        withdraw: {
            insufficient: "No tienes suficientes monedas en el banco.",
            success: "Has retirado {{amount}} monedas.",
            error: "Error al retirar."
        },
        daily: {
            already_claimed: "Ya reclamaste tus monedas diarias hoy.",
            success: "¡Reclamaste {{reward}} monedas! (Racha: {{streak}})",
            error: "Error al reclamar diario."
        },
        transfer: {
            self_transfer: "No puedes transferirte monedas a ti mismo.",
            insufficient: "No tienes suficientes monedas.",
            success: "Has transferido {{amount}} monedas a {{user}}.",
            error: "Error al transferir."
        },
        work: {
            no_job: "No tienes un trabajo. Usa \`/work set\` para conseguir uno.",
            cooldown: "Espera {{remaining}} minutos para trabajar de nuevo.",
            success: "¡Trabajaste como **{{job}}** y ganaste {{amount}} monedas!",
            error: "Error al trabajar."
        }
    }
};

updateLocale(enPath, moreEconomyKeysEn);
updateLocale(esPath, moreEconomyKeysEs);
console.log("Added more economy keys.");
