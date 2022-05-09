/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/

'use strict';

(function ($) {  

    var myDropzone = null;
    var dz_options= {

          autoProcessQueue: false,
          uploadMultiple: true,
          parallelUploads: 100,
          maxFiles: 1,

          init: function() {
            myDropzone = this;

            $("[data-role='upload_image']").click(function(e) {
              // Make sure that the form isn't actually being sent.
              e.preventDefault();
              e.stopPropagation();
              myDropzone.processQueue();
            });

            this.on("sendingmultiple", function() {
              // Gets triggered when the form is actually being sent.
              // Hide the success button or the complete form.
            });
            this.on("successmultiple", function(files, response) {
                console.log(response);
                $("#back_image").click();
                app.page.toast("SUCCESS", "Image uploaded successfully");

                app.protocol.ajax(
                    'build/bridge.php',
                    { request_type: 'get_bimage'},
                    {c: fill_bimage}
                );   
            });
            this.on("errormultiple", function(files, response) {});

            this.on("maxfilesexceeded", function(file){
                myDropzone.removeFile(file);
            });
          }
         
    }

    var file_dz = new Dropzone("#file_src_scid", dz_options);

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
        app.page.gen_map('map', (map) => {
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
                                [buildings.data[x].VixenPPM, buildings.data[x].VixenReactive], 
                                {icon: buildingIcon}
                            ).addTo(map);

                            $(popup_dom).find("[data-role='popup_header']").html(`${buildings.data[x].BuildingName} <br> ${buildings.data[x].Client}`);
                            $(popup_dom).find("[data-role='popup_link']").attr("data-building", buildings.data[x].UID);

                            marker.bindPopup($(popup_dom)[0].outerHTML);

                            if(buildings.data[x].VixenReactive != '' && buildings.data[x].VixenPPM !== '')
                                coords.push([buildings.data[x].VixenPPM, buildings.data[x].VixenReactive]); 

                        }

                        map.fitBounds(coords, {maxZoom: 10});

                        map.on('popupopen', function() {  
                            $("[data-role='popup_link']").click(function(e){
                                session.setItem("building_in_view", $(this).attr("data-building"));
                                $("[data-spa-page='spa-content-summary-building']").click();
                                $("[data-spa-page='spa-content-summary-building']").parent().removeClass("no-display");
                            });
                        });

                    }else{
                        app.page.toast("WARNING", "There is currently no known building, having a location.");
                    }
                }}
            );

            app.page.onrendered().then(() => {
                var selects_col = [];

                $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
                    selects_col.push($(el).attr("data-select"));
                });
                
                app.protocol.ajax(
                    'build/bridge.php',
                    { request_type: 'get_col_grp', fields: JSON.stringify(selects_col), table: 'TabsBuildings'},
                    {c: (data) => {
                        fillSelect(data);
                        $("#filter_site_summary_map").click();
                    }}
                )  
            });  

        });
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
    });

    $("[data-role='spa-content-summary-building']").on("spaloaded", function(){
        if(map_building !== null) map_building.remove();

        var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
               attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
               tileSize: 512,
               zoomOffset: -1
        });

        map_building = L.map('map_sm')
            .addLayer(mapboxTiles)
            .setView([46.2276, 2.2137], 6);

        const building_id = session.getItem('building_in_view');    

        if(building_id != null || building_id != undefined){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'building_summary', building_id: building_id},
                {c: fill_building_summary }
            );    
        }
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
        $("#back_image").click();

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_building_uid'},
            {c: fillUIDSelect}
        ); 

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_bimage'},
            {c: fill_bimage}
        );   
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

        // generate the left filters [DEPRECATED]
        // app.protocol.ajax(
        //     'build/bridge.php',
        //     { request_type: 'get_asset_list_sidebar_dataset'},
        //     {c: show_asset_list_sidebar_dataset}
        // )
    });

    $("[data-role='spa-content-site']").on("spaloaded", function(){
        var building_id = session.getItem("site_in_view");
       
        app.page.onrendered().then(() => {
            var selects_col = [];

            $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
                selects_col.push($(el).attr("data-select"));
            });
            
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_col_grp', fields: JSON.stringify(selects_col), table: 'TabsBuildings'},
                {c: (data) => {
                    fillSelect(data);
                    $("#filter_site_summary").click();
                }}
            )  
        });

        $('[data-toggle="tooltip"]').tooltip();
    });

    $("[data-role='spa-content-work_order']").on("spaloaded", function(){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_work_order'},
            {c: show_work_order }
        );  

        // app.protocol.ajax(
        //     'build/bridge.php',
        //     { request_type: 'get_work_orders'},
        //     {c: (data) => {
        //         if(ref_chart['work_orders'] == undefined)
        //             chart_.gen_chart_work_orders(data);
        //         else{
        //             ref_chart['work_orders'].destroy();
        //             ref_chart['work_orders'] = undefined;
        //             chart_.gen_chart_work_orders(data);
        //         }
        //     }}
        // ); 

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
        $("[data-select='column_format']").niceSelect();
    });

    $("[data-select='column_format']").change(function(){
        const sel_val = $(this).val();

        if(sel_val !== -1){
            if(sel_val == 'report_card'){
                var dataset = {data: []};
                var temp = [];

                $("[data-report-header]").each(function(i, e){
                    temp.push($(e).attr("data-report-header"));
                });

                var set = new Set(temp);
                for(let x in [...set])
                    dataset.data.push({COLUMN_NAME: temp[x]});
                
                fill_form_fields(JSON.stringify(dataset), sel_val)
            }else{
                app.protocol.ajax(
                    'build/bridge.php',
                    { request_type: 'get_column_name', table: sel_val},
                    {c: (data) => {fill_form_fields(data, sel_val)}}
                )
            }
        }
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
                console.log(data);
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
        const attr = $(this).attr("data-sidebar-collapse-target");

        if(collapse_state){
            $(`[data-sidebar-collapse=${$(this).attr('data-sidebar-collapse-target')}]`).addClass("csx-sidebar-collapse");
            $(this).find("svg").addClass("rotate");
            $(this).addClass("mv-el");
            $(`[data-sidebar-collapse='${attr}']`).addClass("no-display");
            $(`[data-main-collapse='${attr}']`).removeClass("col-lg-10").addClass("col-lg-12");
        }else{
            $(`[data-sidebar-collapse=${$(this).attr('data-sidebar-collapse-target')}]`).removeClass("csx-sidebar-collapse");
            $(this).find("svg").removeClass("rotate");
            $(this).removeClass("mv-el");
            $(`[data-sidebar-collapse='${attr}']`).removeClass("no-display");
            $(`[data-main-collapse='${attr}']`).removeClass("col-lg-12").addClass("col-lg-10");
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

    $("[data-role='back-building-edit']").click(function () {
        session.removeItem("building_in_view");
        $("[data-spa-page='spa-content-building_list']").click();
    });

    /**********************************************************
     * Register the event apply filters with respect to select
     * values
     * SPA: spa-content-site
     * ********************************************************/
    $("#filter_site_summary").parent().click(function(){
        var select_val = {}
        var building_id = session.getItem("site_in_view");

        $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
            const el_val = $(el).val();

            if(el_val != "-1" && el_val !== null)
                select_val[$(el).attr("data-select")] = el_val;
        });

        if(Object.keys(select_val).length === 0){
            select_val = {'tc.Client' : $(`[data-role='${spa_loaded}'] [data-select='tc.Client'] option:nth-child(3)`).text().trim()};
        }

        if(Object.keys(select_val).length > 0){
            // app.protocol.ajax(
            //     'build/bridge.php',
            //     { request_type: 'get_col_values', filters: JSON.stringify(select_val), table: 'TabsBuildings', 
            //     date_begin: $('#begin_date').val(), date_end: $('#end_date').val()},
            //     {c: show_site_summary}
            // );

            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_col_json', table: 'report_card'},
                {c: (data) => {
                    const parse = JSON.parse(data);

                    if(parse.data != null){
                        for(let x in parse.data){
                            $(`[data-report-header='${x}']`).text(parse.data[x]);
                        }
                    }

                    var date_begin = $(`[data-role='${spa_loaded}'] [data-field='begin_date']`).val();
                    var date_end = $(`[data-role='${spa_loaded}'] [data-field='end_date']`).val();

                    app.protocol.ajax(
                        'build/bridge.php',
                        { request_type: 'report_card', filters: JSON.stringify(select_val), table: 'TabsBuildings',
                        date_begin: date_begin, date_end: date_end},
                        {c: (data) => {
                            fill_report_card(data);
                        }}
                    )  
                }
            });
        }else{
            $("#site_dataset_warning").removeClass("no-display");
            $("#site_dataset").addClass("no-display");
        }
    });

    $("#filter_site_summary_map").parent().click(function(){
        var select_val = {}
        var building_id = session.getItem("site_in_view");

        $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
            const el_val = $(el).val();

            if(el_val != "-1" && el_val !== null)
                select_val[$(el).attr("data-select")] = el_val;
        });

        if(Object.keys(select_val).length === 0){
            select_val = {'tc.Client' : $(`[data-role='${spa_loaded}'] [data-select='tc.Client'] option:nth-child(3)`).text().trim()};
        }

        if(Object.keys(select_val).length > 0){

            var date_begin = $(`[data-role='${spa_loaded}'] [data-field='begin_date']`).val();
            var date_end = $(`[data-role='${spa_loaded}'] [data-field='end_date']`).val();

            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_col_values', filters: JSON.stringify(select_val), table: 'TabsBuildings', 
                date_begin: date_begin, date_end: date_end},
                {c: (d) =>{
                    regen_map(map, d);
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

    $("[data-select-pdf='export_to_pdf_dropdown']").change(function(e){
        switch($(this).val()){
            case 'pdf':
                var element = $(`[data-role='${spa_loaded}'] [data-elem-print]`)[0];
                var opt = {
                  margin:       0.5,
                  filename:     `${$(`[data-role='${spa_loaded}'] [data-elem-print]`).attr('data-export-name')}.${$(this).val()}`,
                  image:        { type: 'jpeg', quality: 1 },
                  html2canvas:  { scale: 1 },
                  jsPDF:        { unit: 'cm', format: 'a2', orientation: 'landscape' }
                };
                
                // New Promise-based usage:
                $("[data-role='pdf_loader']").removeClass("no-display");
                html2pdf().set(opt).from(element).save().then(() => {
                    $("[data-role='pdf_loader']").addClass("no-display");
                });
                break;
            default:
        }     
    });

    $("#transform_fields").unbind().click(function(){
        var fields = {};

        var spa_targets = {
            TabsBuildings: ["[data-spa='spa-content-map']", "[data-spa-page='spa-content-building_list']"],
            TabsBuildingContacts: ["[data-spa='spa-content-map']", "[data-spa-page='spa-content-contacts']"],
            COContracts: ["[data-spa='spa-content-map']", "[data-spa-page='spa-content-contracts']"],
            fplans: ["[data-spa='spa-content-map']", "[data-spa-page='spa-content-floor_plans']"],
            bimage: ["[data-spa='spa-content-map']", "[data-spa-page='spa-content-images']"],
            ATAssets: ["[data-spa='spa-content-summary']", "[data-spa-page='spa-content-asset_list']"],
            jobs: ["[data-spa='spa-content-work_order']"]
        }

        $("#fill_fields input").each(function(i, el){
            const field_val = $(el).val();

            if(field_val !== ''){
                fields[$(el).attr("name")] = field_val;
            }
        });

        app.protocol.ajax(
            'build/bridge.php',
            {request_type: 'col_to_json', fields_: JSON.stringify(fields), table: $("[data-select='column_format']").val()},
            {c: (data) => {
                for(x in spa_targets[$("[data-select='column_format']").val()]){
                    $(spa_targets[$("[data-select='column_format']").val()][x]).click();
                }
            }}
        ); 

        app.protocol.ajax(
            'build/bridge.php',
            {
                request_type: 'insert_date',
                date_format: $("[data-select='date_format']").val(),
                date_locale: $("[data-select='date_locale']").val()
            },
            {c: () => {}}
        );

        app.page.toast("SUCCESS", "Page setting recorded !");
    });

    $("#add_image").click(function(){
        $("#image_dataset").addClass("no-display");
        $("#add_image_container").removeClass("no-display");
        myDropzone.removeAllFiles();
    });

    $("#back_image").click(function(){
        $("#image_dataset").removeClass("no-display");
        $("#add_image_container").addClass("no-display");
    });

    $("[data-select='building_uid_list']").change(function(){
        $("#building_image_uid").val($(this).val());
    });


    /***********************************************************
     * Add all code outside spaonloaded in this promise, as some
     * variable may not yet be available ( SPA rendering )
     * *********************************************************/
    app.page.onrendered().then(() => {

        $(`[data-role='${spa_loaded}'] [data-select]`).change(function(){

            const selection_rel = { 'tc.Client': 'client_selection', 'tr.RegionName': 'region_selection'};

            if($(this).attr('data-select') != 'c.BuildingName'){
                app.protocol.ajax(
                    'build/bridge.php',
                    {
                        request_type: 'update_selection_fields', selection_type: selection_rel[$(this).attr('data-select')], select_val: $(this).val()
                    },
                    {c: (data) => {
                        updateSelect(data);
                    }}
                );  
            }
        });

        const begin_date_picker = MCDatepicker.create({ 
            el: '#begin_date',
            dateFormat: 'YYYY-MM-DD',
            bodyType: 'inline'
        })

        begin_date_picker.onOpen(() => $(".mc-calendar").css({left: '14px', top: '160px'}));

        const end_date_picker = MCDatepicker.create({ 
            el: '#end_date',
            dateFormat: 'YYYY-MM-DD',
            bodyType: 'inline'
        })

        end_date_picker.onOpen(() => $(".mc-calendar").css({left: '14px', top: '160px'}));
        
        const begin_date_picker_map = MCDatepicker.create({ 
            el: '#begin_date_map',
            dateFormat: 'YYYY-MM-DD',
            bodyType: 'inline'
        })

        begin_date_picker_map.onOpen(() => $(".mc-calendar").css({left: '14px', top: '160px'}));

        const end_date_picker_map = MCDatepicker.create({ 
            el: '#end_date_map',
            dateFormat: 'YYYY-MM-DD',
            bodyType: 'inline'
        })

        end_date_picker_map.onOpen(() => $(".mc-calendar").css({left: '14px', top: '160px'}));
    

        //setting page date format, populate fields
        app.page.render_datemask_field((masks) => {
            var container = $("[data-select='date_format']");
            $(container).children().remove();

            $(container).append($("<option></option>").attr("data-display", "Choose").text(" a date format"));
            for(let x in masks){
                var opt_node = $("<option></option>").val(masks[x].mask).text(masks[x].name);
                $(container).append(opt_node);
            }

            var container = $("[data-select='date_locale']");
            $(container).children().remove();

            var data = [
                'Europe/London',
                'Europe/Brussels',
                'Europe/Paris',
                'Indian/Mauritius',
                'Indian/Reunion'
            ];

            $(container).append($("<option></option>").attr("data-display", "Choose").text(" a date locale"));
            for(let x in data){
                var opt_node = $("<option></option>").val(data[x]).text(data[x]);
                $(container).append(opt_node);
                $(container).niceSelect("update");
            }

            app.protocol.ajax(
                'build/bridge.php',{
                    request_type: 'get_page_setting'
                },
                {c: (data) => {
                    const dataset = JSON.parse(data);

                    if(dataset.data.length == 0){
                        $("[data-select='date_format']")[0].selectedIndex = $("option[value='dd/mm/yyyy']")[0].index;
                        $("[data-select='date_format']").niceSelect("update");

                        $("[data-select='date_locale']")[0].selectedIndex = $("option[value='Etc/GMT+4']")[0].index;
                        $("[data-select='date_locale']").niceSelect("update");
                    }else{
                        $("[data-select='date_format']")[0].selectedIndex = $(`option[value='${dataset.data[0].date_format}']`)[0].index;
                        $("[data-select='date_format']").niceSelect("update");

                        $("[data-select='date_locale']")[0].selectedIndex = $(`option[value='${dataset.data[0].date_locale}']`)[0].index;
                        $("[data-select='date_locale']").niceSelect("update");


                        setInterval(() => {
                            var date = new Date();
                        
                            app.page.format_date(Date.parse(date.toLocaleString('en-US', { timeZone: dataset.data[0].date_locale })), (data) => {
                                $("#time_").text(`${data.hours}:${data.min}:${data.second}`);
                            });
                        }, 1000);

                        $("#date_locale_").text(`( ${dataset.data[0].date_locale} )`);
                        $("#date_").text($(`option[value='${dataset.data[0].date_format}']`).text());

                        var d = new Date();
                        var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                        $("#date_days").text(days[d.getDay()]);
                    }
                }}
            );
        });

        $("[data-lang]").click(function () {
            const lang = $(this).attr("data-lang");
            const page_theme_session = (session.getItem("page_theme") == "light_mode")?'white':'black';

            switch(lang){
                case 'fr':
                    $("title").text("Le HUB rapports");
                    $(".navbar-brand img").attr("src",`build/assets/res/img/brand_fr_${page_theme_session}.png`);
                    app.page.toast("SUCCESS", "Page set to french language");
                    break;
                case 'en':
                    $("title").text("Le HUB reports");
                    $(".navbar-brand img").attr("src",`build/assets/res/img/brand_en_${page_theme_session}.png`);
                    app.page.toast("SUCCESS", "Page set to english language");
                    break;
                default:
                    throw new Error("Unknown language type");
            }

            session.setItem("page_language", lang);
        });

        $("[data-lang='fr']").click();

        //set the first theme dyn
        $("[data-theme]").click(function(){
            const lang_session = session.getItem('page_language');
            const inverse_theme = {
                light_mode: {theme: 'dark_mode', name: 'dark'},
                dark_mode: {theme: 'light_mode', name: 'light'}
            };

            $(`[data-theme='${$(this).attr("data-theme")}']`).addClass("no-display");
            $(`[data-theme='${inverse_theme[$(this).attr("data-theme")].theme}']`).removeClass("no-display");
            document.documentElement.setAttribute('data-theme', inverse_theme[$(this).attr("data-theme")].name);

            if(inverse_theme[$(this).attr("data-theme")].name == 'dark'){
                $(".navbar-brand img").attr("src",`build/assets/res/img/brand_${lang_session}_white.png`);
                $("table").removeClass("table-light").addClass("table-dark");
            }else{
                $(".navbar-brand img").attr("src",`build/assets/res/img/brand_${lang_session}_black.png`);
                $("table").removeClass("table-dark").addClass("table-light");
            }

            session.setItem("page_theme", $(this).attr("data-theme"));
        });

        $("[data-select-pdf='export_to_pdf_dropdown']").niceSelect();

        $("[data-report-card]").each(function(){
            var cloned_card = $(this).clone();

            $(cloned_card).css({width: '100%', 'padding-left': "10px", 'padding-right': "10px", "transform": "scale(0.6)", "position": "relative", "top": "-45px"});
            $("#report_card_carousel").append(cloned_card);
        });

        var owl_title = $("[data-carousel=owl_title]");
        owl_title.owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            items: 1,
            dots: false,
            navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
            mouseDrag: true
        });

        $("#back_to_map").click(function (argument) {
            session.removeItem('building_in_view');
            $("[data-spa-page='spa-content-map']").click();
            $("[data-spa-page='spa-content-summary-building']").parent().addClass("no-display");
        });

        /*********** Multiselect EVOL *************/
        const viable_multiselect_fields = ["tc.Client", "tr.RegionName", "c.BuildingName"];

        for(let o in viable_multiselect_fields){
            $(`[data-select='${viable_multiselect_fields[o]}']`).change(function(){
                setTimeout(() =>{ // quirk, the nice select element seems to not load sync
                    var text_node = $(`[data-value='${$(this).val()}']`).text();
                    $(`[data-value='${$(this).val()}']`).html(`<span data-feather='arrow-right'></span>${text_node}`);
                    feather.replace();
                }, 500);
            });
        }


        /******************************************/
    });
    
    app.init("site_summary");
    feather.replace();
})(jQuery);