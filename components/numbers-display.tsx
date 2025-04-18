"use client"

import { useMemo } from "react"

interface NumbersDisplayProps {
  windowPrevState: number[]
  windowCurrState: number[]
  avg: number
}

export default function NumbersDisplay({ windowPrevState, windowCurrState, avg }: NumbersDisplayProps) {
  const maxValue = useMemo(() => {
    const allNumbers = [...windowPrevState, ...windowCurrState]
    return allNumbers.length > 0 ? Math.max(...allNumbers) : 0
  }, [windowPrevState, windowCurrState])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Window Previous State</h3>
        <div className="flex flex-wrap gap-2">
          {windowPrevState.length === 0 ? (
            <div className="text-muted-foreground italic">Empty</div>
          ) : (
            windowPrevState.map((num, index) => (
              <div key={`prev-${index}`} className="flex flex-col items-center">
                <div className="h-32 w-8 bg-muted-foreground/20 rounded-t-md relative">
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-t-md"
                    style={{
                      height: `${maxValue ? (num / maxValue) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs mt-1">{num}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Window Current State</h3>
        <div className="flex flex-wrap gap-2">
          {windowCurrState.length === 0 ? (
            <div className="text-muted-foreground italic">Empty</div>
          ) : (
            windowCurrState.map((num, index) => (
              <div key={`curr-${index}`} className="flex flex-col items-center">
                <div className="h-32 w-8 bg-muted-foreground/20 rounded-t-md relative">
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-t-md"
                    style={{
                      height: `${maxValue ? (num / maxValue) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-xs mt-1">{num}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center p-4 bg-muted rounded-md">
        <div className="text-center">
          <h3 className="text-sm font-medium mb-1">Average</h3>
          <span className="text-2xl font-bold">{avg}</span>
        </div>
      </div>
    </div>
  )
}
