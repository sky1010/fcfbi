/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

'use strict';

(function ($) {  

    $("[data-spa-page]").click(function(){
        var spa_target = $(this).attr("data-spa-page");
        app.renderer.toggle('[data-role^=spa]', `[data-role=${spa_target}]`);
    });

    $("[data-tab]").click(function(){
        const tab_target = $(this).attr("data-tab");

        $("[data-tab-target]").addClass("no-display");
        $("[data-tab-target] .nav-link").removeClass("active");
        $("[data-tab] .nav-link").removeClass("active");
        $(`[data-tab="${tab_target}"] .nav-link`).addClass("active");

        $(`[data-tab-target='${tab_target}']`).removeClass("no-display");

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
          .setView([46.2276, 2.2137], 6);

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

                        $(popup_dom).find("[data-role='popup_header']").html(`${buildings.data[x].BuildingName} 
                            <br> <p>Latitude: ${buildings.data[x].Longitude}</p><p>Longitude: ${buildings.data[x].Latitude}</p>`);
                        $(popup_dom).find("[data-role='popup_link']").attr("data-building", buildings.data[x].UID);

                        marker.bindPopup($(popup_dom)[0].outerHTML);

                        coords.push([buildings.data[x].Latitude, buildings.data[x].Longitude]); 

                    }

                    map.fitBounds(coords, {maxZoom: 6});

                    map.on('popupopen', function() {  
                        $("[data-role='popup_link']").click(function(e){
                            session.setItem("building_in_view", $(this).attr("data-building"));
                            $("[data-spa-page='spa-content-building_list']").click();
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
        var building_id = session.getItem("building_in_view");

        if(building_id === null){
            $("[data-role='building_edit']").addClass("no-display");
            $("[data-role='building_form']").removeClass("no-display");

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
        }else{
            $("[data-role='building_edit']").removeClass("no-display");
            $("[data-role='building_form']").addClass("no-display");
            $("#building-edit").click();

            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_building_by_uid', building_id: building_id},
                {c: fill_form_building}
            )
        }
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
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_asset_summary'},
            {c: (data) => {
                if(ref_chart['asset_chart'] == undefined)
                    chart_.gen_chart_asset_summary(data);
                else{
                    ref_chart['asset_chart'].destroy();
                    ref_chart['asset_chart'] = undefined;
                    chart_.gen_chart_asset_summary(data);
                }
            }}
        );   
    });

    $("[data-role='spa-building_edit']").on("spaloaded", function(){
        console.log("....");
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

    $("[data-role='spa-content-site']").on("spaloaded", function(){
        var building_id = session.getItem("site_in_view");
        
        app.page.onrendered().then(() => {
            $("#filter_site_summary").click();
        });

        app.page.onrendered().then(() => {
            var selects_col = [];

            $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
                selects_col.push($(el).attr("data-select"));
            });

            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_col_grp', fields: JSON.stringify(selects_col), table: 'buildings'},
                {c: fillSelect}
            )  
        });

    });

    $("[data-role='spa-content-work_order']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_work_order'},
            {c: show_work_order }
        );  

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_work_priority'},
            {c: (data) => {
                if(ref_chart['work_priority'] == undefined)
                    chart_.gen_chart_priority(data);
                else{
                    ref_chart['work_priority'].destroy();
                    ref_chart['work_priority'] = undefined;
                    chart_.gen_chart_priority(data);
                }
            }}
        ); 

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_work_type'},
            {c: (data) => {
                if(ref_chart['work_type'] == undefined)
                    chart_.gen_chart_work_type(data);
                else{
                    ref_chart['work_type'].destroy();
                    ref_chart['work_type'] = undefined;
                    chart_.gen_chart_work_type(data);
                }
            }}
        );         
    });

    $("[data-role='spa-setting']").on("spaloaded", function(){
        $("[data-select='lang']").niceSelect();
    });

    $("[data-role='spa-report']").on("spaloaded", function(){
        $("[data-select='report_style']").niceSelect();
        $("[data-select='report_graph']").niceSelect();
    });

    $("[data-role='spa-finance']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_finance'},
            {c: (data) => {
                if(ref_chart['finance_chart'] == undefined)
                    chart_.gen_chart_finance(data);
                else{
                    ref_chart['finance_chart'].destroy();
                    ref_chart['finance_chart'] = undefined;
                    chart_.gen_chart_finance(data);
                }
            }}
        );   
    });


    $("[data-role='spa-contractor']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_contractor'},
            {c: (data) => {
                if(ref_chart['contractor_chart'] == undefined)
                    chart_.gen_chart_contractor_chart(data);
                else{
                    ref_chart['contractor_chart'].destroy();
                    ref_chart['contractor_chart'] = undefined;
                    chart_.gen_chart_contractor_chart(data);
                }
            }}
        );   
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

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_building}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });

    $("[data-role='spa-content-contacts'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_contacts}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });

    $("[data-role='spa-content-contracts'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_contracts}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });

    $("[data-role='spa-content-floor_plans'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_floor_plans}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });


    $("[data-role='spa-content-asset_list'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_asset_list}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });      
      
    $("[data-role='spa-content-work_order'] [data-column-form-role='apply']").click(function(e){
        var filter = [];
        const target_table = $(this).attr("data-table");

        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: show_work_order}
        ); 

        $(`[data-role='${spa_loaded}'] [data-role='show_columns']`).click();
    });   

    $(`[data-role='export_list_type']`).click(function(){
        $(this).data("collapse", !!!$(this).data("collapse"));
        const collapse_state = $(this).data("collapse");

        if(collapse_state){
            $(this).parent().find(".dropdown-menu").css("display", "block");
        }else{
            $(this).parent().find(".dropdown-menu").css("display", "none");
        }   
    })
    
    /***********************************************************
     * Function: Export
     * Usage: As per the table, each export are handle via 
     * app.export.saveBlobFile app.protocol.ajax
     * *********************************************************/
    $("[data-export]").click(function(){
        // Get the related table associated with the export
        // Get all the filters done by column sorting
        // Send an ajax requrest via 
        const target_table = $(this).parent().attr("data-table");
        var filter = [];
        $(`[data-role='${spa_loaded}'] [data-column-form] .dropzone [data-filter-by-columns]`).each(function (index, el) {
            filter.push($(this).attr("data-filter-by-columns"));
        });

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'filter_by_column_name', filters: JSON.stringify(filter), table: target_table},
            {c: (data) => {
                // Post processing response received from API bridge
                const dataset = JSON.stringify(JSON.parse(data).data);
                app.export.saveBlobFile(target_table, $(this).attr("data-export"), dataset).then((data_arg) => {
                    const parse = JSON.parse(data_arg);
                    var a = document.createElement("a");
                    $(a).attr("href", parse.path);
                    $(a).attr("download", parse.file_name);
                    document.body.appendChild(a);
                    a.click();
                });
            }}
        ); 

        $(`[data-role='export_list_type']`).click();
    });

    /***********************************************************
     * Add all code outside spaonloaded in this promise, as some
     * variable may not yet be available ( SPA rendering )
     * *********************************************************/
    app.page.onrendered().then(() => {

        $(window).scroll(function(event) {
            if(spa_loaded !== "spa-content-map"){
                var scroll = $(window).scrollTop(); 
                if(scroll > 10){ 
                    $("footer").removeClass("d-flex").css("display", "none");
                }else{
                    $("footer").css({"display": "flex", "position": "fixed"});
                }
            }else if(spa_loaded == "spa-content-map"){
                $("footer").css("position", "static");
            }
        });

    });

    $("[data-role='back-building-edit']").click(function () {
        session.removeItem("building_in_view");
        $("[data-spa-page='spa-content-building_list']").click();
    });

    /**********************************************************
     * Register the event apply filters with respect to select
     * values
     * SPA: spa-content-site
     * ********************************************************/
    $("#filter_site_summary").click(function(){
        var select_val = {}
        var building_id = session.getItem("site_in_view");

        $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
            const el_val = $(el).val();

            if(el_val != "-1")
                select_val[$(el).attr("data-select")] = el_val;
        });   

        if(building_id === null){
            select_val = {BuildingName: 'CITYFM LAKANAL'};
        }

        if(Object.keys(select_val).length > 0){
            console.log({ request_type: 'get_col_values', filters: JSON.stringify(select_val), table: 'buildings'});
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_col_values', filters: JSON.stringify(select_val), table: 'buildings'},
                {c: (data) => {
                    show_site_summary(data);
                }}
            );
        }else{
            $("#site_dataset_warning").removeClass("no-display");
            $("#site_dataset").addClass("no-display");
        }
    });

    $("[data-canvas]").click(function(){
        app.page.exportCanvas($(`#${$(this).attr("data-canvas")}`));
    });

    $("#map-edit-form").click(function(){
        var serialize_form = $("#map_edit_inputs").serialize();

        const urlParams = new URLSearchParams(serialize_form);
        const params = Object.fromEntries(urlParams);

        params.UID = session.getItem("building_in_view");
        params.request_type = 'update_map';

        app.protocol.ajax(
            'build/bridge.php',
            params,
            {c: (data) => {
                app.page.toast("SUCCESS", "The map has data has been succesfully updated !");
            }}
        );
    });

    app.init("site_summary");
    feather.replace();
})(jQuery);