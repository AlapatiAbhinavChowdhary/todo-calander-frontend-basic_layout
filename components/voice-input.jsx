"use client"

import { useState, useRef } from "react"
import { Mic, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export function VoiceInput({ onCommand }) {
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const recognitionRef = useRef(null)
  const { toast } = useToast()

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support Web Speech API. Please try Chrome or Edge.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setIsLoading(false)
      toast({
        title: "Listening...",
        description: "Speak your command now.",
      })
    }

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      setIsListening(false)
      setIsLoading(true)
      toast({
        title: "Processing command...",
        description: `"${transcript}"`,
      })

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: transcript }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const command = await response.json()
        onCommand(command) // Pass the parsed command to the parent component
        toast({
          title: "Command processed!",
          description: `Action: ${command.action}`,
        })
      } catch (error) {
        console.error("Error sending command to AI:", error)
        toast({
          title: "Error",
          description: "Failed to process voice command. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    recognitionRef.current.onerror = (event) => {
      setIsListening(false)
      setIsLoading(false)
      console.error("Speech recognition error:", event.error)
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      })
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      if (!isLoading) {
        // Only show if not already loading AI response
        toast({
          title: "Listening stopped.",
          description: "No command detected or microphone closed.",
        })
      }
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className={isListening ? "bg-red-500 text-white hover:bg-red-600" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isListening ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="sr-only">{isListening ? "Stop Listening" : "Start Voice Command"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Stop Listening" : "Start Voice Command"}</p>
        </TooltipContent>
      </TooltipProvider>
  )
}\
