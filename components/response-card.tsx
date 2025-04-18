import type { NumbersResponse } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResponseCardProps {
  title: string
  response: NumbersResponse
}

export default function ResponseCard({ title, response }: ResponseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Window Previous State</h3>
            <div className="bg-muted p-3 rounded-md overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(response.windowPrevState, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Window Current State</h3>
            <div className="bg-muted p-3 rounded-md overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(response.windowCurrState, null, 2)}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Numbers</h3>
            <div className="bg-muted p-3 rounded-md overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(response.numbers, null, 2)}</pre>
            </div>
          </div>

          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-2">Average:</h3>
            <Badge variant="secondary" className="text-lg">
              {response.avg}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
