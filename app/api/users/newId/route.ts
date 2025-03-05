import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ err: "Unauthorized" } , { status: 401 });
    const newId = await prisma.user.count();
    return NextResponse.json({ id: newId+1 }, { status: 200 });
}