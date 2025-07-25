"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }) => void
  placeholder?: string
  label?: string
  required?: boolean
}

declare global {
  interface Window {
    google: any
    initGooglePlaces: () => void
  }
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Start typing your address...",
  label = "Address",
  required = false,
}: AddressAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    const loadGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete()
        setIsLoading(false)
        return
      }

      // Load Google Places API
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGooglePlaces`
      script.async = true
      script.defer = true

      window.initGooglePlaces = () => {
        initializeAutocomplete()
        setIsLoading(false)
      }

      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google) return

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address"],
      })

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace()

        if (!place.address_components) return

        let street = ""
        let city = ""
        let state = ""
        let zipCode = ""
        let country = ""

        place.address_components.forEach((component: any) => {
          const types = component.types

          if (types.includes("street_number")) {
            street = component.long_name + " "
          }
          if (types.includes("route")) {
            street += component.long_name
          }
          if (types.includes("locality")) {
            city = component.long_name
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name
          }
          if (types.includes("postal_code")) {
            zipCode = component.long_name
          }
          if (types.includes("country")) {
            country = component.short_name
          }
        })

        onAddressSelect({
          street: street.trim(),
          city,
          state,
          zipCode,
          country,
        })

        setInputValue(place.formatted_address || "")
      })
    }

    loadGooglePlaces()
  }, [onAddressSelect])

  return (
    <div className="space-y-2">
      <Label htmlFor="address-autocomplete" className="text-green-800 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address-autocomplete"
          type="text"
          placeholder={isLoading ? "Loading address search..." : placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          required={required}
          className="w-full border-green-200 focus:border-green-400 focus:ring-green-400/20"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
          </div>
        )}
      </div>
      {isLoading && <p className="text-sm text-green-600">Loading Google Places API...</p>}
    </div>
  )
}
