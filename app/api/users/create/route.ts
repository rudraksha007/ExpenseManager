import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return { status: 401, body: { err: "Unauthorized" } };
    const { name, id, role, email, password } = await req.json();
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (dbUser) return NextResponse.json({ msg: "User already exists" }, { status: 400 });
    const newUser = await prisma.user.create({
        data: {
            name,
            EmployeeId: id,
            isAdmin: role==='SuperAdmin',
            email,
            password,
        }
    });
    if (!newUser) return NextResponse.json({ err: "Error creating user" }, { status: 500 });
    return NextResponse.json({ msg: "User created" }, { status: 200 });
}