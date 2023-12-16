import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/icons"

export default function SuccessMessage({
  title,
  message,
}: {
  title: string | null
  message: string | null
}) {
  if (!message) return null
  return (
    <Alert variant="success">
      <Icons.check className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {message && <AlertDescription>{message}</AlertDescription>}
    </Alert>
  )
}
