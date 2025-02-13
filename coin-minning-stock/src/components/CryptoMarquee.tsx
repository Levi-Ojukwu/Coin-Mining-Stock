"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface CryptoScrollProps {
    base?: string
    colorTx?: string
    marquee1?: string
    marquee2?: string
    marqueeItems?: number
  }

  const CryptoMarquee: React.FC<CryptoScrollProps> = ({
    base = "USD",
    colorTx = "#999999",
    marquee1 = "coins",
    marquee2 = "movers",
    marqueeItems = 20,
  }) => {
    const scriptRef = useRef<HTMLScriptElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
  
    useEffect(() => {
      if (!scriptRef.current) {
        const script = document.createElement("script")
        script.src = "https://www.livecoinwatch.com/static/lcw-widget.js"
        script.async = true
        script.defer = true
        document.body.appendChild(script)
        scriptRef.current = script
      }
  
      return () => {
        if (scriptRef.current) {
          document.body.removeChild(scriptRef.current)
        }
      }
    }, [])
  
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
        const div = document.createElement("div")
        div.className = "livecoinwatch-widget-5"
        div.setAttribute("lcw-base", base)
        div.setAttribute("lcw-color-tx", colorTx)
        div.setAttribute("lcw-marquee-1", marquee1)
        div.setAttribute("lcw-marquee-2", marquee2)
        div.setAttribute("lcw-marquee-items", marqueeItems.toString())
        containerRef.current.appendChild(div)
      }
    }, [base, colorTx, marquee1, marquee2, marqueeItems])
  
    return <div ref={containerRef} className="w-full bg-transparent  overflow-hidden" />
  } 

export default CryptoMarquee

