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

		page = $(this) // Don't wanna make this call a bunch, so just make a var with it

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

/* This function gets patient data via ajax, hopefully on an interval. */
function get_patient_data(patient_id) {
	var result;
	$.ajax({ // this literally fires off an ajax request
		url: '/ajax/get_patient_data/',
		async:false, // will lock browser while waiting for response from server- allows time to load
		//type: 'post',
		data: {
			'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
			'patient_id': patient_id
		},
		dataType: 'json',
		success: function (data) { // this data is literally sensors data pertaining to the patient id. 'data' is passed into 'success' function
			//console.log(data);
			result = data;
			//handleData(data);
		}
	}); // end ajax

	return result;
}

/* This function controls the toggle of a patient object to open/close a patient graph. It also instantiates a canvas for the patient graph when opened.*/
function open_patient_graph(patient_id) {
	console.log(patient_id);
	var p = $('patient_'+patient_id);
	var ctx = document.getElementById(patient_id+'_graph').getContext('2d'); // instantiates opened graph
	var cvs = $("#"+patient_id+"_graph");
	var myChart; // instantiate new chart object
	var data;
	var intervalId;

	if(cvs.css('display') == 'none'){ // open the div
		console.log("FLAG1");
		console.log(patient_id);

		data = get_patient_data(patient_id); // returns array of sensor_data objects (hopefully);
		//console.log(data);
		var len = data.length;
		var times=[];
		var temps=[];
		var hum=[];
		for(var i=len-1; i>=0; i--) { // patient data array we receive is listed from most to least recent; so read it out backwards
			unix_timestamp = data[i].fields.time;     // Grab the initial unix timestamp
			var date = new Date(unix_timestamp * 1000);   // Multiply by 1000 so it's in ms
			var title = date.toLocaleDateString('en-US', {
										day : 'numeric',
										month : 'short',
										year : 'numeric',
								})
			var hour = date.getHours();                 // Get the hour of day
			var minute = "0" + date.getMinutes();       // Get the minute
			var second = "0" + date.getSeconds();       // Get the seconds. Probably don't need
			var time = hour + ':' + minute.substr(-2) + ':' + second.substr(-2);
			times.push(time);
			temps.push(data[i].fields.temperature);
			hum.push(data[i].fields.humidity);
		}


		myChart = new Chart(ctx, {
				type: 'line',
				data: {
						labels: times,
						datasets: [{
								label: 'Temperature',
								data: temps,
								backgroundColor: [
										'rgba(255, 255, 255, 0)',
								],
								borderColor: [
										'rgba(200, 50, 50, 1)',
								],
								borderWidth: 3,
						}, {
								label: 'Humidity',
								data: hum,
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
						title: {
						    display: true,
						    text: title,
						    fontSize: 18,
						},
				}
		});
		setTimeout(function(){ // Set timeout to ensure that the ajax request has fired and canvas has loaded...
			cvs.css("display", "block"); // Open the image (make it visible) without animation
			p.css('height', 'auto'); // Set div to auto height
			var ch = p.height(); // save curr height
			cvs.css("display", "none"); // close the image
			p.animate({height:ch},200);
			cvs.css("display", "block"); // Open the image
		}, 1000);
		intervalId = setInterval(function(){ // set interval to pull new data/update chart every 30 seconds
			data = get_patient_data(patient_id);
			console.log("FETCH FROM DATABASE + UPDATE");
			console.log(data);

			var len = data.length;
			var times=[];
			var temps=[];
			var hum=[];
			for(var i=len-1; i>=0; i--) { // patient data array we receive is listed from most to least recent; so read it out backwards
				unix_timestamp = data[i].fields.time;     // Grab the initial unix timestamp
				var date = new Date(unix_timestamp * 1000);   // Multiply by 1000 so it's in ms
				var title = date.toLocaleDateString('en-US', {
											day : 'numeric',
											month : 'short',
											year : 'numeric',
									})
				var hour = date.getHours();                 // Get the hour of day
				var minute = "0" + date.getMinutes();       // Get the minute
				var second = "0" + date.getSeconds();       // Get the seconds. Probably don't need
				var time = hour + ':' + minute.substr(-2) + ':' + second.substr(-2);
				times.push(time);
				temps.push(data[i].fields.temperature);
				hum.push(data[i].fields.humidity);
			}

			for(var i=len-1; i>=0; i--){ // update existing x chart labels, temp/humidity values to reflect most recent pull from db
				myChart.data.labels[i] = times[i];
				myChart.data.datasets[0].data[i] = temps[i];
				myChart.data.datasets[1].data[i] = hum[i];
			}
			myChart.update();

		}, 30000); // every 30 sec
	} else { // close the div
		cvs.css("display", "none"); // close the image
		p.css('height', 'auto'); // Set div to auto height
		var ah = p.height(); // save auto height
		cvs.css("display", "block"); // Open the image
		p.animate({height:ah},200);
		cvs.css("display", "none"); // close the image
		clearInterval(intervalId);
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
<<<<<<< HEAD
=======

// if mouse is over the "dirty" status of a patient, content of blurb is changed to 'resolve'
function on_hover_dirty_status(patient_id) {
	var patient_tag = "#patient_"+patient_id; // reserve the tag id
	var $patient = $(patient_tag); // this is the patient div
	$patient.find(".status_dirty").text("resolve"); // this ensures that only a patient with a class "status_dirty" is affected
}

// if mouse is over the "dirty" status of a patient, content of blurb is changed to 'event'
function on_leave_dirty_status(patient_id) {
	var patient_tag = "#patient_"+patient_id; // reserve the tag id
	var $patient = $(patient_tag); // this is the patient div
	$patient.find(".status_dirty").text("event"); // this ensures that only a patient with a class "status_dirty" is affected
}

// the patient status will be dirty at this point. resolve to clean
function resolve_event(patient_id) {
	var patient_tag = "#patient_"+patient_id; // reserve the tag id
	var $patient = $(patient_tag); // this is the patient div
	console.log("FLAG3");
	console.log(patient_tag);
	console.log($patient);
	$patient.find(".status_dirty").addClass("status_clean");
	$patient.find(".status_dirty").removeClass("status_dirty");
	console.log("DONE!")
	$patient.find(".status_clean").text("clean");

	$.ajax({ // this literally fires off an ajax request -> urls.py "ajax/get_patient/" -> views.py "ajax_get_patient"
		url: '/ajax/set_patient_status_clean/',
		async:false, // will lock browser while waiting for response from server: allows time to load
		//type: 'post',
		data: {
			'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
			'patient_id': patient_id
		},
		dataType: 'json',
		success: function (data) { // this data is literally sensors data pertaining to the patient id. 'data' is passed into 'success' function

		}
	}); // end ajax request
}
>>>>>>> tmp
