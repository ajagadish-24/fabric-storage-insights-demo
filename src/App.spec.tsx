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
        FluentProvider: passthrough("div"),
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
        Title2: passthrough("h2"),
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
            borderBottom: () => ({}),
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

        expect(screen.getByText("Fabric Storage Insights")).toBeInTheDocument();
        expect(screen.getByText("Storage health score")).toBeInTheDocument();
        expect(screen.getByText("Total Warehouse Storage")).toBeInTheDocument();
    });

    it("switches between navigation pages", () => {
        render(
            <ThemeContext.Provider value={{ isDark: false, toggleTheme: () => {} }}>
                <App />
            </ThemeContext.Provider>,
        );

        fireEvent.click(screen.getByRole("tab", { name: "Warehouse Tables" }));
        expect(screen.getByText("Largest warehouse tables")).toBeInTheDocument();
        expect(screen.getByText("fact_sales_transactions")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Activity" }));
        expect(screen.getByText("Recent storage activity")).toBeInTheDocument();
        expect(screen.getByText("Nightly ingestion complete")).toBeInTheDocument();
    });
});
