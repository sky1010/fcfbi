var ref_chart = {};

var chart_ = {
    gen_chart_priority: function(data_arg){
      const parse = JSON.parse(data_arg);

      var temp = {val:[], key:[]};

      for(let x in parse.data){
        temp["val"].push(parse.data[x].tot_priority);
        temp["key"].push(parse.data[x].Priority);
      }

      const ctx = document.getElementById('work_priority').getContext('2d');
      const work_priority = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: temp.key,
              datasets: [{ data: temp.val, backgroundColor: ["#f8961e"]}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Live work orders' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Priority' },
                ticks: { minRotation : 90}
            },
              y: {
                  beginAtZero: true,
                  display: true,
                  title: { display: true, text: 'Count' },
                  ticks: { stepSize: 100, mirror: true}
              }
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      var label = data.datasets[tooltipItem.datasetIndex].label || '';

                      if (label) {
                          label += 'Priority: ';
                      }

                      return label;
                  }
              }
            }
          }
      });

      ref_chart['work_priority'] = work_priority;
  },
  
  gen_chart_work_type: function(data_arg){
      const parse = JSON.parse(data_arg);

      var temp = {val:[], key:[]};

      for(let x in parse.data){
        temp["val"].push(parse.data[x].tot_work_type);
        temp["key"].push(parse.data[x].WorkType);
      }

      const ctx = document.getElementById('work_type').getContext('2d');
      const work_type = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: temp.key,
              datasets: [{ data: temp.val, backgroundColor: ["#f8961e"]}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Overdue work orders' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Work type' },
                ticks: { minRotation : 90}
            },
              y: {
                  beginAtZero: true,
                  display: true,
                  title: { display: true, text: 'Count' },
                  ticks: { stepSize: 100, mirror: true}
              }
            },
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      var label = data.datasets[tooltipItem.datasetIndex].label || '';

                      if (label) {
                          label += 'Priority: ';
                      }

                      return label;
                  }
              }
            }
          }
      });

      ref_chart['work_type'] = work_type;
  },

  gen_chart_number_intervention: function(data){
      const ctx = document.getElementById('number_intervention').getContext('2d');
      const number_intervention = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: Object.keys(data),
              datasets: [{ data: Object.values(data), backgroundColor: ["#2a9d8f"]}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by date' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Month and Year' },
                ticks: { minRotation : 90}
            },
              y: {
                  beginAtZero: false,
                  display: true,
                  title: { display: true, text: 'Number of intervention' },
                  ticks: { stepSize: 0.05, suggestedMin: 0.90}
              }
            }
          }
      });

      ref_chart['number_intervention'] = number_intervention;
  },

  gen_chart_number_intervention_nature: function(data_arg){
      var ds = {k: [], v: []};

      for(let x in data_arg){
        ds.k.push(data_arg[x].WorkType);
        ds.v.push(data_arg[x].jobcount);
      }

      const ctx = document.getElementById('number_intervention_by_nature').getContext('2d');
      const number_intervention_by_nature = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: app.page.fillColors(ds.v.length) }]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by nature' },
                legend: { display: true }
            }
          }
      });

      ref_chart['number_intervention_by_nature'] = number_intervention_by_nature;
  },

  gen_chart_number_intervention_category: function(data_arg){
      var ds = {k: [], v: []};

      for(let x in data_arg){
        ds.k.push(data_arg[x].ActionType);
        ds.v.push(data_arg[x].jobcount);
      }

      const ctx = document.getElementById('number_intervention_by_category').getContext('2d');
      const number_intervention_by_category = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: ["#2a9d8f"]}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by category' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                ticks: { minRotation : 90}
            },
            y: {
                beginAtZero: false,
                display: true,
                title: { display: true, text: 'Number of intervention' },
                ticks: { stepSize: 0.05, suggestedMin: 0.90}
              }
            }
          }
      });

      ref_chart['number_intervention_by_category'] = number_intervention_by_category;
  },

  gen_chart_number_intervention_state: function(data_arg){
      var ds = {k: [], v: []};

      for(let x in data_arg){
        ds.k.push(data_arg[x].CurrentStatus);
        ds.v.push(data_arg[x].jobcount);
      }

      const ctx = document.getElementById('number_intervention_by_state').getContext('2d');
      const number_intervention_by_state = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: app.page.fillColors(ds.v.length)}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by status' },
                legend: { display: true }
            }
          }
      });

      ref_chart['number_intervention_by_state'] = number_intervention_by_state;
  },

  gen_chart_number_intervention_priority: function(data_arg){
      var ds = {k: [], v: []};

      for(let x in data_arg){
        ds.k.push(data_arg[x].Priority);
        ds.v.push(data_arg[x].jobcount);
      }

      const ctx = document.getElementById('number_intervention_by_priority').getContext('2d');
      const number_intervention_by_priority = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: ["#2a9d8f"]}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by priority' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                ticks: { minRotation : 90}
            },
            y: {
                beginAtZero: false,
                display: true,
                title: { display: true, text: 'Count' },
                ticks: { stepSize: 0.05, suggestedMin: 0.90}
              }
            }
          }
      });

      ref_chart['number_intervention_by_priority'] = number_intervention_by_priority;
  },

  gen_chart_number_intervention_service_provider: function(data_arg){
      var ds = {k: [], v: []};

      for(let x in data_arg){
        ds.k.push(data_arg[x].ContractorType);
        ds.v.push(data_arg[x].jobcount);
      }
      
      const ctx = document.getElementById('number_intervention_by_service_provider').getContext('2d');
      const number_intervention_by_service_provider = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: ["#2a9d8f"]}]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                title: { display: true, text: 'Intervention by service provider' },
                legend: { display: false }
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Number of intervention' }
            },
            y: {
                beginAtZero: false,
                display: true,
                title: { display: true, text: 'Type of service provider' },
                ticks: { stepSize: 0.05, suggestedMin: 0.90}
              }
            }
          }
      });

      ref_chart['number_intervention_by_service_provider'] = number_intervention_by_service_provider;
  },

  gen_chart_finance: function(data){
      const parse = JSON.parse(data);

      var ds = {k: [], v: []};

      for(let x in parse.data){
        ds.k.push(parse.data[x].WorkType);
        ds.v.push(parse.data[x].jobcount);
      }
        
      const ctx = document.getElementById('finance_chart').getContext('2d');
      const finance_chart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: app.page.fillColors(ds.k.length)}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true},
                legend: { display: true }
            }
          }
      });

      ref_chart['finance_chart'] = finance_chart;
  },

  gen_chart_contractor_chart: function(data){
      const parse = JSON.parse(data);

      var ds = {k: [], v: []};

      for(let x in parse.data){
        ds.k.push(parse.data[x].CurrentStatus);
        ds.v.push(parse.data[x].jobcount);
      }
        
      const ctx = document.getElementById('contractor_chart').getContext('2d');
      const contractor_chart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: app.page.fillColors(ds.k.length)}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true},
                legend: { display: true }
            }
          }
      });

      ref_chart['contractor_chart'] = contractor_chart;
  },

  gen_chart_asset_summary: function(data){
      const parse = JSON.parse(data);

      var ds = {k: [], v: []};

      for(let x in parse.data){
        ds.k.push(parse.data[x].ActionType);
        ds.v.push(parse.data[x].jobcount);
      }
        
      const ctx = document.getElementById('asset_chart').getContext('2d');
      const asset_chart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: ds.k,
              datasets: [{ data: ds.v, backgroundColor: app.page.fillColors(ds.k.length)}]
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true},
                legend: { display: true }
            }
          }
      });

      ref_chart['asset_chart'] = asset_chart;
  },

  gen_chart_work_orders: function(data){
      const parse = JSON.parse(data);

      class template {
        #dps = null;
        #type = ""
        #root_name = null;
        #color = null;
        static datapoints = [];

        constructor(dps, name, type){
          this.dps = dps;
          this.type = type;
          this.root_name = name
          this.color = app.page.fillColors(Math.random() * (10 - 1) + 1).pop();
        }

        genTemplate(){
          let temp = {};
          temp[this.root_name] = [];

          temp[this.root_name].push({
            color: this.color,
            name: this.root_name,
            type: this.type,
            dataPoints: [this.dps]
          });

          template.datapoints.push({y: this.dps.y, name: this.root_name, color: this.color});

          return temp;
        }

        static get_data_points(){
          return this.datapoints;
        }
      };

      var objects = [];

      for(let x in parse.data){

        let obj = new template({
          x: parse.data[x].Client,
          y: parse.data[x].tot_client
        }, parse.data[x].Client, 'pie');

        objects.push(obj.genTemplate());
      }

      var chart_data = {
        "Work orders created": [{
          click: chartDrilldownHandler,
          cursor: "pointer",
          explodeOnClick: false,
          innerRadius: "75%",
          legendMarkerType: "square",
          name: "Work orders created",
          radius: "100%",
          showInLegend: true,
          startAngle: 90,
          type: "pie",
          dataPoints: template.get_data_points()
        }]
      };

      for(let z in objects){
        for(let y in objects[z]){
          chart_data[y] = objects[z][y];
        }
      }

      var chart_options = {
        animationEnabled: true,
        theme: "light2",
        title: {text: "Work orders created"},
        legend: {fontFamily: "calibri",fontSize: 14},
        data: []
      };

      var drilldownedChartOptions = {
        animationEnabled: true,
        theme: "light2",
        axisX: {labelFontColor: "#717171",lineColor: "#a2a2a2", tickColor: "#a2a2a2"},
        axisY: {gridThickness: 0,includeZero: false,labelFontColor: "#717171", lineColor: "#a2a2a2",tickColor: "#a2a2a2",lineThickness: 1},
        data: []
      };

      var chart = new CanvasJS.Chart("work_orders", chart_options);
      chart.options.data = chart_data["Work orders created"];
      chart.render();

      function chartDrilldownHandler(e) {
        chart = new CanvasJS.Chart("work_orders", drilldownedChartOptions);
        chart.options.data = chart_data[e.dataPoint.name];
        chart.options.title = { text: e.dataPoint.name }

        chart.render();
        $("#chart_drill_back").toggleClass("invisible");
      }

      $("#chart_drill_back").unbind().click(function() { 
        $(this).toggleClass("invisible");
        chart = new CanvasJS.Chart("work_orders", chart_options);
        chart.options.data = chart_data["Work orders created"];
        chart.render();
      });
  }
}