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
