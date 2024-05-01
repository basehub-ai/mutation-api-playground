'use server'
import { CreateInstanceBlockOp, basehub } from "basehub";
import { Transaction } from "basehub/api-transaction";

export async function getStatus(id: string) {
  const response = await basehub().mutation({
    transactionStatus: {
    __args: {
      id,
    },
  },})

  return response.transactionStatus
}

export const uploadImageToBaseHub = async (formData: FormData) => {
  const imageInput = formData.get('image-file');
  if (!(imageInput instanceof Blob)) {
    throw new Error("Image is not a Blob");
  }

  const { getUploadSignedURL } =  await basehub().mutation({
    getUploadSignedURL: {
      __args: {
        fileName: imageInput.name,
      },
      signedUrl: true,
      uploadUrl: true,
    },
  });

  const  uploadStatus = await fetch(getUploadSignedURL.signedUrl, {
    method: "PUT",
    body: imageInput,
    headers: {
      "Content-Type": imageInput.type,
    },
  });

  if (uploadStatus.ok) {
    return getUploadSignedURL.uploadUrl
  }

  return null
}

export const addNewRowTo = (async (collectionId: string, prevState: string | undefined | null, data: FormData ) => {
  const name = data.get("name")?.toString();
  const content = data.get("content")?.toString();
  const isHighlighted = data.get("highlighted") === "on";
  const releaseDate = data.get("releaseDate")?.toString();
  const release = releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString();

  // The image can be a remote URL or a file
  const remoteImage= data.get("image-url")?.toString()
  const imageInput = data.get("image-file");

  let imageField: CreateInstanceBlockOp['value'][0] | null
  if (remoteImage) {
      imageField = {
        type: "image",
        value: {
          mimeType: 'image/png',
          altText: "Cover Image",
          format: 'url',
          data: remoteImage},
      }
  } else if ((imageInput instanceof Blob)) {    
    const file = await imageInput.arrayBuffer();
    const buffer = Buffer.from(file);
    imageField = imageInput.size ? {
      type: "image",
      value: {
        mimeType: imageInput.type,
        altText: "Cover Image",
        format: 'base64',
        data: buffer.toString("base64")},
      } : null; 
  } else {
    throw new Error("Image is not a Blob");
  }

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
              },
              ...(imageField ? [imageField] : []),
            ],
          },
        } satisfies Transaction),
        // autoCommit: "This was committed via API.",
      },
    },
  });

  return transaction;
})
