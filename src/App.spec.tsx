//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeContext } from "@/hooks/theme.context";
import App from "@/App";

vi.mock("@fluentui/react-icons", () => ({
    ArrowDownloadRegular: () => null,
    ArrowSyncRegular: () => null,
    ChartMultipleRegular: () => null,
    DatabaseRegular: () => null,
    DismissRegular: () => null,
    DocumentTableRegular: () => null,
    FilterRegular: () => null,
    InfoRegular: () => null,
    OpenRegular: () => null,
    QuestionCircleRegular: () => null,
    SearchRegular: () => null,
    SettingsRegular: () => null,
    WeatherMoonRegular: () => null,
    WeatherSunnyRegular: () => null,
}));

vi.mock("@fluentui/react-components", async () => {
    const React = await import("react");

    const passthrough =
        (Tag = "div") =>
        ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement(Tag, props, children);

    const Tab = ({
        value,
        children,
        onSelect,
        selectedValue,
    }: React.PropsWithChildren<{
        value: string;
        onSelect?: (value: string) => void;
        selectedValue?: string;
    }>) => (
        <button role="tab" aria-selected={selectedValue === value} onClick={() => onSelect?.(value)}>
            {children}
        </button>
    );

    return {
        Badge: passthrough("span"),
        Body1: passthrough("span"),
        Body1Strong: passthrough("strong"),
        Button: passthrough("button"),
        Card: passthrough("section"),
        CardHeader: ({
            header,
            description,
        }: {
            header?: React.ReactNode;
            description?: React.ReactNode;
        }) => (
            <header>
                {header}
                {description}
            </header>
        ),
        Caption1: passthrough("span"),
        Dropdown: ({
            children,
            value,
        }: React.PropsWithChildren<{ value?: string } & Record<string, unknown>>) => (
            <select value={value} onChange={() => {}}>
                {children}
            </select>
        ),
        Field: passthrough("label"),
        FluentProvider: passthrough("div"),
        Input: ({ value, placeholder }: { value?: string; placeholder?: string }) => (
            <input value={value} placeholder={placeholder} readOnly />
        ),
        Option: ({
            children,
            value,
        }: React.PropsWithChildren<{ value?: string } & Record<string, unknown>>) => (
            <option value={value}>
                {children}
            </option>
        ),
        ProgressBar: passthrough("progress"),
        Table: passthrough("table"),
        TableBody: passthrough("tbody"),
        TableCell: passthrough("td"),
        TableHeader: passthrough("thead"),
        TableHeaderCell: passthrough("th"),
        TableRow: passthrough("tr"),
        Text: ({
            children,
            block,
            ...props
        }: React.PropsWithChildren<{ block?: boolean } & Record<string, unknown>>) =>
            React.createElement(block ? "div" : "span", props, children),
        Title3: passthrough("h3"),
        Title2: passthrough("h2"),
        Tooltip: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => <>{children}</>,
        Tab,
        TabList: ({
            children,
            selectedValue,
            onTabSelect,
        }: React.PropsWithChildren<{
            selectedValue?: string;
            onTabSelect?: (_event: unknown, data: { value: string }) => void;
        }>) => (
            <div role="tablist">
                {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(
                              child as React.ReactElement<{
                                  value: string;
                                  onSelect: (value: string) => void;
                                  selectedValue: string | undefined;
                              }>,
                              {
                                  selectedValue,
                                  onSelect: (value: string) => onTabSelect?.(null, { value }),
                              },
                          )
                        : child,
                )}
            </div>
        ),
        makeStyles: () => () => ({
            app: "",
            topBar: "",
            workspaceInfo: "",
            content: "",
            cardGrid: "",
            pageCard: "",
        }),
        shorthands: {
            padding: () => ({}),
            border: () => ({}),
            borderBottom: () => ({}),
            borderLeft: () => ({}),
            borderRadius: () => ({}),
            borderRight: () => ({}),
        },
        tokens: {
            colorNeutralBackground2: "",
            colorNeutralForeground1: "",
            colorNeutralBackground1: "",
            colorNeutralStroke2: "",
        },
        webDarkTheme: {},
        webLightTheme: {},
    };
});

describe("App", () => {
    it("renders Fabric Storage Insights overview content", () => {
        render(
            <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
                <App />
            </ThemeContext.Provider>,
        );

        expect(screen.getAllByText("Storage Insights").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Total storage").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Storage composition").length).toBeGreaterThan(0);
    });

    it("switches between navigation pages", () => {
        render(
            <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
                <App />
            </ThemeContext.Provider>,
        );

        fireEvent.click(screen.getByRole("tab", { name: "Tables" }));
        expect(screen.getByText("Warehouse-to-schema-to-table drilldown")).toBeInTheDocument();
        expect(screen.getByText("fact_sales")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Trends" }));
        expect(screen.getByText("Warehouse storage trend")).toBeInTheDocument();
        expect(screen.getByText("Daily growth view")).toBeInTheDocument();
    });
});
