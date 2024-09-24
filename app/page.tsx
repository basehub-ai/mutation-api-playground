import { basehub } from "basehub";
import { Pump } from "basehub/react-pump";
import { RichText } from "basehub/react-rich-text";
import { APITokenForm, FormResult } from "./client-components";
import {
  Blockquote,
  Box,
  Button,
  Code,
  Em,
  Flex,
  Heading,
  Link,
  Separator,
  Table,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { faker } from "@faker-js/faker";
import { cookies } from "next/headers";

export default async function Home() {
  async function getBlogPostCollectionId() {
    "use server";

    async function dostuff(retryCount = 0) {
      if (retryCount > 5) {
        throw new Error("Failed to get blog post collection id");
      }
      try {
        const data = await basehub({ draft: true, token: getToken() }).raw({
          query: `{ blogPosts { _id } }`,
        });
        // @ts-ignore
        return data?.blogPosts?._id as string;
      } catch (error) {
        if (retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return dostuff(retryCount++);
        } else {
          // means the collection doesn't exist. we'll create it.
          const result = await basehub({ token: getToken() }).mutation({
            transactionAwaitable: {
              __args: {
                data: {
                  type: "create",
                  data: {
                    type: "collection",
                    title: "Blog Posts",
                    template: [
                      {
                        type: "text",
                        title: "Excerpt",
                        isRequired: true,
                      },
                      {
                        type: "date",
                        title: "Date",
                        isRequired: true,
                      },
                      {
                        type: "image",
                        title: "Cover Image",
                        isRequired: true,
                      },
                      {
                        type: "rich-text",
                        title: "Body",
                        isRequired: true,
                      },
                    ],
                  },
                },
              },
              message: true,
              status: true,
            },
          });
          if (result.transactionAwaitable.status !== "Completed") {
            throw new Error(
              result.transactionAwaitable.message ??
                "Failed to create blog posts collection",
            );
          }
          return dostuff(retryCount++);
        }
      }
    }

    return await dostuff();
  }

  return (
    <Flex direction="column" gap="8" p="4">
      <Flex direction="column" gap="4" maxWidth="700px">
        <Pump
          queries={[
            {
              setUp: { title: true, description: { json: { content: true } } },
            },
          ]}
        >
          {async ([{ setUp }]) => {
            "use server";
            return (
              <>
                <Heading size="7">{setUp.title}</Heading>
                <Flex direction="column" gap="2">
                  <RichText
                    content={setUp.description.json.content}
                    components={{
                      p: ({ children }) => <Text as="p">{children}</Text>,
                      a: ({ children, ...rest }) => (
                        <Link size="3" asChild>
                          <NextLink {...rest}>{children}</NextLink>
                        </Link>
                      ),
                      h1: (props) => (
                        <Heading as="h1" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h2: (props) => (
                        <Heading as="h2" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h3: (props) => (
                        <Heading as="h3" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h4: (props) => (
                        <Heading as="h4" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h5: (props) => (
                        <Heading as="h5" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h6: (props) => (
                        <Heading as="h6" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      blockquote: ({ children }) => (
                        <Blockquote>{children}</Blockquote>
                      ),
                      table: (props) => (
                        <Table.Root {...props} size="2" layout="auto" />
                      ),
                      em: (props) => <Em {...props} />,
                      tbody: (props) => <Table.Body {...props} />,
                      tr: ({ children }) => <Table.Row>{children}</Table.Row>,
                      th: ({ children, rowspan, colspan }) => (
                        <Table.ColumnHeaderCell
                          colSpan={colspan}
                          rowSpan={rowspan}
                        >
                          {children}
                        </Table.ColumnHeaderCell>
                      ),
                      td: ({ children, rowspan, colspan }) => (
                        <Table.Cell colSpan={colspan} rowSpan={rowspan}>
                          {children}
                        </Table.Cell>
                      ),
                      hr: () => <Separator size="4" my="7" color="gray" />,
                      code: ({ isInline, ...rest }) => {
                        if (isInline)
                          return (
                            <Code data-type="inline-code" variant="outline">
                              {rest.children}
                            </Code>
                          );

                        return rest.children;
                      },
                      pre: ({ children }) => (
                        <Box
                          p="3"
                          style={{
                            fontSize: "var(--font-size-2)",
                            backgroundColor: "var(--sage-3)",
                            padding: "var(--space-2)",
                            borderRadius: "var(--radius-2)",
                          }}
                          asChild
                        >
                          <pre>{children}</pre>
                        </Box>
                      ),
                    }}
                  />
                </Flex>
              </>
            );
          }}
        </Pump>
        <APITokenForm
          defaultValue={getToken()}
          action={async (data) => {
            "use server";
            const token = data.get("token");
            if (typeof token === "string") {
              cookies().set("basehub-admin-token", token);
            }
          }}
        />
      </Flex>
      <Form
        heading="1. Create a blog post with random data"
        action={async (formData) => {
          "use server";

          const collectionId = await getBlogPostCollectionId();

          const result = await basehub({ token: getToken() }).mutation({
            transactionAwaitable: {
              __args: {
                autoCommit: "Create a blog post with random data",
                data: {
                  type: "create",
                  parentId: collectionId,
                  data: {
                    title:
                      formData.get("title")?.toString() || faker.lorem.words(3),
                    type: "instance",
                    value: {
                      excerpt: {
                        type: "text",
                        value: faker.lorem.sentences(2),
                      },
                      date: {
                        type: "date",
                        value: faker.date.recent().toISOString(),
                      },
                      body: {
                        type: "rich-text",
                        value: {
                          format: "markdown",
                          value: faker.lorem.paragraphs(
                            {
                              min: 4,
                              max: 8,
                            },
                            "\n\n",
                          ),
                        },
                      },
                    },
                  },
                },
              },
              message: true,
              status: true,
              duration: true,
            },
          });

          return result;
        }}
      >
        <Flex direction="column" gap="2" asChild>
          <label>
            <TextField.Root name="title" placeholder="Post title" />
          </label>
        </Flex>
      </Form>
      <Form
        heading="2. Delete a blog post"
        action={async (formData) => {
          "use server";

          const id = formData.get("id");
          if (typeof id !== "string") throw new Error("Invalid ID");

          const result = await basehub({ token: getToken() }).mutation({
            transactionAwaitable: {
              __args: {
                autoCommit: "Delete a blog post",
                data: {
                  type: "delete",
                  id,
                },
              },
              message: true,
              status: true,
              duration: true,
            },
          });

          return result;
        }}
      >
        <Flex direction="column" gap="2">
          <TextField.Root
            name="id"
            placeholder="Get it from the dashboard"
            required
          />
        </Flex>
      </Form>
      <Form
        heading="3. Update a blog post (including an image upload)"
        action={async (formData) => {
          "use server";

          const id = formData.get("id");
          if (typeof id !== "string") throw new Error("Invalid ID");

          const image = formData.get("coverImage");
          let imageURL: string | undefined;
          let imageFileName: string | undefined;
          if (image && typeof image === "object" && image.size > 0) {
            const result = await basehub({ token: getToken() }).mutation({
              getUploadSignedURL: {
                __args: {
                  fileName: image.name,
                },
                signedURL: true,
                uploadURL: true,
              },
            });
            await fetch(result.getUploadSignedURL.signedURL, {
              method: "PUT",
              body: image,
            });
            imageURL = result.getUploadSignedURL.uploadURL;
            imageFileName = image.name;
          }

          const result = await basehub({ token: getToken() }).mutation({
            transactionAwaitable: {
              __args: {
                autoCommit: "Update a blog post",
                data: {
                  type: "update",
                  id,
                  title: formData.get("title")?.toString() || undefined,
                  children: {
                    excerpt: {
                      type: "text",
                      value: formData.get("excerpt")?.toString() || undefined,
                    },
                    date: {
                      type: "date",
                      value: formData.get("date")?.toString() || undefined,
                    },
                    coverImage: {
                      type: "image",
                      value: imageURL
                        ? {
                            url: imageURL,
                            fileName: imageFileName,
                          }
                        : undefined,
                    },
                    body: {
                      type: "rich-text",
                      value: formData.get("body")
                        ? {
                            format: "markdown",
                            value: formData.get("body")?.toString() || "",
                          }
                        : undefined,
                    },
                  },
                },
              },
              message: true,
              status: true,
              duration: true,
            },
          });

          return result;
        }}
      >
        <Flex direction="column" gap="2" asChild>
          <label>
            <Text size="2" weight="medium">
              Post ID
            </Text>
            <TextField.Root
              name="id"
              placeholder="Get it from the dashboard"
              required
            />
          </label>
        </Flex>
        <Flex direction="column" gap="2" asChild>
          <label>
            <Text size="2" weight="medium">
              Title
            </Text>
            <TextField.Root name="title" />
          </label>
        </Flex>
        <Flex direction="column" gap="2" asChild>
          <label>
            <Text size="2" weight="medium">
              Date
            </Text>
            <TextField.Root name="date" type="date" />
          </label>
        </Flex>
        <Flex direction="column" gap="2" asChild>
          <label>
            <Text size="2" weight="medium">
              Excerpt
            </Text>
            <TextField.Root name="excerpt" />
          </label>
        </Flex>
        <Flex direction="column" gap="1" asChild>
          <label>
            <Text size="2" weight="medium">
              Cover Image
            </Text>
            <input type="file" name="coverImage" accept="image/*" />
          </label>
        </Flex>
        <Flex direction="column" gap="2" asChild>
          <label>
            <Text size="2" weight="medium">
              Body
            </Text>
            <TextArea name="body" placeholder="Markdown accepted" />
          </label>
        </Flex>
      </Form>
    </Flex>
  );
}

const Form = ({
  children,
  heading,
  action,
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  action: JSX.IntrinsicElements["form"]["action"];
}) => {
  const hash = heading
    ?.toString()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/\./g, "");
  return (
    <Flex
      direction="column"
      gap="4"
      maxWidth="500px"
      width="100%"
      position="relative"
      asChild
    >
      <form action={action}>
        <Link
          href={`#${hash}`}
          color="gray"
          style={{ width: "max-content", maxWidth: "100%" }}
          highContrast
        >
          <Heading as="h2" size="5" id={hash}>
            {heading}
          </Heading>
        </Link>
        <div>
          <Flex direction="column" gap="3">
            {children}
            <Button>Submit</Button>
            <FormResult sourceCode={action?.toString() || ""} />
          </Flex>
        </div>
      </form>
    </Flex>
  );
};

function getToken() {
  const tokenFromCookie = cookies().get("basehub-admin-token");
  if (tokenFromCookie) return tokenFromCookie.value;

  // will fallback to env vars
  return undefined;
}
