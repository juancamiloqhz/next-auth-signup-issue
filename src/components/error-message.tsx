import {
  Alert,
  // AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Icons } from "@/components/icons"

export default function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <Alert variant="destructive">
      <Icons.warning className="h-4 w-4" />
      <AlertTitle>{error}</AlertTitle>
      {/* <AlertDescription>{error}</AlertDescription> */}
    </Alert>
  )
}
