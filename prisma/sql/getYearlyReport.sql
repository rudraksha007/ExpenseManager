SELECT
    i."Type" AS "Category",

    -- Directly summing allocations from the Project table
    COALESCE(p."ManpowerAllocationAmt", 0) + 
    COALESCE(p."TravelAllocationAmt", 0) + 
    COALESCE(p."ConsumablesAllocationAmt", 0) + 
    COALESCE(p."ContingencyAllocationAmt", 0) + 
    COALESCE(p."OverheadAllocationAmt", 0) + 
    COALESCE(p."EquipmentAllocationAmt", 0) AS "Allocation",

    -- Sum of all requested amounts
    COALESCE(SUM(i."IndentAmount"), 0) AS "IndentedProposed",

    -- Amount that has been paid
    COALESCE(SUM(
        CASE WHEN i."IndentStatus" = 'COMPLETED' THEN i."IndentAmount" ELSE 0 END
    ), 0) AS "Paid",

    -- Amount that is still pending or approved (committed)
    COALESCE(SUM(
        CASE WHEN i."IndentStatus" IN ('APPROVED', 'PENDING') THEN i."IndentAmount" ELSE 0 END
    ), 0) AS "Committed",

    -- Remaining allocation after all indent requests
    (
        COALESCE(p."ManpowerAllocationAmt", 0) + 
        COALESCE(p."TravelAllocationAmt", 0) + 
        COALESCE(p."ConsumablesAllocationAmt", 0) + 
        COALESCE(p."ContingencyAllocationAmt", 0) + 
        COALESCE(p."OverheadAllocationAmt", 0) + 
        COALESCE(p."EquipmentAllocationAmt", 0) - 
        COALESCE(SUM(i."IndentAmount"), 0)
    ) AS "AvailableAllocatedAmt",
    COALESCE(p."TotalSanctionAmount", 0) - COALESCE(SUM(i."IndentAmount"), 0) AS "UnallocatedAmt"

FROM "Indents" AS i
LEFT JOIN "Project" AS p ON i."ProjectNo" = p."ProjectNo"

WHERE
    i."ProjectNo" = $1
    AND i."IndentDate" BETWEEN 
        TO_DATE(
            CAST($2::integer AS TEXT) || '-04-01', 
            'YYYY-MM-DD'
        )  -- Start: April 1 of given year
        AND 
        TO_DATE(
            CAST(($2::integer + 1) AS TEXT) || '-03-31', 
            'YYYY-MM-DD'
        )  -- End: March 31 of next year

GROUP BY
    i."Type",
    p."ManpowerAllocationAmt",
    p."TravelAllocationAmt",
    p."ConsumablesAllocationAmt",
    p."ContingencyAllocationAmt",
    p."OverheadAllocationAmt",
    p."TotalSanctionAmount",
    p."EquipmentAllocationAmt";