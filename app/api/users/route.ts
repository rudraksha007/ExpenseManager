import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        const users = await prisma.user.findMany({ select: { email: true, name: true, EmployeeId: true, isAdmin: true } });
        return NextResponse.json(users || [], { status: 200 });
    }catch(err: any){
        console.error(err);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500});
    }
}