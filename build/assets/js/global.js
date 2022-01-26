/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

const app_name = 'FCFBI';   // holds the application name
const event = new Event('spa_loaded'); // spa loaded event
const mapbox_token = 'pk.eyJ1IjoicmFqZXNzZW4iLCJhIjoiY2t5dWwya2l1MWlkODJ1dGdjd2xsOTdrZSJ9.qyn4CgQZmD-YTzrVcqUzgg';
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
    },

    renderer: {
        toggle: function(fsel, ssel, affectDOM = true){
            if(affectDOM){
                $(fsel).removeClass("show active");
                $(ssel).addClass("show active");

                let spa_target = $(ssel).attr("data-role");

                $("[data-bs-target]").removeClass("active");
                $(`[data-bs-target='#${spa_target}']`).addClass("active");
            }
            
            setTimeout(function(){
                $(ssel).trigger('spaloaded');
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
    }
}