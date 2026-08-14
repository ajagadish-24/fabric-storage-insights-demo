//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useMemo, useState } from "react";
import {
    Badge,
    Body1Strong,
    Button,
    Card,
    CardHeader,
    FluentProvider,
    ProgressBar,
    Tab,
    TabList,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Text,
    Title2,
    makeStyles,
    shorthands,
    tokens,
    webDarkTheme,
    webLightTheme,
} from "@fluentui/react-components";
import { WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";

import { useThemeContext } from "@/hooks/theme.context";
import {
    activityFeed,
    storageHealthScore,
    storageKpis,
    warehouseStorageTables,
} from "@/mock/fabric-storage-insights.mock";

const useStyles = makeStyles({
    app: {
        minHeight: "100%",
        backgroundColor: tokens.colorNeutralBackground2,
        color: tokens.colorNeutralForeground1,
        display: "flex",
        flexDirection: "column",
    },
    topBar: {
        backgroundColor: tokens.colorNeutralBackground1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...shorthands.padding("12px", "20px"),
        ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
    },
    workspaceInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    content: {
        maxWidth: "1200px",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        ...shorthands.padding("16px", "20px", "24px"),
        display: "grid",
        gap: "16px",
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "12px",
    },
    pageCard: {
        display: "grid",
        gap: "12px",
    },
});

function App() {
    const styles = useStyles();
    const { isDark, toggleTheme } = useThemeContext();
    const [selectedPage, setSelectedPage] = useState("overview");
    const theme = useMemo(() => (isDark ? webDarkTheme : webLightTheme), [isDark]);

    return (
        <FluentProvider theme={theme} className={styles.app}>
            <header className={styles.topBar}>
                <div className={styles.workspaceInfo}>
                    <Body1Strong>Fabric Storage Insights</Body1Strong>
                    <Badge appearance="tint">Data Warehouse</Badge>
                    <Text size={200}>Workspace: Finance Lakehouse Ops</Text>
                </div>
                <Button
                    icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
                    onClick={toggleTheme}
                    appearance="subtle"
                >
                    {isDark ? "Light mode" : "Dark mode"}
                </Button>
            </header>

            <main className={styles.content}>
                <TabList
                    selectedValue={selectedPage}
                    onTabSelect={(_, data) => setSelectedPage(String(data.value))}
                >
                    <Tab value="overview">Overview</Tab>
                    <Tab value="tables">Warehouse Tables</Tab>
                    <Tab value="activity">Activity</Tab>
                </TabList>

                {selectedPage === "overview" && (
                    <>
                        <div className={styles.cardGrid}>
                            {storageKpis.map((kpi) => (
                                <Card key={kpi.label}>
                                    <CardHeader
                                        header={<Text weight="semibold">{kpi.label}</Text>}
                                        description={<Text size={200}>{kpi.helperText}</Text>}
                                    />
                                    <Title2>{kpi.value}</Title2>
                                </Card>
                            ))}
                        </div>
                        <Card className={styles.pageCard}>
                            <CardHeader
                                header={<Body1Strong>Storage health score</Body1Strong>}
                                description={
                                    <Text size={200}>
                                        Composite score based on warehouse growth, file aging, and
                                        stale partition ratio.
                                    </Text>
                                }
                            />
                            <ProgressBar
                                value={storageHealthScore / 100}
                                max={1}
                                thickness="large"
                            />
                            <Text>{storageHealthScore}% healthy</Text>
                        </Card>
                    </>
                )}

                {selectedPage === "tables" && (
                    <Card>
                        <CardHeader
                            header={<Body1Strong>Largest warehouse tables</Body1Strong>}
                            description={
                                <Text size={200}>
                                    Mock metrics for local development before wiring Fabric
                                    semantic model queries.
                                </Text>
                            }
                        />
                        <Table aria-label="Warehouse storage table">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Table</TableHeaderCell>
                                    <TableHeaderCell>Storage Used</TableHeaderCell>
                                    <TableHeaderCell>Growth (30 days)</TableHeaderCell>
                                    <TableHeaderCell>Owner</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warehouseStorageTables.map((table) => (
                                    <TableRow key={table.tableName}>
                                        <TableCell>{table.tableName}</TableCell>
                                        <TableCell>{table.storageUsed}</TableCell>
                                        <TableCell>{table.growthRate}</TableCell>
                                        <TableCell>{table.owner}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                {selectedPage === "activity" && (
                    <Card className={styles.pageCard}>
                        <CardHeader
                            header={<Body1Strong>Recent storage activity</Body1Strong>}
                            description={
                                <Text size={200}>
                                    Fabric-style activity feed with ingestion and maintenance
                                    events.
                                </Text>
                            }
                        />
                        {activityFeed.map((event) => (
                            <div key={event.id}>
                                <Body1Strong>{event.title}</Body1Strong>
                                <Text block size={200}>
                                    {event.details}
                                </Text>
                                <Text size={100}>{event.timestamp}</Text>
                            </div>
                        ))}
                    </Card>
                )}
            </main>
        </FluentProvider>
    );
}

export default App;
