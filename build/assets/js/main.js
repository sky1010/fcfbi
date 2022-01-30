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

        // generate the building table
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_contacts'},
            {c: show_contacts }
        );  

        // generate the left filters
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_contacts_sidebar_dataset'},
            {c: show_contacts_sidebar_dataset}
        )
    });


    $("[data-role='spa-content-building_list']").on("spaloaded", function(){

        // generate the building table
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_buildings'},
            {c: show_building }
        );  

        // generate the left filters
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_buildings_sidebar_dataset'},
            {c: show_buildings_sidebar_dataset}
        )
    });


    $("[data-role='spa-content-contracts']").on("spaloaded", function(){
        // generate the contracts table
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_contracts'},
            {c: show_contracts }
        );  

        // generate the left filters
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_contracts_sidebar_dataset'},
            {c: show_contracts_sidebar_dataset}
        )
    });

    $("[data-role='spa-content-floor_plans']").on("spaloaded", function(){
        // generate the floor_plans table
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_floor_plans'},
            {c: show_floor_plans }
        );  

        // generate the left filters
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_floor_plans_sidebar_dataset'},
            {c: show_floor_plans_sidebar_dataset}
        )
    });

    $("[data-role='spa-content-images']").on("spaloaded", function(){
        // TODO pre processsing
    });

    $("[data-role='spa-content-summary']").on("spaloaded", function(){
        // TODO pre processsing
    });

    $("[data-role='spa-content-asset_list']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_asset_list'},
            {c: show_asset_list }
        );  

        // generate the left filters
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_asset_list_sidebar_dataset'},
            {c: show_asset_list_sidebar_dataset}
        )
    });

    $("[data-sidebar-collapse-target]").click(function(){
        $(this).data("collapse", !!!$(this).data("collapse"));
        const collapse_state = $(this).data("collapse");

        if(collapse_state){
            $(`[data-sidebar-collapse=${$(this).attr('data-sidebar-collapse-target')}]`).addClass("csx-sidebar-collapse");
            $(this).find("svg").addClass("rotate");
            $(this).addClass("mv-el");
        }else{
            $(`[data-sidebar-collapse=${$(this).attr('data-sidebar-collapse-target')}]`).removeClass("csx-sidebar-collapse");
            $(this).find("svg").removeClass("rotate");
            $(this).removeClass("mv-el");
        }
    });

    $("[data-role='show_columns']").click(function(){
        const target_table = $(this).attr("data-table");
        $(this).data("collapse", !!!$(this).data("collapse"));
        const collapse_state = $(this).data("collapse");

        if(collapse_state){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_column_name', table: target_table},
                {c: (data) => {
                     console.log(target_table);
                    show_columns(`[data-role='${spa_loaded}'] [data-drop-col]`, data)
                    $(`[data-role='${spa_loaded}'] [data-column-form]`).removeClass("no-display");
                }}
            ); 
        }else{
            $(`[data-role='${spa_loaded}'] [data-column-form]`).addClass("no-display");
        } 
    });

    $("[data-column-form-role='cancel']").click(function(e){
        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });

    $("[data-column-form-role='restore']").click(function(e){
        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone`).children().each(function(index, el){
            var clone = $(el).clone();
            $(`[data-role='${spa_loaded}'] [data-column-form] [data-drop-col]`).append(clone);
            $(el).remove();
        });
    });

    $("[data-role='spa-content-building_list'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        if(filter.length > 0){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
                {c: show_building}
            ); 

            $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
        }
    });

    $("[data-role='spa-content-contacts'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        if(filter.length > 0){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
                {c: show_contacts}
            ); 

            $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
        }
    });

        $("[data-role='spa-content-contracts'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        if(filter.length > 0){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
                {c: show_contracts}
            ); 

            $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
        }
    });

        $("[data-role='spa-content-floor_plans'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        if(filter.length > 0){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
                {c: show_floor_plans}
            ); 

            $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
        }
    });


        $("[data-role='spa-content-asset_list'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        if(filter.length > 0){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
                {c: show_asset_list}
            ); 

            $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
        }
    });      
      


    // $("[data-target-collapse]").click();

    app.init("site_summary");
    feather.replace();
})(jQuery);