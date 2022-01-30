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
        // TODO pre processsing
    });


    $("[data-role='spa-content-floor_plans']").on("spaloaded", function(){
        // TODO pre processsing
    });

    $("[data-role='spa-content-images']").on("spaloaded", function(){
        // TODO pre processsing
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


    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: '#drop_column',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
        // add active dropzone feedback
        console.log("element is being dragged");
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target

        // feedback the possibility of a drop
        console.log("can drop element");
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        console.log("can remove dropped element");
      },
      ondrop: function (event) {
        console.log("element dropped");
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        console.log("element is no longer being dragged");
      }
    })

    interact('.drag-drop')
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoScroll: true,
        // dragMoveListener from the dragging demo above
        listeners: { move: dragMoveListener }
    })

    function dragMoveListener (event) {
      var target = event.target
      // keep the dragged position in the data-x/data-y attributes
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }

    // $("[data-target-collapse]").click();

    app.init("site_summary");
    feather.replace();
})(jQuery);