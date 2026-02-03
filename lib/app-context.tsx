'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type User,
  type Location,
  type ComplianceRule,
  users,
  complianceRules as initialRules,
} from './data'
import { 
  complianceRulesStorage, 
  auditLogsStorage, 
  initializeStorage,
  type AuditLogEntry 
} from './storage'

// Role-based permissions
export const rolePermissions = {
  'Super Admin': {
    canEdit: true,
    canDelete: true,
    canExport: true,
    canRescan: true,
    canManageUsers: true,
    canManageRules: true,
    canGenerateReports: true,
    canViewAuditLogs: true,
    canChangeSettings: true,
  },
  'Local Admin': {
    canEdit: true,
    canDelete: false,
    canExport: true,
    canRescan: true,
    canManageUsers: false,
    canManageRules: true,
    canGenerateReports: true,
    canViewAuditLogs: true,
    canChangeSettings: false,
  },
  'Auditor': {
    canEdit: false,
    canDelete: false,
    canExport: true,
    canRescan: false,
    canManageUsers: false,
    canManageRules: false,
    canGenerateReports: true,
    canViewAuditLogs: true,
    canChangeSettings: false,
  },
  'Viewer': {
    canEdit: false,
    canDelete: false,
    canExport: false,
    canRescan: false,
    canManageUsers: false,
    canManageRules: false,
    canGenerateReports: false,
    canViewAuditLogs: false,
    canChangeSettings: false,
  },
} as const

export type Permission = keyof (typeof rolePermissions)['Super Admin']

interface AppContextType {
  currentUser: User
  setCurrentUser: (user: User) => void
  selectedLocation: Location
  setSelectedLocation: (location: Location) => void
  complianceRules: ComplianceRule[]
  toggleRuleLocation: (ruleId: string, location: keyof ComplianceRule['locations']) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  hasPermission: (permission: Permission) => boolean
  isAdmin: () => boolean
  auditLogs: AuditLogEntry[]
  addAuditLog: (action: string, details: string, metadata?: Record<string, any>) => void
  resetComplianceRules: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0])
  const [selectedLocation, setSelectedLocation] = useState<Location>('All Locations')
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(initialRules)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])

  // Initialize storage and load saved data on mount
  useEffect(() => {
    initializeStorage()
    
    // Load saved compliance rules
    const savedRules = complianceRulesStorage.load()
    if (savedRules && savedRules.length > 0) {
      setComplianceRules(savedRules as ComplianceRule[])
    }

    // Load audit logs
    const logs = auditLogsStorage.getRecent(100)
    setAuditLogs(logs)
  }, [])

  // Save compliance rules to localStorage whenever they change
  useEffect(() => {
    if (complianceRules.length > 0) {
      complianceRulesStorage.save(complianceRules as any)
    }
  }, [complianceRules])

  const addAuditLog = (action: string, details: string, metadata?: Record<string, any>) => {
    const logEntry = {
      action,
      user: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      details,
      ...metadata
    }
    
    auditLogsStorage.add(logEntry)
    
    // Update state
    const updatedLogs = auditLogsStorage.getRecent(100)
    setAuditLogs(updatedLogs)
  }

  const toggleRuleLocation = (ruleId: string, location: keyof ComplianceRule['locations']) => {
    // Check permission before allowing toggle
    if (!rolePermissions[currentUser.role].canManageRules) {
      addAuditLog(
        'Rule Toggle Denied',
        `User ${currentUser.name} attempted to toggle ${ruleId} for ${location} but lacks permission`,
        { ruleId, location, denied: true }
      )
      return
    }

    const rule = complianceRules.find(r => r.id === ruleId)
    if (!rule) return

    const previousState = rule.locations[location]
    const newState = !previousState

    setComplianceRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              locations: {
                ...r.locations,
                [location]: newState,
              },
            }
          : r
      )
    )

    // Add audit log
    addAuditLog(
      newState ? 'Rule Enabled' : 'Rule Disabled',
      `${newState ? 'Enabled' : 'Disabled'} ${rule.ruleId} (${rule.framework}) for ${location} location`,
      { 
        ruleId: rule.ruleId, 
        location, 
        framework: rule.framework,
        severity: rule.severity,
        previousState,
        newState
      }
    )
  }

  const resetComplianceRules = () => {
    if (!rolePermissions[currentUser.role].canManageRules) {
      return
    }

    setComplianceRules(initialRules)
    complianceRulesStorage.clear()
    
    addAuditLog(
      'Rules Reset',
      'All compliance rules reset to default configuration',
      { resetBy: currentUser.name }
    )
  }

  const hasPermission = (permission: Permission): boolean => {
    return rolePermissions[currentUser.role][permission]
  }

  const isAdmin = (): boolean => {
    return currentUser.role === 'Super Admin' || currentUser.role === 'Local Admin'
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedLocation,
        setSelectedLocation,
        complianceRules,
        toggleRuleLocation,
        sidebarCollapsed,
        setSidebarCollapsed,
        hasPermission,
        isAdmin,
        auditLogs,
        addAuditLog,
        resetComplianceRules,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
