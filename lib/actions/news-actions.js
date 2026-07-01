"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getNews() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
  return articles;
}

export async function createArticle(formData) {
  let success = false;
  let newArticleId = "";
  const session = await auth();
  if (!session?.user?.id || !session?.user?.isAdmin) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  try {
    const newArticle = await prisma.article.create({
      data: {
        userId: session.user.id,
        title,
        content,
      },
    });

    success = true;
    newArticleId = newArticle.id;
  } catch (error) {
    console.error("Failed to create article:", error);
    return { error: "Database error" };
  }

  if (success) {
    redirect(`/news/${newArticleId}`);
  }
}

export async function deleteArticle(articleId) {
  let success = false;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });

    if (!article) {
      throw new Error("Article not found");
    }
    if (!session.user.isAdmin) {
      throw new Error("No permission");
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    success = true;
  } catch (error) {
    console.error("Failed to delete article:", error);
    return { success: false, error: error.message };
  }

  if (success) {
    revalidatePath("/news");
    redirect("/news");
  }
}
