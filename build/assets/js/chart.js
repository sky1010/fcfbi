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
              datasets: [{ data: temp.val, backgroundColor: ["#005f73", "#94d2bd", "#e9d8a6", "#ee9b00", "#ca6702", "#bb3e03", "#ae2012", "#c9184a", "#ff8fa3", "#a5a58d"]}]
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
                title: { display: true, text: 'Priority' }
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
              datasets: [{ data: temp.val, backgroundColor: ["#005f73", "#94d2bd", "#e9d8a6", "#ee9b00", 
              "#ca6702", "#bb3e03", "#ae2012", "#c9184a", "#ff8fa3", "#a5a58d"]}]
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
                title: { display: true, text: 'Work type' }
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
  }
}

