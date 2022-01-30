/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/ 

function show_building(data){
    const buildings = JSON.parse(data);
    const container = $("[data-target-table='buildings'] tbody");

    $(container).children().remove();

    for(let x in buildings.data){

        var tr = $("<tr></tr>").attr("data-building", buildings.data[x].UID );
        var building_number = $("<td></td>").text( buildings.data[x].UID );
        var building_name = $("<td></td>").text( buildings.data[x].BuildingName );
        var client = $("<td></td>").text( buildings.data[x].Client );
        var address = $("<td></td>").text( buildings.data[x].Address );
        var post_code = $("<td></td>").text( buildings.data[x].PostCode );
        var phone = $("<td></td>").text( buildings.data[x].Phone );
        var region = $("<td></td>").text( buildings.data[x].Region );
        var sub_region = $("<td></td>").text( buildings.data[x].SubRegion );
        var trading_type = $("<td></td>").text( buildings.data[x].TradingType );
        var status = $("<td></td>").text( buildings.data[x].Status );
        var edit_btn = $("<th scope='row'> <span class='hover-pointer' data-feather='edit-3'></span></th>");

        $(container)
            .append( $(tr)
            .append(edit_btn)
            .append(building_number)
            .append(building_name)
            .append(client)
            .append(address)
            .append(post_code)
            .append(phone)
            .append(region)
            .append(sub_region)
            .append(trading_type)
            .append(status)
        );

        $(edit_btn).click(function(){
            // TODO
        });

    }

    $("[data-target-pagination='building_pagination']").pagination({
        dataSource: [...$("[data-target-table='buildings'] tbody tr")],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $("[data-target-table='buildings'] tbody").html(html);
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

function template(nodes){
    var html = "";

    for(let x in nodes)
        html += $(nodes[x])[0].outerHTML;

    return html;
}