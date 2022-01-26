/***********************************************************
 *  FCFBI application V1.0
 *  Copyright 2022 
 *  Authors: -
***********************************************************/ 

function show_building(data){
    const buildings = JSON.parse(data);
    const container = $("[data-role='spa-content-building_list'] tbody");

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

    $("[data-role='spa-content-building_list']").pagination({
        dataSource: [...$("[data-role='spa-content-building_list'] tbody tr")],
        pageSize: 9,
        callback: function(data, pagination) {
            var html = template(data);
            $("[data-role='spa-content-building_list'] tbody").html(html);
        }
    })

    feather.replace();
}

function template(nodes){
    var html = "";

    for(let x in nodes)
        html += $(nodes[x])[0].outerHTML;

    return html;
}