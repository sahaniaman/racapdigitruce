'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown, MapPin } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { users, locations, type Location } from '@/lib/data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-purple text-white',
  'Local Admin': 'bg-green text-black',
  'Auditor': 'bg-orange text-black',
  'Viewer': 'bg-muted-foreground text-black',
}

export function AppHeader() {
  const { currentUser, setCurrentUser, selectedLocation, setSelectedLocation, sidebarCollapsed } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-56'
      )}
    >
      {/* Left side - Location selector */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
            <MapPin className="h-4 w-4 text-purple" />
            <span>{selectedLocation}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Select Location</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {locations.map((location) => (
              <DropdownMenuItem
                key={location}
                onClick={() => setSelectedLocation(location as Location)}
                className={cn(selectedLocation === location && 'bg-accent')}
              >
                {location}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm text-muted-foreground">
          Viewing: <span className="text-purple">{selectedLocation}</span>
        </span>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search hosts, issues, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
          />
        </div>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-4">
        <button
          className="relative rounded-lg p-2 hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-secondary transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-sm font-bold text-black">
              {currentUser.initials}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{currentUser.name}</div>
              <span className={cn('inline-block rounded px-2 py-0.5 text-xs font-medium', roleColors[currentUser.role])}>
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch User (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="flex items-center gap-3 py-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {user.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <span className={cn('rounded px-2 py-0.5 text-xs font-medium', roleColors[user.role])}>
                  {user.role === 'Super Admin' ? 'Super' : user.role}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Viewing as {currentUser.role}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
