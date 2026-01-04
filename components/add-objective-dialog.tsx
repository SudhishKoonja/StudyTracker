"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (objective: {
    title: string
    description: string
    targetHours: number
    color: string
    subject?: "chemistry" | "physics" | "computer-science"
    chapter?: string
  }) => void
}

const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
]

const SYLLABUS_CHAPTERS = {
  chemistry: [
    "1. Atomic Structure",
    "2. Atoms, Molecules and Stoichiometry",
    "3. Chemical Bonding",
    "4. States of Matter",
    "5. Chemical Energetics",
    "6. Electrochemistry",
    "7. Equilibria",
    "8. Reaction Kinetics",
    "9. Periodicity",
    "10. Group 2",
    "11. Group 17",
    "12. Nitrogen and Sulfur",
    "13. Introduction to Organic Chemistry",
    "14. Hydrocarbons",
    "15. Halogen Derivatives",
    "16. Hydroxy Compounds",
    "17. Carbonyl Compounds",
    "18. Carboxylic Acids and Derivatives",
    "19. Nitrogen Compounds",
    "20. Polymerisation",
    "21. Analytical Techniques",
    "22. Organic Synthesis",
  ],
  physics: [
    "1. Physical Quantities and Units",
    "2. Measurement Techniques",
    "3. Kinematics",
    "4. Dynamics",
    "5. Forces, Density and Pressure",
    "6. Work, Energy and Power",
    "7. Deformation of Solids",
    "8. Waves",
    "9. Superposition",
    "10. Electricity",
    "11. Electric Fields",
    "12. Current of Electricity",
    "13. D.C. Circuits",
    "14. Particle and Nuclear Physics",
    "15. Electronics",
    "16. Magnetic Fields",
    "17. Alternating Currents",
    "18. Quantum Physics",
    "19. Medical Physics",
    "20. Astronomy and Cosmology",
  ],
  "computer-science": [
    "1. Information Representation",
    "2. Communication and Internet Technologies",
    "3. Hardware",
    "4. Processor Fundamentals",
    "5. System Software",
    "6. Security, Privacy and Data Integrity",
    "7. Ethics and Ownership",
    "8. Database and Data Modelling",
    "9. Algorithm Design and Problem-Solving",
    "10. Data Types and Structures",
    "11. Programming",
    "12. Software Development",
  ],
}

const SUBJECT_LABELS = {
  chemistry: "Chemistry (A Level)",
  physics: "Physics (A Level)",
  "computer-science": "Computer Science (AS Level)",
}

export function AddObjectiveDialog({ open, onOpenChange, onAdd }: AddObjectiveDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetHours, setTargetHours] = useState("10")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [subject, setSubject] = useState<"chemistry" | "physics" | "computer-science" | undefined>(undefined)
  const [chapter, setChapter] = useState<string | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !targetHours) return

    onAdd({
      title,
      description,
      targetHours: Number.parseFloat(targetHours),
      color: selectedColor,
      subject,
      chapter,
    })

    setTitle("")
    setDescription("")
    setTargetHours("10")
    setSelectedColor(COLORS[0])
    setSubject(undefined)
    setChapter(undefined)
    onOpenChange(false)
  }

  const handleSubjectChange = (value: "chemistry" | "physics" | "computer-science") => {
    setSubject(value)
    setChapter(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Objective</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">CAIE Subject</Label>
            <Select value={subject} onValueChange={handleSubjectChange}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chemistry">{SUBJECT_LABELS.chemistry}</SelectItem>
                <SelectItem value="physics">{SUBJECT_LABELS.physics}</SelectItem>
                <SelectItem value="computer-science">{SUBJECT_LABELS["computer-science"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {subject && (
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger id="chapter">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {SYLLABUS_CHAPTERS[subject].map((ch) => (
                    <SelectItem key={ch} value={ch}>
                      {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Learn Organic Chemistry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What do you want to achieve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Target Hours</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-10 w-10 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color}`}
                >
                  {selectedColor === color && (
                    <svg className="h-full w-full p-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Objective
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
