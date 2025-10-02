/**
 * Performance monitoring utilities for ASCII Art component
 */

// Performance metrics storage
const performanceMetrics = {
  asciiConversions: [],
  cacheStats: {
    hits: 0,
    misses: 0,
    hitRate: 0
  },
  renderTimes: [],
  memoryUsage: []
};

/**
 * Record ASCII conversion performance
 * @param {number} conversionTime - Time taken for conversion in ms
 * @param {string} imagePath - Path to the image
 * @param {number} resolution - Resolution used (width x height)
 */
export const recordConversionTime = (conversionTime, imagePath, resolution) => {
  performanceMetrics.asciiConversions.push({
    time: conversionTime,
    imagePath,
    resolution,
    timestamp: Date.now()
  });
  
  // Keep only last 50 entries
  if (performanceMetrics.asciiConversions.length > 50) {
    performanceMetrics.asciiConversions = performanceMetrics.asciiConversions.slice(-50);
  }
};

/**
 * Record cache statistics
 * @param {boolean} isHit - Whether it was a cache hit
 */
export const recordCacheStats = (isHit) => {
  if (isHit) {
    performanceMetrics.cacheStats.hits++;
  } else {
    performanceMetrics.cacheStats.misses++;
  }
  
  const total = performanceMetrics.cacheStats.hits + performanceMetrics.cacheStats.misses;
  performanceMetrics.cacheStats.hitRate = total > 0 ? (performanceMetrics.cacheStats.hits / total) * 100 : 0;
};

/**
 * Record render time
 * @param {number} renderTime - Time taken for render in ms
 */
export const recordRenderTime = (renderTime) => {
  performanceMetrics.renderTimes.push({
    time: renderTime,
    timestamp: Date.now()
  });
  
  // Keep only last 20 entries
  if (performanceMetrics.renderTimes.length > 20) {
    performanceMetrics.renderTimes = performanceMetrics.renderTimes.slice(-20);
  }
};

/**
 * Get performance summary
 * @returns {Object} Performance summary
 */
export const getPerformanceSummary = () => {
  const avgConversionTime = performanceMetrics.asciiConversions.length > 0
    ? performanceMetrics.asciiConversions.reduce((sum, item) => sum + item.time, 0) / performanceMetrics.asciiConversions.length
    : 0;
    
  const avgRenderTime = performanceMetrics.renderTimes.length > 0
    ? performanceMetrics.renderTimes.reduce((sum, item) => sum + item.time, 0) / performanceMetrics.renderTimes.length
    : 0;
    
  return {
    averageConversionTime: `${avgConversionTime.toFixed(2)}ms`,
    averageRenderTime: `${avgRenderTime.toFixed(2)}ms`,
    cacheHitRate: `${performanceMetrics.cacheStats.hitRate.toFixed(1)}%`,
    totalConversions: performanceMetrics.asciiConversions.length,
    totalCacheHits: performanceMetrics.cacheStats.hits,
    totalCacheMisses: performanceMetrics.cacheStats.misses
  };
};

/**
 * Clear performance metrics
 */
export const clearPerformanceMetrics = () => {
  performanceMetrics.asciiConversions = [];
  performanceMetrics.cacheStats = { hits: 0, misses: 0, hitRate: 0 };
  performanceMetrics.renderTimes = [];
  performanceMetrics.memoryUsage = [];
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get optimal resolution for device
 * @param {number} screenWidth - Screen width
 * @param {number} screenHeight - Screen height
 * @returns {Object} Optimal resolution
 */
export const getOptimalResolution = (screenWidth, screenHeight) => {
  const isMobile = isMobileDevice();
  const baseWidth = 320;
  const baseResolution = { width: 80, height: 60 };
  
  // Calculate scale factor based on screen width
  const scaleFactor = Math.min(screenWidth / baseWidth, isMobile ? 2 : 3);
  
  // Calculate resolution with scale factor
  const newWidth = Math.round(baseResolution.width * scaleFactor);
  const newHeight = Math.round(baseResolution.height * scaleFactor);
  
  // Ensure minimum resolution
  const minWidth = isMobile ? 40 : 60;
  const minHeight = isMobile ? 30 : 45;
  
  return {
    width: Math.max(newWidth, minWidth),
    height: Math.max(newHeight, minHeight)
  };
};

/**
 * Memory usage monitoring
 * @returns {Object} Memory usage info
 */
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
    };
  }
  return null;
};
