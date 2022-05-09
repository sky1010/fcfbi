/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

const app_name = 'Le HUB reports';   // holds the application name
const event = new Event('spa_loaded'); // spa loaded event
const mapbox_token = 'pk.eyJ1IjoicmFqZXNzZW4iLCJhIjoiY2wxem0xMjdwMG13MjNibXRiYm9iMmsyayJ9.Is72kssHSZMyoNgxXOVDpw';
var spa_loaded = null;

var map = null;
var map_building = null;
var session = window.sessionStorage;

var buildingIcon = L.icon({
    iconUrl: 'build/assets/res/svg/building_map.png',
    iconSize:     [40, 40],
    iconAnchor:   [2, 40],
    popupAnchor:  [18, -20] 
});


/*
    HELPERS
*/
var app = {

    init: function (page_name) {
        session.clear();
        $("[data-select]").niceSelect();

        $("[data-role='app_name']").text(app_name);
        $(`[data-tab='${page_name}']`).click();

        var d = new Date();
        $("footer").text(`${d.getFullYear()} © ${app_name}`);

        interact('.dropzone').dropzone({
            accept: '.col-items',
            overlap: 0.75,
            ondragenter: function (event) {
                var draggableElement = event.relatedTarget
                var dropzoneElement = event.target

                // feedback the possibility of a drop
                var clone = $(draggableElement).clone().removeAttr("style");
                $(dropzoneElement).append(clone);
                $(draggableElement).remove();
            },
            ondropdeactivate: function (event) {
                $(event.relatedTarget).removeAttr("style");
            }
        })

        interact('.drag-drop')
            .draggable({
            inertia: true,
            modifiers: [
              interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
              })
            ],
            autoScroll: true,
            // dragMoveListener from the dragging demo above
            listeners: { move: (event) => {
                var target = event.target;
                var target_bounds = $(target)[0].getBoundingClientRect();

                var x = (event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) - (target_bounds.width / 2);
                var y = (event.clientY + document.body.scrollTop + document.documentElement.scrollTop) - (target_bounds.height / 2);

                $(target).css({position: "absolute", left: `${x}px`, top: `${y}px`}); 

                // update the posiion attributes
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
            }}
        })

        session.setItem("page_theme", "dark_mode");
    },

    renderer: {
        toggle: function(fsel, ssel, affectDOM = true){
            let spa_target = $(ssel).attr("data-role");

            if(affectDOM){
                $(fsel).removeClass("show active");
                $(ssel).addClass("show active");

                $("[data-spa-page]").removeClass("active");
                $(`[data-spa-page='${spa_target}']`).addClass("active");
            }
            
            setTimeout(function(){
                $(ssel).trigger('spaloaded');
                session.setItem('spa_loaded', spa_target);
                spa_loaded = spa_target;
                
                if(spa_loaded == "spa-content-map"){
                    $("footer").css("position", "static");
                }else{
                    $("footer").css("position", "fixed");
                }
            }, 0);
        }
    },

    protocol: {
        ajax: function (url, data, parameters, type = 'GET'){
            $.ajax({ url: url, data: data, type: type})
            .done(function(data){
                if(parameters.hasOwnProperty('o'))
                    parameters.c(data, ...parameters.o);
                else{
                    parameters.c(data);
                }
            });
        }
    },

    page: {
        toast: function (type, message) {
            $("[role='alert']").removeAttr("class").addClass("alert alert-pos");

            var alert_class = "alert-primary";
            switch(type){
                case "ERR":
                    alert_class = "alert-danger";
                    break;
                case "SUCCESS":
                    alert_class = "alert-success";
                    break;
                case "WARNING":
                    alert_class = "alert-warning";
                    break;
                case "INFO":
                    alert_class = "alert-info";
                    break;
                default:
                    throw "Unknown alert type";
            }

            $("[role='alert']").addClass(alert_class).text(message);
            $("[role='alert']").fadeIn(500,"swing",() => {
                setTimeout(() => {
                    $("[role='alert']").fadeOut(500, "swing");
                }, 5000);
            });
        },

        onrendered: function (callback) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(callback)
                }, 0);
            });
        },

        fillColors: function(amount){
            const colors = [
                "f94144", "f3722c", "f8961e", "f9844a", "f9c74f", "90be6d", "43aa8b", "4d908e", "577590", "277da1", "cb997e", "ddbea9", "ffe8d6", "b7b7a4", 
                "a5a58d", "6b705c", "0a9396", "94d2bd", "e9d8a6", "ee9b00", "ca6702", "bb3e03", "ae2012", "9b2226", "2a9d8f", "e9c46a", "f4a261", "e76f51", 
                "e63946", "f1faee", "a8dadc", "457b9d", "1d3557", "00b4d8", "99d98c", "ccd5ae", "f9844a", "e63946","f1faee","a8dadc","457b9d","1d3557","001219",
                "005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226","03071e","370617","6a040f","9d0208","d00000","dc2f02","e85d04",
                "f48c06","faa307","ffba08","d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77","f94144","f3722c","f8961e",
                "f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"
            ];

            var palette = [];
            for(let x = 0; x < amount; x++)
                palette.push(`#${colors[x]}`);

            return palette;
        },

        exportCanvas: function(canvas){
            $(canvas)[0].toBlob(function(blob) {
                var img = document.createElement('img'),
                url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;

                a.download = 'image.jpeg';
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                $(a).remove();
            });
        },

        renderVoidChart: function(chart_id, hide_root = false){

            var cloned_dom = $("[data-shadow-el='empty-chart']").clone();
            $(`#${chart_id}`).parent().parent().find('[data-shadow-el]').each(function(i, e){
                $(e).remove();
            });

            if(hide_root){

                var chart_title = {
                    number_intervention: 'Intervention by date',
                    number_intervention_by_nature: 'Intervention by nature',
                    number_intervention_by_category: 'Intervention by category',
                    number_intervention_by_state: 'Intervention by status',
                    number_intervention_by_priority: 'Intervention by priority',
                    number_intervention_by_service_provider: 'Intervention by service provider',
                    asset_chart: 'Asset summary chart',
                    work_priority: 'Live work orders',
                    work_type: 'Overdue work orders',
                    finance_chart: 'Finance summary chart',
                    contractor_chart: 'Contractor summary chart'
                };

                $(`#${chart_id}`).parent().addClass('no-display');
                $(cloned_dom).removeClass('no-display');
                $(cloned_dom).attr("data-shadow-el", chart_id);

                $(cloned_dom).find("[data-header='empty_header']").text(`${chart_title[chart_id]} ( empty chart )`);
                $(`#${chart_id}`).parent().parent().append(cloned_dom);

            }else{

                $(`[data-shadow-el='${chart_id}']`).remove();
                $(`#${chart_id}`).parent().removeClass('no-display');

            }

        },

        renderChartPreloader: function(chart_id){

            var chart_title = {
                number_intervention: 'Intervention by date',
                number_intervention_by_nature: 'Intervention by nature',
                number_intervention_by_category: 'Intervention by category',
                number_intervention_by_state: 'Intervention by status',
                number_intervention_by_priority: 'Intervention by priority',
                number_intervention_by_service_provider: 'Intervention by service provider',
                asset_chart: 'Asset summary chart',
                work_priority: 'Live work orders',
                work_type: 'Overdue work orders',
                finance_chart: 'Finance summary chart',
                contractor_chart: 'Contractor summary chart'
            };

            //unload all instance of a data-shadow-el
            $(`#${chart_id}`).parent().parent().find('[data-shadow-el]').each(function(i, e){
                $(e).remove();
            });

            var cloned_dom = $("[data-shadow-el='chart-preloader']").clone();

            $(`#${chart_id}`).parent().addClass('no-display');
            $(cloned_dom).removeClass('no-display');
            $(cloned_dom).attr("data-shadow-el", chart_id);

            $(cloned_dom).find("[data-header]").text(`${chart_title[chart_id]}`);
            $(`#${chart_id}`).parent().parent().append(cloned_dom);
        },

        unloadChartPreloader: function(chart_id){
            //unload all instance of a data-shadow-el
            $(`#${chart_id}`).parent().parent().find('[data-shadow-el]').each(function(i, e){
                $(e).remove();
            });

            $(`#${chart_id}`).parent().removeClass('no-display');
        },

        render_datemask_field: function(cb){
            const date_format = [
                {name: null, mask: "iso_date"}, 
                {name: null, mask: "short_date"}, 
                {name: null, mask: "long_date"}, 
                {name: null, mask: 'dd-mm-yyyy'}, 
                {name: null, mask: 'dd/mm/yyyy'}
            ];

            for(let x in date_format){
                switch (date_format[x].mask){
                    case 'iso_date':
                        app.page.format_date(null, (data) => {
                            date_format[x].name = `${data.year}-${data.month}-${data.date}`
                        });
                        break;
                    case 'short_date':
                        app.page.format_date(null, (data) => {
                            date_format[x].name = `${data.month}-${data.date}-${data.year}`
                        });
                        break;
                    case 'long_date':
                        app.page.format_date(null, (data) => {
                            date_format[x].name = `${data.month_full} ${data.date} ${data.year}`
                        });
                        break;
                    case 'dd-mm-yyyy':
                        app.page.format_date(null, (data) => {
                            date_format[x].name = `${data.date}-${data.month}-${data.year}`
                        });
                        break;
                    case 'dd/mm/yyyy':
                        app.page.format_date(null, (data) => {
                            date_format[x].name = `${data.date}/${data.month}/${data.year}`
                        });
                        break;
                    default:
                        throw new Error('Undefined date format');
                }
            }

            return cb(date_format);
        },

        format_date: function (d, callback) {
            var date = new Date();

            if(d !== null)
                date.setTime(typeof d != 'int'?d:Date.parse(d));
            
            const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            callback ({
                min: (date.getMinutes() >= 10)?date.getMinutes():("0" + date.getMinutes()),
                hours: (date.getHours() >= 10)?date.getHours():("0" +date.getHours()),
                second: (date.getSeconds() >= 10)?date.getSeconds():("0" +date.getSeconds()),
                meridian: (date.getHours() >= 12)?"PM":"AM",
                month: ((date.getMonth() + 1) > 10)?(date.getMonth() + 1):("0"+(date.getMonth() + 1)),
                month_full: month[date.getMonth()],
                date: (date.getDate() > 10)?date.getDate():("0" + date.getDate()),
                year: date.getFullYear()
            });
        },

        pretty_print_digit: function(nStr){
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        gen_map: function(map_el, cb){
            L.mapbox.accessToken = mapbox_token;
            
            if(map !== null) map.remove();

            var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
                   attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                   tileSize: 512,
                   zoomOffset: -1
            });
            
            map = L.map(map_el)
                .addLayer(mapboxTiles)
                .setView([46.2276, 2.2137], 6);

            cb(map);    
        }
    },

    export: {
        saveBlobFile : function(file_name, file_type, data){
            return new Promise((resolve, reject) => {
                app.protocol.ajax(
                    (['pdf', 'xlsx'].includes(file_type)?'build/report_generator.php':'build/bridge.php'),
                    { request_type: 'upload_file', file_name: file_name, file_type: file_type, file_data: data},
                    {c: (data) => {
                        resolve(data);
                    }},
                    'POST'
                );
            }); 
        }
    }
}