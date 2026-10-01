import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="title-pixel text-4xl text-bone sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-mist">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
