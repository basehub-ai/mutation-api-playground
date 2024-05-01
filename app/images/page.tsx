import { basehub } from "basehub";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageFormWrapper } from "./_components/image-form-wrapper";

export default async function ImagesUploadPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1>Load your images and see the result once uploaded to basehub.earth</h1>
      <ImageFormWrapper>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="pb-0">
            <div>Upload an image</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please fill out the form below to upload an image into BaseHub.
            </p>
          </CardHeader>
          <CardContent>
            <div>
            <Label htmlFor="image-file">Local Image</Label>
            <input type="file" name="image-file" id="image-file" accept="image/png, image/jpeg" />
            </div>
            <Button size="lg">Submit</Button>
          </CardContent>
        </Card>
      </ImageFormWrapper>
    </main>
  );
}

