import * as React from "react"
import { cn } from "@transora/ui/lib/utils"

interface GridBackgroundProps extends React.ComponentProps<"div"> {
  opacity?: number
  gridSize?: number
}

export function GridBackground({
  opacity = 0.22,
  gridSize = 40,
  className,
  ...props
}: GridBackgroundProps) {
  return (
    <div
      data-slot="grid-background"
      className={cn(
        "absolute inset-y-0 left-6 right-6 pointer-events-none z-0 border-l border-r border-border/30",
        className
      )}
      style={{
        opacity,
        backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`
      }}
      {...props}
    />
  )
}
