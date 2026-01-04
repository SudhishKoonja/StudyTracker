"use client"

import type React from "react"
import { Trash2, Edit2, PlayCircle, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Objective } from "@/app/page"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ObjectiveCardProps {
  objective: Objective
  onStartStudy: () => void
  onUpdate: (updates: Partial<Objective>) => void
  onDelete: () => void
}

export function ObjectiveCard({ objective, onStartStudy, onDelete }: ObjectiveCardProps) {
  const progress = (objective.currentHours / objective.targetHours) * 100
  const isCompleted = progress >= 100

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:shadow-foreground/5">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: objective.color }} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-balance text-lg">{objective.title}</CardTitle>
            {objective.chapter && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                <span>{objective.chapter}</span>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-pretty text-sm text-muted-foreground">{objective.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold tabular-nums">
              {objective.currentHours.toFixed(1)} / {objective.targetHours}h
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            style={
              {
                // @ts-ignore
                "--progress-background": objective.color,
              } as React.CSSProperties
            }
          />
          {isCompleted && <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed!</p>}
        </div>

        <Button onClick={onStartStudy} className="w-full gap-2" variant={isCompleted ? "outline" : "default"}>
          <PlayCircle className="h-4 w-4" />
          Start Study Session
        </Button>
      </CardContent>
    </Card>
  )
}
