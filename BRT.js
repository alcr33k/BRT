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
					tableCode += '<tr id="r'+i+'">';
					for(var z = 0; z < numCol; z++){
						tableCode += "<td></td>";
					}
					tableCode += "</tr>";
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
	
	$("#saveTable").click(function() { 
		$("#cursor").remove();
		$("#tableForm").removeClass(".selected");
		var tableName = $("#tName").val();
		var html = $(".BRT").html();
		console.log(html);
		console.log($("#tableForm").serialize());
		$.ajax({
			type: 'POST',
			url: '../BRT/incl/form-action.php',	
			data: "tblName=" + tableName + "&html=" +  html + "&action=createTable", 
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
	});
	
	$("#eT1Btn").click(function(){
		$("#eT1").hide();
		$("#addTable").hide();
		// add table names to dropdown
		$.ajax({
			type: 'POST',
			url: '../BRT/incl/form-action.php',
			data: "action=getNames",
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
		if($(".BRT th").length) {
			$("#deleteTh").show();
			$("#addTh").hide();
		} else {
			$("#addTh").show();
			$("#deleteTh").hide();
		}
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
	$("#funcBtn").click(function(){
		if($("th").hasClass("selected")) {
			$("#funcSort").show();
		} else {
			$("#funcSort").hide();
		}
		if(!$("#funcBtn").hasClass("disabled")) { // and no rating found
			$(this).toggleClass("active");
			$("#func-dropdown").toggle();
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
		$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
	});
	
	$("#addR").click(function(){
		var numberOfColumns = $(".BRT").find('tr')[1].cells.length;
		var toAdd = "<tr>";
		for(var z = 0; z < numberOfColumns; z++) {
			toAdd += "<td></td>";
		}
		toAdd += "</tr>";
		$(".BRT tbody").append(toAdd);
				$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
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
	$("#addTh").click(function(){
		var numberOfColumns = $(".BRT").find('tr')[1].cells.length;
		var tableCode = '<tr id="tableHeader">';
		for(var z = 0; z < numberOfColumns; z++) {
			tableCode += "<th></th>";
		}
		tableCode += "</tr>";
		var currentCode = $(".BRT tbody").html();
		var newCode = tableCode + currentCode;
		$(".BRT tbody").html(newCode);
		$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
	});
	
	$("#deleteTh").click(function(){
		$(this).toggleClass("active");
		if($("#confirmBox").html().indexOf("This will remove") < 0) {
			$("#confirmBox").prepend("<p>This will remove the the table header and all it´s content.</p>");
		}
		$("#confirmBox").toggle();
	});
	$("#funcSort").click(function(){
		$(this).toggleClass("active");
		if($("#funcBox").html().indexOf('<p>Display a') < 0) {
			$("#funcBox").prepend('<p>Display a sorting list above the table. What do you want to call the selected column in the list? <input id="num" type="text" name="num" value="0"></p>');
		} else {
			$("#funcBox p").first().remove();
			$("#funcBox").prepend('<p>Display a sorting list. What do you want to call the selected column in the list? <input id="num" type="text" name="num" value=""></p>');
		}
		$("#funcBox").toggle();
	});
	function setFuncText(type, enhet){
		if($("#funcBox").html().indexOf('<p>Display a') < 0) {
			$("#funcBox").prepend('<p>Display a '+type+' <input id="num" type="text" name="num" value="0"> '+enhet+' from now</p>');
		} else {
			$("#funcBox p").first().remove();
			$("#funcBox").prepend('<p>Display a '+type+' <input id="num" type="text" name="num" value="0"> '+enhet+' from now</p>');
		}
		$("#funcBox").toggle();
	}
	$("#funcTime").click(function(){
		$(this).toggleClass("active");
		setFuncText('time','minutes');
	});
	$("#funcDate").click(function(){
		$(this).toggleClass("active");
		setFuncText('date','days');
	});
	$("#funcDay").click(function(){
		$(this).toggleClass("active");
		setFuncText('day','days');
	});
	$("#funcMonth").click(function(){
		$(this).toggleClass("active");
		setFuncText('month','months');
	});
	$("#funcYear").click(function(){
		$(this).toggleClass("active");
		setFuncText('year','years');
	});
	
	$("#addStars").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="stars" id="starRating" class="ratingC" src="BRT/incl/img/stars/stars0.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "BRT/incl/img/stars/star-disabled.png");
	});
	
	$("#addThumb").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="thumbup"  id="thumbup" class="ratingC thumbRating" src="BRT/incl/img/thumbs/thumb.png"><img id="thumbdown" alt="thumbdown" class="ratingC thumbRating" src="BRT/incl/img/thumbs/thumbdown.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "incl/img/stars/star-disabled.png");
	});
	
	$("#addVotes").click(function(){
		var selectedIndex = $(".BRT .selected").index() + 1;
		$("#cursor").remove();
		$("table.BRT tbody th:nth-child("+selectedIndex+")").addClass("rating");
		$("table.BRT tbody th:nth-child("+selectedIndex+")").append('<p class="ratingC">Rating</p>');
		$("table.BRT tbody td:nth-child("+selectedIndex+")").append('<img alt="thumbup" id="upvote" class="ratingC" src="BRT/incl/img/upvotes/upvote.png"><br><img alt="thumbdown" id="downvote" class="ratingC" src="BRT/incl/img/upvotes/downvote.png">');
		$("#rating-dropdown").hide();
		$("#rateBtn").removeClass("active");
		$("#rateBtn").addClass("disabled");
		$("#rateBtn img").attr("src", "incl/img/stars/star-disabled.png");
	});
	
	$("body").on('click','.shownVal', function(){
		$("#sort-dropdown").toggle();
	});
	
	$("body").on('click','#sort-dropdown li', function(){
		var id = $(this).attr("id");
		// get the text of all columns of the row with id
		var i = 0;
		var id2 = id.substring(1);
		var currentHtml = $(".BRT").html();
		var trs = currentHtml.split("<tr");
		var numTrs =  $('.BRT tr').length;
		var toAdd = trs[0] + '<tr' + trs[1];
		if(id == "c0") {
			for(var i = 0; i < (numTrs-1); i++) {
				var select = "#r"+i.toString();
				var code = $(select).html();
				toAdd += '<tr id="r'+i+'">' + code + '</tr>';
			}
			$(".BRT").html(toAdd + '</tbody>');
			
		} else if ($('.BRT tr:nth-child(2) td:nth-child('+id2+')').html().indexOf('class="ratingC"') != -1) {
			var tableName = $('.BRT').attr("id");
			WilsonScore(tableName, function(data) {
				if(data !== "false") {
					var columns = data.split('{"columnNumber":"');
					columns.shift();
					for (var i = 0; i < columns.length; i++) {
						var index = columns[i].substring(0,columns[i].indexOf(",") - 1);
						index = parseInt(index);
						if(index == (numTrs)) {
							var add = trs[index].substring(0,trs[index].indexOf("</tbody>"));
							toAdd += '<tr' + add;
						} else {
							toAdd += '<tr' + trs[index];
						}
					}
					$(".BRT").html(toAdd + '</tbody>');
				}		
			});
		} else {
			var colText = [];
			$('.BRT td:nth-child('+id2+')').each(function() {
				colText.push($(this).html() + ' ' + i);   
				i++; 
			});
			var updatedList = colText.sort(natSort);
			for (var i = 0; i < updatedList.length; i++) {
				var colId = updatedList[i].substring(updatedList[i].indexOf(' ')+1);
				var index = parseInt(colId) + 2;
				if(colId == (numTrs -2)) {
					var add = trs[index].substring(0,trs[index].indexOf("</tbody>"));
					toAdd += '<tr' +add;
				} else {
					toAdd += '<tr' + trs[index];
				}
			}
			$(".BRT").html(toAdd + '</tbody>');
		}
		var oldSelected = $(".shownVal").attr("valC");
		$('#'+oldSelected).show();
		$(".shownVal").attr("valC",$(this).attr("id"));
		$(".shownVal").text($(this).find(">:first-child").text());
		$(this).hide();
		$(this).parent().hide();
		// console.log($(".BRT").html());
	});
	
	$("body").on('click','#upvote', function(){
		var clickedRow = $(this).parent().parent().attr("id");
		if((!($(this).parent().find('#downvote').hasClass("clicked"))) && ((getCookie("votes") == null) || (getCookie("votes").indexOf(clickedRow) == -1)) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"BRT/incl/img/upvotes/upvote-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			var tableRow = $(this).parent().parent().index() +1; 
			var selector = $(this);
			updateVotes("1", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('downvote.png">') + 14) + "Thanks for voting!";
				selector.parent().html(newCode);
			});
		}
		if(getCookie("votes") == null) {
			setCookie('votes',clickedRow+'-up');
		} else if(getCookie("votes").indexOf(clickedRow) == -1) {
			updateCookie('votes',clickedRow+'-up');
		}
	});
	
	$("body").on('click','#downvote', function(){
		var clickedRow = $(this).parent().parent().attr("id");
		if((!($(this).parent().find('#upvote').hasClass("clicked"))) && ((getCookie("votes") == null) || (getCookie("votes").indexOf(clickedRow) == -1)) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"BRT/incl/img/upvotes/downvote-clicked.png");
			var tableName = $(this).closest('table').attr("id");
			
			var tableRow = $(this).parent().parent().index() +1; 
			console.log(tableRow);
			
			var selector = $(this);
			updateVotes("0", tableName, tableRow, function(data) {
				var columnCode = selector.parent().html();
				var newCode = columnCode.substring(0, columnCode.indexOf('downvote-clicked.png">') + 22) + "Thanks for voting!";
				selector.parent().html(newCode);
			});
		}
		if(getCookie("votes") == null) {
			setCookie('votes',clickedRow+'-down');
		} else if(getCookie("votes").indexOf(clickedRow) == -1) {
			updateCookie('votes',clickedRow+'-down');
		}
	});
	
	$("body").on('click','#thumbup', function(){
		if((!($('#thumbdown').hasClass("clicked"))) && (!($(this).hasClass("clicked")))) {
			$(this).addClass("clicked");
			$(this).attr('src',"BRT/incl/img/thumbs/thumb-clicked.png");
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
			$(this).attr('src',"BRT/incl/img/thumbs/thumbdown-clicked.png");
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
	
	$("#confirmF").click(function(){
		var num = $("#num").val();
		var toAdd = "";
		if($("#funcDate").hasClass("active")) {
			toAdd += "[date "+num+"]";
		} else if($("#funcDay").hasClass("active")) {
			toAdd += "[day "+num+"]";
		} else if($("#funcTime").hasClass("active")) {
			toAdd += "[time "+num+"]";
		} else if($("#funcMonth").hasClass("active")) {
			toAdd += "[month "+num+"]";
		} else if($("#funcYear").hasClass("active")) {
			toAdd += "[year "+num+"]";
		} else if($("#funcSort").hasClass("active")) {
			toAdd += "[sort "+num+"]";
		}
		var currentHtml = $(".selected").html();
		var writeTextFrom = currentHtml.indexOf('<span id="cursor">|</span>') + 26;
		var codeBefore = currentHtml.substring(0, writeTextFrom);
		codeBefore = codeBefore.replace('<span id="cursor">|</span>', '');
		var codeAfter = currentHtml.substring(writeTextFrom);
		var newCode = codeBefore + toAdd + codeAfter;
		$(".selected").html(newCode);
		
		$("#funcBox").hide();
		$("#func-dropdown li").removeClass("active");
		$("#func-dropdown").hide();
		$("#funcBtn").removeClass("active");
	});
	
	$("#declineL").click(function(){
		$("#confirmBox").hide();
		$(".column-dropdown li").removeClass("active");
		$(".column-dropdown").hide();
		$("#columnsBtn").removeClass("active");
	});
	
	$("#declineF").click(function(){
		$("#funcBox").hide();
		$("#func-dropdown li").removeClass("active");
		$("#func-dropdown").hide();
		$("#funcBtn").removeClass("active");
	});
	
	// code for preview table
	$('#main').on('click','.BRT th, .BRT td', function(){
		$(".BRT th, .BRT td").removeClass("selected");
		if(!$(".BRT td img").hasClass("ratingC")) {
			$("#rateBtn").removeClass("disabled");
			$("#funcBtn").removeClass("disabled");
			$("#rateBtn img").attr("src", "incl/img/stars/star.png");
			$("#funcBtn img").attr("src", "incl/img/lightning.png");
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
	
	$("#main").on("click",".BRT .selected", function(){
		$("#cursor").remove();
		var currentText = $(".BRT .selected span").text();
		var currentHtml = $(".selected").html();
		var clickedIndex = getCaretCharacterOffsetWithin(this) + 1 + currentHtml.indexOf(">");
		var codeBeforeCursor = currentHtml.substring(0, clickedIndex);
		var codeAfterCursor = currentHtml.substring(clickedIndex);
		codeBeforeCursor = codeBeforeCursor.replace('<span id="cursor">|</span>', '');
		codeAfterCursor = codeAfterCursor.replace('<span id="cursor">|</span>', '');
		var newCode = codeBeforeCursor + '<span id="cursor">|</span>' + codeAfterCursor;
		$(".selected").html(newCode);
	});
	
	$(".selected").ready(function() { 
		$(document).on('keydown', function(e) { // delete letter
			if((e.keyCode == 8) && !($("#funcBox").is(":visible"))) { 
				if($(".selected img").hasClass("ratingC")) { // code to remove rating
					$(".BRT th").removeClass("rating");
					$(".ratingC").remove();
					$("#rateBtn").removeClass("disabled");
					$("#rateBtn img").attr("src", "BRT/incl/img/stars/star.png")
				} 
				var currentHtml = $(".selected").html();
				var letterPos = currentHtml.indexOf('<span id="cursor">|</span>') - 1;
				var letterBeforeCursor =  currentHtml.substring(letterPos, letterPos + 1);
				if (letterBeforeCursor == "]") {
					var twobefore =  currentHtml.substring(letterPos -1, letterPos);
					if (isNaN(twobefore) == false) {
						console.log('remoev inbuilt function');
					}
				}
				var codeBeforeLetter = currentHtml.substring(0, letterPos);
				var codeAfterLetter = currentHtml.substring(letterPos + 1);
				// remove <span id="cursor">|</span> from afterLetter
				codeAfterLetter = codeAfterLetter.replace('<span id="cursor">|</span>', '');
				var newCode = codeBeforeLetter + '<span id="cursor">|</span>' + codeAfterLetter;
				if(letterBeforeCursor != ">") {
					$(".selected").html(newCode);
				}
			} else if(e.keyCode == 37) { 
				var currentText = $(".selected").text();
				var currentHtml = $(".selected").html();
				if(currentText.length > 1) {
					var letterPos = currentHtml.indexOf('<span id="cursor">|</span>') - 1;
					var letterBeforeCursor =  currentHtml.substring(letterPos, letterPos + 1);
					var codeBeforeLetter = currentHtml.substring(0, letterPos);
					var codeAfterLetter = currentHtml.substring(letterPos + 1);
					// remove <span id="cursor">|</span> from afterLetter
					codeAfterLetter = codeAfterLetter.replace('<span id="cursor">|</span>', '');
					var newCode = codeBeforeLetter + '<span id="cursor">|</span>' + letterBeforeCursor + codeAfterLetter;
					if(letterBeforeCursor != ">") {
						$(".selected").html(newCode);
					}
					// console.log("An " + letterBeforeCursor + " is before the cursor at position" + letterPos);
					// console.log('left-arrow clicked');
				}
			} else if(e.keyCode == 39) {
				var currentText = $(".selected").text();
				var currentHtml = $(".selected").html();
				if(currentText.length > 1) {
					var letterPos = currentHtml.indexOf('<span id="cursor">|</span>') + 26;
					var letterAfterCursor =  currentHtml.substring(letterPos, letterPos + 1);
					var codeBeforeLetter = currentHtml.substring(0, letterPos);
					codeBeforeLetter = codeBeforeLetter.replace('<span id="cursor">|</span>', '');
					var codeAfterLetter = currentHtml.substring(letterPos + 1);
					var newCode = codeBeforeLetter + letterAfterCursor + '<span id="cursor">|</span>'  + codeAfterLetter;
					if(letterAfterCursor != "<") {
						$(".selected").html(newCode);
					} 
					// console.log(currentHtml+":An " + letterAfterCursor + " is after the cursor at position" + letterPos);
					// console.log('left-arrow clicked');
				}
			}
		});
		
		$(document).on('keypress', function(e) { // add letter
			var key = e.keyCode || e.which;
			var charCode = e.charCode;
			var allowedKeys = [32,33,35,37,40,41,47]; // possible 38 &, 34 ", 39 '
			if((($("th").hasClass("selected")) || ($("td").hasClass("selected"))) && (key > 46 || allowedKeys.indexOf(charCode) > -1) && !($("#funcBox").is(":visible"))) { // schould only do this when a tablerow or header is selected
				var currentText = $(".selected").text();
				var currentHtml = $(".selected").html();
				/* remove all end-tags at end of string
				if (currentHtml.match("</span>$")) {
					currentHtml = currentHtml.replace("</span>","");
				} */
				if(currentHtml.length == 0) { // add style and fonts on first keypress in beginning
					var htmlToAdd = addFirstSign(e.key);
					$(".selected").html(htmlToAdd);
				} else {
					var writeTextFrom = currentHtml.indexOf('<span id="cursor">|</span>') + 26;
					var codeBefore = currentHtml.substring(0, writeTextFrom);
					codeBefore = codeBefore.replace('<span id="cursor">|</span>', '');
					var codeAfter = currentHtml.substring(writeTextFrom);
					var newCode = codeBefore + e.key + '<span id="cursor">|</span>'  + codeAfter;
					$(".selected").html(newCode);
				}
				updateFontWeight();
			}
		});
	});
	
	/* $('body').on('click','.rating', function(){
		sortVotes();
	}); */
	
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

function cursorAnimation() { // animate text cursor
		$('#cursor').animate({
				opacity: 0
		}, 'fast', 'swing').animate({
				opacity: 1
		}, 'fast', 'swing');
}

function callback(data) {
	return data;
}

function addFirstSign(key) {
	var htmlToAdd = "";
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
	htmlToAdd += key;
	return htmlToAdd;
}

function updateFontWeight() {
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

function checkIfTableExists(tableName, callback) { // check if a table exists by it´s tablename
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "tblName=" + tableName + "&action=checkTable", 
		success: function(data)
		{
			 callback(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function updateVotes(votes, tableName, tableRow, callback) { 
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "vote=" + votes + "&tableName=" + tableName + "&tableRow=" + tableRow + "&action=updateVotes", 
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
		data: "tblName=" + tableName + "&action=getCode", 
		success: function(data)
		{
			callback(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function WilsonScore(tableName, callback) { // get the order of columns of numbername according to the wilson score
	$.ajax({
		type: 'POST',
		url: '../BRT/incl/form-action.php',
		data: "tblName=" + tableName + "&action=wilson", 
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
		data: "tblName=" + tableName + "&action=getVotes", 
		success: function(data)
		{
			if (data == '[]') {
				var rows = tableCode.split("<tr");
				var newRows = tableCode.split("<tr");
				newRows.splice(0,2);
				if (tableCode.indexOf('incl/img/upvotes/') != -1) { // upvotes
					var status = "No one has voted yet, be the first!";
					for (i = 0; i < newRows.length; i++) {
						var row = newRows[i];
						var newRow = '<tr' + row.splice(row.indexOf('downvote.png">') + 14,0,status);
						newRows[i] = newRow;
					}
				} else if(tableCode.indexOf('incl/img/thumbs/') != -1) { // thumbs
					var status = "No one has voted yet, be the first!";
					for (i = 0; i < newRows.length; i++) {
						var row = newRows[i];
						var newRow = row.splice(row.indexOf('alt="thumbdown">') + row.indexOf(">", row.indexOf('alt="thumbdown"')) +2,0,status);
						newRows[i] = newRow;
					}
				}
				var html = rows[0] + '<tr' + rows[1];
				for (i = 0; i < newRows.length; i++) {
					html += newRows[i];
				}
				callback(html);	
			}
			else {
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
				var rows = tableCode.split("<tr");
				var newRows = tableCode.split("<tr");
				newRows.splice(0,2);
				var votesArr = votes.split(":");
				if (tableCode.indexOf('incl/img/upvotes/') != -1) { // upvotes
					for (i = 0; i < newRows.length; i++) {
						var row = newRows[i];
						var currentVotesArr = votesArr[i].split("-");
						var currentUpVotes = parseInt(currentVotesArr[1])-1;
						var currentNumVotes = parseInt(currentVotesArr[0])-1;
						var status = "";
						if(currentNumVotes == 0) {
							status = "No one has voted yet, be the first!";
						} else {
							status = currentUpVotes + " of " + currentNumVotes + " upvoted this";
						}
						var newRow = row.splice(row.indexOf('downvote.png">') + 14,0,status);
						var rowID = newRow.substring(5,newRow.indexOf(">")-1);
						console.log(rowID);
						console.log(getCookie("votes"));
						if(getCookie("votes") != null) {
							if(getCookie("votes").indexOf(rowID) != -1) {
								var cookie = getCookie("votes");
								var cookiestatus;
								var voteCookieCode1 =  cookie.substring(cookie.indexOf(rowID));
								if(voteCookieCode1.indexOf(' ') != -1) {
									cookiestatus = voteCookieCode1.substring(voteCookieCode1.indexOf('-')+1,voteCookieCode1.indexOf(' '));
								} else {
									cookiestatus = voteCookieCode1.substring(voteCookieCode1.indexOf('-')+1);
								}
								if(cookiestatus == 'down') {
									newRow = newRow.replace('incl/img/upvotes/downvote.png','incl/img/upvotes/downvote-clicked.png');
								} else if (cookiestatus == 'up') {
									newRow = newRow.replace('incl/img/upvotes/upvote.png','incl/img/upvotes/upvote-clicked.png');
								}
							}
						}
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
				var html = rows[0] + '<tr' + rows[1];
				for (i = 0; i < newRows.length; i++) {
					html += '<tr' + newRows[i];
				}
				callback(html);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			alert("Status: " + textStatus); alert("Error: " + errorThrown); 
		}       
	});
}

function addZero(i) {
	return (i < 10) ? "0" + i : i
}

function updateFuncs(tableCode) {
	if(tableCode.indexOf('[time') != -1) {
		var startPos = tableCode.indexOf('[time');
		var endPos = tableCode.indexOf(']',startPos);
		var fullFunc = tableCode.substring(startPos, endPos);
		var num = fullFunc.substring(fullFunc.indexOf(' ') + 1);
		var date = new Date();
		var time = new Date(date.getTime() + num*60000),
			h = addZero(time.getHours()),
			m = addZero(time.getMinutes()),
			s = addZero(time.getSeconds());     
		var dateMsg = h + ":" + m + ":" + s;
		var codeBeforeDate = tableCode.substring(0,startPos);
		var codeAfterDate = tableCode.substring(endPos +1);
		tableCode = codeBeforeDate + ' ' + dateMsg + ' ' + codeAfterDate;
	}
	if(tableCode.indexOf('[date') != -1) {
		var startPos = tableCode.indexOf('[date');
		var endPos = tableCode.indexOf(']',startPos);
		var fullFunc = tableCode.substring(startPos, endPos);
		var num = fullFunc.substring(fullFunc.indexOf(' ') + 1);
		var date = new Date();
		console.log(date);
		console.log(num);
		date.setDate(date.getDate() + parseInt(num));
		var dateMsg = date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
		var codeBeforeDate = tableCode.substring(0,startPos);
		var codeAfterDate = tableCode.substring(endPos +1);
		tableCode = codeBeforeDate + ' ' + dateMsg + ' ' + codeAfterDate;
	}
	if(tableCode.indexOf('[day') != -1) {
		var startPos = tableCode.indexOf('[day');
		var endPos = tableCode.indexOf(']',startPos);
		var fullFunc = tableCode.substring(startPos, endPos);
		var num = fullFunc.substring(fullFunc.indexOf(' ') + 1);
		var date = new Date();
		date.setDate(date.getDate() + parseInt(num));
		var weekday = new Array(7);
		weekday[0]=  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var index = date.getUTCDay();
		var dateMsg = weekday[index];
		var codeBeforeDate = tableCode.substring(0,startPos);
		var codeAfterDate = tableCode.substring(endPos +1);
		tableCode = codeBeforeDate + ' ' + dateMsg + ' ' + codeAfterDate;
	}
	if(tableCode.indexOf('[month') != -1) {
		var startPos = tableCode.indexOf('[month');
		var endPos = tableCode.indexOf(']',startPos);
		var fullFunc = tableCode.substring(startPos, endPos);
		var num = fullFunc.substring(fullFunc.indexOf(' ') + 1);
		var date = new Date();
		date.setMonth(date.getMonth() + parseInt(num));
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var index = date.getMonth();
		var dateMsg = month[index];
		var codeBeforeDate = tableCode.substring(0,startPos);
		var codeAfterDate = tableCode.substring(endPos +1);
		tableCode = codeBeforeDate + ' ' + dateMsg + ' ' + codeAfterDate;
	}
	if(tableCode.indexOf('[year') != -1) {
		var startPos = tableCode.indexOf('[year');
		var endPos = tableCode.indexOf(']',startPos);
		var fullFunc = tableCode.substring(startPos, endPos);
		var num = fullFunc.substring(fullFunc.indexOf(' ') + 1);
		var date = new Date();
		date.setYear(date.getUTCFullYear() + parseInt(num));
		var dateMsg = date.getUTCFullYear();
		var codeBeforeDate = tableCode.substring(0,startPos);
		var codeAfterDate = tableCode.substring(endPos +1);
		tableCode = codeBeforeDate + ' ' + dateMsg + ' ' + codeAfterDate;
	}
	if(tableCode.indexOf('[sort') != -1) {
		// here add all to the list and prepend
		// first step get all sort collumns and values 
		var toAdd = '<div class="BRTTable"><div id="sort">Sort by: <a valC="c0" class="shownVal" href="#">Most popular</a><ul id="sort-dropdown"><li id="c0"><a href="#">Most popular</a></li>';
		var tableHeaders = tableCode.split('<th');
		for (var i = 1; i < tableHeaders.length; i++) {
			if(tableHeaders[i].indexOf("[sort") != -1) {
				var startPos = tableHeaders[i].indexOf('[sort');
				var endPos = tableHeaders[i].indexOf(']',startPos);
				var fullFunc = tableHeaders[i].substring(startPos, endPos);
				var text = fullFunc.substring(fullFunc.indexOf(' ') + 1);
				toAdd += '<li id="c'+i+'"><a href="#">'+text+'</a></li>';
				var startPos2 = tableCode.indexOf('[sort');
				var endPos2 = tableCode.indexOf(']',startPos);
				var codeBeforeSort = tableCode.substring(0,startPos2);
				var codeAfterSort = tableCode.substring(endPos2 +1);
				tableCode = codeBeforeSort + codeAfterSort;
			}
			
		}
		toAdd += "</ul></div>";
		tableCode = toAdd + tableCode;
	}
	return tableCode;
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
					tableCode = updateFuncs(tableCode);
					if(tableCode.indexOf('class="ratingC"') != -1) { // table has votes;
						addVotes(tableName, tableCode, function(data2) { // add votes and appaend updated tableCode
							selector.append('<table id="'+tableName+'" class="BRT live">' +data2+ '</table></div>');
						});
					} else {
						selector.append('<table class="BRT preview">' +tableCode+ '</table></div>');
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

function setCookie(key, value) { // credit to http://stackoverflow.com/questions/1458724/how-to-set-unset-cookie-with-jquery
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

function updateCookie(key, value) {
	var oldVal = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')[2];
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + oldVal + ' ' + value + ';expires=' + expires.toUTCString();
}

function natSort(as, bs){
    var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
    if(isFinite(as) && isFinite(bs)) return as - bs;
    a= String(as).toLowerCase();
    b= String(bs).toLowerCase();
    if(a=== b) return 0;
    if(!(rd.test(a) && rd.test(b))) return a> b? 1: -1;
    a= a.match(rx);
    b= b.match(rx);
    L= a.length> b.length? b.length: a.length;
    while(i < L){
        a1= a[i];
        b1= b[i++];
        if(a1!== b1){
            if(isFinite(a1) && isFinite(b1)){
                if(a1.charAt(0)=== "0") a1= "." + a1;
                if(b1.charAt(0)=== "0") b1= "." + b1;
                return a1 - b1;
            }
            else return a1> b1? 1: -1;
        }
    }
    return a.length - b.length;
}

function getCaretCharacterOffsetWithin(element) { // http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

String.prototype.splice = function( idx, rem, s ) { // update slice, http://stackoverflow.com/questions/4313841/javascript-how-can-i-insert-a-string-at-a-specific-index
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
}

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
	var canvas = document.getElementById('color_picker');
	var context;
	var img = new Image();
	if(context != null) {
		context = canvas.getContext('2d');
		img.src = 'incl/img/color-palette.jpg';
		context.drawImage(img,0,0)
	}
	// edit table canvas
	var canvas2 = document.getElementById('color_picker2');
	var context2;
	if(context2 != null) {
		context2 = canvas2.getContext('2d');
		img.src = 'incl/img/color-palette.jpg';
		context2.drawImage(img,0,0);
	}
	// $('#main').on('click','.color_picker', function(event){
	$("#color_picker").click(function(event){
		// getting user coordinates
		var offsetTop = $("#color_picker").offset().top;
		var offsetLeft = $("#color_picker").offset().left;
		var x = event.pageX - offsetLeft;
		var y = event.pageY - offsetTop;
		// getting image data and RGB values
		var img_data = context.getImageData(x, y, 1, 1).data;
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
	$("#color_picker2").click(function(event){
		// getting user coordinates
		var offsetTop = $("#color_picker2").offset().top;
		var offsetLeft = $("#color_picker2").offset().left;
		var x = event.pageX - offsetLeft;
		var y = event.pageY - offsetTop;
		// getting image data and RGB values
		var img_data = context2.getImageData(x, y, 1, 1).data;
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
