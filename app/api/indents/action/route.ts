import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { IndentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) { return NextResponse.json({ msg: "Unauthorized", status: 401 }, { status: 401 }); }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            projectsAsCoPIs: {
                include:{
                    Indents: true
                }
            },
            projectsAsPIs: {
                include:{
                    Indents: true
                }
            },
        }
    });
    if (!user) { return NextResponse.json({ msg: "User not found", status: 404 }, { status: 404 }); }
    const {approved, IndentNo} = await req.json();
    const indent = await prisma.indents.findUnique({
        where:{
            IndentNo
        }
    });
    if(!indent){
        return NextResponse.json({msg: 'Indent not found'}, {status: 404});
    }
    if(!user.isAdmin&&!user.projectsAsPIs.some((project)=>project.ProjectNo === indent.ProjectNo)&&!user.projectsAsCoPIs.some((project)=>project.ProjectNo === indent.ProjectNo)){
        return NextResponse.json({msg: 'You are not authorized to approve this indent'}, {status: 403});
    }
    await prisma.indents.update({
        where: {
            IndentNo
        },
        data:{
            IndentStatus: approved ? IndentStatus.APPROVED : IndentStatus.REJECTED
        }
    })
    return NextResponse.json({msg: 'updated successfully'}, {status: 200});
}