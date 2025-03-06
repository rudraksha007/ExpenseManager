import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{id: string}> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        if (!id) return NextResponse.json({ err: "Bad Request" }, { status: 400 });

        const project = await prisma.project.findUnique({
            where: {
                ProjectNo: decodeURIComponent(id) as string
            },
            include: {
                PIs: {
                    select: {
                        name: true,
                        email: true,
                        isAdmin: true,
                        id: true,
                        EmployeeId: true
                    }
                },
                CoPIs: {
                    select: {
                        name: true,
                        email: true,
                        isAdmin: true,
                        id: true,
                        EmployeeId: true
                    }
                },
                Indents: true
            }
        });

        if (!project) return NextResponse.json({ msg: "Project not found" }, { status: 404 });

        const indents = await prisma.indents.groupBy({
            by: "Type",
            where: {
                ProjectNo: project.ProjectNo
            },
            _sum: {
                IndentAmount: true
            }
        });

        const resp = { ...project };

        indents.map((indent) => {
            //@ts-expect-error
            resp[`Remaining${indent}Amt`] = project[`${indent}AllocationAmt`] - (indent._sum.IndentAmount || 0);
            return null;
        });

        return NextResponse.json(resp, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
    }
}