import ApexCharts from "apexcharts";

// Declare ApexCharts as a property on the Window object
declare global {
    interface Window { ApexCharts: typeof ApexCharts; }
}
window.ApexCharts = ApexCharts;

// Define the type for the options parameter, which is usually specific to your chart configuration
type ChartOptions = ApexCharts.ApexOptions;

export const chart = (node: HTMLElement, options: ChartOptions) => {
    let myChart = new ApexCharts(node, options);
    myChart.render();

    return {
        update(options: Partial<ChartOptions>) {
            myChart.updateOptions(options);
        },
        destroy() {
            myChart.destroy();
        }
    };
};
