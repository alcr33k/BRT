$(document).ready(function(){
  'use strict';
	// JQuery
	$('#main').on('click','#closeBtn', function(){ // close table
		$(this).parent().hide();
		$(".BRT").remove();
		$("#aT1").show();
		$("#eT1").show();
		$("#editTable").show();
		$("#addTable").show();
	});
	$("#newTable").click(function(){
		$("#aT1").hide();
		$("#aT2").show();
		$("#editTable").hide();
		$("#createTableForm").show();
	});
	$('#main').on('click','#createTableBtn', function(){
		var tableName = $('#tblName').val();
		var numCol = $('#numColumns').val();
		var numRows = $('#numRows').val();
		var errorStatus = errorControl(tableName, numCol, numRows);
		checkIfTableExists(tableName, function(data) { // get html for table with tableName, using callback
			if(data != "false") { // check so no ither table exists with the selected table name  
				$(".error").remove();
				$("#aT2").append('<p class="error">The table name you selected already exists, please choose another name.</p>');
			} 
			else if(errorStatus[0] === false) { // the javascript error handling found an error
				$(".error").remove();
				$("#aT2").append(errorStatus[1]);
			} else {
				$("#aT2").hide();
				$("#aT3 h1").text("Table: " + tableName);
				// code for creating the empty table
				$(".BRT").remove(); // remove all old tables might be shown
				var tableCode = '<br><table class="BRT preview"><tbody>';
				for(var i = 0; i < numRows; i++) {
					if(i == 0){
						tableCode += "<tr>";
						for(var z = 0; z < numCol; z++) {
							tableCode += "<th></th>";
						}
						tableCode += "</tr>";
					}else{
						tableCode += "<tr>";
						for(var z = 0; z < numCol; z++){
							tableCode += "<td></td>";
						}
						tableCode += "</tr>";
					}
				}
				tableCode += '</tbody></table>';
				// append table, add style, show the table and add the table name 
				$("#prT").append(tableCode);
				var columnWidth = 100 / numCol;
				$("#prT td, #prT th").css("width",columnWidth + "%");
				$("#aT3").show();
				$("#tName").val(tableName);		
			}
		});
	});
	$("#eT1Btn").click(function(){
		$("#eT1").hide();
		$("#addTable").hide();
		// add table names to dropdown
		$.ajax({
			type: 'POST',
			url: '../BRT/incl/form-action.php',
			data: "action=getNames", // not safe need to secure table value
			success: function(data)
			{	
				if(data == "none") {
					$('#editSelect option[value="none"]').text("No tables available");
					$('#editTableBtn').prop("disabled",true);
				} else {
					var tableNames = data.split(":");
					for(var i = 0; i < tableNames.length; i++) {
						$("#editSelect").append("<option value="+tableNames[i]+">"+tableNames[i]+"</option>");
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				alert("Status: " + textStatus); alert("Error: " + errorThrown); 
			}       
		});
		$("#editTableForm").show();
		$("#eT2").show();
	});
	$("#editTableBtn").click(function(){
		$("#eT2").hide();
		var tableName = $('#editSelect').val(); // get the selected table name
		$("#eT3 h1").text("Edit table: " + tableName);
		$(".BRT").remove(); // remove all old tables might be shown
		getTableCode(tableName, function(data) { // get html for table with tableName, using callback
			var tableCode = '<br><table class="BRT preview">' + data + '</table>';
			$("#eprT").append(tableCode); // append table
			$("#eT3").show(); // show table
		});
		$("#etName").val(tableName);	
	});
	
	$("#saveEditForm").submit(function(e) { // save any edits
		$("#cursor").remove();
		$("#tableForm").removeClass(".selected");
		$("#etHtml").val($("#eprT .BRT").html());
		$.ajax({
			type: 'POST',
			url: '../BRT/incl/form-action.php',
			data: $("#saveEditForm").serialize(), // serializes the form's elements.
			success: function(data)
			{
				$("#eT3").hide();
				$("#eT1").show();
				$(data).hide().prependTo("#eT1").fadeIn(2000).fadeOut(2000);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				alert("Status: " + textStatus); alert("Error: " + errorThrown); 
			}       
		});
		e.preventDefault();
	});
	
	// code for edit toolbar
	$("#columnsBtn, #eColumnsBtn").click(function(){
		$(this).toggleClass("active");
		$(".column-dropdown").toggle();
	});
	$("#fontBtn, #eFontBtn").click(function(){
		$(this).toggleClass("active");
		$(".font-dropdown").toggle();
	});
	$("#colorBtn, #eColorBtn").click(function(){
		$(this).toggleClass("active");
		$(".color-dropdown").toggle();
	});
	$("#fontsizeBtn, #eFontsizeBtn").click(function(){
		$(this).toggleClass("active");
		$(".fontsize-dropdown").toggle();
	});
	$("#rateBtn").click(function(){
		if((!$("#rateBtn").hasClass("disabled")) && (!$(".BRT td img").hasClass("ratingC"))) { // and no rating found
			$(this).toggleClass("active");
			$("#rating-dropdown").toggle();
		}
	});
	$("#boldBtn, #eBoldBtn").click(function(){
		$(this).toggleClass("active");
		$(".BRT .selected span").toggleClass("bold");
	});
	
	$("#italicBtn, #eItalicBtn").click(function(){
		$(this).toggleClass("active");
		$(".BRT .selected span").toggleClass("italic");
	});
	
	$("#underlineBtn, #eUnderlineBtn").click(function(){
		$(this).toggleClass("active");
		$(".BRT .selected span").toggleClass("underline");
	});
	
	$(".font-dropdown li").click(function(){
		$(".font-dropdown li").removeClass('active');
		$(this).addClass('active');
		// remove any font that exists
		var fonts = ["arial", "timesnew", "georgia", "courier", "trebucchet", "verdana", "helvetica"];
		$(".BRT .selected span").removeClass(fonts.join(' '));
		// get selected font and add
		var font = $(this).attr('class');
		$(".BRT .selected span").addClass(font);
		$("#fontBtn").removeClass('active');
		$(".font-dropdown").hide();
	});
	
	$(".fontsize-dropdown li").click(function(){
		$(".fontsize-dropdown li").removeClass('active');
		$(this).addClass('active');
		var fontSize = $(this).attr('id');
		console.log(fontSize);
		var currentStyle = $(".BRT .selected span").attr('style');
		if(typeof $(".BRT .selected span").html() != 'undefined') {
			if($(".BRT .selected span").css('font-size').length != 0) { // has no font-size, add choosen value
				$(".BRT .selected span").attr('style', currentStyle + ' font-size:' + fontSize + 'px;');
			} else { // already has font-size, change it to choosen value
				var newStyle = currentStyle.splice(currentStyle.indexOf('font-size:'), currentStyle.indexOf('px') - currentStyle.indexOf('font-size:'), fontSize);
			}
		}
		$("#fontsizeBtn").removeClass('active');
		$(".fontsize-dropdown").hide();
	});
	
	$("#addC").click(function(){
		// need to get number of rows / columns, schould be able to get them with index
		var newnumberOfColumns = $(".BRT").find('tr')[1].cells.length + 1;
		// var numberOfRows = $(".BRT").find('tr').length;
		var columnWidth = 100 / newnumberOfColumns;
		if($(".BRT th").length) {
			$(".BRT tr:first").append("<th></th>");
		}
		$(".BRT tr:gt(0)").append("<td></td>");
		$("#prT td, #prT th").css("width",columnWidth + "%");
	});
	
	$("#addR").click(function(){
		var numberOfColumns = $(".BRT").find('tr')[1].cells.length;
		var toAdd = "<tr>";
		for(var z = 0; z < numberOfColumns; z++) {
			toAdd += "<td></td>";
		}
		toAdd += "</tr>";
		$(".BRT tbody").append(toAdd);
	});
	
	$("#deleteR").click(function(){
		var numberOfRows = $(".BRT").find('tr').length;
		if(numberOfRows > 2) {
			$(this).toggleClass("active");
			if($("#confirmBox").html().indexOf("This will remove") < 0) {
				$("#confirmBox").prepend("<p>This will remove the last row and all it´s content.</p>");
			}
			$("#confirmBox").toggle();
		}
	});
	
	$("#deleteC").click(function(){
		var numberOfColumns = $(".BRT").find('tr')[1].cells.length;
		if(numberOfColumns > 2) {
			$(this).toggleClass("active");
			if($("#confirmBox").html().indexOf("This will remove") < 0) {
				$("#confirmBox").prepend("<p>This will remove the last column and all it´s content.</p>");
			}
			$("#confirmBox").toggle();
		}
	});
	
	$("#deleteTh").click(function(){
		$(this).toggleClass("active");
		if($("#confirmBox").html().indexOf("This will remove") < 0) {
			$("#confirmBox").prepend("<p>This will remove the the table header and all it´s content.</p>");
		}
		$("#confirmBox").toggle();
	});
	
	$("#addStars").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="stars" id="starRating" class="ratingC" src="http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/stars/stars0.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/stars/star-disabled.png")
	});
	
	$("#addThumb").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="thumbup"  id="thumbup" class="ratingC thumbRating" src="http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/thumbs/thumb.png"><img id="thumbdown" alt="thumbdown" class="ratingC thumbRating" src="http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/thumbs/thumbdown.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "incl/img/stars/star-disabled.png")
	});
	
	$("#addVotes").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="thumbup" id="upvote" class="ratingC" src="http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/upvotes/upvote.png"><br><img alt="thumbdown" id="downvote" class="ratingC" src="http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/upvotes/downvote.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "incl/img/stars/star-disabled.png")
	});
	
	$("body").on('click','#upvote', function(){
		if((!($('#downvote').hasClass("clicked"))) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/upvotes/upvote-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			var tableRow = $(this).parent().parent().children().index($(this).parent()) +1; 
			var selector = $(this);
			updateVotes("1", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('downvote.png">') + 14) + "Thanks for voting!";
				console.log(newCode);
				selector.parent().html(newCode);
			});
		}
	});
	
	$("body").on('click','#downvote', function(){
		if((!($('#upvote').hasClass("clicked"))) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/upvotes/downvote-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			var tableRow = $(this).parent().parent().children().index($(this).parent()) +1; 
			var selector = $(this);
			updateVotes("0", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('downvote-clicked.png">') + 22) + "Thanks for voting!";
				selector.parent().html(newCode);
			});
		}
	});
	
	$("body").on('click','#thumbup', function(){
		if((!($('#thumbdown').hasClass("clicked"))) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/thumbs/thumb-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			var tableRow = $(this).parent().parent().children().index($(this).parent()) +1; 
			var selector = $(this);
			updateVotes("1", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('thumbdown.png">') + 15) + "Thanks for voting!";
				selector.parent().html(newCode);
			});
		}
	});
	
	$("body").on('click','#thumbdown', function(){
		if((!($('#thumbup').hasClass("clicked"))) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/thumbs/thumbdown-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			var tableRow = $(this).parent().parent().children().index($(this).parent()) +1;
			var selector = $(this);			
			updateVotes("0", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('thumbdown-clicked.png">') + 23) + "Thanks for voting!";
				selector.parent().html(newCode);
			});
		}
	});
	$("#confirmL").click(function(){
		if($("#deleteC").hasClass("active")) {
			$(".BRT th:last-child, .BRT td:last-child").remove();
		} else if($("#deleteR").hasClass("active")) {
			$(".BRT tr:last-child").remove();
		} else if($("#deleteTh").hasClass("active")) {
			$(".BRT th").remove()
		}
		$("#confirmBox").hide();
		$(".column-dropdown li").removeClass("active");
		$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
	});
	
	$("#declineL").click(function(){
		$("#confirmBox").hide();
		$(".column-dropdown li").removeClass("active");
		$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
	});
	
	// code for preview table
	$('#main').on('click','.BRT th, .BRT td', function(){
		$(".BRT th, .BRT td").removeClass("selected");
		if(!$(".BRT td img").hasClass("ratingC")) {
			$("#rateBtn").removeClass("disabled");
			$("#rateBtn img").attr("src", "http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/stars/star.png")
		}
		$("#cursor").remove();
		$(this).addClass("selected");
		$(this).append('<span id="cursor">|</span>');		
	});
	/*
	$("#cursor").ready(function() {
		setInterval ('cursorAnimation()', 600);
	});
	*/
	
	$(".selected").ready(function() { // delete letter
		$(document).on('keydown', function(e) {
			if(e.keyCode == 8) { 
				if($(".selected img").hasClass("ratingC")) { // code to remove rating
					$(".BRT th").removeClass("rating");
					$(".ratingC").remove();
					$("#rateBtn").removeClass("disabled");
					$("#rateBtn img").attr("src", "http://www.student.bth.se/~albh14/javascript/projekt/BRT/incl/img/stars/star.png")
				}
				// code to remove letter
				$("#cursor").remove();
				var currentText = $(".BRT .selected span").text();
				var newText = currentText.substring(0, currentText.length - 1);
				$(".BRT .selected span").text(newText);
				$(".BRT .selected span").append('<span id="cursor">|</span>');
			}
		});
		
		$(document).on('keypress', function(e) { // add letter
			if(($("th").hasClass("selected")) || ($("td").hasClass("selected"))) { // schould only do this when a tablerow or header is selected
				$("#cursor").remove();
				var htmlToAdd = "";
				var currentText = $(".selected").text();
				var currentHtml = $(".selected").html();
				// remove all end-tags at end of string
				if (currentHtml.match("</span>$")) {
					currentHtml = currentHtml.replace("</span>","");
				}
				if(currentText.length == 0) { // add style and fonts on first keypress in beginning
					if(($(".font-dropdown li").hasClass("active")) || ($(".fontsize-dropdown li").hasClass("active")) || ($(".hex input").val() != "")) {
						htmlToAdd += '<span class=';
						if($(".font-dropdown li").hasClass("active")) {
							console.log($(".font-dropdown .active").attr('class').split(' ')[0]);
							htmlToAdd += '"' + $(".font-dropdown .active").attr('class').split(' ')[0] + '"';
						}
						if(($(".fontsize-dropdown li").hasClass("active")) && ($(".hex input").val() != "")) {
							htmlToAdd += '"" style="font-size:' + $(".fontsize-dropdown .active").attr('id') + 'px; color: ' + $(".hex input").val() +';"';
						} else if ($(".fontsize-dropdown li").hasClass("active")) {
							htmlToAdd += '"" style="font-size:' + $(".fontsize-dropdown .active").attr('id') + 'px;"';
						} else if($(".hex input").val() != "") {
							htmlToAdd += '"" style="color: ' + $(".hex input").val() +';"';
						}
						htmlToAdd += '>';
					} else {
						htmlToAdd += '<span class="">';
					}
				}
				var key = e.keyCode || e.which;
				if(key > 46) { // do not add keys such as arrows, insert or f1
					htmlToAdd += e.key;
				}
				if(htmlToAdd.indexOf("<span>") != -1) {
					htmlToAdd += "</span>";
				}
				$(".selected").html(currentHtml + htmlToAdd);
				if($(".BRT .selected span").hasClass("active")) { // some wierd cases span has active class, remove it then
					$(".BRT .selected span").removeClass("active");
				}
				if(currentText.length == 0) { // add more classes on first keypress in beginning
					if(($("#boldBtn").hasClass("active")) && (!$(".BRT .selected span").hasClass("bold"))) {
						$(".BRT .selected span").addClass("bold");
					}
					if(($("#italicBtn").hasClass("active")) && (!$(".BRT .selected span").hasClass("italic"))) {
						$(".BRT .selected span").addClass("italic");
					}
					if(($("#underlineBtn").hasClass("active")) && (!$(".BRT .selected span").hasClass("underline"))) {
						$(".BRT .selected span").addClass("underline");
					}
				}
				$(".selected").append('<span id="cursor">|</span>');
			}
		});
	});
	
	$("#tableForm").submit(function(e) { 
		$("#cursor").remove();
		$("#tableForm").removeClass(".selected");
		$("#tHtml").val($(".BRT").html());
		$.ajax({
			type: 'POST',
			url: '../BRT/incl/form-action.php',
			data: $("#tableForm").serialize(), // serializes the form's elements.
			success: function(data)
			{
				$("#aT3").hide();
				$("#aT1").show();
				$(data).hide().prependTo("#aT1").fadeIn(2000).fadeOut(2000);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
        alert("Status: " + textStatus); alert("Error: " + errorThrown); 
			}       
		});
		e.preventDefault();
	});
	
	// code for color picker
	// rbgToHex thanks to http://www.javascripter.net/faq/rgbtohex.htm
	function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
	function toHex(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
	}
	// create table canavs
	var canvas = document.getElementById('color_picker').getContext('2d');
	var img = new Image();
	img.src = 'incl/img/color-palette.jpg';
	canvas.drawImage(img,0,0);
	// $('#main').on('click','.color_picker', function(event){
	$("#color_picker").click(function(event){
		// getting user coordinates
		var offsetTop = $("#color_picker").offset().top;
		var offsetLeft = $("#color_picker").offset().left;
		var x = event.pageX - offsetLeft;
		var y = event.pageY - offsetTop;
		// getting image data and RGB values
		var img_data = canvas.getImageData(x, y, 1, 1).data;
		var R = img_data[0];
		var G = img_data[1];
		var B = img_data[2]; 
		// convert RGB to HEX
		var hex = rgbToHex(R,G,B);
		// making the color the value of the input
		$('.hex input').val('#' + hex);
		var color = $(".hex input").val();
		if(typeof $(".BRT .selected span").html() != 'undefined') { // there is text to change color
			var currentStyle = $(".BRT .selected span").attr('style');
			if($(".BRT .selected span").css('color').length != 0) { // has no color, add choosen value
				$(".BRT .selected span").attr('style', currentStyle + ' color:' + color + ';');
			} else { // already has color, change it to choosen value
				var newStyle = currentStyle.splice(currentStyle.indexOf('color:'), currentStyle.indexOf(';', currentStyle.indexOf('color:')), color);
			}
		}
		$("#colorBtn").removeClass('active');
		$(".color-dropdown").hide();
	});
	// edit table canvas
	var canvas2 = document.getElementById('color_picker2').getContext('2d');
	canvas2.drawImage(img,0,0);
	$("#color_picker2").click(function(event){
		// getting user coordinates
		var offsetTop = $("#color_picker2").offset().top;
		var offsetLeft = $("#color_picker2").offset().left;
		var x = event.pageX - offsetLeft;
		var y = event.pageY - offsetTop;
		// getting image data and RGB values
		var img_data = canvas.getImageData(x, y, 1, 1).data;
		var R = img_data[0];
		var G = img_data[1];
		var B = img_data[2]; 
		// convert RGB to HEX
		var hex = rgbToHex(R,G,B);
		// making the color the value of the input
		$('.hex input').val('#' + hex);
		var color = $(".hex input").val();
		if(typeof $(".BRT .selected span").html() != 'undefined') { // there is text to change color
			var currentStyle = $(".BRT .selected span").attr('style');
			if($(".BRT .selected span").css('color').length != 0) { // has no color, add choosen value
				$(".BRT .selected span").attr('style', currentStyle + ' color:' + color + ';');
			} else { // already has color, change it to choosen value
				var newStyle = currentStyle.splice(currentStyle.indexOf('color:'), currentStyle.indexOf(';', currentStyle.indexOf('color:')), color);
			}
		}
		$("#eColorBtn").removeClass('active');
		$(".color-dropdown").hide();
	});
});
// helpful functions
function errorControl(tableName, numCol, numRows) { // error handling for creating a table
	if((tableName == "") || (numCol == "") || (numRows == "")){
		return [false, '<p class="error">All colummns must be filled in</p>'];
	}
	else if(isNaN(parseInt(numCol)) == true){
		return [false, '<p class="error">Number of colummns must be a number between 2 and 15</p>'];
	}
	else if((parseInt(numCol) < 2) || (parseInt(numCol) > 15)){
		return [false, '<p class="error">Number of colummns must be a number between 2 and 15</p>'];
	}
	else if(isNaN(parseInt(numRows)) == true){
		return [false, '<p class="error">Number of rows must be a number between 2 and 15</p>'];
	}
	else if((parseInt(numRows) < 2) || (parseInt(numRows) > 15)){
		return [false, '<p class="error">Number of rows must be a number between 2 and 15</p>'];
	}
	else{
		return [true, ''];
	}
}
/*
function cursorAnimation() { // animate text cursor
		$('#cursor').animate({
				opacity: 0
		}, 'fast', 'swing').animate({
				opacity: 1
		}, 'fast', 'swing');
}
*/
function callback(data) {
	return data;
}

function checkIfTableExists(tableName, callback) { // check if a table exists by it´s tablename
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "tblName=" + tableName + "&action=checkTable", // not safe need to secure table value
		success: function(data)
		{
			 callback(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function updateVotes(votes, tableName, tableRow, callback) { // check if a table exists by it´s tablename
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "vote=" + votes + "&tableName=" + tableName + "&tableRow=" + tableRow + "&action=updateVotes", // not safe need to secure table value
		success: function(data)
		{
			 callback(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function getTableCode(tableName, callback) { // get the table code, since ajax return as callback function
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "tblName=" + tableName + "&action=getCode", // not safe need to secure table value
		success: function(data)
		{
			callback(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function addVotes(tableName, tableCode, callback) { // add correct votes to the vote columns in a table
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "tblName=" + tableName + "&action=getVotes", // not safe need to secure table value
		success: function(data)
		{
			var tableData = data.split("},");
			var votes = "";
			for(var i = 0; i < tableData.length; i++) {
				var currentData = tableData[i];
				var numVotes = currentData.substring(currentData.indexOf("numVotes") + 11,currentData.indexOf(",",currentData.indexOf("numVotes")) -1);
				var upVotes = currentData.substring(currentData.indexOf("upVotes") + 10,currentData.indexOf(",",currentData.indexOf("upVotes") + 4) -1);
				if (i == tableData.length -1) {
					votes += numVotes + "-" + upVotes;
				} else {
					votes += numVotes + "-" + upVotes + ":";
				}
			}
			var rows = tableCode.split("<tr>");
			var newRows = tableCode.split("<tr>");
			newRows.splice(0,2);
			var votesArr = votes.split(":");
			if (tableCode.indexOf('incl/img/upvotes/') != -1) { // upvotes
				for (i = 0; i < newRows.length; i++) {
					var row = newRows[i];
					var currentVotes = votesArr[i];
					var currentUpVotes = currentVotes.substring(0,1);
					var currentNumVotes = currentVotes.substring(2);
					var status = "";
					if(currentNumVotes == "0") {
						status = "No one has voted yet, be the first!";
					} else {
						status = currentUpVotes + " of " + currentNumVotes + " upvoted this";
					}
					var newRow = row.splice(row.indexOf('downvote.png">') + 14,0,status);
					newRows[i] = newRow;
				}
			} else if(tableCode.indexOf('incl/img/thumbs/') != -1) { // thumbs
				for (i = 0; i < newRows.length; i++) {
					var row = newRows[i];
					var currentVotes = votesArr[i];
					console.log(currentVotes);
					var currentUpVotes = currentVotes.substring(0,1);
					var currentNumVotes = currentVotes.substring(2);
					var status = "";
					if(currentNumVotes == "0") {
						status = "No one has voted yet, be the first!";
					} else {
						status = currentUpVotes + " of " + currentNumVotes + " like this";
					}
					var newRow = row.splice(row.indexOf('alt="thumbdown">') + row.indexOf(">", row.indexOf('alt="thumbdown"')) +2,0,status);
					newRows[i] = newRow;
				}
			} 
			var html = "";
			for (i = 0; i < 2; i++) {
				html += rows[i];
			}
			for (i = 0; i < newRows.length; i++) {
				html += newRows[i];
			}
			callback(html);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

// main function, display a table
(function($) {
	$.fn.addTable = function(tableName) {
		return this.each( function() {
			var result = "";
			var selector = $(this);
			checkIfTableExists(tableName, function(data) { // check if requested table exists
				if(data != "false") {  
					var tableCode = data;
					if(tableCode.indexOf('class="ratingC"') != -1) { // table has votes
						addVotes(tableName, tableCode, function(data2) { // add votes and appaend updated tableCode
							selector.append('<table id="'+tableName+'" class="BRT preview">' +data2+ '</table>');
						});
					} else {
						selector.append('<table class="BRT preview">' +tableCode+ '</table>');
					}
				}
			});
		});
	}
}) (jQuery);

// disable backslash to go back a page, credit to http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back?answertab=votes#tab-top
var rx = /INPUT|SELECT|TEXTAREA/i;

$(document).bind("keydown keypress", function(e){
		if( e.which == 8 ){ // 8 == backspace
				if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
						e.preventDefault();
				}
		}
});

String.prototype.splice = function( idx, rem, s ) { // update slice, http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
}
