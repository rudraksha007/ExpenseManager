import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return { status: 401, body: { msg: "Unauthorized" } };
        const {
            ProjectNo,
            ProjectTitle,
            IndentNo,
            IndentDate,
            Type,
            IndentAmount,
            IndentQty,
            ActionDate,
            IndentReason,
            IndentRemarks,
            indentData
        } = await req.json();
        const proj = await prisma.project.findFirst({
            where: {
                ProjectNo
            }
        });
        if (!proj) return NextResponse.json({ msg: "Project doesn't exists" }, { status: 404 });

        const indent = await prisma.indents.create({
            data: {
                ProjectNo,
                ProjectTitle,
                IndentNo,
                IndentDate: new Date(IndentDate),
                Type,
                IndentAmount: parseFloat(IndentAmount),
                IndentQty: parseInt(IndentQty),
                ActionDate: new Date(ActionDate),
                ActionedById: session.user.EmployeeId,
                IndentReason,
                IndentRemarks,
                indentData
            },
        });
        return NextResponse.json({ msg: 'created successfully' }, { status: 200 });
    }catch(err: any){
        return NextResponse.json({msg: err.message}, {status: 500});
    }
}