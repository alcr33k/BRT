<!doctype html>
<html class='no-js' lang='sv'>
<head>
	<meta charset='utf-8'/>
	<title>Beautiful review tables | Setup</title>
	<link rel='icon' href='favicon.ico'/>
	<link rel='stylesheet' type='text/css' href='incl/style.css'/>
	<link rel='stylesheet' type='text/css' href='incl/admin-style.css'/>
	<script type="text/javascript" src='//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js'></script>
	<script type="text/javascript" src='BRT.js'></script>
</head>

<body>

<div id='wrapper'>
	<div id='header'>
		<h1 class="sitetitle">Beautiful Review Tables</h1> <!-- set in php/jquery -->
	</div>

	<div id='main'>
		<div class="tc3"">
			<div id="aT1">
				<p class="mainLink" id="newTable"><a href="#">Create new table</a></p>
			</div>
			<div id="aT2">
				<form id="createTableForm">
					<h1>Create new table</h1><div id="closeBtn"><p>X</p></div>
					<p>Table name:<input type="text" name="tblName" id="tblName"></p>
					<p>Number of columns:<input id="numColumns" type="text" name="numColumns"></p>
					<p>Number of rows:<input id="numRows" type="text" name="numRows"></p>
					<button id="createTableBtn" name="createTableBtn" type="button">Create</button> 
				</form>
			</div>
			<div id="aT3"><h1>Table: x</h1><div id="closeBtn"><p>X</p></div>
				<div id="prT">
					<div id="editBox"><div class="editBtn" id="boldBtn">B</div><div class="editBtn" id="italicBtn">I</div><div class="editBtn" id="underlineBtn">U</div><div class="editBtn" id="fontBtn">Font</div><div class="editBtn" id="fontsizeBtn">Font size</div><div class="editBtn" id="colorBtn"><img src="incl/img/color-wheel2.png" alt="color" height="16" width="16"></div><div class="editBtn disabled" id="rateBtn"><img src="incl/img/stars/star-disabled.png" alt="color" height="16" width="16"></div><div class="editBtn" id="columnsBtn">Edit table</div>
						<ul class="dropdown font-dropdown"><li class="arial">Arial</li><li class="timesnew">Times New Roman</li><li class="georgia">Georgia</li><li class="courier">Courier New</li><li class="trebucchet">Trebuchet MS</li><li class="verdana">Verdana</li><li class="helvetica">Helvetica Neue</li></ul>
						<ul class="dropdown fontsize-dropdown"><li id="8">8px</li><li id="10">10px</li><li id="12">12px</li><li id="14">14px</li><li id="16">16px</li><li id="18">18px</li><li id="20">20px</li><li id="24">24px</li><li id="32">32px</li><li id="64">64px</li></ul>
						<ul class="dropdown column-dropdown"><li id="addC">Add column</li><li id="deleteC">Delete column</li><li id="addR">Add row</li><li id="deleteR">Delete row</li><li id="deleteTh">Delete table header</li></ul>
						<ul class="dropdown color-dropdown"><li id="addC"><canvas width="280" height="210" id="color_picker"></canvas><div class="hex"><p>HEX: <input type="text" value=""></input></p></div></li></ul>
						<ul class="dropdown" id="rating-dropdown"><li id="addVotes"><img src="incl/img/upvotes/upvote-icon.png" alt="upvote" height="16" width="16">Vote up/down</li><li  id="addThumb"><img src="incl/img/thumbs/thumb.png" alt="thumb" height="16" width="16">Thumb up/down</li></ul>
						<div id="confirmBox"><p>Are you sure?</p><p><a id="confirmL" href="#">Yes</a><a id="declineL" href="#">No</a></p></div>
					</div>	
				</div>	
				<form id="tableForm"> <!-- action="incl/form-action.php" method="post" -->
					<input id="tName" type="hidden" name="table-name" value="">
					<input id="tHtml" type="hidden" name="html" value=""> 
					<input id="saveTable" type="submit" name="saveTable" value="Save form">
				</form>
			</div>
		</div>
		<div class="tc3">
			<div id="eT1">	
				<p class="mainLink" id="eT1Btn"><a href="#">Edit existing table</a></p>
			</div>
			<div id="eT2">
				<form id="editTableForm">
					<h1>Edit table</h1><div id="closeBtn"><p>X</p></div>
					<select id="editSelect">
					  <option value="none" selected="selected">None selected</option>
					</select> 
					<button id="editTableBtn" name="editTableBtn" type="button">Edit</button> 
				</form>
			</div>
			<div id="eT3"><h1>Edit table: x</h1><div id="closeBtn"><p>X</p></div>
				<div id="eprT">
					<div id="editBox2"><div class="editBtn" id="eBoldBtn">B</div><div class="editBtn" id="eItalicBtn">I</div><div class="editBtn" id="eUnderlineBtn">U</div><div class="editBtn" id="eFontBtn">Font</div><div class="editBtn" id="eFontsizeBtn">Font size</div><div class="editBtn" id="eColorBtn"><img src="incl/img/color-wheel2.png" alt="color" height="16" width="16"></div>
						<ul class="dropdown font-dropdown"><li class="arial">Arial</li><li class="timesnew">Times New Roman</li><li class="georgia">Georgia</li><li class="courier">Courier New</li><li class="trebucchet">Trebuchet MS</li><li class="verdana">Verdana</li><li class="helvetica">Helvetica Neue</li></ul>
						<ul class="dropdown fontsize-dropdown"><li id="8">8px</li><li id="10">10px</li><li id="12">12px</li><li id="14">14px</li><li id="16">16px</li><li id="18">18px</li><li id="20">20px</li><li id="24">24px</li><li id="32">32px</li><li id="64">64px</li></ul>
						<ul class="dropdown color-dropdown"><li id="addC"><canvas width="280" height="210" id="color_picker2"></canvas><div class="hex"><p>HEX: <input type="text" value=""></input></p></div></li></ul>
						<div id="confirmBox"><p>Are you sure?</p><p><a id="confirmL" href="#">Yes</a><a id="declineL" href="#">No</a></p></div>
					</div>	
				</div>	
				<form id="saveEditForm"> <!-- action="incl/form-action.php" method="post" -->
					<input id="etName" type="hidden" name="table-name" value="">
					<input id="etHtml" type="hidden" name="edit-html" value=""> 
					<input id="saveEdit" type="submit" name="saveEdit" value="Save edit">
				</form>
			</div>
		</div>

	<div id='footer'>
		<footer>
			<span class='sitefooter'>Copyright &copy; Alexander Björkenhall | <a href='https://github.com/alcr33k/BRT'>GitHub</a></span>
		</footer>
	</div>
</div>
</body>
</html>
