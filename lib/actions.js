"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import pokemonData from "@/data/pokemon.json";
import z from "zod";

export async function getUser(userId) {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });
  return user;
}

// News
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
    redirect(`news/${newArticleId}`);
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

// Team
export async function getTeamData({ id }) {
  const getCachedTeam = unstable_cache(
    async (teamId) => {
      return await prisma.team.findUnique({
        where: { id: teamId },
        select: {
          replicaId: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          likes: true,
        },
      });
    },
    ["team-detail", id],
    { tags: [`team-${id}`] },
  );

  const team = getCachedTeam(id);
  if (!team) return null;
  return team;
}

export async function getPokemonMoves({ id }) {
  const moves = await prisma.teamPokemonMove.findMany({
    where: { teamPokemonId: id },
  });
  return moves;
}

export async function createTeam() {
  let newTeamId = null;
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const newTeam = await prisma.team.create({
      data: {
        userId: session.user.id,
        name: "New team",
      },
    });
    newTeamId = newTeam.id;
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }

  if (newTeamId) redirect(`/teams?open=${newTeamId}`);
}

export async function duplicateTeam(team) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const generatedName = `Copy of ${team.name}`;
    const safeName = generatedName.slice(0, 64);

    const newTeam = await prisma.team.create({
      data: {
        userId: session.user.id,
        replicaId: team.replicaId,
        name: safeName,
        notes: team.notes,
        isLegal: team.isLegal,
        format: team.format,
      },
    });
    redirect(`/teams?open=${newTeam.id}`);
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeam(teamId) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.userId !== session.user.id) {
      throw new Error("No permission");
    }

    await prisma.team.delete({
      where: { id: teamId },
    });

    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamName(teamId, teamName) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.userId !== session.user.id) {
      throw new Error("No permission");
    }

    await prisma.team.update({
      where: { id: teamId },
      data: { name: teamName },
    });
    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamCode(teamId, teamCode) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });
    if (!team) throw new Error("Team not found");
    if (team.userId !== session.user.id) throw new Error("No permission");

    await prisma.team.update({
      where: { id: teamId },
      data: { replicaId: teamCode },
    });
    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

// Team Pokemon
export async function createTeamPokemon(teamId, pokemonId) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true, pokemon: true },
    });
    if (!team) throw new Error("Team not found");
    if (team.userId !== session.user.id) throw new Error("No permission");
    if (team.pokemon.length == 6) throw new Error("Team is full");

    const pokemon = pokemonData.find((p) => p.id === pokemonId);
    if (!pokemon) throw new Error("Pokémon not found");

    await prisma.teamPokemon.create({
      data: {
        teamId: teamId,
        slot: team.pokemon.length + 1,
        pokemonId: pokemonId,
        ability: pokemon.abilities[0],
        nature: "hardy",
      },
    });
    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function changeTeamPokemon(mon, pokemonId) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const pokemon = await prisma.teamPokemon.findUnique({
      where: { id: mon.id },
      select: { id: true, teamId: true },
    });
    const team = await prisma.team.findUnique({
      where: { id: pokemon.teamId },
      select: { id: true, userId: true },
    });
    if (team.userId !== session.user.id) throw new Error("No permission");
    const ability = pokemonData.find((p) => p.id === pokemonId).abilities[0];

    await prisma.teamPokemon.update({
      where: { id: pokemon.id },
      data: {
        pokemonId: pokemonId,
        ability: ability,
      },
    });
    updateTag(`team-${team.id}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamPokemon(type, mon, data) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const pokemon = await prisma.teamPokemon.findUnique({
      where: { id: mon.id },
      select: { id: true, teamId: true },
    });
    const team = await prisma.team.findUnique({
      where: { id: pokemon.teamId },
      select: { id: true, userId: true },
    });
    if (team.userId !== session.user.id) throw new Error("No permission");

    if (type === "item") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { item: data },
      });
    } else if (type === "nature") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { nature: data },
      });
    } else if (type === "ability") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { ability: data },
      });
    }
    updateTag(`team-${team.id}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamPokemonEv(type, mon, ev) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const pokemon = await prisma.teamPokemon.findUnique({
      where: { id: mon.id },
      select: { id: true, teamId: true },
    });
    const team = await prisma.team.findUnique({
      where: { id: pokemon.teamId },
      select: { id: true, userId: true },
    });
    if (team.userId !== session.user.id) throw new Error("No permission");

    if (type === "HP") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evHp: ev },
      });
    } else if (type === "Atk") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evAtk: ev },
      });
    } else if (type === "Def") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evDef: ev },
      });
    } else if (type === "SpA") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evSpa: ev },
      });
    } else if (type === "SpD") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evSpd: ev },
      });
    } else if (type === "Spe") {
      await prisma.teamPokemon.update({
        where: { id: pokemon.id },
        data: { evSpe: ev },
      });
    }
    updateTag(`team-${team.id}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeamPokemon(mon) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const pokemon = await prisma.teamPokemon.findUnique({
      where: { id: mon.id },
      select: { id: true, teamId: true },
    });
    const team = await prisma.team.findUnique({
      where: { id: pokemon.teamId },
      select: { id: true, userId: true },
    });
    if (team.userId !== session.user.id) throw new Error("No permission");

    await prisma.teamPokemon.delete({
      where: { id: pokemon.id },
    });
    updateTag(`team-${team.id}`);
    return { success: true };
  } catch (error) {
    console.log("Failed:", error);
    return { success: false, error: error.message };
  }
}

//Auth
const SignUpSchema = z.object({
  username: z
    .string({ error: "Username is empty" })
    .trim()
    .min(1, "Username is empty")
    .min(4, "Username is too short")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username"),
  email: z
    .string({ required_error: "Email is empty" })
    .trim()
    .min(1, "Email is empty")
    .pipe(z.email({ error: "Invalid email address" })),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty")
    .min(8, "Password is too short")
    .max(100, "Password is too long"),
});

const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is empty" })
    .trim()
    .min(1, "Email is empty")
    .pipe(z.email({ error: "Invalid email address" })),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty"),
});

export async function signUpAction(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedFields = SignUpSchema.safeParse({ username, email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedFields.data.email },
          { username: validatedFields.data.username },
        ],
      },
      select: { email: true, username: true },
    });

    if (existingUser) {
      if (existingUser.email === validatedFields.data.email) {
        return { errors: { email: ["Email is in use"] } };
      }
      if (existingUser.username === validatedFields.data.username) {
        return { errors: { username: ["Username is in use"] } };
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username: validatedFields.data.username,
        email: validatedFields.data.email,
        password: hashed,
      },
    });
  } catch (error) {
    console.error("Sign up failure:", error);
    return { errors: { form: ["An unexpected error occurred"] } };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/home" });
  } catch (error) {
    if (error.name === "AuthError" || error.type === "CredentialsSignin") {
      return {
        errors: { form: ["Account created, but automatic sign-in failed"] },
      };
    }
    throw error;
  }
}

export async function signInAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedFields = SignInSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/home" });
  } catch (error) {
    if (error.name === "AuthError" || error.type === "CredentialsSignin") {
      return {
        errors: { form: ["Invalid email or password"] },
      };
    }
    throw error;
  }
}
