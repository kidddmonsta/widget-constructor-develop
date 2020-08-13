DevExpress.localization.loadMessages({
    "ru": {
        "string1": "Выберите измерения...",
        "string2": "Введите операнд...",
        "string3": "Введите значение...",
        "analytQueryName": "Название аналитического запроса",
        "selectIndicator": "Выберите индикатор",
        "measures": "Выберите меры",
        "dimensions": "Выберите измерения",
        "timeStart": "Выберите дату начала",
        "timeFinish": "Выберите дату окончания",
        "granularity": "Выберите гранулярность",
        "preFilters": "Выберите префильтры",
        "filters": "Выберите фильтры"
    },
    "en": {
        "string1": "Choose value...",
        "string2": "Type operand...",
        "string3": "Type search value...",
        "analytQueryName": "Analytic query name",
        "selectIndicator": "Select indicator",
        "measures": "Select measures",
        "dimensions": "Select dimensions",
        "timeStart": "Select period start",
        "timeFinish": "Select period finish",
        "granularity": "Select granularity",
        "preFilters": "Select prefilters",
        "filters": "Select filters"
    }
});

//DevExpress.localization.locale("ru");
console.log(DevExpress.localization.formatMessage("string1"));

analytQueryName = DevExpress.localization.formatMessage("analytQueryName")
