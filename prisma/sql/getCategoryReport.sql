SELECT
    p."ProjectNo",
    p."ProjectTitle",
    p."TotalSanctionAmount",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'MANPOWER' THEN i."FinalAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ManpowerUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'CONSUMABLES' THEN i."FinalAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ConsumablesUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'CONTINGENCY' THEN i."FinalAmount"
                ELSE 0
            END
        ),
        0
    ) AS "ContingencyUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'OVERHEAD' THEN i."FinalAmount"
                ELSE 0
            END
        ),
        0
    ) AS "OverheadUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'EQUIPMENT' THEN i."FinalAmount"
                ELSE 0
            END
        ),
        0
    ) AS "EquipmentUsed",
    COALESCE(
        SUM(
            CASE
                WHEN i."Type" = 'TRAVEL' THEN i."FinalAmount"
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
        COALESCE(p."ManpowerAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'MANPOWER' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        ) + COALESCE(p."ConsumablesAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'CONSUMABLES' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        ) + COALESCE(p."ContingencyAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'CONTINGENCY' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        ) + COALESCE(p."OverheadAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'OVERHEAD' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        ) + COALESCE(p."EquipmentAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'EQUIPMENT' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        ) + COALESCE(p."TravelAllocationAmt", 0) - COALESCE(
            SUM(
                CASE
                    WHEN i."Type" = 'TRAVEL' THEN i."FinalAmount"
                    ELSE 0
                END
            ),
            0
        )
    ) AS "RemainingAllocatedAmount",
    (
        SELECT COALESCE(SUM(p2."ManpowerAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalManpowerAmount",
    (
        SELECT COALESCE(SUM(p2."ConsumablesAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalConsumablesAmount",
    (
        SELECT COALESCE(SUM(p2."ContingencyAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalContingencyAmount",
    (
        SELECT COALESCE(SUM(p2."OverheadAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalOverheadAmount",
    (
        SELECT COALESCE(SUM(p2."EquipmentAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalEquipmentAmount",
    (
        SELECT COALESCE(SUM(p2."TravelAllocationAmt"), 0)
        FROM "Project" p2
        -- WHERE EXISTS (
        --     SELECT 1 FROM "_ProjectPIs" pi WHERE pi."A" = p2."ProjectNo" AND pi."B" = $1
        -- ) OR EXISTS (
        --     SELECT 1 FROM "_ProjectCoPIs" copi WHERE copi."A" = p2."ProjectNo" AND copi."B" = $1
        -- )
    ) AS "TotalTravelAmount"
FROM
    "Project" p
    LEFT JOIN "Indents" i ON p."ProjectNo" = i."ProjectNo"
GROUP BY
    p."ProjectNo"