<script>
	import { chart } from '$lib/utils/chart?client';
	import { mode } from 'mode-watcher';
	export let categories = ['-----', '-----', '-----', '-----'];
	export let colors = ['#1C64F2', '#16BDCA', '#FDBA8C', '#E74694'];
	export let values = [35.1, 23.5, 2.4, 5.4];
	export let label = 'Revenue';
	
	$: textColor = $mode === 'light' ? '#000000' : '#FFFFFF';

	$: options = {
		series: values,
		colors: colors,
		chart: {
			height: 320,
			width: '100%',
			type: 'donut'
		},
		stroke: {
			colors: ['transparent'],
			lineCap: ''
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'ui-sans-serif, sans-serif',
							color: textColor,
							offsetY: 20
						},
						total: {
							showAlways: true,
							show: true,
							label: label,
							fontFamily: 'ui-sans-serif, sans-serif',
							color: textColor,
							formatter: function (w) {
								const sum = w.globals.seriesTotals.reduce((a, b) => {
									return a + b;
								}, 0);
								return '$' + sum;
							}
						},
						value: {
							show: true,
							fontFamily: 'ui-sans-serif, sans-serif',
							offsetY: -20,
							color: textColor,
							formatter: function (value) {
								return "$" + value;
							}
						}
					},
					size: '80%'
				}
			}
		},
		grid: {
			padding: {
				top: -2
			}
		},
		labels: categories,
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'ui-sans-serif, sans-serif',
			fontSize: '16px',
			labels: {
				colors: textColor
			}
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return "$" + value;
				}
			}
		},
		xaxis: {
			labels: {
				formatter: function (value) {
					return "$" + value;
				}
			},
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
		}
	};
</script>

<div use:chart={options} />