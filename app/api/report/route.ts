import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getCategoryReport, getGeneralReport, getQuarterlyReport, getYearlyReport } from "@prisma/client/sql";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        
        const { reportType, year, projectNo, quarter } = await req.json();
        
        switch (reportType) {
            case 'general':
                return NextResponse.json({ data: await prisma.$queryRawTyped(getGeneralReport()), reportType: 'general' }, { status: 200 });
            case 'category':
                return NextResponse.json({ data: await prisma.$queryRawTyped(getCategoryReport()), reportType: 'category' }, { status: 200 });
            case 'yearly':
                return NextResponse.json({ data: await prisma.$queryRawTyped(getYearlyReport(projectNo, year)), reportType: 'yearly' }, { status: 200 });
            case 'quarterly':
                return NextResponse.json({ data: await prisma.$queryRawTyped(getQuarterlyReport(projectNo, quarter, year)), reportType: 'quarterly' }, { status: 200 });
            default:
                return NextResponse.json({ msg: "Invalid report type" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}