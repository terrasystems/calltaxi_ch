'use strict';
angular.module('com.module.taxi')
/**
 * @ngdoc function
 * @name com.module.taxi.controller:TaxiController
 * @description
 * # TaxiController
 * Controller of the main-common form
 */
.controller('TaxiController', function ($scope, privateRequest, $translate, $sessionStorage, periodObj) {
	/* model toggle */
	$scope.type = 'Pie';
	$scope.periodobject = periodObj;
	// periodfilter
	$scope.periodfilter = $sessionStorage.periodfilter || 0;
	if (!$scope.backfilter) $scope.backfilter = {
		filtering: {}
	};
	$scope.chartname = 'CHARTGROUP';
	$scope.chartname2 = 'CHARTANAL';
	//if (chartdata=0) {
	// $scope.chartTitle = '<i class="fa fa-file-text"></i> ' + $translate.instant('ANALISYS') + ' ' + $translate.instant(
	// 	'ANALISYS') + ' ' + $translate.instant('BYY') + ' ' + $translate.instant(filter.filter);
	// $scope.chartSeriesName = '<i class="fa fa-tint"></i> ' + $translate.instant('CNT');
	//}
/*	$scope.chartNoData = $translate.instant('WILLBECHART');
	$scope.options = {
		title: {
			//useHTML: true,
			text: $scope.chartTitle,
			style: {
				fontSize: '16px',
				fontWeight: '700'
			}
		},
		lang: {
			noData: $scope.chartNoData
		},
		credits: {
			enabled: false
		},
		tooltip: {
			//pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			pointFormatter: function () {
				return this.name === 'Slice' ? $translate.instant('o_0') + ': <b>' + this.percentage.toFixed(2) + '%</b>' : this.name +
				': <b>' + this.percentage.toFixed(2) + '%</b>';
			}
		},
		exporting: {
			enabled: false
		},
		legend: {
			itemStyle: {
				'fontSize': '12px',
				'fontWeight': 'normal',
				'paddingBottom' : '8'
			},
			//labelFormat: '{name}',
			labelFormatter: function () {
				return this.name === 'Slice' ? $translate.instant('o_0') : this.name;
			},
			layout: 'horizontal',
			maxHeight: 60
			//,title: {style: null, text: null},
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		}
	};*/
/*	$scope.$watch('periodfilter', function (periodfilter) {
		$sessionStorage.periodfilter = periodfilter;
		$scope.backfilter.periodfilter = periodfilter;
		privateRequest.get({url: 'dashboard', action: 'chart'}, {backfilter: $scope.backfilter}, function (data) {
			/!* LEFT BANNER *!/
			$scope.cntOrdersAll = data.result.cntOrdersAll;
			$scope.prcOrdersDone = data.result.prcOrdersDone;
			$scope.prcOrdersLast = data.result.prcOrdersLast;
			/!* MIDDLE BANNER *!/
			$scope.cntJorProcessAll = data.result.cntJorProcessAll;
			$scope.prcJorProcessDone = data.result.prcJorProcessDone;
			$scope.prcJorProcessLast = data.result.prcJorProcessLast;
			/!* RIGHT BANNER *!/
			$scope.cntQualityControlAll = data.result.cntQualityControlAll;
			$scope.prcIndicators = data.result.prcIndicators;
			/!* WTF ?! o_0 *!/
			/!* CHARTS *!/
			$scope.analChartConfig = {
				series: [{
					type: 'pie',
					name: $translate.instant('PERCENT'),
					data: data.result.analizatorChart
				}]
			};
			$scope.groupChartConfig = {
				series: [{
					type: 'pie',
					name: $translate.instant('PERCENT'),
					data: data.result.groupChart
				}]
			};
		});
	});*/
});