export type StorageUnit = "MB" | "GB" | "TB";

export interface StorageMetric {
  id: string;
  label: string;
  value: number;
  unit: StorageUnit;
  description: string;
  filterCategoryIds?: string[];
  percentageOfTotal?: number;
}

export interface StorageCategory {
  id: string;
  name: string;
  sizeGb: number;
  description: string;
  billingState: string;
  cleanupBehavior: string;
  relatedCapability: string;
}

export interface TableStorageRecord {
  id: string;
  schema: string;
  tableName: string;
  tableType: "Fact" | "Dimension" | "Snapshot" | "Staging" | "Audit" | "Aggregate";
  totalGb: number;
  activeGb: number;
  historicalGb: number;
  softDeletedGb: number;
  cloneRetainedGb: number;
  fileCount: number;
  expiredFiles: number;
  nonReferencedFiles: number;
  lastModified: string;
  lastAccessed: string;
  queriesLast30Days: number;
  growth30dPct: number;
  owner: string;
  reviewRecommended?: boolean;
}

export interface TrendPoint {
  day: string;
  totalGb: number;
  activeGb: number;
  historicalGb: number;
  systemGb: number;
}

export interface Observation {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning";
}

export interface QueryViewDefinition {
  viewName: string;
  purpose: string;
  columns: string[];
  sampleQuery: string;
  rows: Array<Record<string, string | number>>;
  dashboardTarget: StorageTab;
}

export interface AlertRule {
  id: string;
  ruleName: string;
  enabled: boolean;
  severity: "Information" | "Warning" | "Critical";
  threshold: string;
  destination: string;
  lastTriggered: string;
}

export type StorageTab =
  | "overview"
  | "breakdown"
  | "tables"
  | "trends"
  | "query-views"
  | "retention"
  | "alerts";

export const warehouseName = "SalesAnalyticsDW";
export const workspaceName = "Enterprise Analytics";

export const storageCategories: StorageCategory[] = [
  {
    id: "active-data",
    name: "Active data",
    sizeGb: 7475.2,
    description: "Current data files used for active warehouse query and serving operations.",
    billingState: "Billed",
    cleanupBehavior: "Retained while referenced by active table snapshots.",
    relatedCapability: "Warehouse table data",
  },
  {
    id: "historical-data",
    name: "Historical/time-travel data",
    sizeGb: 2478.08,
    description: "Versioned historical files retained for time-travel and retention windows.",
    billingState: "Billed",
    cleanupBehavior: "Aged out automatically based on retention policy.",
    relatedCapability: "Time travel and retention",
  },
  {
    id: "soft-deleted-data",
    name: "Soft-deleted data",
    sizeGb: 300,
    description: "Data marked for deletion but still available until retention and cleanup windows complete.",
    billingState: "Billed",
    cleanupBehavior: "Purged after lifecycle and reference checks pass.",
    relatedCapability: "Soft delete lifecycle",
  },
  {
    id: "system-generated-files",
    name: "System-generated files",
    sizeGb: 540,
    description: "Warehouse-generated metadata and optimization artifacts.",
    billingState: "Billed",
    cleanupBehavior: "Managed by background warehouse maintenance.",
    relatedCapability: "Warehouse optimization",
  },
  {
    id: "temporary-execution-files",
    name: "Temporary execution files",
    sizeGb: 535.2,
    description: "Transient files produced for execution, shuffle, and intermediate query processing.",
    billingState: "Billed",
    cleanupBehavior: "Auto-cleaned after workload completion and retention checks.",
    relatedCapability: "Query execution",
  },
  {
    id: "query-insights",
    name: "Query Insights data",
    sizeGb: 110,
    description: "Storage used by adjacent Query Insights telemetry and history artifacts.",
    billingState: "Billed",
    cleanupBehavior: "Managed by Query Insights retention pipeline.",
    relatedCapability: "Query Insights",
  },
  {
    id: "audit-logs",
    name: "Audit logs",
    sizeGb: 60,
    description: "SQL and operation audit records for governance and security review.",
    billingState: "Billed",
    cleanupBehavior: "Expired according to workspace auditing policies.",
    relatedCapability: "Auditing",
  },
  {
    id: "restore-points",
    name: "Restore points",
    sizeGb: 120,
    description: "Storage retained for warehouse point-in-time restore checkpoints.",
    billingState: "Billed",
    cleanupBehavior: "Aged out by restore point lifecycle policies.",
    relatedCapability: "Restore",
  },
  {
    id: "clone-retained",
    name: "Storage retained for clones",
    sizeGb: 740,
    description: "Blocks retained due to active clone references across environments.",
    billingState: "Billed",
    cleanupBehavior: "Released after clone references are removed.",
    relatedCapability: "Clone management",
  },
  {
    id: "vaulted-backups",
    name: "Vaulted backups",
    sizeGb: 84.68,
    description: "Protected warehouse backup copies retained for recovery scenarios.",
    billingState: "Billed",
    cleanupBehavior: "Managed by backup policy and retention settings.",
    relatedCapability: "Backup vault",
  },
  {
    id: "expired-parquet",
    name: "Expired Parquet files",
    sizeGb: 260,
    description: "Expired Parquet segments pending garbage-collection iteration.",
    billingState: "Pending GC",
    cleanupBehavior: "Eligible for reclaim in future garbage-collection cycle.",
    relatedCapability: "Garbage collection scope",
  },
  {
    id: "expired-log",
    name: "Expired log files",
    sizeGb: 190,
    description: "Expired transaction and operation logs queued for reclaim.",
    billingState: "Pending GC",
    cleanupBehavior: "Eligible for reclaim in future garbage-collection cycle.",
    relatedCapability: "Garbage collection scope",
  },
  {
    id: "non-referenced",
    name: "Non-referenced files",
    sizeGb: 170,
    description: "Data files with no active references awaiting safe cleanup.",
    billingState: "Pending GC",
    cleanupBehavior: "Eligible for reclaim in future garbage-collection cycle.",
    relatedCapability: "Garbage collection scope",
  },
  {
    id: "warehouse-system-folder",
    name: "Warehouse System folder",
    sizeGb: 85,
    description: "Internal warehouse folder structures and service metadata dependencies.",
    billingState: "Billed",
    cleanupBehavior: "Service-managed lifecycle.",
    relatedCapability: "Warehouse internals",
  },
];

export const totalStorageGb = storageCategories.reduce((sum, category) => sum + category.sizeGb, 0);

const pendingGcCategoryIds = ["expired-parquet", "expired-log", "non-referenced"];

export const pendingGarbageCollectionGb = storageCategories
  .filter((category) => pendingGcCategoryIds.includes(category.id))
  .reduce((sum, category) => sum + category.sizeGb, 0);

export const systemAndTemporaryGb = storageCategories
  .filter((category) => ["system-generated-files", "temporary-execution-files"].includes(category.id))
  .reduce((sum, category) => sum + category.sizeGb, 0);

export const storageMetrics: StorageMetric[] = [
  {
    id: "total-storage",
    label: "Total storage",
    value: 12.84,
    unit: "TB",
    description: "Total OneLake storage currently attributed to this warehouse and related operational artifacts.",
    filterCategoryIds: storageCategories.map((category) => category.id),
  },
  {
    id: "active-storage",
    label: "Active storage",
    value: 7.3,
    unit: "TB",
    description: "Actively referenced table data available for current query processing.",
    filterCategoryIds: ["active-data"],
    percentageOfTotal: 56.9,
  },
  {
    id: "historical-storage",
    label: "Historical storage",
    value: 2.42,
    unit: "TB",
    description: "Historical and time-travel storage retained by the configured warehouse retention policy.",
    filterCategoryIds: ["historical-data"],
    percentageOfTotal: 18.8,
  },
  {
    id: "system-temp-storage",
    label: "System and temporary storage",
    value: 1.05,
    unit: "TB",
    description: "System-generated and temporary execution storage used for operations and optimization.",
    filterCategoryIds: ["system-generated-files", "temporary-execution-files"],
    percentageOfTotal: 8.2,
  },
  {
    id: "pending-gc",
    label: "Storage pending garbage collection",
    value: 620,
    unit: "GB",
    description: "Expired or non-referenced files in scope for a future garbage-collection iteration.",
    filterCategoryIds: pendingGcCategoryIds,
    percentageOfTotal: 4.7,
  },
  {
    id: "clone-retained",
    label: "Clone-retained storage",
    value: 740,
    unit: "GB",
    description: "Storage retained because active clone relationships still reference underlying files.",
    filterCategoryIds: ["clone-retained"],
    percentageOfTotal: 5.6,
  },
  {
    id: "retention",
    label: "Current retention",
    value: 30,
    unit: "MB",
    description: "Current warehouse retention policy duration in days for historical versions.",
  },
  {
    id: "last-refresh",
    label: "Last refreshed",
    value: 6,
    unit: "MB",
    description: "The latest successful storage telemetry snapshot for this warehouse.",
  },
];

export const tableStorageRecords: TableStorageRecord[] = [
  {
    id: "dbo-fact-sales",
    schema: "dbo",
    tableName: "fact_sales",
    tableType: "Fact",
    totalGb: 2930,
    activeGb: 1910,
    historicalGb: 650,
    softDeletedGb: 170,
    cloneRetainedGb: 200,
    fileCount: 120430,
    expiredFiles: 7220,
    nonReferencedFiles: 2490,
    lastModified: "Today, 02:14 AM",
    lastAccessed: "Today, 06:10 AM",
    queriesLast30Days: 6120,
    growth30dPct: 17.8,
    owner: "Retail Analytics",
  },
  {
    id: "dbo-fact-orders",
    schema: "dbo",
    tableName: "fact_orders",
    tableType: "Fact",
    totalGb: 2020,
    activeGb: 1420,
    historicalGb: 390,
    softDeletedGb: 90,
    cloneRetainedGb: 120,
    fileCount: 94440,
    expiredFiles: 3810,
    nonReferencedFiles: 1840,
    lastModified: "Today, 01:47 AM",
    lastAccessed: "Today, 05:32 AM",
    queriesLast30Days: 4870,
    growth30dPct: 11.2,
    owner: "Order Intelligence",
  },
  {
    id: "finance-transaction-history",
    schema: "finance",
    tableName: "transaction_history",
    tableType: "Fact",
    totalGb: 1380,
    activeGb: 810,
    historicalGb: 420,
    softDeletedGb: 60,
    cloneRetainedGb: 90,
    fileCount: 55310,
    expiredFiles: 2650,
    nonReferencedFiles: 1110,
    lastModified: "Yesterday, 11:50 PM",
    lastAccessed: "Yesterday, 07:12 PM",
    queriesLast30Days: 1280,
    growth30dPct: 24.1,
    owner: "Finance Ops",
  },
  {
    id: "inventory-inventory-snapshot",
    schema: "inventory",
    tableName: "inventory_snapshot",
    tableType: "Snapshot",
    totalGb: 960,
    activeGb: 460,
    historicalGb: 320,
    softDeletedGb: 80,
    cloneRetainedGb: 50,
    fileCount: 42100,
    expiredFiles: 2290,
    nonReferencedFiles: 820,
    lastModified: "Today, 12:28 AM",
    lastAccessed: "2 days ago",
    queriesLast30Days: 740,
    growth30dPct: 8.7,
    owner: "Inventory Analytics",
  },
  {
    id: "staging-raw-customer-events",
    schema: "staging",
    tableName: "raw_customer_events",
    tableType: "Staging",
    totalGb: 890,
    activeGb: 600,
    historicalGb: 110,
    softDeletedGb: 120,
    cloneRetainedGb: 60,
    fileCount: 38110,
    expiredFiles: 6540,
    nonReferencedFiles: 2910,
    lastModified: "Today, 04:45 AM",
    lastAccessed: "6 days ago",
    queriesLast30Days: 240,
    growth30dPct: 29.4,
    owner: "Data Engineering",
    reviewRecommended: true,
  },
  {
    id: "audit-sql-audit-history",
    schema: "audit",
    tableName: "sql_audit_history",
    tableType: "Audit",
    totalGb: 700,
    activeGb: 240,
    historicalGb: 310,
    softDeletedGb: 70,
    cloneRetainedGb: 40,
    fileCount: 29880,
    expiredFiles: 3630,
    nonReferencedFiles: 1020,
    lastModified: "Yesterday, 09:31 PM",
    lastAccessed: "Yesterday, 11:14 PM",
    queriesLast30Days: 3320,
    growth30dPct: 6.8,
    owner: "Security Governance",
  },
  {
    id: "reporting-monthly-aggregates",
    schema: "reporting",
    tableName: "monthly_aggregates",
    tableType: "Aggregate",
    totalGb: 560,
    activeGb: 340,
    historicalGb: 130,
    softDeletedGb: 50,
    cloneRetainedGb: 40,
    fileCount: 17020,
    expiredFiles: 1260,
    nonReferencedFiles: 440,
    lastModified: "Yesterday, 10:55 PM",
    lastAccessed: "Today, 06:05 AM",
    queriesLast30Days: 4150,
    growth30dPct: 4.2,
    owner: "Executive Reporting",
  },
  {
    id: "dbo-dim-customer",
    schema: "dbo",
    tableName: "dim_customer",
    tableType: "Dimension",
    totalGb: 470,
    activeGb: 380,
    historicalGb: 50,
    softDeletedGb: 20,
    cloneRetainedGb: 20,
    fileCount: 14180,
    expiredFiles: 680,
    nonReferencedFiles: 210,
    lastModified: "3 days ago",
    lastAccessed: "Today, 05:56 AM",
    queriesLast30Days: 5280,
    growth30dPct: 2.4,
    owner: "Customer Analytics",
  },
  {
    id: "dbo-dim-product",
    schema: "dbo",
    tableName: "dim_product",
    tableType: "Dimension",
    totalGb: 410,
    activeGb: 320,
    historicalGb: 60,
    softDeletedGb: 10,
    cloneRetainedGb: 20,
    fileCount: 12940,
    expiredFiles: 340,
    nonReferencedFiles: 180,
    lastModified: "2 days ago",
    lastAccessed: "Today, 05:46 AM",
    queriesLast30Days: 5120,
    growth30dPct: 3.1,
    owner: "Product Intelligence",
  },
  {
    id: "finance-account-balance-snapshot",
    schema: "finance",
    tableName: "account_balance_snapshot",
    tableType: "Snapshot",
    totalGb: 390,
    activeGb: 220,
    historicalGb: 120,
    softDeletedGb: 20,
    cloneRetainedGb: 30,
    fileCount: 15830,
    expiredFiles: 920,
    nonReferencedFiles: 350,
    lastModified: "Yesterday, 08:44 PM",
    lastAccessed: "8 days ago",
    queriesLast30Days: 370,
    growth30dPct: 15.9,
    owner: "Finance Ops",
    reviewRecommended: true,
  },
  {
    id: "dbo-fact-returns",
    schema: "dbo",
    tableName: "fact_returns",
    tableType: "Fact",
    totalGb: 370,
    activeGb: 240,
    historicalGb: 90,
    softDeletedGb: 20,
    cloneRetainedGb: 20,
    fileCount: 17290,
    expiredFiles: 580,
    nonReferencedFiles: 260,
    lastModified: "Today, 02:05 AM",
    lastAccessed: "Today, 04:20 AM",
    queriesLast30Days: 1640,
    growth30dPct: 9.8,
    owner: "Returns Intelligence",
  },
  {
    id: "inventory-stock-movement",
    schema: "inventory",
    tableName: "stock_movement",
    tableType: "Fact",
    totalGb: 340,
    activeGb: 210,
    historicalGb: 70,
    softDeletedGb: 30,
    cloneRetainedGb: 30,
    fileCount: 13380,
    expiredFiles: 760,
    nonReferencedFiles: 370,
    lastModified: "Yesterday, 11:22 PM",
    lastAccessed: "4 days ago",
    queriesLast30Days: 520,
    growth30dPct: 12.4,
    owner: "Supply Chain",
  },
  {
    id: "staging-raw-clickstream",
    schema: "staging",
    tableName: "raw_clickstream",
    tableType: "Staging",
    totalGb: 310,
    activeGb: 180,
    historicalGb: 40,
    softDeletedGb: 60,
    cloneRetainedGb: 30,
    fileCount: 11900,
    expiredFiles: 2480,
    nonReferencedFiles: 980,
    lastModified: "Today, 04:52 AM",
    lastAccessed: "14 days ago",
    queriesLast30Days: 90,
    growth30dPct: 31.2,
    owner: "Digital Platform",
    reviewRecommended: true,
  },
  {
    id: "reporting-sales-forecast",
    schema: "reporting",
    tableName: "sales_forecast",
    tableType: "Aggregate",
    totalGb: 290,
    activeGb: 170,
    historicalGb: 70,
    softDeletedGb: 30,
    cloneRetainedGb: 20,
    fileCount: 10320,
    expiredFiles: 490,
    nonReferencedFiles: 160,
    lastModified: "Yesterday, 05:25 PM",
    lastAccessed: "Today, 05:03 AM",
    queriesLast30Days: 1980,
    growth30dPct: 5.4,
    owner: "Forecasting",
  },
  {
    id: "dbo-fact-payments",
    schema: "dbo",
    tableName: "fact_payments",
    tableType: "Fact",
    totalGb: 260,
    activeGb: 170,
    historicalGb: 60,
    softDeletedGb: 10,
    cloneRetainedGb: 20,
    fileCount: 11120,
    expiredFiles: 360,
    nonReferencedFiles: 150,
    lastModified: "Today, 01:12 AM",
    lastAccessed: "Today, 03:10 AM",
    queriesLast30Days: 1880,
    growth30dPct: 7.2,
    owner: "Payments Analytics",
  },
  {
    id: "finance-exchange-rates",
    schema: "finance",
    tableName: "exchange_rates",
    tableType: "Dimension",
    totalGb: 220,
    activeGb: 160,
    historicalGb: 30,
    softDeletedGb: 10,
    cloneRetainedGb: 20,
    fileCount: 9720,
    expiredFiles: 150,
    nonReferencedFiles: 70,
    lastModified: "Yesterday, 07:40 PM",
    lastAccessed: "Today, 04:54 AM",
    queriesLast30Days: 2230,
    growth30dPct: 1.6,
    owner: "Finance Ops",
  },
  {
    id: "reporting-customer-ltv",
    schema: "reporting",
    tableName: "customer_ltv",
    tableType: "Aggregate",
    totalGb: 190,
    activeGb: 120,
    historicalGb: 40,
    softDeletedGb: 20,
    cloneRetainedGb: 10,
    fileCount: 8280,
    expiredFiles: 240,
    nonReferencedFiles: 90,
    lastModified: "2 days ago",
    lastAccessed: "13 days ago",
    queriesLast30Days: 420,
    growth30dPct: 9.4,
    owner: "Customer Analytics",
    reviewRecommended: true,
  },
  {
    id: "inventory-supplier-performance",
    schema: "inventory",
    tableName: "supplier_performance",
    tableType: "Aggregate",
    totalGb: 180,
    activeGb: 110,
    historicalGb: 40,
    softDeletedGb: 10,
    cloneRetainedGb: 20,
    fileCount: 7240,
    expiredFiles: 280,
    nonReferencedFiles: 120,
    lastModified: "3 days ago",
    lastAccessed: "10 days ago",
    queriesLast30Days: 360,
    growth30dPct: 8.1,
    owner: "Supplier Insights",
    reviewRecommended: true,
  },
  {
    id: "staging-raw-partner-files",
    schema: "staging",
    tableName: "raw_partner_files",
    tableType: "Staging",
    totalGb: 150,
    activeGb: 80,
    historicalGb: 20,
    softDeletedGb: 30,
    cloneRetainedGb: 20,
    fileCount: 6940,
    expiredFiles: 1130,
    nonReferencedFiles: 520,
    lastModified: "Today, 03:45 AM",
    lastAccessed: "23 days ago",
    queriesLast30Days: 22,
    growth30dPct: 34.8,
    owner: "Data Engineering",
    reviewRecommended: true,
  },
  {
    id: "dbo-dim-date",
    schema: "dbo",
    tableName: "dim_date",
    tableType: "Dimension",
    totalGb: 128.16,
    activeGb: 95,
    historicalGb: 18,
    softDeletedGb: 5,
    cloneRetainedGb: 10.16,
    fileCount: 5180,
    expiredFiles: 80,
    nonReferencedFiles: 20,
    lastModified: "4 days ago",
    lastAccessed: "Today, 05:22 AM",
    queriesLast30Days: 5890,
    growth30dPct: 0.8,
    owner: "Platform BI",
  },
];

export const observations: Observation[] = [
  {
    id: "obs-historical",
    title: "Historical storage increased 24% in the last seven days",
    detail: "Time-travel retention and higher write volume increased historical snapshots across finance and staging schemas.",
    severity: "warning",
  },
  {
    id: "obs-fact-sales",
    title: "fact_sales caused the largest recent increase",
    detail: "The dbo.fact_sales table contributed 34% of net growth after a high-volume backfill operation.",
    severity: "info",
  },
  {
    id: "obs-gc",
    title: "620 GB is pending garbage collection",
    detail: "Expired Parquet, expired log, and non-referenced files are queued for future garbage-collection processing.",
    severity: "warning",
  },
  {
    id: "obs-low-activity",
    title: "Three large tables have not been queried in 30 days",
    detail: "raw_partner_files, raw_clickstream, and account_balance_snapshot have low query activity and are marked Review recommended.",
    severity: "info",
  },
];

const trendSeed: Array<[number, number, number, number]> = [
  [11520, 6900, 2100, 920],
  [11580, 6930, 2120, 930],
  [11630, 6965, 2135, 928],
  [11690, 7000, 2150, 934],
  [11760, 7050, 2175, 940],
  [11820, 7080, 2190, 947],
  [11890, 7120, 2210, 952],
  [11950, 7150, 2235, 960],
  [12020, 7190, 2260, 965],
  [12090, 7230, 2280, 968],
  [12170, 7280, 2300, 972],
  [12230, 7310, 2325, 980],
  [12310, 7345, 2350, 992],
  [12390, 7380, 2370, 998],
  [12480, 7410, 2395, 1004],
  [12570, 7440, 2420, 1010],
  [12650, 7460, 2438, 1018],
  [12740, 7495, 2455, 1020],
  [12840, 7530, 2472, 1028],
  [12910, 7550, 2488, 1030],
  [13020, 7595, 2515, 1040],
  [13340, 7700, 2625, 1070],
  [13390, 7710, 2635, 1072],
  [13420, 7720, 2640, 1076],
  [13450, 7730, 2645, 1080],
  [13480, 7740, 2650, 1083],
  [13510, 7750, 2660, 1088],
  [13540, 7760, 2668, 1090],
  [13570, 7770, 2670, 1092],
  [13148.16, 7475.2, 2478.08, 1075.2],
];

export const trendPoints: TrendPoint[] = trendSeed.map(([totalGbValue, activeGb, historicalGb, systemGb], index) => ({
  day: `Day ${index + 1}`,
  totalGb: totalGbValue,
  activeGb,
  historicalGb,
  systemGb,
}));

export const anomalyDay = "Day 22";

export const queryTemplates = [
  {
    id: "warehouse-summary",
    title: "Warehouse summary",
    sql: `SELECT
    warehouse_name,
    total_storage_bytes,
    active_storage_bytes,
    historical_storage_bytes,
    soft_deleted_storage_bytes,
    system_storage_bytes,
    query_insights_storage_bytes,
    clone_retained_storage_bytes,
    last_refresh_time
FROM sys.storage_insights_warehouse_summary;`,
  },
  {
    id: "top-tables",
    title: "Top 20 tables by total storage",
    sql: "SELECT TOP (20) schema_name, table_name, total_storage_bytes FROM sys.storage_insights_table_details ORDER BY total_storage_bytes DESC;",
  },
  {
    id: "growth-tables",
    title: "Tables with highest 30-day growth",
    sql: "SELECT TOP (20) schema_name, table_name, growth_30d_percent FROM sys.storage_insights_table_details ORDER BY growth_30d_percent DESC;",
  },
  {
    id: "inactive-tables",
    title: "Tables not accessed in 30 days",
    sql: "SELECT schema_name, table_name, last_accessed_time FROM sys.storage_insights_table_details WHERE DATEDIFF(day, last_accessed_time, GETUTCDATE()) >= 30;",
  },
  {
    id: "pending-gc",
    title: "Storage pending garbage collection",
    sql: "SELECT category_name, storage_bytes FROM sys.storage_insights_warehouse_summary WHERE category_name IN ('Expired Parquet files','Expired log files','Non-referenced files');",
  },
  {
    id: "historical-by-table",
    title: "Historical storage by table",
    sql: "SELECT schema_name, table_name, historical_storage_bytes FROM sys.storage_insights_table_details ORDER BY historical_storage_bytes DESC;",
  },
  {
    id: "anomalies",
    title: "Warehouse storage anomalies",
    sql: "SELECT event_date, total_growth_bytes, growth_percent, top_contributor FROM sys.storage_insights_warehouse_history WHERE is_anomaly = 1 ORDER BY event_date DESC;",
  },
];

export const queryViewDefinitions: QueryViewDefinition[] = [
  {
    viewName: "sys.storage_insights_warehouse_summary",
    purpose: "Warehouse-level reconciliation of storage categories and operational footprints.",
    columns: [
      "warehouse_name",
      "total_storage_bytes",
      "active_storage_bytes",
      "historical_storage_bytes",
      "soft_deleted_storage_bytes",
      "system_storage_bytes",
      "query_insights_storage_bytes",
      "clone_retained_storage_bytes",
      "last_refresh_time",
    ],
    sampleQuery: queryTemplates[0].sql,
    rows: [
      {
        warehouse_name: warehouseName,
        total_storage_bytes: gbToBytes(totalStorageGb),
        active_storage_bytes: gbToBytes(7475.2),
        historical_storage_bytes: gbToBytes(2478.08),
        soft_deleted_storage_bytes: gbToBytes(300),
        system_storage_bytes: gbToBytes(systemAndTemporaryGb),
        query_insights_storage_bytes: gbToBytes(110),
        clone_retained_storage_bytes: gbToBytes(740),
        last_refresh_time: "2026-08-14T06:00:00Z",
      },
    ],
    dashboardTarget: "overview",
  },
  {
    viewName: "sys.storage_insights_table_details",
    purpose: "Table-level storage composition, usage, and growth rankings.",
    columns: [
      "schema_name",
      "table_name",
      "table_type",
      "total_storage_bytes",
      "active_storage_bytes",
      "historical_storage_bytes",
      "last_accessed_time",
      "queries_last_30d",
      "growth_30d_percent",
    ],
    sampleQuery: queryTemplates[1].sql,
    rows: tableStorageRecords.slice(0, 8).map((table) => ({
      schema_name: table.schema,
      table_name: table.tableName,
      table_type: table.tableType,
      total_storage_bytes: gbToBytes(table.totalGb),
      active_storage_bytes: gbToBytes(table.activeGb),
      historical_storage_bytes: gbToBytes(table.historicalGb),
      last_accessed_time: table.lastAccessed,
      queries_last_30d: table.queriesLast30Days,
      growth_30d_percent: table.growth30dPct,
    })),
    dashboardTarget: "tables",
  },
  {
    viewName: "sys.storage_insights_warehouse_history",
    purpose: "Daily warehouse-level trend snapshots with anomaly flags.",
    columns: ["event_date", "total_storage_bytes", "active_storage_bytes", "historical_storage_bytes", "system_storage_bytes", "is_anomaly"],
    sampleQuery: "SELECT TOP (30) event_date, total_storage_bytes, active_storage_bytes, historical_storage_bytes, system_storage_bytes, is_anomaly FROM sys.storage_insights_warehouse_history ORDER BY event_date DESC;",
    rows: trendPoints.slice(-10).map((trend) => ({
      event_date: trend.day,
      total_storage_bytes: gbToBytes(trend.totalGb),
      active_storage_bytes: gbToBytes(trend.activeGb),
      historical_storage_bytes: gbToBytes(trend.historicalGb),
      system_storage_bytes: gbToBytes(trend.systemGb),
      is_anomaly: trend.day === anomalyDay ? 1 : 0,
    })),
    dashboardTarget: "trends",
  },
  {
    viewName: "sys.storage_insights_tables_history",
    purpose: "Per-table daily storage trend points for growth and usage analysis.",
    columns: ["event_date", "schema_name", "table_name", "total_storage_bytes", "growth_percent"],
    sampleQuery: "SELECT event_date, schema_name, table_name, total_storage_bytes, growth_percent FROM sys.storage_insights_tables_history WHERE table_name IN ('fact_sales','fact_orders');",
    rows: [
      { event_date: "Day 20", schema_name: "dbo", table_name: "fact_sales", total_storage_bytes: gbToBytes(2810), growth_percent: 0.9 },
      { event_date: "Day 21", schema_name: "dbo", table_name: "fact_sales", total_storage_bytes: gbToBytes(2870), growth_percent: 2.1 },
      { event_date: anomalyDay, schema_name: "dbo", table_name: "fact_sales", total_storage_bytes: gbToBytes(2978), growth_percent: 3.8 },
      { event_date: "Day 20", schema_name: "dbo", table_name: "fact_orders", total_storage_bytes: gbToBytes(1970), growth_percent: 0.8 },
      { event_date: "Day 21", schema_name: "dbo", table_name: "fact_orders", total_storage_bytes: gbToBytes(1990), growth_percent: 1.0 },
      { event_date: anomalyDay, schema_name: "dbo", table_name: "fact_orders", total_storage_bytes: gbToBytes(2040), growth_percent: 2.5 },
    ],
    dashboardTarget: "trends",
  },
  {
    viewName: "sys.storage_insights_top_contributors",
    purpose: "Largest recent contributors to warehouse growth.",
    columns: ["schema_name", "table_name", "growth_7d_bytes", "growth_30d_percent", "last_accessed_time"],
    sampleQuery: "SELECT TOP (10) schema_name, table_name, growth_7d_bytes, growth_30d_percent, last_accessed_time FROM sys.storage_insights_top_contributors ORDER BY growth_7d_bytes DESC;",
    rows: [
      { schema_name: "dbo", table_name: "fact_sales", growth_7d_bytes: gbToBytes(312), growth_30d_percent: 17.8, last_accessed_time: "Today, 06:10 AM" },
      { schema_name: "finance", table_name: "transaction_history", growth_7d_bytes: gbToBytes(186), growth_30d_percent: 24.1, last_accessed_time: "Yesterday, 07:12 PM" },
      { schema_name: "staging", table_name: "raw_customer_events", growth_7d_bytes: gbToBytes(148), growth_30d_percent: 29.4, last_accessed_time: "6 days ago" },
    ],
    dashboardTarget: "overview",
  },
  {
    viewName: "sys.storage_insights_retention_simulation",
    purpose: "Post-preview simulation view for projected retention impact.",
    columns: ["current_retention_days", "proposed_retention_days", "current_historical_gb", "projected_historical_gb", "projected_savings_gb"],
    sampleQuery: "SELECT current_retention_days, proposed_retention_days, current_historical_gb, projected_historical_gb, projected_savings_gb FROM sys.storage_insights_retention_simulation WHERE scenario_id = 'preview';",
    rows: [
      {
        current_retention_days: 30,
        proposed_retention_days: 14,
        current_historical_gb: 2478.08,
        projected_historical_gb: 1730.44,
        projected_savings_gb: 747.64,
      },
    ],
    dashboardTarget: "retention",
  },
  {
    viewName: "sys.storage_insights_alerts",
    purpose: "Future alert rules, trigger history, and delivery destinations.",
    columns: ["alert_name", "severity", "enabled", "last_triggered", "destination"],
    sampleQuery: "SELECT alert_name, severity, enabled, last_triggered, destination FROM sys.storage_insights_alerts ORDER BY last_triggered DESC;",
    rows: [
      {
        alert_name: "Daily storage spike > 12%",
        severity: "Warning",
        enabled: "true",
        last_triggered: "2026-08-12T04:00:00Z",
        destination: "Fabric workspace notifications",
      },
      {
        alert_name: "Inactive table threshold",
        severity: "Information",
        enabled: "true",
        last_triggered: "2026-08-10T04:00:00Z",
        destination: "Ops mailing list",
      },
    ],
    dashboardTarget: "alerts",
  },
];

export const alertRules: AlertRule[] = [
  {
    id: "storage-spike",
    ruleName: "Storage spike percentage",
    enabled: true,
    severity: "Warning",
    threshold: "> 12% day-over-day",
    destination: "Fabric workspace notifications",
    lastTriggered: "Aug 12, 2026 04:00",
  },
  {
    id: "absolute-threshold",
    ruleName: "Absolute storage threshold",
    enabled: true,
    severity: "Critical",
    threshold: "> 14 TB",
    destination: "On-call Teams channel",
    lastTriggered: "Aug 8, 2026 06:20",
  },
  {
    id: "inactive-tables",
    ruleName: "Inactive table threshold",
    enabled: false,
    severity: "Information",
    threshold: "No query access in 30 days",
    destination: "Warehouse admins",
    lastTriggered: "Jul 30, 2026 09:12",
  },
];

export function gbToBytes(gb: number): number {
  return Math.round(gb * 1024 * 1024 * 1024);
}

export function formatStorage(gb: number): string {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
  return `${(gb * 1024).toFixed(0)} MB`;
}

export function storagePercent(gb: number): number {
  return Number(((gb / totalStorageGb) * 100).toFixed(1));
}
