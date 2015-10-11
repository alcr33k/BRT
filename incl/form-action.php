<?php 
	// The following fields must be filled in in oder to make the plugin work
	$servername = "";
	$dbname = "";
	$username = "";
	$password = "";
	if(!isset($_POST['action'])) {
		$_POST['action'] = "submitForm";
	}
	
	if (!empty($_POST['html'])) { // form for svae submitted, save the html code of table in database
		 $tableName = $_POST['table-name'];
		 $html = $_POST['html'];
		 if(strpos($html, 'class="ratingC"') !== false) { // votes was found in html, add the votes to votesTable
			// create SQL table, add values in application best is if filled in 
			try {
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				// create table storing table code if not exists
				$SQL = 'CREATE TABLE IF NOT EXISTS brTables(tableName varchar(50) PRIMARY KEY, tableCode text NOT NULL)';
				$conn->exec($SQL);
				// create table storing votes if not exists
				$VotesSql = 'CREATE TABLE IF NOT EXISTS brVotes(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, tableName varchar(50) NOT NULL, columnNumber int(2) NOT NULL, numVotes int NOT NULL, upVotes int NOT NULL)';
				$conn->exec($VotesSql);
				// insert table-code
				$stmt = $conn->prepare("INSERT INTO brTables (tableName,tableCode) VALUES (?, ?)");
				$stmt->bindParam(1,$tableName,PDO::PARAM_STR);
				$stmt->bindParam(2,$html, PDO::PARAM_STR);
				$stmt->execute();
				// get number of columns 
				$columns = explode("<tr>", $html);
				$numColumns = count($columns) - 1;
				// insert the rows with votes to votesTable
				for ($i = 2; $i <= $numColumns; $i++) {
					$stmt2 = $conn->prepare("INSERT INTO brVotes (tableName,columnNumber,numVotes,upVotes) VALUES (?, ?, 0, 0)");
					$stmt2->bindParam(1,$tableName,PDO::PARAM_STR);
					$stmt2->bindParam(2,$i, PDO::PARAM_INT);
					$stmt2->execute();
				}
				echo "<p class='status'>The table was saved</p>";
			}
			catch(PDOExceptation $e) {
				echo  "Error:" . $e->getMessage();
			}
		 } else {
			 // create SQL table, add values in application best is if filled in 
			try {
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$SQL = 'CREATE TABLE IF NOT EXISTS brTables(tableName varchar(50) PRIMARY KEY, tableCode text NOT NULL)';
				$conn->exec($SQL);
				$stmt = $conn->prepare("INSERT INTO brTables (tableName,tableCode) VALUES (?, ?)");
				$stmt->bindParam(1,$tableName,PDO::PARAM_STR);
				$stmt->bindParam(2,$html, PDO::PARAM_STR);
				$stmt->execute();
				echo "<p class='status'>The table was saved</p>";
			}
			catch(PDOExceptation $e) {
				echo  "Error:" . $e->getMessage();
			}
		}
	} else if(!empty($_POST['edit-html'])) { // form for edit submitted, save the edited html code of table in database
		$tableName = $_POST['table-name'];
		$html = $_POST['edit-html'];
		// update the html of the table with tableName = $tableName
		try {
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = $conn->prepare("UPDATE brTables SET tableCode=? WHERE tableName=?");
			$stmt->bindParam(1,$html, PDO::PARAM_STR);
			$stmt->bindParam(2,$tableName,PDO::PARAM_STR);
			$stmt->execute();
			echo "<p class='status'>The table was updated</p>";
		}
		catch(PDOExceptation $e) {
			echo  "Error:" . $e->getMessage();
		}
	} else if(($_POST['action']) == "checkTable") {
		$status = checkTableCode($_POST['tblName'], $servername, $dbname, $username, $password); // here run function to check if tablename exists
		if($status == false) {
			echo "false";
		} else {
			echo $status;
		}
	} else if(($_POST['action']) == "getCode") {
		$status = checkTableCode($_POST['tblName'], $servername, $dbname, $username, $password); // here run function to check if tablename exists
		echo $status;
	}
	else if(($_POST['action']) == "getNames") {
		try {	
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = $conn->prepare("SELECT tableName FROM brTables");		
			$stmt->execute();
			$result = $stmt->fetchAll();
			$output = "";
			for($i = 0; $i < count($result); $i++) {
				$tableName = $result[$i]["tableName"];
				if($i == count($result) - 1) {
					$output .= $tableName;
				} else {
					$output .= $tableName . ":";
				}
			}
			echo $output;
		}
		catch(PDOExceptation $e) {
			echo "Error:" . $e->getMessage();
		}
	} else if(($_POST['action']) == "getVotes") {
		$tName = $_POST['tblName'];
		try {	
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = $conn->prepare("SELECT * FROM brVotes WHERE tableName = ?");		
			$stmt->bindParam(1,$tName);
			$stmt->execute();
			$result = $stmt->fetchAll();
			/* $output = "";
			for($i = 0; $i < count($result); $i++) {
				$output .= $result[$i]["numVotes"] + "-" + $result[$i]["upVotes"] + ":";
			} */
			echo json_encode($result); 
		}
		catch(PDOExceptation $e) {
			echo "Error:" . $e->getMessage();
		}
	} else if(($_POST['action']) == "updateVotes") {
		$vote = $_POST['vote'];
		$tableName = $_POST['tableName'];
		$tableRow = $_POST['tableRow'];
		if($vote = "0") {
			try {	
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$stmt = $conn->prepare("UPDATE brVotes SET numVotes=numVotes+1 WHERE tableName=? AND columnNumber=?");
				$stmt->bindParam(1,$tableName, PDO::PARAM_STR);
				$stmt->bindParam(2,$tableRow,PDO::PARAM_STR);
				$stmt->execute();
			}
			catch(PDOExceptation $e) {
				echo "Error:" . $e->getMessage();
			}
		} else if($vote = "1") {
			try {	
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$stmt = $conn->prepare("UPDATE brVotes SET upVotes=upVotes+1 WHERE tableName=? AND columnNumber=?");
				$stmt->bindParam(1,$tableName, PDO::PARAM_STR);
				$stmt->bindParam(2,$tableRow,PDO::PARAM_STR);
				$stmt->execute();
				$stmt2 = $conn->prepare("UPDATE brVotes SET numVotes=numVotes+1 WHERE tableName=? AND columnNumber=?");
				$stmt2->bindParam(1,$tableName, PDO::PARAM_STR);
				$stmt2->bindParam(2,$tableRow,PDO::PARAM_STR);
				$stmt2->execute();
			}
			catch(PDOExceptation $e) {
				echo "Error:" . $e->getMessage();
			}
		}
	}
	
	
	function checkTableCode($tName, $servername, $dbname, $username, $password) {
		try {	
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = $conn->prepare("SELECT tableCode FROM brTables WHERE tableName = ?");		
			$stmt->bindParam(1,$tName);
			$stmt->execute();
			$result = $stmt->fetchColumn();
			if($result != false) {
				return $result;
			} else {
				return false;
			}
		}
		catch(PDOExceptation $e) {
			echo "Error:" . $e->getMessage();
		}
	}
?>