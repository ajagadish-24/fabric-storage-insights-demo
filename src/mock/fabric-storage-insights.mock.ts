export const storageKpis = [
    { label: "Total Warehouse Storage", value: "14.2 TB", helperText: "Across 37 managed tables" },
    { label: "Unused Cold Data", value: "2.8 TB", helperText: "No reads in the last 120 days" },
    { label: "Compression Ratio", value: "4.6x", helperText: "Average parquet compression" },
    { label: "Monthly Growth", value: "+8.4%", helperText: "Compared with previous month" },
];

export const storageHealthScore = 87;

export const warehouseStorageTables = [
    {
        tableName: "fact_sales_transactions",
        storageUsed: "3.4 TB",
        growthRate: "+12%",
        owner: "Retail Analytics",
    },
    {
        tableName: "fact_inventory_snapshot",
        storageUsed: "2.1 TB",
        growthRate: "+5%",
        owner: "Supply Chain",
    },
    {
        tableName: "dim_customer_profile",
        storageUsed: "1.2 TB",
        growthRate: "+3%",
        owner: "CRM Insights",
    },
    {
        tableName: "fact_web_events",
        storageUsed: "0.9 TB",
        growthRate: "+17%",
        owner: "Digital Commerce",
    },
];

export const activityFeed = [
    {
        id: "load-2026-08-13-01",
        title: "Nightly ingestion complete",
        details: "Warehouse load pipeline added 124 GB and optimized 8 partitions.",
        timestamp: "Today at 01:10 UTC",
    },
    {
        id: "vacuum-2026-08-12-22",
        title: "Compaction and cleanup",
        details: "Background maintenance removed 43 GB of stale snapshot files.",
        timestamp: "Yesterday at 22:40 UTC",
    },
    {
        id: "policy-2026-08-12-14",
        title: "Retention policy updated",
        details: "Cold tier policy changed from 180 to 150 days for telemetry tables.",
        timestamp: "Yesterday at 14:05 UTC",
    },
];
