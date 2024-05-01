'use client'

import { Card } from "@/components/ui/card"
import { uploadImageToBaseHub } from "@/lib/mutate-action"
import * as React from "react"
import { useFormState } from "react-dom"

export const ImageFormWrapper = ({ children }: {children: React.ReactNode}) => {
  const [lastUploadUrl, formAction] = useFormState((prevState: string | undefined | null, data: FormData) => uploadImageToBaseHub(data), null)

  return <form action={formAction}>
    {children}
    <Card>
      {lastUploadUrl && 
        <img src={lastUploadUrl} alt="Uploaded image" className="w-full" />
      }
    </Card>
  </form>

}