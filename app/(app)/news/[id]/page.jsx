import Button from "@/app/ui/button";
import { GoBackButton, DeleteArticleButton } from "@/app/ui/util-button";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/actions";
import clsx from "clsx";
import { auth } from "@/auth";

export default async function Page({ params }) {
  const session = await auth();
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id: id },
  });

  const user = article ? await getUser(article.userId) : null;
  const username = user?.username || "unknown";

  const formattedDate = article
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex h-fit w-full flex-col gap-4 rounded-2xl bg-base-base p-4">
      <div
        className={clsx(
          "flex w-full items-center",
          session?.user?.isAdmin ? "justify-between" : "justify-start",
        )}
      >
        <GoBackButton />
        {session?.user?.isAdmin && (
          <div className="flex gap-4">
            <DeleteArticleButton articleId={article.id} />
            <div>
              <Button text={"Edit"} />
            </div>
          </div>
        )}
      </div>
      <article className="flex h-fit w-full flex-col gap-8 px-4">
        {article ? (
          <>
            <header className="flex h-fit w-full flex-col gap-2">
              <h1 className="w-full text-hero font-bold">{article.title}</h1>
              <span>{formattedDate}</span>
              <span className="w-full cursor-pointer font-medium text-base-text-darker hover:underline">{`@${username}`}</span>
            </header>
            <p className="h-fit w-full">{article.content}</p>
          </>
        ) : (
          <p className="h-fit w-full">This post does not exist</p>
        )}
      </article>
    </div>
  );
}
