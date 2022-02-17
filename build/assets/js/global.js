/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

const app_name = 'FCFBI';   // holds the application name
const event = new Event('spa_loaded'); // spa loaded event
const mapbox_token = 'pk.eyJ1IjoicmFqZXNzZW4iLCJhIjoiY2t5dWwya2l1MWlkODJ1dGdjd2xsOTdrZSJ9.qyn4CgQZmD-YTzrVcqUzgg';
var spa_loaded = null;

var map = null;
var session = window.sessionStorage;

var buildingIcon = L.icon({
    iconUrl: 'build/assets/res/svg/building_map.png',
    iconSize:     [60, 60],
    iconAnchor:   [22, 60],
    popupAnchor:  [-3, -60] 
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
                "e63946", "f1faee", "a8dadc", "457b9d", "1d3557"
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