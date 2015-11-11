<?php 
	// Include database class
	include 'database.class.php';
	$database = new Database();
	$conn = $database->getDb();
	// Include functions class
	include 'functions.class.php';
	$functions = new Functions();

	if (($_POST['action']) == "createTable") { // form for svae submitted, save the html code of table in database
		 echo $functions->createTable($conn, $_POST['tblName'], $_POST['html']);
	} else if(!empty($_POST['edit-html'])) { 
		echo $functions->updateTable($conn, $_POST['table-name'], $_POST['edit-html']);	
	} else if((($_POST['action']) == "checkTable") || (($_POST['action']) == "getCode")) {
		echo $functions->checkTableCode($_POST['tblName'], $conn); 
	} else if(($_POST['action']) == "getNames") {
		echo $functions->getNames($conn);
	} else if(($_POST['action']) == "getVotes") {
		echo $functions->getVotes($conn, $_POST['tblName']);
	} else if(($_POST['action']) == "updateVotes") {
		$functions->updateVotes($conn, $_POST['vote'], $_POST['tableName'], $_POST['tableRow']);
	} else if(($_POST['action']) == "wilson") {
		echo $functions->wilsonScore($_POST['tblName'], $conn); 
	}
?>
