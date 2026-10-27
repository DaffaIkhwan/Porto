import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (val: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (val: string) => void
  orientation?: "horizontal" | "vertical"
}

function Tabs({
  className,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "group/tabs flex gap-2",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-[#f3efea]",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant = "default", ...props }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext)
  const isActive = ctx?.value === value

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      data-active={isActive ? "true" : undefined}
      aria-selected={isActive}
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-all",
        isActive
          ? "bg-white text-[#1a1619] shadow-sm font-semibold"
          : "text-[#5c5258] hover:text-[#1a1619]",
        className
      )}
      {...props}
    />
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext)
  if (ctx?.value !== value) return null

  return (
    <div
      data-slot="tabs-content"
      className={cn("mt-2 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
