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
WHERE
    i."ProjectNo" = $1
    AND i."IndentDate" BETWEEN 
        TO_DATE(
            CAST($2::integer AS TEXT) || '-04-01', 
            'YYYY-MM-DD'
        )  
        AND 
        TO_DATE(
            CAST(($2::integer + 1) AS TEXT) || '-03-31', 
            'YYYY-MM-DD'
        ) 
GROUP BY
    i."Type", p."ProjectNo"
