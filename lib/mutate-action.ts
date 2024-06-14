"use server";
import { basehub } from "basehub";

export async function getStatus(id: string) {
  const response = await basehub().mutation({
    transactionStatus: {
      __args: {
        id,
      },
    },
  });

  return response.transactionStatus;
}

export const uploadImageToBaseHub = async (imageInput: File) => {
  const { getUploadSignedURL } = await basehub().mutation({
    getUploadSignedURL: {
      __args: {
        fileName: imageInput.name,
      },
      signedURL: true,
      uploadURL: true,
    },
  });

  const uploadStatus = await fetch(getUploadSignedURL.signedURL, {
    method: "PUT",
    body: imageInput,
    headers: {
      "Content-Type": imageInput.type,
    },
  });

  if (uploadStatus.ok) {
    return getUploadSignedURL.uploadURL;
  }

  return null;
};

export const addNewRowTo = async (
  collectionId: string,
  _prevState: string | undefined | null,
  data: FormData
) => {
  const name = data.get("name")?.toString();
  const content = data.get("content")?.toString();
  const isHighlighted = data.get("highlighted") === "on";
  const releaseDate = data.get("releaseDate")?.toString();
  const release = releaseDate
    ? new Date(releaseDate).toISOString()
    : new Date().toISOString();

  // The image can be a remote URL or a file
  const remoteImage = data.get("image-url")?.toString();
  const imageInput = data.get("image-file");

  let imageUrl: string | null = remoteImage ?? null;
  if (!imageUrl && imageInput instanceof Blob && imageInput.size > 0) {
    imageUrl = await uploadImageToBaseHub(imageInput);
  }

  const { transaction } = await basehub().mutation({
    transaction: {
      __args: {
        data: {
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
                type: "date",
                value: release,
              },
              ...(imageUrl
                ? ([
                    {
                      type: "image",
                      value: {
                        altText: "Cover Image",
                        url: imageUrl,
                      },
                    },
                  ] as const)
                : []),
            ],
          },
        },
        // autoCommit: "This was committed via API.",
      },
    },
  });

  return transaction;
};
