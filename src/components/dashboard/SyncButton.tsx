import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ga4Service } from "@/services/ga4Service"

interface SyncButtonProps {
  className?: string
}

export function SyncButton({ className }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    
    try {
      // Get credentials
      const credentials = await ga4Service.getCredentials()
      
      if (!credentials) {
        toast.error("No credentials configured", {
          description: "Please configure your analytics credentials in Settings.",
        })
        setIsSyncing(false)
        return
      }

      // Sync all data
      await ga4Service.syncAllData(
        credentials.property_id || "",
        undefined,
        undefined
      )
      
      toast.success("Sync complete", {
        description: "All data sources have been refreshed.",
      })
    } catch (error) {
      console.error("Sync error:", error)
      toast.error("Sync failed", {
        description: error instanceof Error ? error.message : "Failed to sync data sources.",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className={className}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Syncing..." : "Refresh Data"}
    </Button>
  )
}
