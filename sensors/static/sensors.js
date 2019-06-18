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
		var $dash_nav = document.getElementById('dash_nav');

		console.log($ul.height())

		$nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
		$ul.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
		$nav_link.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    $a.toggleClass('scrolled', $(this).scrollTop() > $nav.height());

		if($(this).scrollTop() > $nav.height()){
			$dash_nav.style.top = 60;
		} else {
			$dash_nav.style.top = 100;
		}
		/* https://jsfiddle.net/we9L9h2r/ */
		//console.log($(this).scrollTop());
		//console.log("NAV HEIGHT:", $nav.height());
	});
});

/* This function controls the toggle of a patient object to open/close a patient graph */
$(function(){
	var i=0;
	$(".patient").click(function(){
		i=(i+1)%2;
		if(i==1){ // open the div
			$(this).find("canvas").css("display", "block"); // Open the image
			$(this).css('height', 'auto'); // Set div to auto height
			var ch = $(this).height(); // save curr height
			$(this).find("canvas").css("display", "none"); // close the image
			$(this).animate({height:ch},200);
			$(this).find("canvas").css("display", "block"); // Open the image
		} else { // close the div
			$(this).find("canvas").css("display", "none"); // close the image
			$(this).css('height', 'auto'); // Set div to auto height
			var ah = $(this).height(); // save auto height
			$(this).find("canvas").css("display", "block"); // Open the image
			$(this).animate({height:ah},200);
			$(this).find("canvas").css("display", "none"); // close the image
		}
	});
});

/* This function changes the caregroup patients being currently viewed */
$(function(){
	$(".ajax_trigger1").on('click', function () {
		var caregroup = $(this).val();
		console.log(caregroup)
	  $.ajax({
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
	      }else{
	        console.log("ajax call not success.");
					window.location.reload();
	      }
	    }
	  });
	});
});

$(function() {
	var ctx = document.getElementById('patient_graph').getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	        datasets: [{
	            label: '# of Votes',
	            data: [12, 19, 3, 5, 2, 3],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
	    }
	});
});
