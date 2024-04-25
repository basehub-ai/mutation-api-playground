'use client';
import * as React from 'react';
import { useFormState } from "react-dom";
import { addNewRowTo, getStatus } from "@/lib/mutate-action";

export const FormWrapper = ({ children, collectionId }: {collectionId: string; children: React.ReactNode}) => {
  const [transactionId, formAction] = useFormState((...args: [string | undefined | null, FormData]) => addNewRowTo(collectionId, ...args), null)
  const [status, setStatus]= React.useState("idle")

React.useEffect(() => {
  if (transactionId) {
    switch (status) {
      case 'idle':
      setStatus("pending")
      break;
      case 'pending':
        getStatus(transactionId).then((response) => {
          setStatus(response)
        })
      break;
    }
  }
}, [transactionId, status])

  return <form
  action={formAction}
>
    {children}
    <span className='text-gray-800 font-medium text-sm'>Status: {status}</span>
    </form>;
}