/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/ 

function show_building(data){
    const buildings = JSON.parse(data);

    if(buildings.data.length !== 0){
        const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

        $(container).find("tbody").children().remove();
        $(container).find("thead").children().remove();

        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_col_json', table: 'TabsBuildings'},
            {c: (data) => {
                const parse = JSON.parse(data);

                // gen header
                var col_name = Object.keys(buildings.data[0]);
                var tr_node = $("<tr></tr>");
                $(tr_node).append($("<th></th>"));

                for(let x in col_name){

                    var temp_val = null
                    if(parse.data !== null){
                        temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                    }else{
                        temp_val = col_name[x];
                    }

                    var th_node = $("<th></th>").text(temp_val);
                    $(tr_node).append(th_node);
                }

                $(container).find("thead").append(tr_node);

            }}
        ); 
    
        for(let x in buildings.data){

            var tr = $("<tr></tr>").attr("data-building", buildings.data[x].UID );
            var edit_btn = $("<th scope='row'></th>").append($("<button type='button' class='btn btn-sm btn-dark'><span class='hover-pointer' data-feather='edit-3'></span></button>"));

            $(tr).append(edit_btn);
            
            for(let y in buildings.data[x]){
                var td_node = $("<td></td>").text(buildings.data[x][y]);
                $(tr).append(td_node);
            }

            $(container).find("tbody").append(tr);

            $(edit_btn).find("button").click(function(){
                var building_id = $(this).parent().parent().attr("data-building");
                session.setItem("building_in_view", building_id);
                $("[data-spa-page='spa-content-building_list']").click();
            });

        }

    }

    feather.replace();
}


function show_contacts(data){
    const contacts = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'contacts'},
        {c: (data) => {
            const parse = JSON.parse(data);

            // gen header
            var col_name = Object.keys(contacts.data[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));
            $(container).find("thead").children().remove();

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in contacts.data){

        var tr = $("<tr></tr>").attr("data-contacts", contacts.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in contacts.data[x]){
            var td_node = $("<td></td>").text(contacts.data[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

        // $(edit_btn).click(function(){
        //     // TODO
        // });

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}

function show_contracts(data){
    const contracts = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'COContracts'},
        {c: (data) => {
            const parse = JSON.parse(data);

            // gen header
            var col_name = Object.keys(contracts.data[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 


    for(let x in contracts.data){

        var tr = $("<tr></tr>").attr("data-contracts", contracts.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in contracts.data[x]){
            var td_node = $("<td></td>").text(contracts.data[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

        // $(edit_btn).click(function(){
        //     // TODO
        // });

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}

function show_floor_plans(data){
    const fplan = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'fplans'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(fplan.data[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in fplan.data){

        var tr = $("<tr></tr>").attr("data-floor_plans", fplan.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in fplan.data[x]){
            var td_node = $("<td></td>").text(fplan.data[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);
    }
}

function fill_summary_asset(data){    
    const asset_list = JSON.parse(data);    

    /*------------ ASSETS CARD -------------*/
    $("[data-field='assets_summary']").text(asset_list.data.assets[0].tot_assets);

    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'assets'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(asset_list.data.asset_dataset[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);

            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    var as_link = ["AssetCode"];
    for(let x in asset_list.data.asset_dataset){

        var tr = $("<tr></tr>").attr("data-asset_list", asset_list.data.asset_dataset[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in asset_list.data.asset_dataset[x]){
            var link_node = $(`<a href='#' data-asset-link-value='${asset_list.data.asset_dataset[x][y]}'>${asset_list.data.asset_dataset[x][y]}</a>`);
            var node_ = as_link.includes(y)?link_node:asset_list.data.asset_dataset[x][y];
            var td_node = $("<td></td>").html(node_);
            $(tr).append(td_node);

        }

        $(container).find("tbody").append(tr);
    }


    $("[data-asset-link-value]").click(function(e){
        e.preventDefault();
        session.setItem('asset_in_view', $(this).attr('data-asset-link-value'));
        $("[data-spa-page='spa-content-asset_list']").click();
    });

    // $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
    //     dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
    //     pageSize: 9,
    //     callback: function(data, pagination) {
    //         var html = template(data);
    //         $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
    //     }
    // })

    feather.replace();
}



function show_buildings_sidebar_dataset(data){
    const dataset = JSON.parse(data);
    const container = $("[data-sidebar-collapse='left-filters-building']");
    $(container).children().remove();

    var section_keys = Object.keys(dataset.data);
    var key_transform = {
        Client: 'Client',
        Region: 'Region',
        BuildingName: 'Building name'
    };

    for(let x in dataset.data){
        var parent_node = null;
        var parent_node = $("<div></div>").addClass("table-responsive mt-2");
        var table_node = $("<table></table>").addClass("table");

        //generate thead
        var thead = $("<thead></thead>").addClass("csx-light-theme");
        var tr_node = $("<tr></tr>");
        var th_node = $("<th scope='col'></th>");
        var div_node = $("<div></div>").attr("data-target-collapse", x).text(key_transform[x]).append($("<span data-feather='chevron-down'></span>"));
        $(th_node).append(div_node);
        $(tr_node).append(th_node);
        $(thead).append(tr_node);


        var tbody = $("<tbody></tbody>").addClass("sm-font").attr("data-collapse", x);

        dataset.data[x].push({tot_col: 0, col_name: '+ See All'});
        for(let y in dataset.data[x]){
            var tr_node = $("<tr></tr>");
            var td_node = $("<td></td>");
            var div_node = $("<div></div>").addClass("form-check");
            var input_ = $(`<input class="form-check-input" name="${x}" type="checkbox" value="${dataset.data[x][y].col_name}" id="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}">`);
            var label_ = $(`<label for="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}"></label>`).addClass("form-check-label").text(dataset.data[x][y].col_name);
            $(div_node).append(input_).append(label_);
            $(td_node).append(div_node);
            $(tr_node).append(td_node);
            $(tbody).append(tr_node);
        }

        $(table_node).append(thead).append(tbody);
        $(parent_node).append(table_node);
        $(container).append(parent_node);
    }

    registerSidebarFiltersEvent("[data-role='spa-content-building_list']", (all_selected_val) => {
        if(!(Object.keys(all_selected_val).length === 0 && all_selected_val.constructor === Object)){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_filtered_dataset', filters: JSON.stringify(all_selected_val)},
                {c: show_building }
            );
        }else{
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_buildings'},
                {c: show_building }
            );
        }  
    });

    feather.replace();
}


function show_contacts_sidebar_dataset(data){
    const dataset = JSON.parse(data);
    const container = $("[data-sidebar-collapse='left-filters-contacts']");
    $(container).children().remove();

    var section_keys = Object.keys(dataset.data);
    var key_transform = {
        Name: 'Name'
    };

    for(let x in dataset.data){
        var parent_node = null;
        var parent_node = $("<div></div>").addClass("table-responsive mt-2");
        var table_node = $("<table></table>").addClass("table");

        //generate thead
        var thead = $("<thead></thead>").addClass("csx-light-theme");
        var tr_node = $("<tr></tr>");
        var th_node = $("<th scope='col'></th>");
        var div_node = $("<div></div>").attr("data-target-collapse", x).text(key_transform[x]).append($("<span data-feather='chevron-down'></span>"));
        $(th_node).append(div_node);
        $(tr_node).append(th_node);
        $(thead).append(tr_node);


        var tbody = $("<tbody></tbody>").addClass("sm-font").attr("data-collapse", x);

        dataset.data[x].push({tot_col: 0, col_name: '+ See All'});
        for(let y in dataset.data[x]){
            var tr_node = $("<tr></tr>");
            var td_node = $("<td></td>");
            var div_node = $("<div></div>").addClass("form-check");
            var input_ = $(`<input class="form-check-input" name="${x}" type="checkbox" value="${dataset.data[x][y].col_name}" id="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}">`);
            var label_ = $(`<label for="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}"></label>`).addClass("form-check-label").text(dataset.data[x][y].col_name);
            $(div_node).append(input_).append(label_);
            $(td_node).append(div_node);
            $(tr_node).append(td_node);
            $(tbody).append(tr_node);
        }

        $(table_node).append(thead).append(tbody);
        $(parent_node).append(table_node);
        $(container).append(parent_node);
    }

    registerSidebarFiltersEvent("[data-role='spa-content-contacts']", (all_selected_val) => {
        if(!(Object.keys(all_selected_val).length === 0 && all_selected_val.constructor === Object)){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_filtered_dataset_contacts', filters: JSON.stringify(all_selected_val)},
                {c: show_contacts }
            );
        }else{
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_contacts'},
                {c: show_contacts }
            );
        }  
    });

    feather.replace();
}

function show_contracts_sidebar_dataset(data){
    const dataset = JSON.parse(data);
    const container = $("[data-sidebar-collapse='left-filters-contracts']");
    $(container).children().remove();

    var section_keys = Object.keys(dataset.data);
    var key_transform = {
        Client: 'Client',
        Region: 'Region',
        BuildingName: 'Building name'
    };

    for(let x in dataset.data){
        var parent_node = null;
        var parent_node = $("<div></div>").addClass("table-responsive mt-2");
        var table_node = $("<table></table>").addClass("table");

        //generate thead
        var thead = $("<thead></thead>").addClass("csx-light-theme");
        var tr_node = $("<tr></tr>");
        var th_node = $("<th scope='col'></th>");
        var div_node = $("<div></div>").attr("data-target-collapse", x).text(key_transform[x]).append($("<span data-feather='chevron-down'></span>"));
        $(th_node).append(div_node);
        $(tr_node).append(th_node);
        $(thead).append(tr_node);


        var tbody = $("<tbody></tbody>").addClass("sm-font").attr("data-collapse", x);

        dataset.data[x].push({tot_col: 0, col_name: '+ See All'});
        for(let y in dataset.data[x]){
            var tr_node = $("<tr></tr>");
            var td_node = $("<td></td>");
            var div_node = $("<div></div>").addClass("form-check");
            var input_ = $(`<input class="form-check-input" name="${x}" type="checkbox" value="${dataset.data[x][y].col_name}" id="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}">`);
            var label_ = $(`<label for="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}"></label>`).addClass("form-check-label").text(dataset.data[x][y].col_name);
            $(div_node).append(input_).append(label_);
            $(td_node).append(div_node);
            $(tr_node).append(td_node);
            $(tbody).append(tr_node);
        }

        $(table_node).append(thead).append(tbody);
        $(parent_node).append(table_node);
        $(container).append(parent_node);
    }

    registerSidebarFiltersEvent("[data-role='spa-content-contracts']", (all_selected_val) => {
        if(!(Object.keys(all_selected_val).length === 0 && all_selected_val.constructor === Object)){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_filtered_dataset_contracts', filters: JSON.stringify(all_selected_val)},
                {c: show_contracts }
            );
        }else{
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_contracts'},
                {c: show_contracts }
            );
        }  
    });

    feather.replace();
}

function show_floor_plans_sidebar_dataset(data){
    const dataset = JSON.parse(data);
    const container = $("[data-sidebar-collapse='left-filters-floor_plans']");
    $(container).children().remove();

    var section_keys = Object.keys(dataset.data);
    var key_transform = {
        UID: 'UID',
        description: 'description'
    };

    for(let x in dataset.data){
        var parent_node = null;
        var parent_node = $("<div></div>").addClass("table-responsive mt-2");
        var table_node = $("<table></table>").addClass("table");

        //generate thead
        var thead = $("<thead></thead>").addClass("csx-light-theme");
        var tr_node = $("<tr></tr>");
        var th_node = $("<th scope='col'></th>");
        var div_node = $("<div></div>").attr("data-target-collapse", x).text(key_transform[x]).append($("<span data-feather='chevron-down'></span>"));
        $(th_node).append(div_node);
        $(tr_node).append(th_node);
        $(thead).append(tr_node);


        var tbody = $("<tbody></tbody>").addClass("sm-font").attr("data-collapse", x);

        dataset.data[x].push({tot_col: 0, col_name: '+ See All'});
        for(let y in dataset.data[x]){
            var tr_node = $("<tr></tr>");
            var td_node = $("<td></td>");
            var div_node = $("<div></div>").addClass("form-check");
            var input_ = $(`<input class="form-check-input" name="${x}" type="checkbox" value="${dataset.data[x][y].col_name}" id="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}">`);
            var label_ = $(`<label for="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}"></label>`).addClass("form-check-label").text(dataset.data[x][y].col_name);
            $(div_node).append(input_).append(label_);
            $(td_node).append(div_node);
            $(tr_node).append(td_node);
            $(tbody).append(tr_node);
        }

        $(table_node).append(thead).append(tbody);
        $(parent_node).append(table_node);
        $(container).append(parent_node);
    }

    registerSidebarFiltersEvent("[data-role='spa-content-floor_plans']", (all_selected_val) => {
        if(!(Object.keys(all_selected_val).length === 0 && all_selected_val.constructor === Object)){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_filtered_dataset_floor_plans', filters: JSON.stringify(all_selected_val)},
                {c: show_floor_plans }
            );
        }else{
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_floor_plans'},
                {c: show_floor_plans }
            );
        }  
    });

    feather.replace();
}

function show_asset_list_sidebar_dataset(data){
    const dataset = JSON.parse(data);
    const container = $("[data-sidebar-collapse='left-filters-asset_list']");
    $(container).children().remove();

    var section_keys = Object.keys(dataset.data);
    var key_transform = {
        Client: 'Client',
        Region: 'Region',
        BuildingName: 'Building name',
        Group1: 'Group1',
        Description: 'Description'
    };

    for(let x in dataset.data){
        var parent_node = null;
        var parent_node = $("<div></div>").addClass("table-responsive mt-2");
        var table_node = $("<table></table>").addClass("table");

        //generate thead
        var thead = $("<thead></thead>").addClass("csx-light-theme");
        var tr_node = $("<tr></tr>");
        var th_node = $("<th scope='col'></th>");
        var div_node = $("<div></div>").attr("data-target-collapse", x).text(key_transform[x]).append($("<span data-feather='chevron-down'></span>"));
        $(th_node).append(div_node);
        $(tr_node).append(th_node);
        $(thead).append(tr_node);


        var tbody = $("<tbody></tbody>").addClass("sm-font").attr("data-collapse", x);

        dataset.data[x].push({tot_col: 0, col_name: '+ See All'});
        for(let y in dataset.data[x]){
            var tr_node = $("<tr></tr>");
            var td_node = $("<td></td>");
            var div_node = $("<div></div>").addClass("form-check");
            var input_ = $(`<input class="form-check-input" name="${x}" type="checkbox" value="${dataset.data[x][y].col_name}" id="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}">`);
            var label_ = $(`<label for="fi_${dataset.data[x][y].col_name.replaceAll(' ', '_')}_${x}"></label>`).addClass("form-check-label").text(dataset.data[x][y].col_name);
            $(div_node).append(input_).append(label_);
            $(td_node).append(div_node);
            $(tr_node).append(td_node);
            $(tbody).append(tr_node);
        }

        $(table_node).append(thead).append(tbody);
        $(parent_node).append(table_node);
        $(container).append(parent_node);
    }

    registerSidebarFiltersEvent("[data-role='spa-content-asset_list']", (all_selected_val) => {
        if(!(Object.keys(all_selected_val).length === 0 && all_selected_val.constructor === Object)){
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_filtered_dataset_asset_list', filters: JSON.stringify(all_selected_val)},
                {c: show_asset_list }
            );
        }else{
            app.protocol.ajax(
                'build/bridge.php',
                { request_type: 'get_asset_list'},
                {c: show_asset_list }
            );
        }  
    });

    feather.replace();
}

function registerSidebarFiltersEvent(sel, callback ){
    $(`${sel} [data-target-collapse]`).click(function(){
        $(this).data("collapse", !!!$(this).data("collapse"));

        const collapse_state = $(this).data("collapse");
        if(collapse_state){
            $(`[data-collapse=${$(this).attr('data-target-collapse')}]`).addClass("csx-collapse");
            $(this).find("svg").addClass("rotate");
        }else{
            $(`[data-collapse=${$(this).attr('data-target-collapse')}]`).removeClass("csx-collapse");
            $(this).find("svg").removeClass("rotate");
        }
    });

    $(`${sel} [id ^= 'fi_+_See_All']`).click(function(){
        $(`[name="${$(this).attr("name")}"]`).each(function(index, el){
            if($(el).val() != '+ See All' && !$(this)[0].hasAttribute("checked")){
                $(el).click();
            }
        });
    });

    $(`${sel} [type='checkbox']`).click(function(){
        var all_selected_val = {};
        var checked = $(this).data("checked", !!!$(this).data("checked"));

        if($(this).data("checked")){
            $(this).attr("checked", "checked");
        }else{
            $(this).removeAttr("checked", "checked");
        }

        $(`${sel} [type='checkbox']`).each(function(index, el){
            var name = $(this).attr("name");
            if($(el)[0].hasAttribute("checked") && $(el).val() != '+ See All'){
                if(!all_selected_val.hasOwnProperty(name)){
                    all_selected_val[name] = [];
                }
                all_selected_val[name].push($(el).val());
            }
        });

        callback(all_selected_val);
    });
}

function show_work_order(data){
    const work_order = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    /*------------ LIVE JOB STATUS CARD -------------*/
    var woljs_container = $("[data-field='wo_live_job_status']");
    $(woljs_container).children().remove();
    for(let x in work_order.data.live_job_status){
        var div_node = $("<div></div>").addClass("d-lg-flex justify-content-between");
        var p_head_node = $("<p></p>").text(work_order.data.live_job_status[x].CurrentStatus);
        var p_desc_node = $("<p></p>").text(work_order.data.live_job_status[x].number_intervention);

        $(div_node).append(p_head_node).append(p_desc_node);
        $(woljs_container).append(div_node);
    }

    /*------------ JOB PRIORITY CARD -------------*/
    var wojp_container = $("[data-field='wo_jobs_priority']");
    $(wojp_container).children().remove();
    for(let x in work_order.data.job_priorities){
        var div_node = $("<div></div>").addClass("d-lg-flex justify-content-between");
        var p_head_node = $("<p></p>").text(work_order.data.job_priorities[x].CurrentStatus);
        var p_desc_node = $("<p></p>").text(work_order.data.job_priorities[x].number_intervention);

        $(div_node).append(p_head_node).append(p_desc_node);
        $(wojp_container).append(div_node);
    }

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'jobs'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(work_order.data.job[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in work_order.data.job){

        var tr = $("<tr></tr>").attr("data-work_order", work_order.data.job[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in work_order.data.job[x]){
            var td_node = $("<td></td>").text(work_order.data.job[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}

function show_contractor(data){
    const contractor = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'jobs'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(contractor.data.contractor[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in contractor.data.contractor){

        var tr = $("<tr></tr>").attr("data-work_order", contractor.data.contractor[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in contractor.data.contractor[x]){
            var td_node = $("<td></td>").text(contractor.data.contractor[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}


function show_finance(data){
    const finance = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'jobs'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(finance.data.finance[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in finance.data.finance){

        var tr = $("<tr></tr>").attr("data-work_order", finance.data.finance[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in finance.data.finance[x]){
            var td_node = $("<td></td>").text(finance.data.finance[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}

function show_finance_expenditure(data){
    const p = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-fwe-report-card]`);
    const tile_color = ["#ffbe0b", "#e63946", "#a8dadc", "#b5e48c", "#fca311"];
    var color_repeats_x_time = 2;
    var color_index = 0;

    $(container).children().remove();

    for(let x in p.data.finance){
        var div_node = $("<div></div").addClass("col-lg-4 box-area text-center").css({"background-color": tile_color[color_index], 'min-height': '190px'});
        var sub_div = $("<div></div>").addClass("d-lg-flex justify-content-center align-items-center");
        var title_node = $("<h4></h4>").addClass("mt-3 mb-3 me-3 csx-txt-uppercase").text(p.data.finance[x].Name);
        var tooltip = $("<div data-toggle='tooltip' data-placement='top' title='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'><i class='fa-solid fa-circle-info'></i></div>");
        $(sub_div).append(title_node).append(tooltip);

        var div_txt_node = $("<div></div>").addClass("d-lg-flex justify-content-center align-items-center mt-3");
        var text_node = $("<h1></h1>").text(`Rs ${p.data.finance[x].WorkCost}`);
        $(div_txt_node).append(text_node);

        $(div_node).append(sub_div).append(div_txt_node);
        $(container).append(div_node);

        color_repeats_x_time--;
        if(color_repeats_x_time <= 0){
            color_repeats_x_time = 3;
            color_index++;
            if(color_index > tile_color.length){
                color_index = 0;
            }
        }
    }

    $('[data-toggle="tooltip"]').tooltip();
}

function show_worker(data){
    const worker = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: 'jobs'},
        {c: (data) => {
            const parse = JSON.parse(data);
            
            // gen header
            var col_name = Object.keys(worker.data.worker[0]);
            var tr_node = $("<tr></tr>");
            $(tr_node).append($("<th></th>"));

            for(let x in col_name){

                var temp_val = null
                if(parse.data !== null){
                    temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                }else{
                    temp_val = col_name[x];
                }

                var th_node = $("<th></th>").text(temp_val);
                $(tr_node).append(th_node);
            }

            $(container).find("thead").append(tr_node);

        }}
    ); 

    for(let x in worker.data.worker){

        var tr = $("<tr></tr>").attr("data-work_order", worker.data.worker[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in worker.data.worker[x]){
            var td_node = $("<td></td>").text(worker.data.worker[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

    }

    $(`[data-role='${spa_loaded}'] [data-target-pagination]`).pagination({
        dataSource: [...$(`[data-role='${spa_loaded}'] [data-target-table] tbody tr`)],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $(`[data-role='${spa_loaded}'] [data-target-table] tbody`).html(html);
        }
    })

    feather.replace();
}

function show_site_summary(data){
    const site_summary = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] #tbl_summary`);
    $(container).children().remove();

    if(site_summary.data.length == 0){
        $("#site_dataset_warning").removeClass("no-display");
        $("#site_dataset").addClass("no-display");
    }else{
        $("#site_dataset_warning").addClass("no-display");
        $("#site_dataset").removeClass("no-display");

        var key_transform = {
            BuildingPicture: 'Site image',
            BuildingNumber: 'Site number',
            Client: 'Client',
            Address: 'Address',
            PostCode: 'Postal code',
            Phone: 'Telephone',
            Fax: 'Fax', 
            Region: 'Region',
            SubRegion: 'Subregion',
            EmailAddress: 'Email',
            Landlord: 'Landlord', 
            InsuranceBroker: 'Insurance broker',
            EstatesManager: 'Estates manager',
            RegionalOperationsManager: 'Regional operations manager',
            Longitude: 'Longitude',
            Latitude: 'Latitude',
            Website: 'Website',
            LocalAuthority: 'LocalAuthority',

        };

        for(let x in site_summary.data[0]){
            if(key_transform.hasOwnProperty(x)){
                var th_node = $("<th scope='row'></th>").text(key_transform[x]);
                var td_node = $("<td></td>").text((site_summary.data[0][x] === 'NULL')?' - ':site_summary.data[0][x]);
                var tr_node = $("<tr></tr>");

                $(tr_node).append(th_node).append(td_node);
                $(container).append(tr_node);
            }
        }

        var container_inv = $("#inv_summary");
        $(container_inv).children().remove();

        if(site_summary.data.interventions.length > 0){
            for(let x in site_summary.data.interventions){
                var tr_node = $("<tr></tr>");
                var th_node = $("<th scope='row'></th>").text(site_summary.data.interventions[x].BuildingName);
                var inv_desc = $("<td></td>").text(site_summary.data.interventions[x].intervention_desc);
                // var inv_sp = $("<td></td>").text(site_summary.data.interventions[x].service_provider);
                let assetCode = site_summary.data.interventions[x].AssetCode;
                assetCode = (assetCode === null)?'N/A':assetCode;

                var inv_no_eq = $("<td></td>").text(assetCode);
                var inv_state = $("<td></td>").text(site_summary.data.interventions[x].CurrentStatus);
                var inv_start_dt = $("<td></td>").text(site_summary.data.interventions[x].StartDate);
                // var inv_end_dt = $("<td></td>").text(site_summary.data.interventions[x].Deadline);
                // var inv_last_dt = $("<td></td>").text(site_summary.data.interventions[x].date_last_monitoring);

                $(tr_node)
                    .append(th_node)
                    .append(inv_desc)
                    // .append(inv_sp)
                    .append(inv_no_eq)
                    .append(inv_state)
                    .append(inv_start_dt)
                    // .append(inv_end_dt)
                    // .append(inv_last_dt);
                $(container_inv).append(tr_node);
            }
        }

        var temp_chart_config = {
            number_intervention: {
                data: site_summary.data.chart.intervention_date,
                callback: chart_.gen_chart_number_intervention
            },
            number_intervention_by_nature:{
                data: site_summary.data.chart.intervention_type,
                callback: chart_.gen_chart_number_intervention_nature
            },
            number_intervention_by_category:{
                data: site_summary.data.chart.intervention_action,
                callback: chart_.gen_chart_number_intervention_category
            },
            number_intervention_by_state:{
                data: site_summary.data.chart.intervention_status,
                callback: chart_.gen_chart_number_intervention_state
            },
            number_intervention_by_priority:{
                data: site_summary.data.chart.intervention_priority,
                callback: chart_.gen_chart_number_intervention_priority
            },
            number_intervention_by_service_provider:{
                data: site_summary.data.chart.intervention_service_provider,
                callback: chart_.gen_chart_number_intervention_service_provider   
            }
        };

        // DEPRECATED, KEPT IN CASE OF ROLLBACK
        // for(let x in temp_chart_config){

        //     if(ref_chart[x] != undefined){
        //         ref_chart[x].destroy();
        //         ref_chart[x] = undefined;
        //     }

        //     temp_chart_config[x].callback(temp_chart_config[x].data);
        // }
    }
}

function fill_form_building(data) {
    const parse = JSON.parse(data);

    const building_container = $("#building_edit_inputs");
    const map_container = $("#map_edit_inputs");

    $(building_container).children().remove();
    $(map_container).children().remove();

    for(x in parse.data[0]){
        var div_node = $("<div></div>").addClass("form-floating m-4");
        var input_node = $("<input type='text'>").attr({id: x, placeholder: x, value: parse.data[0][x], name: x}).addClass("form-control");
        var label_node = $("<label></label>").attr("for", x).text(x);

        $(div_node).append(input_node).append(label_node);

        if(['VixenPPM', 'VixenReactive'].includes(x)){
            $(map_container).append(div_node);
        }else{
            $(building_container).append(div_node);
        }
    }
}

function show_columns(sel, data){
    const dataset = JSON.parse(data);
    const container = $(sel);
    $(container).children().remove();

    for(let x in dataset.data){
        var div_node = $("<div></div>")
            .text(dataset.data[x].COLUMN_NAME)
            .addClass("col-items drag-drop m-2")
            .attr("data-filter-by-columns", dataset.data[x].COLUMN_NAME);
        $(container).append(div_node);
    }
}

function fillSelect(data){
    const dataset = JSON.parse(data);
    
    var key_transform = {
        BuildingNumber: 'Site number',
        BuildingName: 'Site name',
        Client: 'Client',
        RegionName: 'Region',
        Description: 'Description',
        GroupName: 'Group',
        asset_status: 'Status',
        AssetCode: 'Code',
        job_type: 'Job type',
        Name: 'Work type',
        Status: 'Status level',
        Priority: 'Priority'
    };

    // fields remapped is not compatible with the initial tables specs
    var key_remapped_fields = {
        BuildingName: 'c.BuildingName', 
        Client: 'tc.Client',
        RegionName: 'tr.RegionName',
        Description: 'atd.Description',
        GroupName: 'atg.GroupName',
        asset_status: 'atl.asset_status',
        AssetCode: 'ats.AssetCode',
        job_type: 'pmjd.job_type',
        Name: 'pmwt.Name',
        Status: 'pmsl.Status',
        Priority: 'pmp.Priority'
    };

    for(let x in dataset.data){
        var container = $(`[data-select='${key_remapped_fields[x]}']`);

        $(container).children().remove();
        var opt = $(`<option data-display='${key_transform[x]}'>Choose ${key_transform[x]}</option>`).val(-1);
        $(container).append(opt);

        for(let y in dataset.data[x]){
            var opt_text = dataset.data[x][y][x];
            if(dataset.data[x][y][x] === null){
                dataset.data[x][y][x] = 0;
                opt_text = 'Empty';
            }
            
            var opt = $("<option></option>").val(dataset.data[x][y][x]).text(opt_text);
            $(container).append(opt);
        }
    }

    $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
        $(el).niceSelect("update");
    });

}


function fill_form_fields(data , table) {
    const parse = JSON.parse(data);
    const container = $("#fill_fields");

    $(container).children().remove();

    app.protocol.ajax(
        'build/bridge.php',
        { request_type: 'get_col_json', table: table},
        {c: (data) => {
            const parse_ = JSON.parse(data);

            for(x in parse.data){
                var col_name = parse.data[x].column_name;
                var div_node = $("<div></div>").addClass("form-floating m-4");
                var input_node = $("<input type='text'>").attr({id: col_name, placeholder: col_name, name: col_name}).addClass("form-control");
                var label_node = $("<label></label>").attr("for", col_name).text(col_name);

                if (parse_.data !==null){
                    if(parse_.data.hasOwnProperty(col_name)){
                        $(input_node).attr("value", parse_.data[col_name]);
                    }  
                }

                $(div_node).append(input_node).append(label_node);
                $(container).append(div_node);
            }
        }}
    ); 
}

function fillUIDSelect(data) {
    const parse = JSON.parse(data);
    const container = $("[data-select='building_uid_list']");
    $(container).children().remove();

    var opt = $(`<option data-display='Choose'> a building</option>`).val(-1);
    $(container).append(opt);

    for(let x in parse.data){
        var opt = $("<option></option>").val(parse.data[x]['UID']).text(parse.data[x]['BuildingName']);
        $(container).append(opt);
    }    

    $("[data-select='building_uid_list']").niceSelect("update")
}

function fill_bimage(data){
    const bimage_ = JSON.parse(data);
    var container = $("[data-role='spa-content-images'] [data-target-table]");
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    if(bimage_.data.length != 0){
        app.protocol.ajax(
            'build/bridge.php',
            { request_type: 'get_col_json', table: 'bimage'},
            {c: (data) => {
                const parse = JSON.parse(data);
                
                // gen header
                var col_name = Object.keys(bimage_.data[0]);
                var tr_node = $("<tr></tr>");

                for(let x in col_name){

                    var temp_val = null
                    if(parse.data !== null){
                        temp_val = parse.data.hasOwnProperty(col_name[x])?parse.data[col_name[x]]:col_name[x]
                    }else{
                        temp_val = col_name[x];
                    }

                    var th_node = $("<th scope='col' width='5%'></th>").text(temp_val);
                    $(tr_node).append(th_node);
                }

                $(container).find("thead").append(tr_node);

            }}
        ); 

        for(let x in bimage_.data){
            var tr_node = $("<tr></tr>").attr('uid', bimage_.data[x]['UID']);
            var th_node = $("<th scope='row'></th>").text(bimage_.data[x]['UID']);
            var bname = $("<td></td>").text(bimage_.data[x]['BuildingName']);

            var b_file = bimage_.data[x]['bimage'].split("/");
            b_file.shift();
            b_file = b_file.join("/");

            var bimage = $("<td></td>").append($(`<img src='${b_file}' class='td_image'>`));

            $(tr_node).append(th_node).append(bimage).append(bname);
            $(container).append(tr_node);
        }
    }
}

function updateSelect(data){
    const dataset = JSON.parse(data);

    var key_transform = {
        buildings: 'Site name',
        regions: 'Region'
    };

    // fields remapped is not compatible with the initial tables specs
    var key_remapped_fields = {
        buildings: 'c.BuildingName', 
        regions: 'tr.RegionName'
    };

    for(let x in dataset.data){
        var container = $(`[data-select='${key_remapped_fields[x]}']`);

        $(container).children().remove();
        var opt = $(`<option data-display='${key_transform[x]}'>Choose ${key_transform[x]}</option>`).val(-1);
        $(container).append(opt);

        for(let y in dataset.data[x]){
            const rel_key = Object.keys(dataset.data[x][y])[0];
            var opt_text = dataset.data[x][y][rel_key];
            if(dataset.data[x][y][rel_key] === null){
                dataset.data[x][y][rel_key] = 0;
                opt_text = 'Empty';
            }
            
            var opt = $("<option></option>").val(opt_text).text(opt_text);
            $(container).append(opt);
        }
    }

    $(`[data-role='${spa_loaded}'] [data-select]`).each(function(i, el){
        $(el).niceSelect("update");
    });

}

function fill_report_card(data){
    const dataset = JSON.parse(data);

    /*------------ REPAIR JOB CARD -------------*/
    $("[data-field='in_sla_field']").text(dataset.data.repair_jobs.in_sla);
    $("[data-field='out_sla_field']").text(dataset.data.repair_jobs.out_sla);

    /*------------ MAINTAINANCE JOB CARD -------------*/
    $("[data-field='in_sla_field_mj']").text(dataset.data.maintenance_jobs.in_sla);
    $("[data-field='out_sla_field_mj']").text(dataset.data.maintenance_jobs.out_sla);

    /*------------ SATISFACTION SURVEY CARD -------------*/
    $("[data-field='survey_happy']").text(`${Math.round(dataset.data.satisfaction.happy)}%`);
    $("[data-field='survey_unhappy']").text(`${Math.round(dataset.data.satisfaction.unhappy)}%`);

    /*------------ JOB TODAY CARD -------------*/
    $("[data-field='job_today']").text(dataset.data.jobs_today);

    /*------------ ASSETS CARD -------------*/
    $("[data-field='assets']").text(dataset.data.asset[0].tot_assets);

        /*------------ CERTIFICATES CARD -------------*/
    $("[data-field='certificates']").text(dataset.data.certificates[0].tot_certificates);

    /*------------ TOTAL AVERAGE ORDER CARD -------------*/
    $("[data-field='tao']").text(`Rs ${app.page.pretty_print_digit(Number.parseFloat(dataset.data.total_average_order[0].tao).toFixed(2))}`);

    /*------------ LIVE JOB STATUS CARD -------------*/
    var container = $("[data-field='live_job_status']");
    $(container).children().remove();
    for(let x in dataset.data.live_job_status){
        var div_node = $("<div></div>").addClass("d-lg-flex justify-content-between");
        var p_head_node = $("<p></p>").text(dataset.data.live_job_status[x].CurrentStatus);
        var p_desc_node = $("<p></p>").text(dataset.data.live_job_status[x].number_intervention);

        $(div_node).append(p_head_node).append(p_desc_node);
        $(container).append(div_node);
    }

    /*------------ JOB PRIORITY CARD -------------*/
    var container = $("[data-field='jobs_priority']");
    $(container).children().remove();
    for(let x in dataset.data.job_priorities){
        var div_node = $("<div></div>").addClass("d-lg-flex justify-content-between");
        var p_head_node = $("<p></p>").text(dataset.data.job_priorities[x].CurrentStatus);
        var p_desc_node = $("<p></p>").text(dataset.data.job_priorities[x].number_intervention);

        $(div_node).append(p_head_node).append(p_desc_node);
        $(container).append(div_node);
    }
}

function fill_building_summary(argument) {
    const dataset = JSON.parse(argument);

    /*------------- GENERAL INFO BUILDING SUMMARY -----------------*/
    $("[data-field='sb_address']").text(`Address : ${dataset.data.general_info[0].Address}`);
    $("[data-field='sb_region']").text(`Region : ${dataset.data.general_info[0].RegionName}`);
    $("[data-field='sb_post_code']").text(`Post code: ${dataset.data.general_info[0].PostCode}`);
    $("[data-field='sb_telephone']").text(`Telephone : ${dataset.data.general_info[0].Phone}`);
    $("[data-field='sb_email']").text(`Email : ${dataset.data.general_info[0].Email}`);
    $("[data-field='sb_building_name']").text(`${dataset.data.general_info[0].BuildingName}`);
    $("[data-field='sb_client_name']").text(`${dataset.data.general_info[0].Client}'s office`);
    $("[data-field='sb_building_image']").css("background-image", `url('${dataset.data.general_info[0].building_image.replace('../', '')}')`);

    /*------------- BUILDING CONTACT SUMMARY -----------------*/
    let container_contact = $("[data-table-fill='summary_building_contact'] tbody");
    if(dataset.data.contact_section.length != 0){
        $(container_contact).children().remove();
    }

    for(let x in dataset.data.contact_section){
        var tr_node = $("<tr></tr>").attr("data-contacts-row-id", dataset.data.contact_section[x].contact_id);
        var td_name = $("<td></td>").text(dataset.data.contact_section[x].Name);
        var td_email = $("<td></td>").text(dataset.data.contact_section[x].Email);
        var td_phone = $("<td></td>").text(dataset.data.contact_section[x].Phone);
        var td_mobile = $("<td></td>").text(dataset.data.contact_section[x].Mobile);

        $(tr_node).append(td_name).append(td_email).append(td_phone).append(td_mobile);
        $(container_contact).append(tr_node);
    }

    /*------------- FLOOR PLAN SUMMARY -----------------*/
    let container_fplan = $("[data-table-fill='summary_building_fplan'] tbody");
    if(dataset.data.floor_plans_section.length != 0){
        $(container_fplan).children().remove();
    }

    for(let x in dataset.data.floor_plans_section){
        var tr_node = $("<tr></tr>").attr("data-fplan-row-id", dataset.data.floor_plans_section[x].id);
        var td_file_name = $("<td></td>").text(dataset.data.floor_plans_section[x].fplan);
        var td_size = $("<td></td>").text(`N/A`);
        var td_description = $("<td></td>").text(dataset.data.floor_plans_section[x].description);

        $(tr_node).append(td_file_name).append(td_size).append(td_description);
        $(container_fplan).append(tr_node);
    }

    /*------------- CONTRACTS SUMMARY -----------------*/
    let container_contracts = $("[data-table-fill='summary_building_contracts'] tbody");

    if(dataset.data.contracts_section.length != 0){
        $(container_contracts).children().remove();
    }

    for(let x in dataset.data.contracts_section){
        var tr_node = $("<tr></tr>").attr("data-fplan-row-id", dataset.data.contracts_section[x].id);
        var td_title = $("<td></td>").text(dataset.data.contracts_section[x].fplan);
        var td_contract_number = $("<td></td>").text(dataset.data.contracts_section[x].fplan);
        var td_start_date = $("<td></td>").text(dataset.data.contracts_section[x].fplan);
        var td_end_date = $("<td></td>").text(dataset.data.contracts_section[x].fplan);
        var td_value = $("<td></td>").text(dataset.data.contracts_section[x].fplan);
        var td_desc = $("<td></td>").text(dataset.data.contracts_section[x].fplan);

        $(tr_node).append(td_title).append(td_contract_number).append(td_start_date).append(td_end_date).append(td_value).append(td_desc);
        $(container_contracts).append(tr_node);
    }

}

function regen_map(map_instance, data){
    const dataset = JSON.parse(data);

    if(dataset.data.metadata.length > 0){
        let points_ = [];

        for(let y in dataset.data.metadata){
            points_.push({
                BuildingName: dataset.data.metadata[y].BuildingName,
                Client: dataset.data.metadata[y].Client,
                UID: dataset.data.metadata[y].UID,
                VixenPPM: dataset.data.metadata[y].VixenPPM,
                VixenReactive: dataset.data.metadata[y].VixenReactive
            });
        }

        var buildings = {};
        buildings.data = points_;

        app.page.gen_map('map', (map) => {
            if(buildings.data.length != 0){
                var coords = [];
                var popup_dom = $("[data-shadow-el='building_marker']").clone().removeClass("no-display");

                var invalid_points = false
                for(let x in buildings.data){

                    var marker = L.marker(
                        [buildings.data[x].VixenPPM, buildings.data[x].VixenReactive], 
                        {icon: buildingIcon}
                    ).addTo(map);

                    $(popup_dom).find("[data-role='popup_header']").html(`<ul><li>${buildings.data[x].Client}</li><li>${buildings.data[x].BuildingName}</li></ul>`);
                    $(popup_dom).find("[data-role='popup_link']").attr("data-building", buildings.data[x].UID);

                    marker.bindPopup($(popup_dom)[0].outerHTML);

                    if(buildings.data[x].VixenReactive != '' && buildings.data[x].VixenPPM !== ''){
                        coords.push([buildings.data[x].VixenPPM, buildings.data[x].VixenReactive]); 
                    }else{
                        invalid_points = true;
                        app.page.toast("ERR", "Building points withing those parameters are erroneous");
                    }

                }

                if(coords.length > 0 && !invalid_points){
                    map.fitBounds(coords, {maxZoom: 10});

                    map.on('popupopen', function() {  
                        $("[data-role='popup_link']").click(function(e){
                            session.setItem("building_in_view", $(this).attr("data-building"));
                            $("[data-spa-page='spa-content-summary-building']").click();
                        });
                    });
                }
            }else{
                app.page.toast("WARNING", "There is currently no known buildings, within those parameters");
            }
        });
    }else{
        app.page.gen_map('map', (map) => {});
        app.page.toast("WARNING", "There is currently no known building, within those parameters");
    }
}

function fill_asset_summary(d){
    const p = JSON.parse(d);

    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody [data-table-asset-row-field]").text("");

    for(let x in p.data){
        for(let y in p.data[x]){
            $(`[data-table-asset-row-field='${y}']`).text(p.data[x][y]);
        }
    }
};

function template(nodes){
    var html = "";

    for(let x in nodes)
        html += $(nodes[x])[0].outerHTML;

    return html;
}