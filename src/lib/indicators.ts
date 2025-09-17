/**
 * Simple Moving Average (SMA)
 * Returns array of SMA values aligned with input length
 * Returns null for first n-1 values where insufficient data
 */
export function sma(values: number[], n: number): (number|null)[] {
  if (!values?.length || n <= 0 || n > values.length) {
    return values?.map(() => null) || [];
  }

  const result: (number|null)[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < n - 1) {
      // Not enough data for SMA calculation
      result.push(null);
    } else {
      // Calculate SMA for the last n values
      const sum = values.slice(i - n + 1, i + 1).reduce((acc, val) => acc + val, 0);
      result.push(sum / n);
    }
  }
  
  return result;
}

/**
 * Relative Strength Index (RSI)
 * Measures momentum on scale 0-100
 * Returns null for first n values where insufficient data for calculation
 */
export function rsi(values: number[], n = 14): (number|null)[] {
  if (!values?.length || n <= 0 || n >= values.length) {
    return values?.map(() => null) || [];
  }

  const result: (number|null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // First n-1 values are null (not enough data)
  for (let i = 0; i < n; i++) {
    result.push(null);
  }

  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, n).reduce((sum, gain) => sum + gain, 0) / n;
  let avgLoss = losses.slice(0, n).reduce((sum, loss) => sum + loss, 0) / n;

  // Calculate RSI for remaining values
  for (let i = n; i < values.length; i++) {
    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(rsi);
    }

    // Update averages using Wilder's smoothing
    if (i < values.length - 1) {
      avgGain = ((avgGain * (n - 1)) + gains[i]) / n;
      avgLoss = ((avgLoss * (n - 1)) + losses[i]) / n;
    }
  }

  return result;
}

/**
 * Average True Range Percentage (ATR%)
 * Measures volatility as percentage of price
 * Returns null for first n values where insufficient data
 */
export function atrp(high: number[], low: number[], close: number[], n = 14): (number|null)[] {
  if (!high?.length || !low?.length || !close?.length || 
      high.length !== low.length || high.length !== close.length || 
      n <= 0 || n > high.length) {
    return high?.map(() => null) || [];
  }

  const result: (number|null)[] = [];
  const trueRanges: number[] = [];

  // Calculate True Range for each period
  for (let i = 0; i < high.length; i++) {
    if (i === 0) {
      trueRanges.push(high[i] - low[i]);
    } else {
      const tr1 = high[i] - low[i];
      const tr2 = Math.abs(high[i] - close[i - 1]);
      const tr3 = Math.abs(low[i] - close[i - 1]);
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
  }

  // Calculate ATR using SMA of True Ranges
  const atrValues = sma(trueRanges, n);

  // Convert to percentage
  for (let i = 0; i < close.length; i++) {
    if (atrValues[i] === null || close[i] === 0) {
      result.push(null);
    } else {
      result.push((atrValues[i]! / close[i]) * 100);
    }
  }

  return result;
}

/**
 * Volume Z-Score
 * Measures how many standard deviations current volume is from average
 * Returns null for first n values where insufficient data
 */
export function volZ(vol: number[], n = 20): (number|null)[] {
  if (!vol?.length || n <= 0 || n > vol.length) {
    return vol?.map(() => null) || [];
  }

  const result: (number|null)[] = [];

  for (let i = 0; i < vol.length; i++) {
    if (i < n - 1) {
      result.push(null);
    } else {
      // Get last n volume values
      const recentVols = vol.slice(i - n + 1, i + 1);
      
      // Calculate mean
      const mean = recentVols.reduce((sum, v) => sum + v, 0) / n;
      
      // Calculate standard deviation
      const variance = recentVols.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      
      // Calculate z-score
      if (stdDev === 0) {
        result.push(0);
      } else {
        result.push((vol[i] - mean) / stdDev);
      }
    }
  }

  return result;
}

/**
 * Prior High
 * Returns the highest value in the previous n periods
 * Returns null for first n values where insufficient lookback data
 */
export function priorHigh(values: number[], n = 20): (number|null)[] {
  if (!values?.length || n <= 0 || n > values.length) {
    return values?.map(() => null) || [];
  }

  const result: (number|null)[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i < n) {
      result.push(null);
    } else {
      // Find highest value in previous n periods
      const priorValues = values.slice(i - n, i);
      const highest = Math.max(...priorValues);
      result.push(highest);
    }
  }

  return result;
}

/**
 * Linear Regression Forecast
 * Calculates linear regression on last n values and projects next value
 * Returns null if insufficient data
 */
export function linregForecast(values: number[], n = 20): { slope: number, intercept: number, next: number } | null {
  if (!values?.length || n <= 1 || n > values.length) {
    return null;
  }

  // Get last n values
  const recentValues = values.slice(-n);
  
  // Calculate x values (time indices)
  const xValues = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = recentValues.reduce((sum, y) => sum + y, 0) / n;
  
  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = recentValues[i] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }
  
  if (denominator === 0) {
    return null; // No variation in x values
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Forecast next value (x = n)
  const next = slope * n + intercept;
  
  return { slope, intercept, next };
}
