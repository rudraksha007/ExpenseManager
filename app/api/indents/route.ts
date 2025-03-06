import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.email) {
            return NextResponse.json({ msg: "Unauthorized", status: 401 }, { status: 401 });
        }
        if(session.user.email === 'root@ils.in'){
            const indents = await prisma.indents.findMany();
            return NextResponse.json(indents, { status: 200 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                projectsAsCoPIs: true,
                projectsAsPIs: true,
            }
        });

        if (!user) {
            return NextResponse.json({ msg: "User not found", status: 404 }, { status: 404 });
        }

        if (user.isAdmin) {
            const indents = await prisma.indents.findMany();
            return NextResponse.json(indents, { status: 200 });
        }

        const indents = await prisma.indents.findMany({
            where: {
                OR: [
                    {
                        ProjectNo: {
                            in: user.projectsAsPIs.map((project) => project.ProjectNo)
                        }
                    },
                    {
                        ProjectNo: {
                            in: user.projectsAsCoPIs.map((project) => project.ProjectNo)
                        }
                    }
                ]
            }
        });

        return NextResponse.json(indents);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Internal Server Error", status: 500 }, { status: 500 });
    }
}