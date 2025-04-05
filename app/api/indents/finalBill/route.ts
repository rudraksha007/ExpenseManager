import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        const {
            IndentNo,
            BillCopy,
            FinalAmount
        } = await req.json();
        const ind = await prisma.indents.findFirst({
            where:{
                IndentNo
            }
        });
        if(!ind) return NextResponse.json({msg: "Indent No doesn't exists"}, {status: 400});

        await prisma.indents.update({
            where:{
                IndentNo
            },
            data: {
                FinalBill: BillCopy,
                FinalAmount: FinalAmount,
            },
        });
        return NextResponse.json({ msg: 'updated successfully' }, { status: 200 });
    }catch(err){
        return NextResponse.json({msg: err as string}, {status: 500});
    }
}