"use strict";

const RISK_WEIGHTS = {
  accountAge: {
    lessThan1Day: 40,
    lessThan7Days: 25,
    lessThan30Days: 10,
    lessThan90Days: 5,
    older: 0,
  },
  avatar: {
    default: 15,
    custom: 0,
  },
  username: {
    suspicious: 20,
    normal: 0,
  },
  joinPattern: {
    rapidRejoin: 25,
    recentKick: 30,
    normal: 0,
  },
  serverActivity: {
    raidDetected: 35,
    highJoinRate: 15,
    normal: 0,
  },
};

const RISK_THRESHOLDS = {
  low: 20,
  medium: 40,
  high: 60,
  critical: 80,
};

const SUSPICIOUS_USERNAME_PATTERNS = [
  /^[a-z]{2,4}\d{4,}$/i,
  /^user\d+$/i,
  /^[a-z]+_[a-z]+_\d+$/i,
  /^[a-z]{1,2}[0-9]{6,}$/i,
  /discord.*nitro/i,
  /free.*gift/i,
  /claim.*reward/i,
  /^\d{5,}$/,
  /(.)\1{4,}/,
];

const SUSPICIOUS_DISPLAY_NAME_PATTERNS = [
  /discord.*nitro/i,
  /free.*gift/i,
  /steam.*gift/i,
  /claim.*reward/i,
  /click.*link/i,
  /dm.*me/i,
  /http[s]?:\/\//i,
  /\$\d+.*free/i,
];

function calculateAccountAgeScore(user) {
  if (!user?.createdAt) return RISK_WEIGHTS.accountAge.lessThan7Days;

  const ageMs = Date.now() - user.createdAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays < 1) return RISK_WEIGHTS.accountAge.lessThan1Day;
  if (ageDays < 7) return RISK_WEIGHTS.accountAge.lessThan7Days;
  if (ageDays < 30) return RISK_WEIGHTS.accountAge.lessThan30Days;
  if (ageDays < 90) return RISK_WEIGHTS.accountAge.lessThan90Days;
  return RISK_WEIGHTS.accountAge.older;
}

function calculateAvatarScore(user) {
  const hasCustomAvatar = user?.avatar !== null && user?.avatar !== undefined;
  return hasCustomAvatar ? RISK_WEIGHTS.avatar.custom : RISK_WEIGHTS.avatar.default;
}

function calculateUsernameScore(user) {
  const username = user?.username || "";
  const displayName = user?.displayName || user?.globalName || "";

  for (const pattern of SUSPICIOUS_USERNAME_PATTERNS) {
    if (pattern.test(username)) {
      return RISK_WEIGHTS.username.suspicious;
    }
  }

  for (const pattern of SUSPICIOUS_DISPLAY_NAME_PATTERNS) {
    if (pattern.test(displayName)) {
      return RISK_WEIGHTS.username.suspicious;
    }
  }

  return RISK_WEIGHTS.username.normal;
}

function calculateJoinPatternScore(memberState) {
  if (!memberState) return RISK_WEIGHTS.joinPattern.normal;

  if (memberState.status === "kicked") {
    const kickedAt = memberState.kicked_at ? new Date(memberState.kicked_at) : null;
    if (kickedAt && Date.now() - kickedAt.getTime() < 24 * 60 * 60 * 1000) {
      return RISK_WEIGHTS.joinPattern.recentKick;
    }
  }

  const joinCount = Number(memberState.join_count || 0);
  if (joinCount > 2) {
    const lastJoined = memberState.last_joined_at ? new Date(memberState.last_joined_at) : null;
    const previousJoined = memberState.joined_at ? new Date(memberState.joined_at) : null;
    if (lastJoined && previousJoined) {
      const timeBetweenJoins = lastJoined.getTime() - previousJoined.getTime();
      if (timeBetweenJoins < 7 * 24 * 60 * 60 * 1000) {
        return RISK_WEIGHTS.joinPattern.rapidRejoin;
      }
    }
  }

  return RISK_WEIGHTS.joinPattern.normal;
}

function calculateServerActivityScore(verificationSettings, recentJoinCount = 0) {
  if (!verificationSettings?.antiraid_enabled) {
    return RISK_WEIGHTS.serverActivity.normal;
  }

  const threshold = verificationSettings.antiraid_joins || 10;

  if (recentJoinCount >= threshold) {
    return RISK_WEIGHTS.serverActivity.raidDetected;
  }

  if (recentJoinCount >= threshold * 0.5) {
    return RISK_WEIGHTS.serverActivity.highJoinRate;
  }

  return RISK_WEIGHTS.serverActivity.normal;
}

function getRiskLevel(totalScore) {
  if (totalScore >= RISK_THRESHOLDS.critical) return "critical";
  if (totalScore >= RISK_THRESHOLDS.high) return "high";
  if (totalScore >= RISK_THRESHOLDS.medium) return "medium";
  if (totalScore >= RISK_THRESHOLDS.low) return "low";
  return "minimal";
}

function getRecommendedVerificationMode(riskLevel, currentMode) {
  const modeStrength = {
    button: 1,
    code: 2,
    question: 2,
    captcha: 3,
  };

  const requiredStrength = {
    minimal: 1,
    low: 1,
    medium: 2,
    high: 3,
    critical: 3,
  };

  const currentStrength = modeStrength[currentMode] || 1;
  const neededStrength = requiredStrength[riskLevel] || 1;

  if (currentStrength >= neededStrength) {
    return { mode: currentMode, upgraded: false };
  }

  if (neededStrength >= 3) {
    return { mode: "captcha", upgraded: true };
  }

  if (neededStrength >= 2 && currentMode === "button") {
    return { mode: "code", upgraded: true };
  }

  return { mode: currentMode, upgraded: false };
}

async function analyzeUserRisk(user, member, memberState, verificationSettings, options = {}) {
  const scores = {
    accountAge: calculateAccountAgeScore(user),
    avatar: calculateAvatarScore(user),
    username: calculateUsernameScore(user),
    joinPattern: calculateJoinPatternScore(memberState),
    serverActivity: calculateServerActivityScore(
      verificationSettings,
      options.recentJoinCount || 0
    ),
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const riskLevel = getRiskLevel(totalScore);
  const recommendation = getRecommendedVerificationMode(
    riskLevel,
    verificationSettings?.mode || "button"
  );

  const flags = [];

  if (scores.accountAge >= RISK_WEIGHTS.accountAge.lessThan7Days) {
    const ageMs = user?.createdAt ? Date.now() - user.createdAt.getTime() : 0;
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    flags.push(`new_account_${ageDays}d`);
  }

  if (scores.avatar > 0) {
    flags.push("no_avatar");
  }

  if (scores.username > 0) {
    flags.push("suspicious_name");
  }

  if (scores.joinPattern === RISK_WEIGHTS.joinPattern.recentKick) {
    flags.push("recently_kicked");
  } else if (scores.joinPattern === RISK_WEIGHTS.joinPattern.rapidRejoin) {
    flags.push("rapid_rejoin");
  }

  if (scores.serverActivity === RISK_WEIGHTS.serverActivity.raidDetected) {
    flags.push("raid_detected");
  } else if (scores.serverActivity === RISK_WEIGHTS.serverActivity.highJoinRate) {
    flags.push("high_join_rate");
  }

  return {
    scores,
    totalScore,
    riskLevel,
    recommendation,
    flags,
    requiresEscalation: recommendation.upgraded,
    timestamp: new Date(),
  };
}

function generateMathCaptcha() {
  const operations = [
    { symbol: "+", fn: (a, b) => a + b },
    { symbol: "-", fn: (a, b) => a - b },
    { symbol: "×", fn: (a, b) => a * b },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];
  let a, b;

  if (op.symbol === "×") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
  } else if (op.symbol === "-") {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a);
  } else {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
  }

  return {
    question: `${a} ${op.symbol} ${b} = ?`,
    answer: String(op.fn(a, b)),
    type: "math",
  };
}

function generateEmojiCaptcha() {
  const emojiSets = [
    { emoji: "🍎", name: "apple", names: ["apple", "manzana", "🍎"] },
    { emoji: "🍊", name: "orange", names: ["orange", "naranja", "🍊"] },
    { emoji: "🍋", name: "lemon", names: ["lemon", "limon", "limón", "🍋"] },
    { emoji: "🍇", name: "grapes", names: ["grapes", "uvas", "grape", "uva", "🍇"] },
    { emoji: "🍓", name: "strawberry", names: ["strawberry", "fresa", "🍓"] },
    { emoji: "🍌", name: "banana", names: ["banana", "plátano", "platano", "🍌"] },
    { emoji: "🐶", name: "dog", names: ["dog", "perro", "🐶"] },
    { emoji: "🐱", name: "cat", names: ["cat", "gato", "🐱"] },
    { emoji: "🐭", name: "mouse", names: ["mouse", "ratón", "raton", "🐭"] },
    { emoji: "🌟", name: "star", names: ["star", "estrella", "🌟"] },
    { emoji: "❤️", name: "heart", names: ["heart", "corazón", "corazon", "❤️", "❤"] },
    { emoji: "🔥", name: "fire", names: ["fire", "fuego", "🔥"] },
  ];

  const selected = emojiSets[Math.floor(Math.random() * emojiSets.length)];
  const count = Math.floor(Math.random() * 5) + 2;
  const display = Array(count).fill(selected.emoji).join(" ");

  return {
    question: `How many ${selected.name}s? ${display}`,
    answer: String(count),
    validAnswers: [String(count)],
    type: "emoji_count",
  };
}

function generateCaptcha(type = "math") {
  if (type === "emoji") {
    return generateEmojiCaptcha();
  }
  return generateMathCaptcha();
}

function verifyCaptchaAnswer(captcha, userAnswer) {
  const normalized = String(userAnswer || "").trim().toLowerCase();

  if (captcha.validAnswers) {
    return captcha.validAnswers.some(
      (valid) => String(valid).toLowerCase() === normalized
    );
  }

  return String(captcha.answer).toLowerCase() === normalized;
}

function getAccountAgeDays(user) {
  if (!user?.createdAt) return null;
  const ageMs = Date.now() - user.createdAt.getTime();
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

function isAccountTooNew(user, minAgeDays = 7) {
  const ageDays = getAccountAgeDays(user);
  if (ageDays === null) return false;
  return ageDays < minAgeDays;
}

module.exports = {
  RISK_WEIGHTS,
  RISK_THRESHOLDS,
  SUSPICIOUS_USERNAME_PATTERNS,
  SUSPICIOUS_DISPLAY_NAME_PATTERNS,
  calculateAccountAgeScore,
  calculateAvatarScore,
  calculateUsernameScore,
  calculateJoinPatternScore,
  calculateServerActivityScore,
  getRiskLevel,
  getRecommendedVerificationMode,
  analyzeUserRisk,
  generateMathCaptcha,
  generateEmojiCaptcha,
  generateCaptcha,
  verifyCaptchaAnswer,
  getAccountAgeDays,
  isAccountTooNew,
};
