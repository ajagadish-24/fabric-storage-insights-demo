import { useMemo, useState } from "react";
import {
  Badge,
  Body1,
  Body1Strong,
  Button,
  Card,
  CardHeader,
  Caption1,
  Dropdown,
  Field,
  FluentProvider,
  Input,
  Option,
  Tab,
  TabList,
  Text,
  Title2,
  Title3,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import {
  ArrowDownloadRegular,
  ArrowSyncRegular,
  ChartMultipleRegular,
  DatabaseRegular,
  DismissRegular,
  DocumentTableRegular,
  FilterRegular,
  InfoRegular,
  OpenRegular,
  QuestionCircleRegular,
  SearchRegular,
  SettingsRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
} from "@fluentui/react-icons";

import { useThemeContext } from "@/hooks/theme.context";
import {
  alertRules,
  anomalyDay,
  formatStorage,
  observations,
  pendingGarbageCollectionGb,
  queryTemplates,
  queryViewDefinitions,
  storageCategories,
  storageMetrics,
  storagePercent,
  tableStorageRecords,
  totalStorageGb,
  trendPoints,
  warehouseName,
  workspaceName,
  type QueryViewDefinition,
  type StorageTab,
  type TableStorageRecord,
} from "@/mock/storage-insights-data";

const useStyles = makeStyles({
  app: {
    minHeight: "100%",
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    flexDirection: "column",
    fontFamily: "Segoe UI, Segoe UI Web (West European), sans-serif",
  },
  topBar: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...shorthands.padding("10px", "20px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0, 1fr)",
    minHeight: "calc(100vh - 56px)",
  },
  leftNav: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.padding("12px", "8px"),
    display: "grid",
    alignContent: "start",
    gap: "2px",
  },
  leftNavItem: {
    justifyContent: "flex-start",
  },
  leftNavSubGroup: {
    ...shorthands.padding("0", "0", "0", "18px"),
    display: "grid",
    gap: "2px",
  },
  mainArea: {
    display: "grid",
    alignContent: "start",
    gap: "12px",
    ...shorthands.padding("16px"),
  },
  headerCard: {
    ...shorthands.padding("12px"),
    display: "grid",
    gap: "10px",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  commandBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  commandButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  tabCard: {
    ...shorthands.padding("4px", "8px", "0"),
  },
  contentGrid: {
    display: "grid",
    gap: "12px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "10px",
  },
  clickableCard: {
    cursor: "pointer",
    transitionDuration: "120ms",
    transitionProperty: "transform, box-shadow",
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: tokens.shadow8,
    },
  },
  kpiValue: {
    fontSize: "26px",
    fontWeight: 650,
    lineHeight: "32px",
  },
  sectionGrid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "1.6fr 1fr",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr",
    },
  },
  chartContainer: {
    display: "grid",
    gap: "8px",
  },
  horizontalStack: {
    display: "flex",
    height: "22px",
    width: "100%",
    overflow: "hidden",
    ...shorthands.borderRadius("8px"),
  },
  stackSegment: {
    height: "100%",
  },
  legendGrid: {
    display: "grid",
    gap: "6px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendSwatch: {
    width: "12px",
    height: "12px",
    ...shorthands.borderRadius("2px"),
  },
  trendSvg: {
    width: "100%",
    height: "260px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius("8px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
  },
  denseTableWrap: {
    overflow: "auto",
    ...shorthands.borderRadius("8px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
  },
  denseTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  denseCell: {
    ...shorthands.padding("8px", "10px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke3),
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  rowHover: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  observationGrid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  },
  breakdownLayout: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "1.2fr 1fr",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr",
    },
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "1.4fr repeat(5, minmax(140px, 1fr))",
    gap: "10px",
    "@media (max-width: 1300px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  pillRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  rankButton: {
    minWidth: "auto",
  },
  splitLayout: {
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr)",
    gap: "12px",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr",
    },
  },
  queryEditorCard: {
    display: "grid",
    gap: "8px",
  },
  queryPanel: {
    minHeight: "220px",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("8px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding("10px"),
    overflow: "auto",
  },
  codeText: {
    fontFamily: "Consolas, Courier New, monospace",
    whiteSpace: "pre-wrap",
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
  queryTextarea: {
    width: "100%",
    minHeight: "140px",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius("8px"),
    ...shorthands.padding("10px"),
    fontFamily: "Consolas, Courier New, monospace",
    fontSize: "12px",
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  queryBottom: {
    display: "grid",
    gap: "10px",
  },
  sidePane: {
    position: "fixed",
    right: 0,
    top: 0,
    width: "430px",
    maxWidth: "95vw",
    height: "100vh",
    zIndex: 2000,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderLeft("1px", "solid", tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow64,
    ...shorthands.padding("12px"),
    overflow: "auto",
    display: "grid",
    alignContent: "start",
    gap: "10px",
  },
  sidePaneHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingBlock: {
    height: "86px",
    ...shorthands.borderRadius("8px"),
    background: `linear-gradient(90deg, ${tokens.colorNeutralBackground3} 25%, ${tokens.colorNeutralBackground4} 50%, ${tokens.colorNeutralBackground3} 75%)`,
    backgroundSize: "240% 100%",
    animationName: {
      from: { backgroundPosition: "100% 0" },
      to: { backgroundPosition: "-100% 0" },
    },
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  warningCard: {
    backgroundColor: tokens.colorPaletteMarigoldBackground1,
  },
  errorCard: {
    backgroundColor: tokens.colorPaletteRedBackground1,
  },
});

const storageColorMap: Record<string, string> = {
  "active-data": "#6B4EFF",
  "historical-data": "#9B8AFB",
  "soft-deleted-data": "#D7CFFF",
  "system-generated-files": "#4F6BED",
  "temporary-execution-files": "#7DA1FF",
  "query-insights": "#5E9D5E",
  "audit-logs": "#8AB77A",
  "restore-points": "#EAA300",
  "vaulted-backups": "#8E8E8E",
  "expired-parquet": "#E65F5C",
  "expired-log": "#F08A5A",
  "non-referenced": "#F6B26B",
  "warehouse-system-folder": "#5C5C5C",
};

function metricValue(metricId: string): string {
  if (metricId === "retention") return "30 days";
  if (metricId === "last-refresh") return "Today, 6:00 AM";
  const metric = storageMetrics.find((item) => item.id === metricId);
  if (!metric) return "";
  if (metric.unit === "TB") return `${metric.value.toFixed(2)} TB`;
  if (metric.unit === "GB") return `${Math.round(metric.value)} GB`;
  return `${metric.value}`;
}

function buildTrendPath(values: number[], maxValue: number, width: number, height: number): string {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function SqlSyntax({ query }: { query: string }) {
  const keywordPattern = /\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|TOP|IN|DESC|ASC|DATEDIFF|GETUTCDATE|AND|OR)\b/gi;
  const segments = query.split(keywordPattern);

  return (
    <pre style={{ margin: 0 }}>
      {segments.map((segment, index) => {
        const isKeyword = keywordPattern.test(segment);
        keywordPattern.lastIndex = 0;
        return (
          <span
            key={`${segment}-${index}`}
            style={{
              color: isKeyword ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground1,
              fontWeight: isKeyword ? 600 : 400,
            }}
          >
            {segment}
          </span>
        );
      })}
    </pre>
  );
}

function App() {
  const styles = useStyles();
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useMemo(() => (isDark ? webDarkTheme : webLightTheme), [isDark]);

  const [selectedTab, setSelectedTab] = useState<StorageTab>("overview");
  const [selectedBreakdownFilter, setSelectedBreakdownFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Today, 6:00 AM");

  const [searchText, setSearchText] = useState("");
  const [schemaFilter, setSchemaFilter] = useState("all");
  const [tableTypeFilter, setTableTypeFilter] = useState("all");
  const [storageFilter, setStorageFilter] = useState("all");
  const [ranking, setRanking] = useState("largest");

  const [selectedTable, setSelectedTable] = useState<TableStorageRecord | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState(false);

  const [selectedViewName, setSelectedViewName] = useState(queryViewDefinitions[0].viewName);
  const [sqlText, setSqlText] = useState(queryTemplates[0].sql);
  const [messagesTab, setMessagesTab] = useState<"results" | "messages">("results");

  const [retentionDays, setRetentionDays] = useState("14");

  const selectedView =
    queryViewDefinitions.find((view) => view.viewName === selectedViewName) ?? queryViewDefinitions[0];

  const filteredBreakdownCategories = useMemo(() => {
    if (!selectedBreakdownFilter.length) {
      return storageCategories;
    }
    return storageCategories.filter((category) => selectedBreakdownFilter.includes(category.id));
  }, [selectedBreakdownFilter]);

  const tableSchemas = useMemo(
    () => Array.from(new Set(tableStorageRecords.map((table) => table.schema))).sort(),
    [],
  );

  const filteredTables = useMemo(() => {
    let tables = [...tableStorageRecords];

    if (searchText.trim()) {
      const term = searchText.trim().toLowerCase();
      tables = tables.filter((table) => `${table.schema}.${table.tableName}`.toLowerCase().includes(term));
    }

    if (schemaFilter !== "all") {
      tables = tables.filter((table) => table.schema === schemaFilter);
    }

    if (tableTypeFilter !== "all") {
      tables = tables.filter((table) => table.tableType === tableTypeFilter);
    }

    if (storageFilter !== "all") {
      tables = tables.filter((table) => {
        if (storageFilter === "historical") return table.historicalGb >= 100;
        if (storageFilter === "softDeleted") return table.softDeletedGb >= 40;
        return true;
      });
    }

    if (ranking === "largest") {
      tables.sort((a, b) => b.totalGb - a.totalGb);
    } else if (ranking === "fastest-growing") {
      tables.sort((a, b) => b.growth30dPct - a.growth30dPct);
    } else if (ranking === "least-recently-accessed") {
      tables.sort((a, b) => a.queriesLast30Days - b.queriesLast30Days);
    } else if (ranking === "most-queried") {
      tables.sort((a, b) => b.queriesLast30Days - a.queriesLast30Days);
    }

    return tables.slice(0, 20);
  }, [searchText, schemaFilter, tableTypeFilter, storageFilter, ranking]);

  const projectedHistoricalGb = useMemo(() => {
    const proposedDays = Number(retentionDays);
    if (Number.isNaN(proposedDays) || proposedDays <= 0) {
      return 2478.08;
    }
    const ratio = Math.min(1, proposedDays / 30);
    return Number((2478.08 * ratio).toFixed(2));
  }, [retentionDays]);

  const projectedSavingsGb = Number((2478.08 - projectedHistoricalGb).toFixed(2));

  const handleRefresh = () => {
    setLoading(true);
    setShowError(false);
    window.setTimeout(() => {
      setLoading(false);
      setLastRefreshed("Today, 6:14 AM");
    }, 700);
  };

  const handleKpiClick = (categoryIds?: string[]) => {
    if (categoryIds?.length) {
      setSelectedBreakdownFilter(categoryIds);
    }
    setSelectedTab("breakdown");
  };

  const anomalyPoint = trendPoints.find((point) => point.day === anomalyDay);

  const categoryReconciliation = Number(
    storageCategories.reduce((sum, category) => sum + category.sizeGb, 0).toFixed(2),
  );
  const tableReconciliation = Number(
    tableStorageRecords.reduce((sum, table) => sum + table.totalGb, 0).toFixed(2),
  );

  const leftNavItems = ["Home", "Explorer", "Query", "Data model", "Monitoring", "Settings"];

  return (
    <FluentProvider theme={theme} className={styles.app}>
      <header className={styles.topBar}>
        <div className={styles.breadcrumbRow}>
          <Body1Strong>Microsoft Fabric</Body1Strong>
          <Text className={styles.muted}>|</Text>
          <Caption1>{workspaceName}</Caption1>
          <Text className={styles.muted}>/</Text>
          <DatabaseRegular />
          <Caption1>{warehouseName}</Caption1>
          <Badge appearance="tint" color="informative">
            Warehouse
          </Badge>
        </div>
        <Button icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />} onClick={toggleTheme} appearance="subtle">
          {isDark ? "Light" : "Dark"}
        </Button>
      </header>

      <div className={styles.shell}>
        <aside className={styles.leftNav}>
          {leftNavItems.slice(0, 4).map((item) => (
            <Button key={item} appearance="subtle" className={styles.leftNavItem}>
              {item}
            </Button>
          ))}
          <Body1Strong style={{ padding: "8px 10px" }}>Insights</Body1Strong>
          <div className={styles.leftNavSubGroup}>
            <Button appearance="subtle" className={styles.leftNavItem}>
              Query Insights
            </Button>
            <Button appearance="secondary" className={styles.leftNavItem}>
              Storage Insights
            </Button>
          </div>
          {leftNavItems.slice(4).map((item) => (
            <Button key={item} appearance="subtle" className={styles.leftNavItem}>
              {item}
            </Button>
          ))}
        </aside>

        <main className={styles.mainArea}>
          <Card className={styles.headerCard}>
            <div className={styles.breadcrumbRow}>
              <Caption1>{workspaceName}</Caption1>
              <Text>/</Text>
              <DatabaseRegular />
              <Caption1>{warehouseName}</Caption1>
              <Text>/</Text>
              <Body1Strong>Storage Insights</Body1Strong>
              <Badge appearance="tint" color="important">
                Preview
              </Badge>
            </div>

            <div className={styles.commandBar}>
              <div className={styles.commandButtons}>
                <Button appearance="secondary" icon={<ArrowSyncRegular />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button appearance="secondary" icon={<ArrowDownloadRegular />}>
                  Export
                </Button>
                <Button appearance="secondary" icon={<DocumentTableRegular />} onClick={() => setSelectedTab("query-views")}>
                  Query data
                </Button>
                <Button appearance="secondary" icon={<SettingsRegular />}>
                  Settings
                </Button>
                <Button appearance="secondary" icon={<QuestionCircleRegular />}>
                  Help
                </Button>
                <Button appearance="subtle" icon={<DismissRegular />} onClick={() => setShowError((value) => !value)}>
                  Toggle error state
                </Button>
              </div>
              <div className={styles.breadcrumbRow}>
                <Caption1>Last refreshed: {lastRefreshed}</Caption1>
                <Tooltip content="Storage information can have up to 24-hour refresh latency." relationship="description">
                  <Button appearance="subtle" size="small" icon={<InfoRegular />}>
                    Info
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Card>

          <Card className={styles.tabCard}>
            <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(String(data.value) as StorageTab)}>
              <Tab value="overview">Overview</Tab>
              <Tab value="breakdown">Storage breakdown</Tab>
              <Tab value="tables">Tables</Tab>
              <Tab value="trends">Trends</Tab>
              <Tab value="query-views">Query views</Tab>
              <Tab value="retention">Retention simulation (future concept)</Tab>
              <Tab value="alerts">Alerts (future concept)</Tab>
            </TabList>
          </Card>

          <section className={styles.contentGrid}>
            {loading ? (
              <>
                <div className={styles.loadingBlock} />
                <div className={styles.loadingBlock} />
                <div className={styles.loadingBlock} />
              </>
            ) : null}

            {!loading && showError ? (
              <Card className={styles.errorCard}>
                <CardHeader
                  header={<Body1Strong>Storage data refresh failed</Body1Strong>}
                  description={<Body1>Unable to retrieve latest telemetry snapshot. Showing last successful refresh from {lastRefreshed}.</Body1>}
                />
              </Card>
            ) : null}

            {!loading && selectedTab === "overview" ? (
              <OverviewPage
                styles={styles}
                onKpiClick={handleKpiClick}
                onOpenTables={() => setSelectedTab("tables")}
                onOpenAnomaly={() => {
                  setSelectedTab("trends");
                  setSelectedAnomaly(true);
                }}
              />
            ) : null}

            {!loading && selectedTab === "breakdown" ? (
              <StorageBreakdownPage
                styles={styles}
                filteredCategoryIds={selectedBreakdownFilter}
                onClearFilter={() => setSelectedBreakdownFilter([])}
                filteredCategories={filteredBreakdownCategories}
              />
            ) : null}

            {!loading && selectedTab === "tables" ? (
              <TablesPage
                styles={styles}
                schemas={tableSchemas}
                searchText={searchText}
                setSearchText={setSearchText}
                schemaFilter={schemaFilter}
                setSchemaFilter={setSchemaFilter}
                tableTypeFilter={tableTypeFilter}
                setTableTypeFilter={setTableTypeFilter}
                storageFilter={storageFilter}
                setStorageFilter={setStorageFilter}
                ranking={ranking}
                setRanking={setRanking}
                filteredTables={filteredTables}
                onSelectTable={setSelectedTable}
              />
            ) : null}

            {!loading && selectedTab === "trends" ? (
              <TrendsPage
                styles={styles}
                onOpenAnomaly={() => setSelectedAnomaly(true)}
                onGoToTables={() => setSelectedTab("tables")}
              />
            ) : null}

            {!loading && selectedTab === "query-views" ? (
              <QueryViewsPage
                styles={styles}
                selectedView={selectedView}
                selectedViewName={selectedViewName}
                setSelectedViewName={setSelectedViewName}
                sqlText={sqlText}
                setSqlText={setSqlText}
                messagesTab={messagesTab}
                setMessagesTab={setMessagesTab}
                onViewInDashboard={(tab) => setSelectedTab(tab)}
                onUseTemplate={(template) => setSqlText(template)}
              />
            ) : null}

            {!loading && selectedTab === "retention" ? (
              <RetentionPage
                styles={styles}
                retentionDays={retentionDays}
                setRetentionDays={setRetentionDays}
                projectedHistoricalGb={projectedHistoricalGb}
                projectedSavingsGb={projectedSavingsGb}
              />
            ) : null}

            {!loading && selectedTab === "alerts" ? (
              <AlertsPage styles={styles} />
            ) : null}
          </section>
        </main>
      </div>

      {selectedTable ? (
        <TableDetailsPane styles={styles} table={selectedTable} onClose={() => setSelectedTable(null)} />
      ) : null}

      {selectedAnomaly && anomalyPoint ? (
        <AnomalyPane
          styles={styles}
          point={anomalyPoint}
          onClose={() => setSelectedAnomaly(false)}
          onOpenTables={() => {
            setSelectedAnomaly(false);
            setSelectedTab("tables");
            setRanking("fastest-growing");
          }}
        />
      ) : null}

      <div style={{ display: "none" }}>
        {categoryReconciliation} {tableReconciliation} {totalStorageGb}
      </div>
    </FluentProvider>
  );
}

function OverviewPage({
  styles,
  onKpiClick,
  onOpenTables,
  onOpenAnomaly,
}: {
  styles: ReturnType<typeof useStyles>;
  onKpiClick: (categoryIds?: string[]) => void;
  onOpenTables: () => void;
  onOpenAnomaly: () => void;
}) {
  const chartSeries = [
    {
      name: "Total storage",
      color: "#6B4EFF",
      values: trendPoints.map((point) => point.totalGb),
    },
    {
      name: "Active storage",
      color: "#4F6BED",
      values: trendPoints.map((point) => point.activeGb),
    },
    {
      name: "Historical storage",
      color: "#B85AB5",
      values: trendPoints.map((point) => point.historicalGb),
    },
    {
      name: "System storage",
      color: "#5E9D5E",
      values: trendPoints.map((point) => point.systemGb),
    },
  ];

  const maxValue = Math.max(...chartSeries.flatMap((series) => series.values));

  return (
    <>
      <div className={styles.kpiGrid}>
        {storageMetrics.map((metric) => (
          <Tooltip key={metric.id} relationship="description" content={metric.description}>
            <Card className={styles.clickableCard} onClick={() => onKpiClick(metric.filterCategoryIds)}>
              <CardHeader
                header={<Body1Strong>{metric.label}</Body1Strong>}
                description={
                  metric.percentageOfTotal ? (
                    <Caption1>{metric.percentageOfTotal.toFixed(1)}% of total storage</Caption1>
                  ) : (
                    <Caption1>Click to filter Storage breakdown</Caption1>
                  )
                }
              />
              <div className={styles.kpiValue}>{metricValue(metric.id)}</div>
            </Card>
          </Tooltip>
        ))}
      </div>

      <div className={styles.sectionGrid}>
        <Card className={styles.chartContainer}>
          <CardHeader
            header={<Body1Strong>Storage composition</Body1Strong>}
            description={<Caption1>Warehouse storage footprint by operational category</Caption1>}
          />
          <div className={styles.horizontalStack}>
            {storageCategories.map((category) => (
              <div
                key={category.id}
                className={styles.stackSegment}
                style={{
                  width: `${storagePercent(category.sizeGb)}%`,
                  backgroundColor: storageColorMap[category.id],
                }}
                title={`${category.name}: ${formatStorage(category.sizeGb)} (${storagePercent(category.sizeGb)}%)`}
              />
            ))}
          </div>
          <div className={styles.legendGrid}>
            {storageCategories.map((category) => (
              <div key={category.id} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ backgroundColor: storageColorMap[category.id] }} />
                <Caption1>
                  {category.name}: {formatStorage(category.sizeGb)}
                </Caption1>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.chartContainer}>
          <CardHeader
            header={<Body1Strong>Top storage contributors</Body1Strong>}
            description={<Caption1>Top 5 tables driving warehouse footprint</Caption1>}
          />
          <div className={styles.denseTableWrap}>
            <table className={styles.denseTable}>
              <thead>
                <tr>
                  <th className={styles.denseCell}>Schema</th>
                  <th className={styles.denseCell}>Table</th>
                  <th className={styles.denseCell}>Total</th>
                  <th className={styles.denseCell}>Active</th>
                  <th className={styles.denseCell}>Historical</th>
                  <th className={styles.denseCell}>30-day growth</th>
                  <th className={styles.denseCell}>Last accessed</th>
                </tr>
              </thead>
              <tbody>
                {tableStorageRecords
                  .slice()
                  .sort((a, b) => b.totalGb - a.totalGb)
                  .slice(0, 5)
                  .map((table) => (
                    <tr key={table.id} className={styles.rowHover} onClick={onOpenTables}>
                      <td className={styles.denseCell}>{table.schema}</td>
                      <td className={styles.denseCell}>{table.tableName}</td>
                      <td className={styles.denseCell}>{formatStorage(table.totalGb)}</td>
                      <td className={styles.denseCell}>{formatStorage(table.activeGb)}</td>
                      <td className={styles.denseCell}>{formatStorage(table.historicalGb)}</td>
                      <td className={styles.denseCell}>{table.growth30dPct.toFixed(1)}%</td>
                      <td className={styles.denseCell}>{table.lastAccessed}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className={styles.chartContainer}>
        <CardHeader
          header={<Body1Strong>Storage trend (30 days)</Body1Strong>}
          description={<Caption1>Includes visible anomaly marker for rapid growth</Caption1>}
        />
        <svg viewBox="0 0 1000 260" className={styles.trendSvg} role="img" aria-label="Storage trend chart">
          {chartSeries.map((series) => (
            <path
              key={series.name}
              d={buildTrendPath(series.values, maxValue, 980, 220)}
              transform="translate(10,20)"
              fill="none"
              stroke={series.color}
              strokeWidth="2"
            />
          ))}
          {trendPoints.map((point, index) => {
            if (point.day !== anomalyDay) return null;
            const x = (index / (trendPoints.length - 1)) * 980 + 10;
            const y = 240 - (point.totalGb / maxValue) * 220;
            return (
              <g key={point.day} onClick={onOpenAnomaly} style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r="6" fill="#E65F5C" />
                <text x={x + 8} y={y - 8} fontSize="12" fill="#E65F5C">
                  Anomaly
                </text>
              </g>
            );
          })}
        </svg>
        <div className={styles.pillRow}>
          {chartSeries.map((series) => (
            <Badge key={series.name} appearance="filled" style={{ backgroundColor: series.color, color: "#fff" }}>
              {series.name}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Storage observations</Body1Strong>}
          description={<Caption1>Fabric-generated observations to support investigation and review</Caption1>}
        />
        <div className={styles.observationGrid}>
          {observations.map((observation) => (
            <Card key={observation.id} className={observation.severity === "warning" ? styles.warningCard : undefined}>
              <CardHeader
                header={<Body1Strong>{observation.title}</Body1Strong>}
                description={<Body1>{observation.detail}</Body1>}
              />
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
}

function StorageBreakdownPage({
  styles,
  filteredCategoryIds,
  onClearFilter,
  filteredCategories,
}: {
  styles: ReturnType<typeof useStyles>;
  filteredCategoryIds: string[];
  onClearFilter: () => void;
  filteredCategories: typeof storageCategories;
}) {
  const pendingCategories = storageCategories.filter((category) =>
    ["expired-parquet", "expired-log", "non-referenced"].includes(category.id),
  );

  return (
    <>
      <div className={styles.breakdownLayout}>
        <Card>
          <CardHeader
            header={<Body1Strong>Storage category composition</Body1Strong>}
            description={<Caption1>Category sizes, percentages, and operational behavior</Caption1>}
          />
          <div className={styles.horizontalStack}>
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={styles.stackSegment}
                style={{
                  width: `${(category.sizeGb / filteredCategories.reduce((sum, item) => sum + item.sizeGb, 0)) * 100}%`,
                  backgroundColor: storageColorMap[category.id],
                }}
              />
            ))}
          </div>
          {filteredCategoryIds.length ? (
            <div className={styles.pillRow}>
              <Badge appearance="filled" color="brand">
                Filtered from KPI card
              </Badge>
              <Button appearance="subtle" onClick={onClearFilter}>
                Clear filter
              </Button>
            </div>
          ) : null}

          <div className={styles.denseTableWrap}>
            <table className={styles.denseTable}>
              <thead>
                <tr>
                  <th className={styles.denseCell}>Category</th>
                  <th className={styles.denseCell}>Storage size</th>
                  <th className={styles.denseCell}>% of total</th>
                  <th className={styles.denseCell}>Description</th>
                  <th className={styles.denseCell}>Billing state</th>
                  <th className={styles.denseCell}>Cleanup behavior</th>
                  <th className={styles.denseCell}>Related capability</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className={styles.denseCell}>{category.name}</td>
                    <td className={styles.denseCell}>{formatStorage(category.sizeGb)}</td>
                    <td className={styles.denseCell}>{storagePercent(category.sizeGb).toFixed(1)}%</td>
                    <td className={styles.denseCell}>{category.description}</td>
                    <td className={styles.denseCell}>{category.billingState}</td>
                    <td className={styles.denseCell}>{category.cleanupBehavior}</td>
                    <td className={styles.denseCell}>{category.relatedCapability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            header={<Body1Strong>Reconciliation checks</Body1Strong>}
            description={<Caption1>Warehouse total must match displayed storage categories</Caption1>}
          />
          <Body1>Total storage: {formatStorage(totalStorageGb)}</Body1>
          <Body1>
            Category sum: {formatStorage(storageCategories.reduce((sum, category) => sum + category.sizeGb, 0))}
          </Body1>
          <Body1>
            Table-attributed sum: {formatStorage(tableStorageRecords.reduce((sum, table) => sum + table.totalGb, 0))}
          </Body1>
          <Badge appearance="filled" color="success">
            Category totals reconciled
          </Badge>
        </Card>
      </div>

      <Card>
        <CardHeader
          header={<Body1Strong>Pending garbage collection</Body1Strong>}
          description={<Caption1>Storage in scope for a future garbage-collection iteration</Caption1>}
        />
        <Body1>
          This section represents expired and non-referenced files that are in scope for a future garbage-collection iteration. No manual delete action is available in this preview.
        </Body1>
        <div className={styles.denseTableWrap}>
          <table className={styles.denseTable}>
            <thead>
              <tr>
                <th className={styles.denseCell}>Category</th>
                <th className={styles.denseCell}>Storage size</th>
              </tr>
            </thead>
            <tbody>
              {pendingCategories.map((category) => (
                <tr key={category.id}>
                  <td className={styles.denseCell}>{category.name}</td>
                  <td className={styles.denseCell}>{formatStorage(category.sizeGb)}</td>
                </tr>
              ))}
              <tr>
                <td className={styles.denseCell}>
                  <Body1Strong>Total potentially reclaimable storage</Body1Strong>
                </td>
                <td className={styles.denseCell}>
                  <Body1Strong>{formatStorage(pendingGarbageCollectionGb)}</Body1Strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function TablesPage({
  styles,
  schemas,
  searchText,
  setSearchText,
  schemaFilter,
  setSchemaFilter,
  tableTypeFilter,
  setTableTypeFilter,
  storageFilter,
  setStorageFilter,
  ranking,
  setRanking,
  filteredTables,
  onSelectTable,
}: {
  styles: ReturnType<typeof useStyles>;
  schemas: string[];
  searchText: string;
  setSearchText: (value: string) => void;
  schemaFilter: string;
  setSchemaFilter: (value: string) => void;
  tableTypeFilter: string;
  setTableTypeFilter: (value: string) => void;
  storageFilter: string;
  setStorageFilter: (value: string) => void;
  ranking: string;
  setRanking: (value: string) => void;
  filteredTables: TableStorageRecord[];
  onSelectTable: (table: TableStorageRecord) => void;
}) {
  return (
    <>
      <Card>
        <CardHeader
          header={<Body1Strong>Warehouse-to-schema-to-table drilldown</Body1Strong>}
          description={<Caption1>Top 20 largest tables by default; filters are preserved while navigating pages</Caption1>}
        />

        <div className={styles.filterRow}>
          <Field label="Search table">
            <Input
              value={searchText}
              onChange={(_, data) => setSearchText(data.value)}
              placeholder="Search by schema.table"
              contentBefore={<SearchRegular />}
            />
          </Field>
          <Field label="Schema">
            <Dropdown value={schemaFilter === "all" ? "All schemas" : schemaFilter} onOptionSelect={(_, data) => setSchemaFilter(data.optionValue ?? "all")}>
              <Option value="all">All schemas</Option>
              {schemas.map((schema) => (
                <Option key={schema} value={schema}>
                  {schema}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Table type">
            <Dropdown value={tableTypeFilter === "all" ? "All table types" : tableTypeFilter} onOptionSelect={(_, data) => setTableTypeFilter(data.optionValue ?? "all")}>
              <Option value="all">All table types</Option>
              {["Fact", "Dimension", "Snapshot", "Staging", "Audit", "Aggregate"].map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Storage category">
            <Dropdown value={storageFilter === "all" ? "All categories" : storageFilter} onOptionSelect={(_, data) => setStorageFilter(data.optionValue ?? "all")}>
              <Option value="all">All categories</Option>
              <Option value="historical">Historical heavy</Option>
              <Option value="softDeleted">Soft-deleted heavy</Option>
            </Dropdown>
          </Field>
          <Field label="Sort">
            <Dropdown value={ranking} onOptionSelect={(_, data) => setRanking(data.optionValue ?? "largest")}>
              <Option value="largest">Largest</Option>
              <Option value="fastest-growing">Fastest growing</Option>
              <Option value="least-recently-accessed">Least recently accessed</Option>
              <Option value="most-queried">Most queried</Option>
            </Dropdown>
          </Field>
          <Field label="Export">
            <Button appearance="secondary" icon={<ArrowDownloadRegular />}>
              Export table data
            </Button>
          </Field>
        </div>

        <div className={styles.pillRow}>
          <Badge appearance="outline">Preset ranking:</Badge>
          {["largest", "fastest-growing", "least-recently-accessed", "most-queried"].map((preset) => (
            <Button
              key={preset}
              size="small"
              appearance={ranking === preset ? "primary" : "subtle"}
              className={styles.rankButton}
              onClick={() => setRanking(preset)}
            >
              {preset.replaceAll("-", " ")}
            </Button>
          ))}
        </div>
      </Card>

      {filteredTables.length === 0 ? (
        <Card>
          <CardHeader
            header={<Body1Strong>No tables match the selected filters</Body1Strong>}
            description={<Body1>Try removing one or more filters to restore results.</Body1>}
          />
        </Card>
      ) : (
        <Card>
          <div className={styles.denseTableWrap}>
            <table className={styles.denseTable}>
              <thead>
                <tr>
                  <th className={styles.denseCell}>Schema</th>
                  <th className={styles.denseCell}>Table name</th>
                  <th className={styles.denseCell}>Table type</th>
                  <th className={styles.denseCell}>Total storage</th>
                  <th className={styles.denseCell}>Active storage</th>
                  <th className={styles.denseCell}>Historical storage</th>
                  <th className={styles.denseCell}>Soft-deleted storage</th>
                  <th className={styles.denseCell}>Number of files</th>
                  <th className={styles.denseCell}>Expired files</th>
                  <th className={styles.denseCell}>Non-referenced files</th>
                  <th className={styles.denseCell}>Last modified</th>
                  <th className={styles.denseCell}>Last accessed</th>
                  <th className={styles.denseCell}>Queries (30d)</th>
                  <th className={styles.denseCell}>30-day growth</th>
                  <th className={styles.denseCell}>Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredTables.map((table) => (
                  <tr key={table.id} className={styles.rowHover} onClick={() => onSelectTable(table)}>
                    <td className={styles.denseCell}>{table.schema}</td>
                    <td className={styles.denseCell}>
                      {table.tableName}
                      {table.reviewRecommended ? (
                        <Badge appearance="outline" color="informative" style={{ marginLeft: "6px" }}>
                          Review recommended
                        </Badge>
                      ) : null}
                    </td>
                    <td className={styles.denseCell}>{table.tableType}</td>
                    <td className={styles.denseCell}>{formatStorage(table.totalGb)}</td>
                    <td className={styles.denseCell}>{formatStorage(table.activeGb)}</td>
                    <td className={styles.denseCell}>{formatStorage(table.historicalGb)}</td>
                    <td className={styles.denseCell}>{formatStorage(table.softDeletedGb)}</td>
                    <td className={styles.denseCell}>{table.fileCount.toLocaleString()}</td>
                    <td className={styles.denseCell}>{table.expiredFiles.toLocaleString()}</td>
                    <td className={styles.denseCell}>{table.nonReferencedFiles.toLocaleString()}</td>
                    <td className={styles.denseCell}>{table.lastModified}</td>
                    <td className={styles.denseCell}>{table.lastAccessed}</td>
                    <td className={styles.denseCell}>{table.queriesLast30Days.toLocaleString()}</td>
                    <td className={styles.denseCell}>{table.growth30dPct.toFixed(1)}%</td>
                    <td className={styles.denseCell}>{table.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

function TrendsPage({
  styles,
  onOpenAnomaly,
  onGoToTables,
}: {
  styles: ReturnType<typeof useStyles>;
  onOpenAnomaly: () => void;
  onGoToTables: () => void;
}) {
  const maxValue = Math.max(...trendPoints.map((point) => point.totalGb));

  return (
    <>
      <Card>
        <CardHeader
          header={<Body1Strong>30-day historical analysis</Body1Strong>}
          description={<Caption1>Warehouse growth by category, daily growth in bytes and percent, with anomaly detection markers</Caption1>}
        />
        <div className={styles.filterRow}>
          <Field label="Date range">
            <Dropdown value="Last 30 days">
              <Option>Last 7 days</Option>
              <Option>Last 14 days</Option>
              <Option>Last 30 days</Option>
            </Dropdown>
          </Field>
          <Field label="Category selection">
            <Dropdown value="All categories">
              <Option>All categories</Option>
              <Option>Active storage</Option>
              <Option>Historical storage</Option>
              <Option>System storage</Option>
            </Dropdown>
          </Field>
          <Field label="Table comparison">
            <Dropdown value="fact_sales vs fact_orders">
              <Option>fact_sales vs fact_orders</Option>
              <Option>transaction_history vs inventory_snapshot</Option>
              <Option>raw_customer_events vs raw_clickstream</Option>
            </Dropdown>
          </Field>
          <Field label="Anomaly threshold">
            <Dropdown value="10% day-over-day">
              <Option>8% day-over-day</Option>
              <Option>10% day-over-day</Option>
              <Option>12% day-over-day</Option>
            </Dropdown>
          </Field>
          <Field label="Actions">
            <Button appearance="secondary" icon={<ChartMultipleRegular />} onClick={onOpenAnomaly}>
              Inspect anomaly
            </Button>
          </Field>
          <Field label="Table detail">
            <Button appearance="secondary" icon={<OpenRegular />} onClick={onGoToTables}>
              Open filtered tables
            </Button>
          </Field>
        </div>
      </Card>

      <Card className={styles.chartContainer}>
        <CardHeader
          header={<Body1Strong>Warehouse storage trend</Body1Strong>}
          description={<Caption1>Visible spike marks anomalous growth event</Caption1>}
        />
        <svg viewBox="0 0 1000 260" className={styles.trendSvg} role="img" aria-label="Warehouse growth trend">
          <path
            d={buildTrendPath(
              trendPoints.map((point) => point.totalGb),
              maxValue,
              980,
              220,
            )}
            transform="translate(10,20)"
            fill="none"
            stroke="#6B4EFF"
            strokeWidth="2.5"
          />
          {trendPoints.map((point, index) => {
            if (point.day !== anomalyDay) return null;
            const x = (index / (trendPoints.length - 1)) * 980 + 10;
            const y = 240 - (point.totalGb / maxValue) * 220;
            return (
              <g key={point.day} onClick={onOpenAnomaly} style={{ cursor: "pointer" }}>
                <line x1={x} y1={20} x2={x} y2={240} stroke="#E65F5C" strokeDasharray="4 4" />
                <circle cx={x} cy={y} r="6" fill="#E65F5C" />
              </g>
            );
          })}
        </svg>
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Daily growth view</Body1Strong>}
          description={<Caption1>Absolute and percentage growth, with top table contributors</Caption1>}
        />
        <div className={styles.denseTableWrap}>
          <table className={styles.denseTable}>
            <thead>
              <tr>
                <th className={styles.denseCell}>Day</th>
                <th className={styles.denseCell}>Total storage</th>
                <th className={styles.denseCell}>Daily growth (GB)</th>
                <th className={styles.denseCell}>Daily growth (%)</th>
                <th className={styles.denseCell}>Top contributor</th>
              </tr>
            </thead>
            <tbody>
              {trendPoints.slice(-12).map((point, index, points) => {
                const previous = points[index - 1]?.totalGb ?? point.totalGb;
                const growthGb = Number((point.totalGb - previous).toFixed(2));
                const growthPct = previous === 0 ? 0 : Number(((growthGb / previous) * 100).toFixed(2));
                return (
                  <tr key={point.day} className={point.day === anomalyDay ? styles.warningCard : undefined}>
                    <td className={styles.denseCell}>{point.day}</td>
                    <td className={styles.denseCell}>{formatStorage(point.totalGb)}</td>
                    <td className={styles.denseCell}>{growthGb >= 0 ? `+${growthGb.toFixed(2)} GB` : `${growthGb.toFixed(2)} GB`}</td>
                    <td className={styles.denseCell}>{growthPct >= 0 ? `+${growthPct}%` : `${growthPct}%`}</td>
                    <td className={styles.denseCell}>{point.day === anomalyDay ? "dbo.fact_sales" : "dbo.fact_orders"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function QueryViewsPage({
  styles,
  selectedView,
  selectedViewName,
  setSelectedViewName,
  sqlText,
  setSqlText,
  messagesTab,
  setMessagesTab,
  onViewInDashboard,
  onUseTemplate,
}: {
  styles: ReturnType<typeof useStyles>;
  selectedView: QueryViewDefinition;
  selectedViewName: string;
  setSelectedViewName: (name: string) => void;
  sqlText: string;
  setSqlText: (sql: string) => void;
  messagesTab: "results" | "messages";
  setMessagesTab: (tab: "results" | "messages") => void;
  onViewInDashboard: (tab: StorageTab) => void;
  onUseTemplate: (template: string) => void;
}) {
  return (
    <div className={styles.splitLayout}>
      <Card>
        <CardHeader
          header={<Body1Strong>System-view explorer</Body1Strong>}
          description={<Caption1>Group: Storage Insights</Caption1>}
        />
        <Field label="Search views">
          <Input placeholder="Find system view" contentBefore={<SearchRegular />} />
        </Field>
        <div style={{ display: "grid", gap: "6px" }}>
          {queryViewDefinitions.map((view) => (
            <Button
              key={view.viewName}
              appearance={selectedViewName === view.viewName ? "secondary" : "subtle"}
              onClick={() => {
                setSelectedViewName(view.viewName);
                setSqlText(view.sampleQuery);
              }}
              style={{ justifyContent: "flex-start" }}
            >
              {view.viewName}
            </Button>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gap: "12px" }}>
        <Card className={styles.queryEditorCard}>
          <CardHeader
            header={<Body1Strong>SQL editor</Body1Strong>}
            description={<Caption1>{selectedView.purpose}</Caption1>}
          />

          <div className={styles.pillRow}>
            <Button appearance="primary">Run</Button>
            <Button appearance="secondary">Explain</Button>
            <Button appearance="secondary">Save as query</Button>
            <Button appearance="subtle" icon={<FilterRegular />} onClick={() => onViewInDashboard(selectedView.dashboardTarget)}>
              View in dashboard
            </Button>
          </div>

          <Card>
            <CardHeader header={<Body1Strong>Column explorer</Body1Strong>} />
            <div className={styles.pillRow}>
              {selectedView.columns.map((column) => (
                <Badge key={column} appearance="outline">
                  {column}
                </Badge>
              ))}
            </div>
          </Card>

          <div className={styles.queryPanel}>
            <p className={styles.codeText}>
              <SqlSyntax query={sqlText} />
            </p>
          </div>

          <textarea
            className={styles.queryTextarea}
            value={sqlText}
            onChange={(event) => setSqlText(event.target.value)}
            aria-label="SQL editor"
          />

          <Card>
            <CardHeader header={<Body1Strong>Query templates</Body1Strong>} />
            <div className={styles.pillRow}>
              {queryTemplates.map((template) => (
                <Button key={template.id} size="small" appearance="subtle" onClick={() => onUseTemplate(template.sql)}>
                  {template.title}
                </Button>
              ))}
            </div>
          </Card>
        </Card>

        <Card className={styles.queryBottom}>
          <TabList selectedValue={messagesTab} onTabSelect={(_, data) => setMessagesTab(String(data.value) as "results" | "messages")}>
            <Tab value="results">Results</Tab>
            <Tab value="messages">Messages</Tab>
          </TabList>

          {messagesTab === "results" ? (
            <div className={styles.denseTableWrap}>
              <table className={styles.denseTable}>
                <thead>
                  <tr>
                    {selectedView.columns.map((column) => (
                      <th key={column} className={styles.denseCell}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedView.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {selectedView.columns.map((column) => (
                        <td key={`${rowIndex}-${column}`} className={styles.denseCell}>
                          {String(row[column] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <Body1>Query completed successfully in 224 ms.</Body1>
              <Body1>Rows returned: {selectedView.rows.length}</Body1>
              <Body1>Source: {selectedView.viewName}</Body1>
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
}

function RetentionPage({
  styles,
  retentionDays,
  setRetentionDays,
  projectedHistoricalGb,
  projectedSavingsGb,
}: {
  styles: ReturnType<typeof useStyles>;
  retentionDays: string;
  setRetentionDays: (value: string) => void;
  projectedHistoricalGb: number;
  projectedSavingsGb: number;
}) {
  const savingsPct = Number(((projectedSavingsGb / 2478.08) * 100).toFixed(1));

  return (
    <>
      <Card className={styles.warningCard}>
        <CardHeader
          header={<Body1Strong>Future concept / Post-preview concept</Body1Strong>}
          description={<Body1>Generating this estimate requires an on-demand storage scan and may consume Fabric capacity.</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Retention simulation</Body1Strong>}
          description={<Caption1>This preview estimates impact only. No retention policy is changed.</Caption1>}
        />

        <div className={styles.filterRow}>
          <Field label="Current retention period">
            <Input value="30 days" readOnly />
          </Field>
          <Field label="Proposed retention period">
            <Dropdown value={`${retentionDays} days`} onOptionSelect={(_, data) => setRetentionDays(data.optionValue ?? "14")}>
              <Option value="7">7 days</Option>
              <Option value="14">14 days</Option>
              <Option value="21">21 days</Option>
              <Option value="30">30 days</Option>
            </Dropdown>
          </Field>
          <Field label="Current historical storage">
            <Input value={formatStorage(2478.08)} readOnly />
          </Field>
          <Field label="Projected historical storage">
            <Input value={formatStorage(projectedHistoricalGb)} readOnly />
          </Field>
          <Field label="Projected savings">
            <Input value={formatStorage(projectedSavingsGb)} readOnly />
          </Field>
          <Field label="Projected savings %">
            <Input value={`${savingsPct.toFixed(1)}%`} readOnly />
          </Field>
        </div>

        <Body1>Simulation timestamp: Today, 6:18 AM</Body1>
      </Card>
    </>
  );
}

function AlertsPage({ styles }: { styles: ReturnType<typeof useStyles> }) {
  return (
    <>
      <Card className={styles.warningCard}>
        <CardHeader
          header={<Body1Strong>Future concept (P1)</Body1Strong>}
          description={<Body1>Alert-management capabilities shown here are proposed for a post-preview release.</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Alert management</Body1Strong>}
          description={<Caption1>Configure storage spike, absolute threshold, and inactive table alerts</Caption1>}
        />
        <div className={styles.denseTableWrap}>
          <table className={styles.denseTable}>
            <thead>
              <tr>
                <th className={styles.denseCell}>Alert</th>
                <th className={styles.denseCell}>Enabled</th>
                <th className={styles.denseCell}>Severity</th>
                <th className={styles.denseCell}>Threshold</th>
                <th className={styles.denseCell}>Destination</th>
                <th className={styles.denseCell}>Last triggered</th>
              </tr>
            </thead>
            <tbody>
              {alertRules.map((rule) => (
                <tr key={rule.id}>
                  <td className={styles.denseCell}>{rule.ruleName}</td>
                  <td className={styles.denseCell}>{rule.enabled ? "Enabled" : "Disabled"}</td>
                  <td className={styles.denseCell}>{rule.severity}</td>
                  <td className={styles.denseCell}>{rule.threshold}</td>
                  <td className={styles.denseCell}>{rule.destination}</td>
                  <td className={styles.denseCell}>{rule.lastTriggered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function TableDetailsPane({
  styles,
  table,
  onClose,
}: {
  styles: ReturnType<typeof useStyles>;
  table: TableStorageRecord;
  onClose: () => void;
}) {
  return (
    <aside className={styles.sidePane} aria-label="Table details">
      <div className={styles.sidePaneHeader}>
        <Title3>
          {table.schema}.{table.tableName}
        </Title3>
        <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />
      </div>

      <Card>
        <CardHeader
          header={<Body1Strong>Storage composition</Body1Strong>}
          description={
            <Body1>
              Total {formatStorage(table.totalGb)} · Active {formatStorage(table.activeGb)} · Historical {formatStorage(table.historicalGb)}
            </Body1>
          }
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>30-day storage trend</Body1Strong>}
          description={<Caption1>Recent growth: {table.growth30dPct.toFixed(1)}%</Caption1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Activity summary</Body1Strong>}
          description={<Body1>Queries in last 30 days: {table.queriesLast30Days.toLocaleString()}</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>File details</Body1Strong>}
          description={
            <Body1>
              Files: {table.fileCount.toLocaleString()} · Expired: {table.expiredFiles.toLocaleString()} · Non-referenced: {table.nonReferencedFiles.toLocaleString()}
            </Body1>
          }
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Last query</Body1Strong>}
          description={<Body1>{table.lastAccessed}</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Last write</Body1Strong>}
          description={<Body1>{table.lastModified}</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Current retention information</Body1Strong>}
          description={<Body1>30-day retention policy applied at warehouse scope.</Body1>}
        />
      </Card>
    </aside>
  );
}

function AnomalyPane({
  styles,
  point,
  onClose,
  onOpenTables,
}: {
  styles: ReturnType<typeof useStyles>;
  point: { day: string; totalGb: number };
  onClose: () => void;
  onOpenTables: () => void;
}) {
  const previousPoint = trendPoints[trendPoints.findIndex((item) => item.day === point.day) - 1];
  const absoluteGrowth = Number((point.totalGb - (previousPoint?.totalGb ?? point.totalGb)).toFixed(2));
  const growthPct = previousPoint
    ? Number(((absoluteGrowth / previousPoint.totalGb) * 100).toFixed(2))
    : 0;

  return (
    <aside className={styles.sidePane} aria-label="Anomaly investigation">
      <div className={styles.sidePaneHeader}>
        <Title2>Anomaly investigation</Title2>
        <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />
      </div>

      <Card>
        <CardHeader
          header={<Body1Strong>Date</Body1Strong>}
          description={<Body1>{point.day}</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Absolute and percentage growth</Body1Strong>}
          description={<Body1>{absoluteGrowth.toFixed(2)} GB ({growthPct.toFixed(2)}%)</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Storage categories responsible</Body1Strong>}
          description={<Body1>Historical/time-travel data and active data were the largest contributors.</Body1>}
        />
      </Card>

      <Card>
        <CardHeader
          header={<Body1Strong>Top contributing tables</Body1Strong>}
          description={<Body1>dbo.fact_sales, finance.transaction_history, staging.raw_customer_events.</Body1>}
        />
      </Card>

      <Button appearance="primary" onClick={onOpenTables} icon={<OpenRegular />}>
        Open filtered Tables view
      </Button>
    </aside>
  );
}

export default App;
