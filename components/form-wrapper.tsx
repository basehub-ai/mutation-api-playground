"use client";
import * as React from "react";
import { useFormState } from "react-dom";
import { createUnionExample } from "@/lib/mutate-action";

export const FormWrapper = ({
  children,
  collectionId,
}: {
  collectionId: string;
  children: React.ReactNode;
}) => {
  const [_transactionId, formAction] = useFormState(() => {
    return createUnionExample();
  }, null);

  return <form action={formAction}>{children}</form>;
};
