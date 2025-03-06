import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        const { searchParams } = new URL(req.url);
        
        const queryParam = searchParams.get('type');
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            select: {
                isAdmin: true
            }
        });
        if (!user) return NextResponse.json({ err: "User not found" }, { status: 404 });
        switch (queryParam) {
            case 'user': {
                // if (!user.isAdmin) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
                const newId = await prisma.user.count();
                return NextResponse.json({ id: newId + 1 }, { status: 200 });
            }
            case 'indent':{
                const newId = await prisma.indents.count();
                return NextResponse.json({ id: newId + 1 }, { status: 200 });
            }
        }

    }
    catch (err: any) {
        console.error(err);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}