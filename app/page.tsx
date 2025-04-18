"use client"

import { useState, useEffect } from "react"
import type { NumbersResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import NumbersDisplay from "@/components/numbers-display"
import ResponseCard from "@/components/response-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("e")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<NumbersResponse | null>(null)
  const [previousResponse, setPreviousResponse] = useState<NumbersResponse | null>(null)
  const [requestCount, setRequestCount] = useState<number>(0)
  const [useMockApi, setUseMockApi] = useState<boolean>(true) // Default to mock API for reliability
  const [backendAvailable, setBackendAvailable] = useState<boolean>(false)

  // Check if the backend is available on component mount
  useEffect(() => {
    const checkBackendAvailability = async () => {
      try {
        const response = await fetch("/api/proxy/health-check", {
          signal: AbortSignal.timeout(2000), // 2 second timeout
        })
        setBackendAvailable(response.ok)
        // If backend is available, switch to using it
        if (response.ok) {
          setUseMockApi(false)
        }
      } catch (error) {
        console.log("Backend not available, using mock API")
        setBackendAvailable(false)
        setUseMockApi(true)
      }
    }

    checkBackendAvailability()
  }, [])

  const fetchNumbers = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use either the mock API or the proxy API based on the toggle
      const apiPath = useMockApi ? `/api/mock/numbers/${activeTab}` : `/api/proxy/numbers/${activeTab}`

      const response = await fetch(apiPath, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      }

      const data: NumbersResponse = await response.json()

      setPreviousResponse(response)
      setResponse(data)
      setRequestCount((prev) => prev + 1)
    } catch (err) {
      console.error("Error fetching data:", err)

      // If using the real API failed, suggest switching to mock API
      if (!useMockApi) {
        setError(`${err instanceof Error ? err.message : "Failed to fetch data"}. Try switching to the Mock API.`)
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch when component mounts or when API mode changes
    fetchNumbers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMockApi])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleRefresh = () => {
    fetchNumbers()
  }

  const getNumberTypeLabel = (type: string): string => {
    switch (type) {
      case "p":
        return "Prime"
      case "f":
        return "Fibonacci"
      case "e":
        return "Even"
      case "r":
        return "Random"
      default:
        return "Unknown"
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Average Calculator Microservice</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          This application fetches numbers from a microservice API and displays the window state and average.
        </p>
      </div>

      {!backendAvailable && !useMockApi && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Not Available</AlertTitle>
          <AlertDescription>The backend server is not responding. Switch to the Mock API for testing.</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Testing Interface</CardTitle>
          <CardDescription>Select a number type and fetch data from the API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center">
              <span className="text-sm mr-2">Use Mock API:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={useMockApi}
                  onChange={() => setUseMockApi(!useMockApi)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <Tabs defaultValue="e" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="p">Prime</TabsTrigger>
              <TabsTrigger value="f">Fibonacci</TabsTrigger>
              <TabsTrigger value="e">Even</TabsTrigger>
              <TabsTrigger value="r">Random</TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="outline" className="mr-2">
                  Endpoint: {useMockApi ? `/api/mock/numbers/${activeTab}` : `/api/proxy/numbers/${activeTab}`}
                </Badge>
                <Badge variant="outline">Type: {getNumberTypeLabel(activeTab)}</Badge>
              </div>
              <Button onClick={handleRefresh} disabled={loading} variant="outline">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="w-full flex justify-between">
            <span className="text-sm text-muted-foreground">Request count: {requestCount}</span>
            <span className="text-sm text-muted-foreground">
              API Mode: {useMockApi ? "Mock (Client-side)" : "Real (Backend)"}
            </span>
          </div>
          {error && (
            <div className="w-full mt-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {response && <ResponseCard title="Current Response" response={response} />}
        {previousResponse && requestCount > 1 && <ResponseCard title="Previous Response" response={previousResponse} />}
      </div>

      {response && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Numbers Visualization</CardTitle>
            <CardDescription>Visual representation of the window state</CardDescription>
          </CardHeader>
          <CardContent>
            <NumbersDisplay
              windowPrevState={response.windowPrevState}
              windowCurrState={response.windowCurrState}
              avg={response.avg}
            />
          </CardContent>
        </Card>
      )}
    </main>
  )
}
