'use client'

import { use } from 'react'
import { AppLayout } from '@/components/app-layout'
import { HostDetailContent } from '@/components/hosts/host-detail-content'

export default function HostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  
  return (
    <AppLayout>
      <HostDetailContent hostId={resolvedParams.id} />
    </AppLayout>
  )
}
