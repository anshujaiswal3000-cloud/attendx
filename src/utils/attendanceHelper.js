/**
 * Calculates attendance percentage.
 * @param {number} present 
 * @param {number} total 
 * @returns {number}
 */
export function calculatePercentage(present, total) {
  if (!total || total === 0) return 0.00;
  return Number(((present / total) * 100).toFixed(2));
}

/**
 * Calculates how many classes can be bunked or must be attended to reach a goal.
 * @param {number} present 
 * @param {number} total 
 * @param {number} goal - e.g. 75, 80, 85, 90
 * @returns {Object} { status: 'safe'|'short', count: number, message: string }
 */
export function calculateBunkStatus(present, total, goal = 75) {
  const g = goal / 100;
  
  if (total === 0) {
    return {
      status: "short",
      count: 1,
      message: `Attend next 1 class to reach ${goal}%.`
    };
  }

  const currentPct = present / total;

  if (currentPct >= g) {
    // How many classes can we miss?
    // p / (t + m) >= g => m <= (p / g) - t
    const maxMiss = Math.floor(present / g - total);
    return {
      status: "safe",
      count: maxMiss,
      message: maxMiss > 0 
        ? `You can safely miss ${maxMiss} more class${maxMiss > 1 ? 'es' : ''}.`
        : `You cannot miss any classes. Next class is critical!`
    };
  } else {
    // How many consecutive classes to attend?
    // (p + a) / (t + a) >= g => a >= (g*t - p) / (1 - g)
    const reqAttend = Math.ceil((g * total - present) / (1 - g));
    return {
      status: "short",
      count: reqAttend,
      message: `Attend next ${reqAttend} class${reqAttend > 1 ? 'es' : ''} to reach ${goal}%.`
    };
  }
}

/**
 * Returns status level based on attendance percentage.
 * @param {number} percentage 
 * @returns {'Safe' | 'Warning' | 'Critical'}
 */
export function getAttendanceStatus(percentage) {
  if (percentage >= 75) return "Safe";
  if (percentage >= 65) return "Warning";
  return "Critical";
}

/**
 * Returns status color for badge/progress bar.
 * @param {'Safe' | 'Warning' | 'Critical'} status 
 * @param {boolean} isDark 
 * @returns {string} Hex color
 */
export function getStatusColor(status, isDark = false) {
  switch (status) {
    case "Safe":
      return isDark ? "#10b981" : "#10b981"; // Emerald green
    case "Warning":
      return isDark ? "#f59e0b" : "#f59e0b"; // Amber orange
    case "Critical":
    default:
      return isDark ? "#ef4444" : "#ef4444"; // Red
  }
}

/**
 * Formats time or date.
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
