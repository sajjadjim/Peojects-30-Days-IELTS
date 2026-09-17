import { DayPlan, StudySession } from '@/types/ielts';

/**
 * Official IELTS Academic Listening Raw Score (out of 40) to Band Score
 */
export function rawToListeningBand(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3.0;
  if (raw >= 4) return 2.5;
  return 2.0;
}

/**
 * Official IELTS Academic Reading Raw Score (out of 40) to Band Score
 */
export function rawToReadingBand(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 19) return 5.5;
  if (raw >= 15) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3.0;
  if (raw >= 4) return 2.5;
  return 2.0;
}

/**
 * Calculate Overall IELTS Band (standard IELTS rounding rule:
 * average rounded to nearest half or whole band:
 * fractional part < 0.25 -> round down to .0;
 * fractional part >= 0.25 and < 0.75 -> round to .5;
 * fractional part >= 0.75 -> round up to next whole band).
 */
export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const whole = Math.floor(avg);
  const frac = avg - whole;

  if (frac < 0.25) {
    return whole;
  } else if (frac < 0.75) {
    return whole + 0.5;
  } else {
    return whole + 1.0;
  }
}

/**
 * Format minutes into readable hours and minutes (e.g. 135 -> "2h 15m", 45 -> "45m")
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

/**
 * Get current date string in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date string into readable text (e.g. "Sep 17, 2026")
 */
export function formatDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Play a clean Web Audio API beep/chime for timers without needing external audio files
 */
export function playChime(frequency: number = 880, durationMs: number = 250, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

/**
 * Play a double chime for stage complete / timer finish
 */
export function playDoubleChime() {
  playChime(660, 200, 'triangle');
  setTimeout(() => {
    playChime(880, 400, 'sine');
  }, 220);
}
