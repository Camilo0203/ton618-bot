"use strict";

const useColor = !process.env.NO_COLOR && Boolean(process.stdout && process.stdout.isTTY);

function paint(openCode, closeCode, value) {
  const text = String(value ?? "");
  if (!useColor) return text;
  return `\u001b[${openCode}m${text}\u001b[${closeCode}m`;
}

function style(openCode, closeCode) {
  return (value) => paint(openCode, closeCode, value);
}

const chalk = {
  bold: style(1, 22),
  red: style(31, 39),
  green: style(32, 39),
  yellow: style(33, 39),
  blue: style(34, 39),
  cyan: style(36, 39),
  gray: style(90, 39),
};

chalk.grey = chalk.gray;

module.exports = chalk;
