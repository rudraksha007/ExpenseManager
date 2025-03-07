import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { isAdmin: true } });
        if (!user) return NextResponse.json({ err: "User not found" }, { status: 404 });
        if (!user?.isAdmin) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        const { EmployeeId, password } = await req.json();
        await prisma.user.update({
            where: { EmployeeId },
            data: {
                password: CryptoJS.SHA256(password).toString()
            }
        });
        return NextResponse.json({ msg: "Employee updated" }, { status: 200 });

    } catch (err: any) {
        if (err.code === 'P2025') return NextResponse.json({ err: "Employee not found" }, { status: 404 });
        console.error(err);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}