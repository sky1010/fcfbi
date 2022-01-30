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
    shadowUrl: 'build/assets/res/svg/building_map_shadow.png',

    iconSize:     [60, 60],
    shadowSize:   [70, 70],
    iconAnchor:   [22, 60],
    shadowAnchor: [4, 50], 
    popupAnchor:  [-3, -60] 
});


/*
    HELPERS
*/
var app = {

    init: function (page_name) {
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

                $("[data-bs-target]").removeClass("active");
                $(`[data-bs-target='#${spa_target}']`).addClass("active");
            }
            
            setTimeout(function(){
                $(ssel).trigger('spaloaded');
                session.setItem('spa_loaded', spa_target);
                spa_loaded = spa_target;
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
        }    
    },

    export: {
        saveBlobFile : function(file_name, file_type, data){
            var file = new Blob([data], {type: file_type});
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, file_name);
            else {
                var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                a.href = url;
                a.download = file_name;
                document.body.appendChild(a);
                a.click();

                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);  
                }, 0); 
            }
        }
    }
}