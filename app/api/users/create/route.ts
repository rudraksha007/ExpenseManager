import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { isAdmin: true } });
        if (!user) {
            return NextResponse.json({ msg: "User not found" }, { status: 404 });
        }
        if (!user?.isAdmin) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }
        const { name, id, role, email, password } = await req.json();
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser) {
            return NextResponse.json({ msg: "User already exists" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                EmployeeId: id,
                isAdmin: role === 'SuperAdmin',
                email,
                password: CryptoJS.SHA256(password).toString(),
            }
        });

        if (!newUser) {
            return NextResponse.json({ err: "Error creating user" }, { status: 500 });
        }

        return NextResponse.json({ msg: "User created" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}