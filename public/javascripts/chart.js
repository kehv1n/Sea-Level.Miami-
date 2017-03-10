
function displayLineChart() {
 var data = {
     labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
     datasets: [
         {
             label: "Bench Press",
             backgroundColor: "rgba(223, 137, 137, 0.5)",
             borderColor: "rgb(111, 36, 33)",
             pointColor: "rgba(220,220,220,1)",
             pointStrokeColor: "#e71616 ",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(220,220,220,1)",
             data: [185, 185, 190, 195, 210, 215, 195, 245, 245, 250]
         },
         {
             label: "Squat",
             backgroundColor: "rgba(0, 161, 241, 0.4)",
             borderColor: "#00A1F1 ",
             pointColor: "rgba(151,187,205,1)",
             pointStrokeColor: "rgb(34, 170, 161)",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(151,187,205,1)",
             data: [315, 320, 345, 365, 370, 395, 400, 420, 430, 435]
         }
     ]
 };
 var ctx = document.getElementById("myLineChart").getContext("2d");
 var options = { };
 var lineChart= new Chart(ctx , {
   type: "line",
   data: data,
   options: {
     legend: {
       height: 10,
       display: true,
       labels: {
         fontSize: 24,
         fontColor: 'rgb(0, 0, 0)',
       }
     }
   }
});
}

displayLineChart();

// function displayLineChart() {


  //var UniqueYearsMonths = $.unique(data.map(function (d) {
    //  return "" + d.Year + "." + d.Month;}));

  //$('#div').html(JSON.stringify(UniqueYearsMonths,null,'\t'));


// function displayLineChart() {
//   var data = {
//       labels: ["January", "February", "March", "April", "May", "June", "July"],
//       datasets: [
//           {
//               label: "CO-OPS__8721604__ml_Trident_Pier",
//               fill: false,
//               lineTension: 0.1,
//               backgroundColor: "rgba(75,192,192,0.4)",
//               borderColor: "rgba(75,192,192,1)",
//               borderCapStyle: 'butt',
//               borderDash: [],
//               borderDashOffset: 0.0,
//               borderJoinStyle: 'miter',
//               pointBorderColor: "rgba(75,192,192,1)",
//               pointBackgroundColor: "#fff",
//               pointBorderWidth: 1,
//               pointHoverRadius: 5,
//               pointHoverBackgroundColor: "rgba(75,192,192,1)",
//               pointHoverBorderColor: "rgba(220,220,220,1)",
//               pointHoverBorderWidth: 2,
//               pointRadius: 1,
//               pointHitRadius: 10,
//               data: MSLArr,
//               spanGaps: false,
//           }
//       ]
//   };
//
//   var ctx = document.getElementById("myLineChart");
//
//   var myLineChart = Chart.Line(ctx, {
//      data: data,
//   //options: options
//   });
// }
//
// displayLineChart();
