import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    // console.log(id);

    if (!session || !session.user?.email) return { status: 401, body: { err: "Unauthorized" } };
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
    // console.log(project);

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
    const resp = {...project};
    
    indents.map((indent) => {
        //@ts-expect-error
        resp[`Remaining${indent}Amt`] = project[`${indent}AllocationAmt`] - (indent._sum.IndentAmount || 0);
        return null;
    });
    // console.log(resp);
    

    // project.remainingAmounts = remainingAmounts;
    return NextResponse.json(resp, { status: 200 });
}