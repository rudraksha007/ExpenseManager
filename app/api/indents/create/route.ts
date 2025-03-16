import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
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
            indentData,
            BillCopy
        } = await req.json();
        const proj = await prisma.project.findFirst({
            where: {
                ProjectNo
            }
        });
        if (!proj) return NextResponse.json({ msg: "Project doesn't exists" }, { status: 404 });
        const ind = await prisma.indents.findFirst({
            where:{
                IndentNo
            }
        });
        if(ind) return NextResponse.json({msg: "Indent No already exists"}, {status: 400});

        await prisma.indents.create({
            data: {
                ProjectNo,
                ProjectTitle,
                IndentNo,
                IndentDate: new Date(IndentDate),
                Type,
                IndentAmount: parseFloat(IndentAmount),
                IndentQty: parseInt(IndentQty),
                ActionDate: new Date(ActionDate),
                IndentPersonId: session.user.EmployeeId,
                IndentReason,
                IndentRemarks,
                indentData,
                BillCopy
            },
        });
        return NextResponse.json({ msg: 'created successfully' }, { status: 200 });
    }catch(err){
        return NextResponse.json({msg: err as string}, {status: 500});
    }
}