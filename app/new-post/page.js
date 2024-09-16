import PostForm from "@/components/post-form";
import { uploadImage } from "@/lib/cloudinary";
import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";

export default function NewPostPage() {
  async function createPost(prev, formData) {
    "use server";
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");

    let errors = [];

    if (!title || title.trim().length === 0) {
      errors.push("Title is required.");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Content is required.");
    }

    if (!image || image.size === 0) {
      errors.push("Image is required.");
    }

    if (errors.length > 0) {
      return { errors };
    }
    let imageUrl;
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(
        "Image upload failed, post was not created. Please try again"
      );
    }

    await storePost({
      imageUrl: imageUrl,
      title,
      content,
      userId: 1,
    });

    redirect("/feed");
  }

  return (
    <>
      <h1>Create a new post</h1>
      <PostForm action={createPost} />
    </>
  );
}
