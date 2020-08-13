
$(function () {
    DevExpress.localization.locale("ru");


    var analytQueryID, visualizationID, dashboardID, widgetText, widgetFrameOptions, widgetProperties, widgetOptions,
        title, brand, chartType, measures, dimensions, widget, timeDimension = '', timeDimensionGranularity = 'day',
        widgetJson = null;
    title = $("#widget-name").dxTextBox({
        value: "testWidget",
        onValueChanged: function (e) {
        },
    }).dxTextBox("instance");
    widgetText = $("#widget-text").dxTextArea({
        value: "Описание виджета",
        height: 90,
        valueChangeEvent: "change",
        onValueChanged: function (data) {
            console.log(data);
        }
    }).dxTextArea("instance");

    $.getJSON(IP_ANALIT_QUERY_LIST, function (queryList) {
        console.log(queryList);
        var prepearedList = [];
        queryList.forEach(element => {
            if (element.code !== "") {
                prepearedList.push(element);
            }
        });

        function compare(a, b) {
            const codeA = a.code.toUpperCase();
            const codeB = b.code.toUpperCase();

            let comparison = 0;
            if (codeA > codeB) {
                comparison = 1;
            } else if (codeA < codeB) {
                comparison = -1;
            }
            return comparison;
        }

        function checkQueryResults(aqid) {
            return $.getJSON(IP_TO_ANALYT_QUERY_RESULTS + aqid + '/result').then(function (resultList) {
                var resultId = resultList.resultIdFinal;
                console.log(resultList);
                if (resultId == "") {
                    alert("Обновите результаты вополнения Аналитческого запроса");
                }
            });
        }

        analytQueryID = $("#analyt-query-select").dxSelectBox({
            items: prepearedList.sort(compare),
            valueExpr: "id",
            displayExpr: "code",
            onValueChanged: function (analytQuery) {
                initWidgetFormData(analytQuery.value);
                checkQueryResults(analytQuery.value);
            }
        }).dxSelectBox('instance');
    });

    var initSettingsForm = function (chartType, brand, dimensions) {
        var defaultCodeLanguage = CODE_LANGUAGES[0];
        var engCodeLanguage = CODE_LANGUAGES[1];
        var currentCodeLanguage = defaultCodeLanguage;
        //currentCodeLanguage = engCodeLanguage;

        $.getJSON("/widget-adapter/" + chartType + "/" + brand + "/widgetOptions.json", function (defaultWidgetOptions) {
            console.log("WidgetOptionsDefault", defaultWidgetOptions);
            //console.log(defaultWidgetOptions[0].caption);

            console.log(currentCodeLanguage);
            var widgetSettings = defaultWidgetOptions;
            var formItems = [];
            //if (currentCodeLanguage === engCodeLanguage) {
            for (var widgetOption in widgetSettings) {
                if (widgetOption.indexOf('_Options') === -1) {
                    if (widgetSettings.hasOwnProperty(widgetOption + '_Options')) {
                        if (typeof widgetSettings[widgetOption] === "object") {
                            formItems.push({
                                dataField: widgetOption,
                                editorType: "dxTagBox",
                                editorOptions: {
                                    items: widgetSettings[widgetOption + '_Options'],
                                    searchEnabled: true,
                                    value: widgetSettings[widgetOption]
                                },
                            });
                        } else {
                            formItems.push({
                                dataField: widgetOption,
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    items: widgetSettings[widgetOption + '_Options'],
                                    searchEnabled: true,
                                    value: widgetSettings[widgetOption]
                                },
                            });
                            console.log(widgetSettings[widgetOption], widgetSettings[widgetOption + '_Options'])
                        }
                    } else {
                        if (widgetOption === "tooltipDimensions") {
                            formItems.push({
                                dataField: "tooltipDimensions",
                                /*label: {
                                    text: "OLOLOLO"
                                },*/
                                editorType: "dxTagBox",
                                editorOptions: {
                                    items: dimensions,
                                    searchEnabled: true,
                                    showSelectionControls: true,
                                    value: ""
                                },
                            });
                        } else {
                            formItems.push({
                                dataField: widgetOption,
                            });
                        }
                    }
                }

            }
            //}

            //todo реализовать логику с английским defaultCodeLanguage
            if (currentCodeLanguage === defaultCodeLanguage) {
                $.getJSON("/widget-adapter/" + chartType + "/" + brand + "/widgetOptionsRu.json", function (defaultWidgetOptionsRu) {
                    console.log("WidgetOptionsDefault", defaultWidgetOptionsRu);
                    //var columnsRu = [];

                    defaultWidgetOptionsRu.forEach(function (column, index) {
                        var formItemIndex = formItems.findIndex(el => el.dataField === column.dataField);
                        if (formItemIndex !== -1) {
                            console.log("formItemIndex", formItemIndex);
                            console.log("formItem", formItems[formItemIndex]);
                            formItems[formItemIndex].label = {text: column.caption};
                        }

                    })


                    //console.log(columnsRu);
                    console.log(widgetSettings);
                    console.log(formItems);

                    //var itemsAll = [formItems, columnsRu]
                    widgetOptions = $("#chart-settings-form").dxForm({
                        formData: widgetSettings,
                        items: formItems,
                        readOnly: false,
                        showColonAfterLabel: true,
                        labelLocation: "top",
                        minColWidth: 300,
                        colCount: 2,
                    }).dxForm("instance");

                });

            } else {
                widgetOptions = $("#chart-settings-form").dxForm({
                    formData: widgetSettings,
                    items: formItems,
                    readOnly: false,
                    showColonAfterLabel: true,
                    labelLocation: "top",
                    minColWidth: 300,
                    colCount: 2,
                }).dxForm("instance");
            }
        });

        //console.log(itemsAll);
    };


    function initWidgetFormData(analytQueryCode) {
        $.getJSON(IP_TO_ANALYT_QUERY_CORE + '/' + analytQueryCode, function (data) {
            console.log(data);
            timeDimension = data.timeDimensions.dimension;
            timeDimensionGranularity = data.timeDimensions.granularity;
            measures = $("#measures").dxTagBox({
                items: data.measures,
                placeholder: 'Выберите факты',
                showSelectionControls: true,
                //applyValueMode: "useButtons",
                onValueChanged: function (e) {

                },
            }).dxTagBox("instance");
            $(".measures").show();

            dimensions = $("#dimensions").dxSelectBox({
                items: data.dimensions,
                placeholder: 'Выберите измерениe',
            }).dxSelectBox("instance");
            $(".dimensions").show();

            var chartTypes = ['line', 'bar', 'pie', 'grid', 'pivotGrid', 'textData'];
            chartType = $("#select-type").dxSelectBox({
                items: chartTypes,
                onValueChanged: function (e) {
                },
            }).dxSelectBox('instance');
            $(".select-type").show();

            var providers = ['eCharts', 'devExpress', 'comlogic'];
            brand = $("#select-provider").dxSelectBox({
                items: providers,
                onValueChanged: function (e) {
                    initSettingsForm(chartType.option('value'), brand.option('value'), data.dimensions);
                    console.log(chartType.option('value'));
                    console.log(brand.option('value'));
                    console.log(data.dimensions);
                    $(".use-default-settings").show();
                },
            }).dxSelectBox('instance');
            $(".select-provider").show();

            $("#use-default-settings").dxCheckBox({
                value: true,
                onValueChanged: function (e) {
                    if (e.value === false) {
                        $(".chart-settings-form").show();
                    } else {
                        $(".chart-settings-form").removeAttr("style").hide();
                    }
                }
            });
        });
    }

    var getQuery = function () {
        var wo = widgetOptions.option('formData');
        wo.series = measures.option('value');
        wo.customDimension = dimensions.option('value');
        wo.timeDimension = timeDimension;
        wo.timeDimensionGranularity = timeDimensionGranularity;
        var result = {
            "analytQueryID": analytQueryID.option('value'),
            "visualizationID": [
                ""
            ],
            "dashboardID": [
                "dash1", "dash2", "dash3"
            ],
            "userID": [
                "user1", "user2"
            ],
            "tag": [
                "line", "echarts"
            ],
            "widgetText": widgetText.option('value'),
            /*"widgetFrameOptions": {
                "urlSite": ["http://dfadsafsafds", "fsafsafds"],
                "period": "day",
                "date": "10-10-10 10:10:10"
            },*/
            "widgetProperties":
                {
                    "title": title.option('value'),
                    "titleURL": "",
                    "footerTitle": "",
                    "footerURL": "",
                    "width": "120px",
                    "visualizationType": chartType.option('value'),
                    "componentBrand": brand.option('value')
                }
            ,
            "widgetOptions": wo,
        };
        console.log(widgetOptions);
        return result;
    };
    var createWidget = function (query) {
        $.post(IP_WIDGET_CRUD, JSON.stringify(query), function (widgetData) {
            console.log(widgetData);
            widget = widgetData;
            widgetJson = widgetData;
            var src = "/widget-adapter/" + chartType.option('value') + "/" + brand.option('value') + "/?wid=" + widget.id;
            console.log(src);
            var frame = $('<iframe>', {
                src: src,
                id: 'widgetPreview',
                frameborder: 0,
                scrolling: 'yes',
                width: 800,
                height: 800
            });
            $('#frameResult').html(frame);
            $("#widgetCreateResult").html('<h3>Виджет</h3><p><pre>' + JSON.stringify(widgetData, null, 2) + "</pre></p>");
        });
    };
    var updateWidget = function (query) {
        $.ajax({
            type: 'PATCH',
            url: IP_WIDGET_CRUD + "/" + widgetJson.id,
            data: JSON.stringify(query),
            processData: false,
            contentType: 'application/merge-patch+json',
        }).done(function (data) {
            console.log(data);
            widget = data;
            widgetJson = data;
            var src = "/widget-adapter/" + chartType.option('value') + "/" + brand.option('value') + "/?wid=" + widgetJson.id;
            console.log(src);
            var frame = $('<iframe>', {
                src: src,
                id: 'widgetPreview',
                frameborder: 0,
                scrolling: 'yes',
                width: 800,
                height: 800
            });
            $('#frameResult').html(frame);
            $("#widgetCreateResult").html('<h3>Виджет</h3><p><pre>' + JSON.stringify(widgetData, null, 2) + "</pre></p>");
        });

    };
    $("#button").dxButton({

        text: "Сохранить",
        onClick: function () {
            //var widgetSettings = getSettings();
            var query = getQuery();
            console.log(query);
            if (widgetJson !== null) {
                updateWidget(query)
            } else {
                createWidget(query);
            }
        }
    });


});