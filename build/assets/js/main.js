/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

'use strict';

(function ($) {  
    /*
        Application superglobal / constant
    */
    const app_name = 'FCFBI';   // holds the application name
    const event = new Event('spa_loaded'); // spa loaded event

    /*
        HELPERS
    */
    var app = {
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

        init: function (page_name) {
            $("[data-role='app_name']").text(app_name);
            app.renderer.toggle('[data-role^=spa]', `[data-role=${page_name}]`); 
        }
    }

    app.init("spa-content-map");

    $("[data-bs-target]").click(function(){
        var spa_target = $(this).attr("data-bs-target").replace("#", "");
        app.renderer.toggle('[data-role^=spa]', `[data-role=${spa_target}]`);
    });

    $("[data-role='spa-content-map']").on("spaloaded", function(){
        console.log("rendering map ...");
    });

    $("[data-role='spa-content-contacts']").on("spaloaded", function(){
        console.log("rendering contacts ...");
    });

    $("[data-role='spa-content-building_list']").on("spaloaded", function(){
        console.log("rendering building ...");
    });


    $("[data-role='spa-content-contracts']").on("spaloaded", function(){
        // TODO pre processsing
    });


    $("[data-role='spa-content-floor_plans']").on("spaloaded", function(){
        // TODO pre processsing
    });

    $("[data-role='spa-content-images']").on("spaloaded", function(){
        // TODO pre processsing
    });

    feather.replace();
})(jQuery);