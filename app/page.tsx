import { basehub } from "basehub";
import { Transaction } from "basehub/api-transaction";
import { FeatureForm } from "@/components/feature-form";

export default async function Home() {
  const query = await basehub({ cache: "no-store" }).query({
    homepage: {
      heroFeatures: {
        _id: true,
      },
    },
  });

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form
        action={async (data) => {
          "use server";

          const name = data.get("name")?.toString();
          const content = data.get("content")?.toString();
          const isHighlighted = data.get("highlighted") === "on";

          const collectionId = query.homepage.heroFeatures._id;

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
                        value: content ?? null,
                      },
                      {
                        type: "boolean",
                        value: isHighlighted ?? null,
                      },
                    ],
                  },
                } satisfies Transaction),
                autoCommit: "This was committed via API.",
              },
            },
          });

          return transaction;
        }}
      >
        <FeatureForm />
      </form>
    </main>
  );
}
