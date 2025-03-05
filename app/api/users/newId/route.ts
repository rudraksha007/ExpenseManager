import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return { status: 401, body: { err: "Unauthorized" } };
    const newId = await prisma.user.count();
    return NextResponse.json({ id: newId+1 }, { status: 200 });
}