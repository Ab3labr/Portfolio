import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  PropsWithChildren,
} from "react"
import { forwardRef } from "react"

type TextProps = PropsWithChildren<HTMLAttributes<HTMLElement> & {
  as?: ElementType
}>

export function Text({ as: Tag = "p", children, ...props }: TextProps) {
  return <Tag {...props}>{children}</Tag>
}

export const Action =
  forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
    function Action({ children, type = "button", ...props }, ref) {
      return (
        <button ref={ref} type={type} {...props}>
          {children}
        </button>
      )
    },
  )

export const NavLink =
  forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
    function NavLink({ children, ...props }, ref) {
      return (
        <a ref={ref} {...props}>
          {children}
        </a>
      )
    },
  )
