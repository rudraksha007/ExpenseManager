import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const {
        ProjectTitle,
        ProjectNo,
        ProjectStartDate,
        ProjectEndDate,
        SanctionOrderNo,
        TotalSanctionAmount,
        FundedBy,
        PIs,
        CoPIs,
        ManpowerAllocationAmt,
        ConsumablesAllocationAmt,
        ContingencyAllocationAmt,
        OverheadAllocationAmt,
        EquipmentAllocationAmt,
        TravelAllocationAmt,
    } = await req.json();
    const proj = await prisma.project.findFirst({
        where: {
            ProjectNo
        }
    });
    if (!proj) return NextResponse.json({ msg: "Project doesn't exists" }, { status: 404 });
    
    await prisma.project.update({
        where:{
            ProjectNo
        },
        data: {
            ProjectTitle,
            ProjectStartDate: new Date(ProjectStartDate),
            ProjectEndDate: new Date(ProjectEndDate),
            SanctionOrderNo,
            TotalSanctionAmount: parseFloat(TotalSanctionAmount),
            FundedBy: [FundedBy],
            PIs: {
                connect: PIs.map(({email}:{email: string}) => ({ email })),
            },
            CoPIs:{
                connect: CoPIs.map(({email}:{email: string}) => ({ email })),
            },
            ManpowerAllocationAmt: parseFloat(ManpowerAllocationAmt),
            ConsumablesAllocationAmt: parseFloat(ConsumablesAllocationAmt),
            ContingencyAllocationAmt: parseFloat(ContingencyAllocationAmt),
            OverheadAllocationAmt: parseFloat(OverheadAllocationAmt),
            EquipmentAllocationAmt: parseFloat(EquipmentAllocationAmt),
            TravelAllocationAmt: parseFloat(TravelAllocationAmt),
            ProjectStatus: new Date(ProjectEndDate)<=new Date()? 'COMPLETED': 'ONGOING', // or any default status
        },
    });
    return NextResponse.json({msg: 'created successfully'}, { status: 200 });
}