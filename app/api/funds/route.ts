import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { FundData } from "@/lib/utils";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface Funds {
    [key: string]: number;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
        }

        let projects = [];
        if (session.user.email == 'root@ils.in') {
            projects = await prisma.project.findMany({
                include: {
                    PIs: true,
                    CoPIs: true,
                },
            });
        } else {
            projects = await prisma.project.findMany({
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
        }

        const data: FundData = {
            projectFund: [],
            piFund: [],
            agencyFund: [],
        };

        const piFunds: Funds = {};
        const agencyFunds: Funds = {};

        projects.forEach((project) => {
            project.FundedBy.forEach((agency: string) => {
                if (!agencyFunds[agency]) agencyFunds[agency] = project.TotalSanctionAmount;
                else agencyFunds[agency] += project.TotalSanctionAmount;
            });
            data.agencyFund = Object.keys(agencyFunds).map((key) => ({ name: key, value: agencyFunds[key] }));

            data.projectFund.push({ name: project.ProjectTitle, value: project.TotalSanctionAmount });

            project.PIs.forEach((pi: User) => {
                const piKey = `${pi.name}(${pi.email})`;
                if (!piFunds[piKey]) piFunds[piKey] = project.TotalSanctionAmount;
                else piFunds[piKey] += project.TotalSanctionAmount;
            });

            project.CoPIs.forEach((pi: User) => {
                const piKey = `${pi.name}(${pi.email})`;
                if (!piFunds[piKey]) piFunds[piKey] = project.TotalSanctionAmount;
                else piFunds[piKey] += project.TotalSanctionAmount;
            });

            data.piFund = Object.keys(piFunds).map((key) => ({ name: key, value: piFunds[key] }));
        });

        return NextResponse.json(data, { status: 200 });
    } catch(e: any) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}