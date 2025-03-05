SELECT
    p."ProjectNo",
    p."ProjectTitle",
    p."TotalSanctionAmount",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'MANPOWER' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ManpowerUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'CONSUMABLES' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ConsumablesUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'CONTINGENCY' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ContingencyUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'OVERHEAD' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "OverheadUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'EQUIPMENT' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "EquipmentUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'TRAVEL' THEN i."IndentAmount"
                ELSE 0
            END
        ),
        0
    ) AS "TravelUsed",
    (
        p."TotalSanctionAmount" - (
            p."ManpowerAllocationAmt" + p."ConsumablesAllocationAmt" + p."ContingencyAllocationAmt" + p."OverheadAllocationAmt" + p."EquipmentAllocationAmt" + p."TravelAllocationAmt"
        )
    ) AS "UnallocatedAmount",
    (
        COALESCE(p."ManpowerAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'MANPOWER' THEN i."IndentAmount" ELSE 0 END), 0) +
        COALESCE(p."ConsumablesAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'CONSUMABLES' THEN i."IndentAmount" ELSE 0 END), 0) +
        COALESCE(p."ContingencyAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'CONTINGENCY' THEN i."IndentAmount" ELSE 0 END), 0) +
        COALESCE(p."OverheadAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'OVERHEAD' THEN i."IndentAmount" ELSE 0 END), 0) +
        COALESCE(p."EquipmentAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'EQUIPMENT' THEN i."IndentAmount" ELSE 0 END), 0) +
        COALESCE(p."TravelAllocationAmt", 0) - COALESCE(SUM(CASE WHEN i."Type" = 'TRAVEL' THEN i."IndentAmount" ELSE 0 END), 0)
    ) AS "RemainingAllocatedAmount"
FROM
    "Project" p
    LEFT JOIN "Indents" i ON p."ProjectNo" = i."ProjectNo"
GROUP BY
    p."ProjectNo"