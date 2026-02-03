// Local Storage Utilities and Persistence Layer

export interface AuditLogEntry {
  id: string
  action: string
  user: string
  userName: string
  role: string
  timestamp: string
  details: string
  location?: string
  ruleId?: string
}

export interface StoredComplianceRule {
  id: string
  ruleId: string
  framework: string
  description: string
  severity: string
  locations: {
    DEL: boolean
    MUM: boolean
    BLR: boolean
    HYD: boolean
  }
}

// Storage keys
const STORAGE_KEYS = {
  COMPLIANCE_RULES: 'racap_compliance_rules',
  AUDIT_LOGS: 'racap_audit_logs',
  USER_PREFERENCES: 'racap_user_preferences',
  SESSION_DATA: 'racap_session_data',
  REPORTS: 'racap_reports',
  MANUAL_REPORTS: 'racap_manual_reports'
} as const

// Safe localStorage access with SSR support
const isBrowser = typeof window !== 'undefined'

export const storage = {
  // Get item from localStorage with type safety
  getItem: <T>(key: string, defaultValue: T): T => {
    if (!isBrowser) return defaultValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  // Set item in localStorage
  setItem: <T>(key: string, value: T): boolean => {
    if (!isBrowser) return false
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): boolean => {
    if (!isBrowser) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },

  // Clear all app data
  clearAll: (): boolean => {
    if (!isBrowser) return false
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Compliance Rules Storage
export const complianceRulesStorage = {
  save: (rules: StoredComplianceRule[]): boolean => {
    return storage.setItem(STORAGE_KEYS.COMPLIANCE_RULES, rules)
  },

  load: (): StoredComplianceRule[] | null => {
    return storage.getItem<StoredComplianceRule[] | null>(
      STORAGE_KEYS.COMPLIANCE_RULES,
      null
    )
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.COMPLIANCE_RULES)
  }
}

// Audit Logs Storage
export const auditLogsStorage = {
  add: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>): boolean => {
    const logs = auditLogsStorage.getAll()
    const newLog: AuditLogEntry = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }
    logs.unshift(newLog) // Add to beginning
    
    // Keep only last 1000 logs to prevent storage overflow
    const trimmedLogs = logs.slice(0, 1000)
    return storage.setItem(STORAGE_KEYS.AUDIT_LOGS, trimmedLogs)
  },

  getAll: (): AuditLogEntry[] => {
    return storage.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, [])
  },

  getRecent: (count: number = 50): AuditLogEntry[] => {
    const logs = auditLogsStorage.getAll()
    return logs.slice(0, count)
  },

  filterByUser: (userName: string): AuditLogEntry[] => {
    const logs = auditLogsStorage.getAll()
    return logs.filter(log => log.userName === userName)
  },

  filterByAction: (action: string): AuditLogEntry[] => {
    const logs = auditLogsStorage.getAll()
    return logs.filter(log => log.action === action)
  },

  filterByDateRange: (startDate: Date, endDate: Date): AuditLogEntry[] => {
    const logs = auditLogsStorage.getAll()
    return logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= startDate && logDate <= endDate
    })
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.AUDIT_LOGS)
  },

  export: (): string => {
    const logs = auditLogsStorage.getAll()
    return JSON.stringify(logs, null, 2)
  }
}

// User Preferences Storage
export const userPreferencesStorage = {
  save: (preferences: Record<string, any>): boolean => {
    return storage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences)
  },

  load: (): Record<string, any> => {
    return storage.getItem(STORAGE_KEYS.USER_PREFERENCES, {})
  },

  update: (key: string, value: any): boolean => {
    const preferences = userPreferencesStorage.load()
    preferences[key] = value
    return userPreferencesStorage.save(preferences)
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
  }
}

// Session Data Storage
export const sessionStorage = {
  save: (data: Record<string, any>): boolean => {
    return storage.setItem(STORAGE_KEYS.SESSION_DATA, data)
  },

  load: (): Record<string, any> => {
    return storage.getItem(STORAGE_KEYS.SESSION_DATA, {})
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.SESSION_DATA)
  }
}

// Reports Storage
export const reportsStorage = {
  save: (reports: any[]): boolean => {
    return storage.setItem(STORAGE_KEYS.REPORTS, reports)
  },

  load: (): any[] => {
    return storage.getItem<any[]>(STORAGE_KEYS.REPORTS, [])
  },

  add: (report: any): boolean => {
    const reports = reportsStorage.load()
    reports.unshift(report)
    return reportsStorage.save(reports)
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.REPORTS)
  }
}

// Manual Reports Storage
export const manualReportsStorage = {
  save: (reports: any[]): boolean => {
    return storage.setItem(STORAGE_KEYS.MANUAL_REPORTS, reports)
  },

  load: (): any[] => {
    return storage.getItem<any[]>(STORAGE_KEYS.MANUAL_REPORTS, [])
  },

  add: (report: any): boolean => {
    const reports = manualReportsStorage.load()
    reports.unshift(report)
    return manualReportsStorage.save(reports)
  },

  remove: (reportId: string): boolean => {
    const reports = manualReportsStorage.load()
    const filtered = reports.filter(r => r.id !== reportId)
    return manualReportsStorage.save(filtered)
  },

  clear: (): boolean => {
    return storage.removeItem(STORAGE_KEYS.MANUAL_REPORTS)
  }
}

// Utility: Check localStorage availability and space
export const checkStorageHealth = () => {
  if (!isBrowser) {
    return { available: false, quotaExceeded: false, usage: 0 }
  }

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    
    // Estimate storage usage
    let usage = 0
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        usage += item.length + key.length
      }
    })

    return {
      available: true,
      quotaExceeded: false,
      usage: Math.round(usage / 1024), // KB
      usageMB: Math.round(usage / 1024 / 1024 * 100) / 100
    }
  } catch (error: any) {
    return {
      available: true,
      quotaExceeded: error.name === 'QuotaExceededError',
      usage: 0
    }
  }
}

// Initialize storage with default data if empty
export const initializeStorage = () => {
  if (!isBrowser) return

  // Add initial audit log if none exists
  const logs = auditLogsStorage.getAll()
  if (logs.length === 0) {
    auditLogsStorage.add({
      action: 'System Initialized',
      user: 'system',
      userName: 'System',
      role: 'System',
      details: 'Local storage initialized successfully'
    })
  }
}
