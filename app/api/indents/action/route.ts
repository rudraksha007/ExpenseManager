import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { IndentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.email) {
            return NextResponse.json({ msg: "Unauthorized", status: 401 }, { status: 401 });
        }
        const { approved, IndentNo } = await req.json();
        const indent = await prisma.indents.findUnique({
            where: {
                IndentNo: parseInt(IndentNo)
            }
        });

        if (!indent) {
            return NextResponse.json({ msg: 'Indent not found' }, { status: 404 });
        }

        if (session.user.email == 'root@ils.in') {
            return NextResponse.json({ msg: "Root Account Isn't supposed to perform this action" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                projectsAsCoPIs: {
                    include: {
                        Indents: true
                    }
                },
                projectsAsPIs: {
                    include: {
                        Indents: true
                    }
                },
            }
        });

        if (!user) {
            return NextResponse.json({ msg: "User not found or using root account", status: 404 }, { status: 404 });
        }

        await prisma.indents.update({
            where: {
                IndentNo: parseInt(IndentNo)
            },
            data: {
                IndentStatus: approved ? IndentStatus.APPROVED : IndentStatus.REJECTED,
                ActionedById: user.EmployeeId,
                ActionDate: new Date()
            }
        });

        return NextResponse.json({ msg: 'updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ msg: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}