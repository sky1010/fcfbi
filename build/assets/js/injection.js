/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/ 

function show_building(data){
    const buildings = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    // gen header
    var col_name = Object.keys(buildings.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

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


function show_contacts(data){
    const contacts = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);

    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();

    // gen header
    var col_name = Object.keys(contacts.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

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
    // gen header
    var col_name = Object.keys(contracts.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

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
    // gen header
    var col_name = Object.keys(fplan.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

    for(let x in fplan.data){

        var tr = $("<tr></tr>").attr("data-floor_plans", fplan.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in fplan.data[x]){
            var td_node = $("<td></td>").text(fplan.data[x][y]);
            $(tr).append(td_node);
        }

        $(container).find("tbody").append(tr);

        // $(edit_btn).click(function(){
        //     // TODO
        // });

    }
}

function show_asset_list(data){
    const asset_list = JSON.parse(data);
    const container = $(`[data-role='${spa_loaded}'] [data-target-table]`);
    $(container).find("tbody").children().remove();
    $(container).find("thead").children().remove();
    // gen header
    var col_name = Object.keys(asset_list.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

    for(let x in asset_list.data){

        var tr = $("<tr></tr>").attr("data-asset_list", asset_list.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in asset_list.data[x]){
            var td_node = $("<td></td>").text(asset_list.data[x][y]);
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
    // gen header
    var col_name = Object.keys(work_order.data[0]);
    var tr_node = $("<tr></tr>");
    $(tr_node).append($("<th></th>"));

    for(let x in col_name){
        var th_node = $("<th></th>").text(col_name[x]);
        $(tr_node).append(th_node);
    }

    $(container).find("thead").append(tr_node);

    for(let x in work_order.data){

        var tr = $("<tr></tr>").attr("data-work_order", work_order.data[x].UID );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(tr).append(edit_btn);
        
        for(let y in work_order.data[x]){
            var td_node = $("<td></td>").text(work_order.data[x][y]);
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
            Division: 'Division',
            Landlord: 'Landlord', 
            InsuranceBroker: 'Insurance broker',
            EstatesManager: 'Estates manager',
            RegionalOperationsManager: 'Regional operations manager',
            Status: 'Status',
            Longitude: 'Longitude',
            Latitude: 'Latitude',
            Website: 'Website',
            LocalAuthority: 'LocalAuthority',

        };

        session.setItem("site_in_view", site_summary.data[0].BuildingNumber);
        for(let x in site_summary.data[0]){
            if(key_transform.hasOwnProperty(x)){
                var th_node = $("<th scope='row'></th>").text(key_transform[x]);
                var td_node = $("<td></td>").text((site_summary.data[0][x] === 'NULL')?' - ':site_summary.data[0][x]);
                var tr_node = $("<tr></tr>");

                $(tr_node).append(th_node).append(td_node);
                $(container).append(tr_node);
            }
        }

        if(site_summary.data.interventions.length > 0){
            var container_inv = $("#inv_summary");
            $(container_inv).children().remove();

            for(let x in site_summary.data.interventions){
                var tr_node = $("<tr></tr>");
                var th_node = $("<th scope='row'></th>").text(site_summary.data.interventions[x].number_intervention);
                var inv_desc = $("<td></td>").text(site_summary.data.interventions[x].intervention_desc);
                var inv_sp = $("<td></td>").text(site_summary.data.interventions[x].service_provider);
                var inv_no_eq = $("<td></td>").text(site_summary.data.interventions[x].AssetCode);
                var inv_state = $("<td></td>").text(site_summary.data.interventions[x].CurrentStatus);
                var inv_start_dt = $("<td></td>").text(site_summary.data.interventions[x].StartDate);
                var inv_end_dt = $("<td></td>").text(site_summary.data.interventions[x].Deadline);
                var inv_last_dt = $("<td></td>").text(site_summary.data.interventions[x].date_last_monitoring);

                $(tr_node)
                    .append(th_node)
                    .append(inv_desc)
                    .append(inv_sp)
                    .append(inv_no_eq)
                    .append(inv_state)
                    .append(inv_start_dt)
                    .append(inv_end_dt)
                    .append(inv_last_dt);
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

        for(let x in temp_chart_config){

            if(ref_chart[x] != undefined){
                ref_chart[x].destroy();
                ref_chart[x] = undefined;
            }

            temp_chart_config[x].callback(temp_chart_config[x].data);
        }
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

        if(['Latitude', 'Longitude'].includes(x)){
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
            .text(dataset.data[x].column_name)
            .addClass("col-items drag-drop m-2")
            .attr("data-filter-by-columns", dataset.data[x].column_name);
        $(container).append(div_node);
    }
}

function fillSelect(data){
    const dataset = JSON.parse(data);
    var key_transform = {
        BuildingNumber: 'Site number',
        BuildingName: 'Site name',
        Client: 'Client',
        Region: 'Region'
    };

    for(let x in dataset.data){
        var container = $(`[data-select='${x}']`);
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

function template(nodes){
    var html = "";

    for(let x in nodes)
        html += $(nodes[x])[0].outerHTML;

    return html;
}