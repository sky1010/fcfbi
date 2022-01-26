/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

'use strict';

(function ($) {  

    $("[data-bs-target]").click(function(){
        var spa_target = $(this).attr("data-bs-target").replace("#", "");
        app.renderer.toggle('[data-role^=spa]', `[data-role=${spa_target}]`);
    });

    $("[data-tab]").click(function(){
        const tab_target = $(this).attr("data-tab");

        $("[data-tab-target]").addClass("no-display");
        $("[data-tab] .nav-link").removeClass("active");
        $(`[data-tab='${tab_target}'] .nav-link`).addClass("active");
        $(`[data-tab-target='${$(this).attr("data-tab")}']`).removeClass("no-display");

        if($(this)[0].hasAttribute("data-init-spa")){
            let spa_target = $(this).attr("data-spa");
            app.renderer.toggle('[data-role^=spa]', `[data-role=${spa_target}]`); 
        }
    });

    $("[data-role='spa-content-map']").on("spaloaded", function(){
        L.mapbox.accessToken = mapbox_token;
        
        if(map !== null) map.remove();  

        var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
               attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
               tileSize: 512,
               zoomOffset: -1
        });

        map = L.map('map')
          .addLayer(mapboxTiles)
          .setView([51.5, -0.09], 13);

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_building_points'},
            {c: (data) => {
                const buildings = JSON.parse(data);

                if(buildings.data.length != 0){
                    var coords = [];
                    var popup_dom = $("[data-shadow-el='building_marker']").clone().removeClass("no-display");

                    for(let x in buildings.data){

                        var marker = L.marker(
                            [buildings.data[x].Latitude, buildings.data[x].Longitude], 
                            {icon: buildingIcon}
                        ).addTo(map);

                        $(popup_dom).find("[data-role='popup_header']").text(buildings.data[x].BuildingName);
                        $(popup_dom).find("[data-role='popup_link']").attr("data-building", buildings.data[x].UID);

                        marker.bindPopup($(popup_dom)[0].outerHTML);

                        coords.push([buildings.data[x].Latitude, buildings.data[x].Longitude]); 

                    }

                    map.fitBounds(coords, {maxZoom: 16});

                    map.on('popupopen', function() {  
                        $("[data-role='popup_link']").click(function(e){
                            session.setItem("building_in_view", $(this).attr("data-building"));
                            $("[data-bs-target='#spa-content-building_list']").click();
                        });
                    });

                }else{
                    app.page.toast("WARNING", "There is currently no known building, having a location.");
                }
            }}
        );  

    });

    $("[data-role='spa-content-contacts']").on("spaloaded", function(){
        console.log("rendering contacts ...");
    });

    $("[data-role='spa-content-building_list']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_buildings'},
            {c: show_building }
        );  
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

    app.init("site_summary");
    feather.replace();
})(jQuery);