WITH QuarterDates AS (
    SELECT
        CASE 
            WHEN $2 = 1 THEN TO_DATE(($3) || '-04-01', 'YYYY-MM-DD')  -- Q1: April 1st
            WHEN $2 = 2 THEN TO_DATE(($3) || '-07-01', 'YYYY-MM-DD')  -- Q2: July 1st
            WHEN $2 = 3 THEN TO_DATE(($3) || '-10-01', 'YYYY-MM-DD')  -- Q3: October 1st
            WHEN $2 = 4 THEN TO_DATE(CAST(($3::integer + 1) AS TEXT) || '-01-01', 'YYYY-MM-DD')        -- Q4: January 1st (Same Year)
        END AS StartDate,
        
        CASE 
            WHEN $2 = 1 THEN TO_DATE(($3) || '-06-30', 'YYYY-MM-DD')  -- Q1: June 30th
            WHEN $2 = 2 THEN TO_DATE(($3) || '-09-30', 'YYYY-MM-DD')  -- Q2: September 30th
            WHEN $2 = 3 THEN TO_DATE(($3) || '-12-31', 'YYYY-MM-DD')  -- Q3: December 31st
            WHEN $2 = 4 THEN TO_DATE(CAST(($3::integer + 1) AS TEXT) || '-03-31', 'YYYY-MM-DD')  -- Q4: March 31st (Next Year)
        END AS EndDate
)

SELECT
    i."Type" AS "Category",
    COALESCE(SUM(i."FinalAmount"), 0) AS "IndentedProposed",
    COALESCE(SUM(
        CASE WHEN i."IndentStatus" IN ('COMPLETED', 'APPROVED') THEN i."FinalAmount" ELSE 0 END
    ), 0) AS "Paid",
    COALESCE(SUM(
        CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END
    ), 0) AS "Committed",
    CASE i."Type"
        WHEN 'MANPOWER' THEN p."ManpowerAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
        WHEN 'TRAVEL' THEN p."TravelAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
        WHEN 'CONSUMABLES' THEN p."ConsumablesAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
        WHEN 'CONTINGENCY' THEN p."ContingencyAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
        WHEN 'OVERHEAD' THEN p."OverheadAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
        WHEN 'EQUIPMENT' THEN p."EquipmentAllocationAmt" - COALESCE(SUM(CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."FinalAmount" ELSE 0 END), 0)
    END AS "Remaining",
    CASE i."Type"
        WHEN 'MANPOWER' THEN p."ManpowerAllocationAmt"
        WHEN 'TRAVEL' THEN p."TravelAllocationAmt"
        WHEN 'CONSUMABLES' THEN p."ConsumablesAllocationAmt"
        WHEN 'CONTINGENCY' THEN p."ContingencyAllocationAmt"
        WHEN 'OVERHEAD' THEN p."OverheadAllocationAmt"
        WHEN 'EQUIPMENT' THEN p."EquipmentAllocationAmt"
    END AS "Allocation"
FROM "Indents" AS i
JOIN
    "Project" as p ON i."ProjectNo" = p."ProjectNo"
CROSS JOIN QuarterDates  -- Using calculated quarter dates

WHERE
    i."ProjectNo" = $1
    AND i."IndentDate" BETWEEN QuarterDates.StartDate AND QuarterDates.EndDate

GROUP BY
    i."Type",
    p."ProjectNo"
