'use strict';
/*   @description menu list */
angular.module('com.module.core')
/*  */
.run(function($templateCache) {
// шаблоны ui-select
	$templateCache.put("my/choices.tpl.html",
		"<ul class=\"ui-select-choices ui-select-choices-content dropdown-menu\" role=\"listbox\" ng-show=\"$select.items.length > 0\"><li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div><div id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\"><a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\"></a></div></li></ul>"
	);
	$templateCache.put("my/select.tpl.html",
		"<div class=\" ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><span class=\"ui-select-match\"></span><input type=\"text\" autocomplete=\"off\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\" ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>"
	);
	$templateCache.put("my/match.tpl.html",
		"<button class=\"btn ui-select-match ui-select-my ui-select-toggle\"  ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder \">{{$select.placeholder}}</span><span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span><a class=\"pad dropdown-toggle\" ng-click=\"$select.toggle($event)\"><i class=\"fa fa-angle-down\"></i></a><a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xspull-right\"><i class=\"fa fa-close\" aria-hidden=\"true\"></i></a></button>"
	);
	$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
	$templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></a></span></div>");
	$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div></div>");
	$templateCache.put("bootstrap/select.tpl.html","<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");
	//
	$templateCache.put("template/typeahead/typeahead-popup.html",
		"<ul class=\"dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px', width: position.width+'px', 'max-height': 300+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
		"    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
		"        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
		"    </li>\n" +
		"</ul>\n" +
		"");
	// pager for labprocess
	$templateCache.put("template/pagination/pagination.html",
		"<ul class=\"pagination\">\n" +
		"  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(1, $event)\">{{getText('first')}}</a></li>\n" +
		"  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(page - 1, $event)\"><i class=\"fa fa-angle-double-left\"></i>&nbsp;<span class=\"hidden-xs\" translate=\"PREVIOUS\"></span></a></li>\n" +
		"  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
		"  <li class=\"disabled hidden-xs\" ng-transclude></li>\n" +
		"  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(page + 1, $event)\"><span class=\"hidden-xs\" translate=\"NEXT\"></span>&nbsp;<i class=\"fa fa-angle-double-right\"></i></a></li>\n" +
		"  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(totalPages, $event)\">{{getText('last')}}</a></li>\n" +
		"</ul>");
	// pager for labprocess
	$templateCache.put("template/pagination/pager.html",
		"<ul class=\"pager\">\n" +
		"  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href class=\"btn btn-flat\" ng-click=\"selectPage(page - 1)\"><i class=\"fa fa-angle-double-left\"></i>&nbsp;<span class=\"visible-lg\" translate=\"PREVIOUS\"></span></a></li>\n" +
		"  <li class=\"\" ng-transclude></li>\n" +
		"  <li ng-class=\"{disabled: noNext(), next: align}\"><a href class=\"btn btn-flat\" ng-click=\"selectPage(page + 1)\"><span class=\"visible-lg\" translate=\"NEXT\"></span>&nbsp;<i class=\"fa fa-angle-double-right\"></i></a></li>\n" +
		"</ul>");
	$templateCache.put("tabs_template.html",
		"<tabset class=\"tab-container\" type=\"{{type}}\" vertical=\"{{vertical}}\" justified=\"{{justified}}\">" +
			"<tab class=\"tab\" ng-repeat=\"tab in tabs\" heading=\"{{tab.heading|translate}}\" " +
			"active=\"tab.active\" disable=\"tab.disabled\" ng-click=\"go(tab)\" addon=\"tab.addon\">" +
				"<tab-heading><i class=\"fa fa-{{tab.icon}}\"></i>&nbsp;<span class=\"hidden-xs\" ng-hide=\"menuStatus\">{{tab.heading|translate}}</span></tab-heading>" +
			"</tab> " +
			// "<li class=\"pull-right right-li-block\">" +
			// 	"<div  style=\"display: inline-block\">" +
			// 		"<button class=\"btn\" ng-class=\"{'btn-success': $$childHead.qccard.isActive}\" ng-click=\"$$childHead.qccard.changeActive()\">" +
			// 			"<i class=\"fa fa-fw\" ng-class=\"!$$childHead.qccard.isActive ? 'fa-lock' : 'fa-unlock'\"></i>" +
			// 		"</button></div></li>" +
			//"<left-info-buttons is-active-q=\"qccard.isActive\" delete-doc=\"deleteorder()(order)\" change-doc=\"changeActive()\"></left-info-buttons>" +
		"</tabset>");
});