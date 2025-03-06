import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.email) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }

        if (session.user?.email === 'root@ils.in') {
            const data = await prisma.project.findMany({});
            const projects = data.map(project => ({
                ...project,
                role: 'ROOT'
            }));
            return NextResponse.json(projects || [], { status: 200 });
        }

        const data = await prisma.project.findMany({
            where: {
                OR: [
                    {
                        PIs: {
                            some: {
                                email: session.user.email
                            }
                        }
                    },
                    {
                        CoPIs: {
                            some: {
                                email: session.user.email
                            }
                        }
                    }
                ]
            },
            include: {
                PIs: true,
                CoPIs: true,
            },
        });

        const projects = data.map(project => ({
            ...project,
            role: project.PIs.some(pi => pi.email === session.user?.email) ? 'PI' : 'COPI'
        }));

        return NextResponse.json(projects || [], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}