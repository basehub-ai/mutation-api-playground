'use server'
import { basehub } from "basehub";
import type { Transaction } from "basehub/api-transaction";

export async function getStatus(id: string) {
  const response = await basehub().mutation({
    transactionStatus: {
    __args: {
      id,
    },
  },})

  return response.transactionStatus
}

export const addNewRowTo = (async (collectionId: string, prevState: string | undefined | null, data: FormData ) => {
  const name = data.get("name")?.toString();
  const content = data.get("content")?.toString();
  const isHighlighted = data.get("highlighted") === "on";
  const releaseDate = data.get("releaseDate")?.toString();
  const release = releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString();

  console.log({ name, content, isHighlighted, collectionId });

  const { transaction } = await basehub().mutation({
    transaction: {
      __args: {
        data: JSON.stringify({
          type: "create",
          parentId: collectionId,
          data: {
            type: "instance",
            title: "",
            value: [
              {
                type: "text",
                value: name ?? null,
              },
              {
                type: "rich-text",
                value: {
                  format: "markdown",
                  value: content ?? "",
                },
              },
              {
                type: "boolean",
                value: isHighlighted ?? null,
              },
              {
                type: 'date',
                value: release,
              }
            ],
          },
        } satisfies Transaction),
        // autoCommit: "This was committed via API.",
      },
    },
  });

  return transaction;
})