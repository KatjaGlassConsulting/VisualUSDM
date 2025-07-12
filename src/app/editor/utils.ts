/**
 * Utility functions for the USDM Editor
 */

/**
 * Safely parse JSON string with error handling
 * @param jsonString - The JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export const safeParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

/**
 * Format date value for HTML date input (yyyy-mm-dd format)
 * @param dateValue - Date string to format
 * @returns Formatted date string for input field
 */
export const formatDateForInput = (dateValue: string): string => {
  if (!dateValue) return '';

  // If it's already in yyyy-mm-dd format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // Try to parse and format the date
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return dateValue;
  }
};

/**
 * Update a nested field in the USDM data structure
 * @param data - The USDM data object
 * @param path - Array of keys representing the path to the field
 * @param value - The new value to set
 * @returns Updated data object
 */
export const updateNestedField = (
  data: any,
  path: (string | number)[],
  value: any
): any => {
  const updated = { ...data };
  let current = updated;

  // Navigate to the parent object
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) current[path[i]] = {};
    current = current[path[i]];
  }

  // Set the value
  current[path[path.length - 1]] = value;

  return updated;
};

/**
 * Get a nested field value from the USDM data structure
 * @param data - The USDM data object
 * @param path - Array of keys representing the path to the field
 * @param defaultValue - Default value if field doesn't exist
 * @returns Field value or default value
 */
export const getNestedField = (
  data: any,
  path: (string | number)[],
  defaultValue: any = undefined
): any => {
  let current = data;

  for (const key of path) {
    if (!current || current[key] === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current;
};

/**
 * Debounce function to limit the rate of function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
};

/**
 * Export USDM data as JSON file
 * @param data - USDM data to export
 * @param filename - Optional filename (defaults to usdm-export.json)
 */
export const exportUSDMAsJSON = (
  data: any,
  filename: string = 'usdm-export.json'
): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting USDM data:', error);
    throw new Error('Failed to export USDM data');
  }
};

/**
 * Validate USDM data structure
 * @param data - USDM data to validate
 * @returns Validation result with success flag and error message
 */
export const validateUSDMData = (
  data: any
): { isValid: boolean; error?: string } => {
  if (!data) {
    return { isValid: false, error: 'No data provided' };
  }

  if (typeof data !== 'object') {
    return { isValid: false, error: 'Data must be an object' };
  }

  // Check for required study structure
  if (!data.study) {
    return { isValid: false, error: 'Missing study object' };
  }

  if (!data.study.versions || !Array.isArray(data.study.versions)) {
    return { isValid: false, error: 'Missing or invalid study versions array' };
  }

  if (data.study.versions.length === 0) {
    return { isValid: false, error: 'Study must have at least one version' };
  }

  return { isValid: true };
};

/**
 * Generate a unique ID for new USDM elements
 * @param prefix - Prefix for the ID (e.g., 'Amendment', 'Version')
 * @param existingIds - Array of existing IDs to avoid duplicates
 * @returns Unique ID string
 */
export const generateUniqueId = (
  prefix: string,
  existingIds: string[] = []
): string => {
  let counter = 1;
  let newId = `${prefix}_${counter}`;

  while (existingIds.includes(newId)) {
    counter++;
    newId = `${prefix}_${counter}`;
  }

  return newId;
};

/**
 * Deep clone an object (useful for preventing mutation of original data)
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
};

/**
 * Check if two objects are deeply equal
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are deeply equal
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Get display text for a USDM element (prioritizes label, then name, then id)
 * @param element - USDM element with potential label, name, and id properties
 * @param fallback - Fallback text if no display text found
 * @returns Display text
 */
export const getDisplayText = (
  element: any,
  fallback: string = 'Unnamed'
): string => {
  if (!element) return fallback;

  return element.label || element.name || element.id || fallback;
};

/**
 * Format a code object for display (shows decode if available, otherwise code)
 * @param codeObj - Code object with potential decode and code properties
 * @param fallback - Fallback text if no code information found
 * @returns Formatted code text
 */
export const formatCodeDisplay = (
  codeObj: any,
  fallback: string = 'No code available'
): string => {
  if (!codeObj) return fallback;

  return codeObj.decode || codeObj.code || fallback;
};
