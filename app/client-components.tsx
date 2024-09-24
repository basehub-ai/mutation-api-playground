"use client";
import { Box } from "@radix-ui/themes";
import { useFormStatus } from "react-dom";

export const FormResult = () => {
  const formStatus = useFormStatus();

  return (
    <Box
      p="3"
      style={{
        fontSize: "var(--font-size-2)",
        backgroundColor: "var(--sage-3)",
        padding: "var(--space-2)",
        borderRadius: "var(--radius-2)",
        minWidth: "300px",
      }}
      asChild
    >
      <pre>{JSON.stringify(formStatus, null, 2)}</pre>
    </Box>
  );
};
