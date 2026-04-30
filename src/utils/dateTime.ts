"use strict";

/**
 * Normalize a value into a valid Date or null.
 * @param value - Date instance, string, number, or anything parseable
 * @returns A valid Date or null
 */
function toValidDate(value: Date | string | number | unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const parsed = new Date(value as string | number);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Format a value as DD/MM/YYYY.
 * @param value - Date-like value
 * @returns Formatted date or empty string if invalid
 */
export function formatDate(value: Date | string | number | unknown): string {
  const date = toValidDate(value);
  if (!date) return "";

  return [pad2(date.getDate()), pad2(date.getMonth() + 1), date.getFullYear()].join("/");
}

interface FormatDateTimeOptions {
  includeSeconds?: boolean;
  literal?: string;
}

/**
 * Format a value as DD/MM/YYYY HH:MM(:SS).
 * @param value - Date-like value
 * @param options - Formatting options
 * @returns Formatted date-time or empty string if invalid
 */
export function formatDateTime(value: Date | string | number | unknown, options: FormatDateTimeOptions = {}): string {
  const date = toValidDate(value);
  if (!date) return "";

  const time = [pad2(date.getHours()), pad2(date.getMinutes())];
  if (options.includeSeconds) {
    time.push(pad2(date.getSeconds()));
  }

  const separator = options.literal ? ` ${options.literal} ` : " ";
  return `${formatDate(date)}${separator}${time.join(":")}`;
}

/**
 * Humanize a millisecond duration into Spanish text.
 * @param value - Duration in milliseconds
 * @returns Humanized Spanish string
 */
export function humanizeDurationMs(value: number | string): string {
  const ms = Math.max(0, Number(value) || 0);
  const seconds = Math.round(ms / 1000);

  if (seconds < 45) return "unos segundos";
  if (seconds < 90) return "un minuto";

  const minutes = Math.round(seconds / 60);
  if (minutes < 45) return `${minutes} minutos`;
  if (minutes < 90) return "una hora";

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} horas`;
  if (hours < 42) return "un dia";

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} dias`;
  if (days < 45) return "un mes";

  const months = Math.round(days / 30);
  if (months < 12) return `${months} meses`;
  if (days < 545) return "un ano";

  const years = Math.round(days / 365);
  return `${years} anos`;
}

/**
 * Humanize the duration between two date values.
 * @param startValue - Start date-like value
 * @param endValue - End date-like value (defaults to now)
 * @returns Humanized Spanish string or empty string if start is invalid
 */
export function humanizeDurationBetween(
  startValue: Date | string | number | unknown,
  endValue: Date | string | number | unknown = Date.now()
): string {
  const start = toValidDate(startValue);
  const end = toValidDate(endValue) || new Date();
  if (!start) return "";
  return humanizeDurationMs(end.getTime() - start.getTime());
}

module.exports = {
  toValidDate,
  formatDate,
  formatDateTime,
  humanizeDurationMs,
  humanizeDurationBetween,
};
