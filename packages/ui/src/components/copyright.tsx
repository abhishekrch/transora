import * as React from "react"

interface CopyrightProps extends React.ComponentProps<"span"> {
  company?: string
}

export function Copyright({ company = "Transora", ...props }: CopyrightProps) {
  return (
    <span {...props}>
      &copy; {new Date().getFullYear()} {company}. All rights reserved.
    </span>
  )
}
