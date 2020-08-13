$(function () {
    DevExpress.localization.locale(navigator.language);

    var table = $("#list-table");
    var redirect = function (url) {
        location.href = url;
    };
    var addCell = function (tr, cellElement) {
        tr.append("<td>");
        tr.append(cellElement);
        tr.append("</td>");
    };

    function compare(a, b) {
        const codeA = a.widgetProperties.title.toUpperCase();
        const codeB = b.widgetProperties.title.toUpperCase();

        let comparison = 0;
        if (codeA > codeB) {
            comparison = 1;
        } else if (codeA < codeB) {
            comparison = -1;
        }
        return comparison;
    }

    $.getJSON(IP_WIDGET_CORE + '?limit=1000', function (list) {
        console.log(list);
        list.items.sort(compare).forEach(function (value, index) {
            if (value.widgetProperties.title !== "") {
                var removeButton = $("<div />").attr("class", "remove").dxButton({
                    text: "Удалить",
                    onClick: function (e) {
                        console.log(value.id);
                        $.ajax({
                            type: 'DELETE',
                            url: IP_WIDGET_CORE + "/" + value.id,
                            processData: false,
                        }).done(function (data) {
                            alert("Delete success");
                            window.location.reload()
                        });
                    }
                });
                var cloneButton = $("<div />").attr("class", "clone").dxButton({
                    text: "Создать копию",
                    onClick: function (e) {
                        console.log(value.id);
                        $.ajax({
                            type: 'POST',
                            url: IP_WIDGET_CORE + "/" + value.id + '/clone',
                            processData: false,
                        }).done(function (data) {
                            alert("Clone created");
                            window.location.reload()
                        });
                    }
                });
                var editButton = $("<div />").attr("class", "edit").dxButton({
                    text: "Редактировать",
                    onClick: function (e) {
                        redirect('/widget-constructor/edit/?wid=' + value.id)
                    }
                });
                var viewButton = $("<div />").attr("class", "view").dxButton({
                    text: "Просмотр",
                    onClick: function (e) {
                        redirect('/widget-adapter/' + value.widgetProperties.visualizationType + '/' + value.widgetProperties.componentBrand + '/?wid=' + value.id)
                    }
                });
                var isVisible = !value.isVisible;
                var query = {
                    "isVisible": isVisible,
                }
                var hideButton = $("<div />").attr("class", "hide").dxButton({
                    text: value.isVisible == true ? "Скрыть" : "Показать",
                    onClick: function (e) {
                        $.ajax({
                            type: 'PATCH',
                            url: IP_WIDGET_CORE + "/" + value.id,
                            data: JSON.stringify(query),
                            processData: false,
                            contentType: 'application/merge-patch+json',
                        }).done(function (data) {
                            console.log(data);
                            window.location.reload();
                        });
                    }
                });
                if (isVisible) {
                    var tr = $("<tr />").attr("class", "hidden");
                } else {
                    var tr = $("<tr />");
                }

                addCell(tr, "<span class='title'>" + value.widgetProperties.title + "</span>");
                addCell(tr, viewButton);
                addCell(tr, editButton);
                addCell(tr, cloneButton);
                addCell(tr, hideButton);
                addCell(tr, removeButton);
                table.append(tr);

            }
        });
        $("#showAll").dxButton({
            text: "Показать все",
            onClick: function (e) {
                $(".hidden").removeClass("hidden");
            }
        });
    });
});
