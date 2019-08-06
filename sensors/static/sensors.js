/*
Kelvin Filyk
April/May 2019

These jquery functions control visual aspects of the dashboard and home pages of the CareChanger site.
*/

/* This function controls the dynamic nav bar color/height change due to a user scroll*/
$(function () { /* Using $(function () {}); Ensures that the document (webpage has fully loaded- then compiles js) */
	$('body').scroll(function () {
		var $nav = $("#nav");
		var $ul = $("ul");
        var $a = $("a"); //new
		var $nav_link = $(".nav_link");

		console.log($ul.height())

		page = $(this)      // Don't wanna make this call a bunch, so just make a var with it

		$nav.toggleClass('scrolled', page.scrollTop() > $nav.height());
		$ul.toggleClass('scrolled', page.scrollTop() > $nav.height());
		$nav_link.toggleClass('scrolled', page.scrollTop() > $nav.height());
    $a.toggleClass('scrolled', page.scrollTop() > $nav.height());
		console.log($("#dash_nav").length);
		if($("#dash_nav").length == 0) { //check to see if the div with id="dashnav" exists. If so, currently viewing dashboard
			var $dash_nav = document.getElementById('dash_nav');
			if(page.scrollTop() > $nav.height()){
				$dash_nav.style.top = 60;
			} else {
				$dash_nav.style.top = 100;
			}
		}
			/* https://jsfiddle.net/we9L9h2r/ */
			//console.log($(this).scrollTop());
			//console.log("NAV HEIGHT:", $nav.height());
	});
});

/* This function controls the toggle of a patient object to open/close a patient graph. It also instantiates a canvas for the patient graph when opened.*/
function open_patient_graph(patient_id) {
	console.log(patient_id);
	var p = $('patient_'+patient_id);
	var ctx = document.getElementById(patient_id+'_graph').getContext('2d'); // instantiates opened graph
	var cvs = $("#"+patient_id+"_graph");
	if(cvs.css('display') == 'none'){ // open the div
		console.log("FLAG1");
		console.log(patient_id);
		$.ajax({ // this literally fires off an ajax request
			url: '/ajax/get_patient_data/',
			//type: 'post',
			data: {
				'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
				'patient_id': patient_id
			},
			dataType: 'json',
			success: function (data) { // this data is literally sensors data pertaining to the patient id
				console.log(data)
				var len = data.length;
				var recent;
				var recent_times=[];
				var recent_temps=[];
				var recent_hum=[];
				var num_of_samples = 180;      // Change this value to adjust amount of data shown on chart

				if(len>num_of_samples){
					recent = data.slice(data.length-num_of_samples, data.length);
					console.log(recent.length);
					for(var i=0; i<recent.length; i++){
						/*console.log(i);*/
						unix_timestamp = recent[i].fields.time;     // Grab the initial unix timestamp
						var date = new Date(unix_timestamp * 1000);   // Multiply by 1000 so it's in ms
						var hour = date.getHours();                 // Get the hour of day
						var minute = "0" + date.getMinutes();       // Get the minute
						var second = "0" + date.getSeconds();       // Get the seconds. Probably don't need
						var time = hour + ':' + minute.substr(-2) + ':' + second.substr(-2);
						recent_times.push(time);
						recent_temps.push(recent[i].fields.temperature);
						recent_hum.push(recent[i].fields.humidity);
					}
				}

				var myChart = new Chart(ctx, {
						type: 'line',
						data: {
								labels: recent_times,
								datasets: [{
										label: 'Temperature',
										data: recent_temps,
										backgroundColor: [
												'rgba(255, 255, 255, 0)',
										],
										borderColor: [
												'rgba(200, 50, 50, 1)',
										],
										borderWidth: 3,
								}, {
										label: 'Humidity',
										data: recent_hum,
										backgroundColor: [
												'rgba(255, 255, 255, 0)',
										],
										borderColor: [
												'rgba(50, 50, 200, 1)',
										],
										borderWidth: 3,
								}]
						},
						options: {
								scales: {
										yAxes: [{
												ticks: {
														beginAtZero: true
												}
										}],
										xAxes: [{
										    //type: 'time',
										    ticks: {
										        autoSkip: true,
										        maxTicksLimit: 20
										    }
										}]
								},
								elements: {
										point: {
												radius: 0      // Gets rid of the data point dots on the line
										}
								},
						}
				});
			}
		}); // end ajax
		setTimeout(function(){ // Set timeout to ensure that the ajax request has fired and canvas has loaded...
			cvs.css("display", "block"); // Open the image (make it visible) without animation
			p.css('height', 'auto'); // Set div to auto height
			var ch = p.height(); // save curr height
			cvs.css("display", "none"); // close the image
			p.animate({height:ch},200);
			cvs.css("display", "block"); // Open the image
		}, 1000);
	} else { // close the div
		cvs.css("display", "none"); // close the image
		p.css('height', 'auto'); // Set div to auto height
		var ah = p.height(); // save auto height
		cvs.css("display", "block"); // Open the image
		p.animate({height:ah},200);
		cvs.css("display", "none"); // close the image
	}
}

/* This function changes the caregroup patients being currently viewed */
$(function(){
	$(".ajax_change_caregroup").on('click', function () {
		var caregroup = $(this).val();
		console.log(caregroup);
	  $.ajax({ // this literally fires off an ajax request
	    url: '/ajax/change_caregroup/',
	    data: {
	      'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
	      'caregroup': caregroup
	    },
	    dataType: 'json',
	    success: function (data) {
	      if (data.success) {
	        console.log("ajax call success.");
	        // here you update the HTML to change the active to innactive
					window.location.reload();
	      } else {
	        console.log("ajax call not success.");
					window.location.reload();
	      }
	    }
	  });
	});
});
