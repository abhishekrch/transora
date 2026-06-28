import * as React from "react"

interface LogoProps extends React.ComponentProps<"a"> {
  text?: string
}

export function Logo({ text = "transora", href = "/", ...props }: LogoProps) {
  return (
    <a
      href={href}
      className="text-base font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
      {...props}
    >
      {text}
    </a>
  )
}
