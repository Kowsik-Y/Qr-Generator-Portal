"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

/**
 * CoursesCard
 * Props:
 * - title: string
 * - description: string
 * - progress: number (0-100)
 * - teacher: { name, image }
 * - onOpen: () => void
 */
function CoursesCard({
  title = "Visual Design Basics",
  description = "No description provided.",
  progress = 20,
  teacher = null,
  onOpen = () => {},
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            {teacher && teacher.image ? (
              <AvatarImage src={teacher.image} alt={teacher.name} />
            ) : (
              <AvatarFallback>{teacher?.name?.charAt(0) ?? "C"}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button size="sm" onClick={onOpen}>Open</Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-end text-sm text-muted-foreground">
            <strong>{pct}%</strong>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full"
              style={{ width: `${pct}%`, transition: "width 300ms ease" }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">Share</Button>
          <Button size="sm" onClick={onOpen}>Continue</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CoursesCard
