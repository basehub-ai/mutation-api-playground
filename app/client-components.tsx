"use client";
import { Box, Flex, Text, TextField } from "@radix-ui/themes";
import { useFormStatus } from "react-dom";

export const FormResult = ({ sourceCode }: { sourceCode: string }) => {
  const formStatus = useFormStatus();

  return (
    <Flex gap="4">
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
    </Flex>
  );
};

export const APITokenForm = ({
  action,
  defaultValue,
}: {
  action: JSX.IntrinsicElements["form"]["action"];
  defaultValue?: string;
}) => {
  return (
    <form action={action}>
      <TextField.Root
        placeholder="Your API Token (optional)"
        name="token"
        defaultValue={defaultValue}
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
      />
      <Text size="1" color="gray">
        Remember, it needs to be an Admin Token.
      </Text>
    </form>
  );
};
