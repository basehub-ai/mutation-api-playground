import { basehub } from "basehub";
import { FeatureForm } from "@/components/feature-form";
import { FormWrapper } from "@/components/form-wrapper";

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
      <FormWrapper collectionId={query.homepage.heroFeatures._id}>
        <FeatureForm />
      </FormWrapper>
    </main>
  );
}
