<?php
	class Functions {
		private function createBase($conn) {
			$SQL = 'CREATE TABLE IF NOT EXISTS brTables(tableName varchar(50) PRIMARY KEY, tableCode text NOT NULL)';
			$conn->exec($SQL);
			$VotesSql = 'CREATE TABLE IF NOT EXISTS brVotes(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, tableName varchar(50) NOT NULL, columnNumber int(2) NOT NULL, numVotes int NOT NULL, upVotes int NOT NULL)';
			$conn->exec($VotesSql);
		}
		
		private function insertTableCode($conn, $tName, $html) { // insert table-code, (string)$tName is the table name of the table to save, (string)$html is the html to save
			$stmt = $conn->prepare("INSERT INTO brTables (tableName,tableCode) VALUES (?, ?)");
			$stmt->bindParam(1,$tName,PDO::PARAM_STR);
			$stmt->bindParam(2,$html, PDO::PARAM_STR);
			$stmt->execute();
		}
		
		private function insertVotesCode($conn, $tName, $html) { // insert every columns index with votes to votesTable, (string)$tName is the table name of the table with votes, (string)$html is the html of the table
			$columns = explode("<tr", $html);
			$numColumns = count($columns) - 1;
			for ($i = 2; $i <= $numColumns; $i++) { 
				$stmt2 = $conn->prepare("INSERT INTO brVotes (tableName,columnNumber,numVotes,upVotes) VALUES (?, ?, 1, 1)");
				$stmt2->bindParam(1,$tName,PDO::PARAM_STR);
				$stmt2->bindParam(2,$i, PDO::PARAM_INT);
				$stmt2->execute();
			}
		}
		
		public function checkTableCode($tName, $conn) {
			try {	
				$stmt = $conn->prepare("SELECT tableCode FROM brTables WHERE tableName = ?");		
				$stmt->bindParam(1,$tName);
				$stmt->execute();
				$result = $stmt->fetchColumn();
				if($result != false) {
					return $result;
				} else {
					return "false";
				}
			}
			catch(PDOException $e) {
				if (strpos($e, 'table or view not found') !== false) {
					$this->createBase($conn);
					checkTableCode($tName, $conn);
				} else {
					echo "Error:" . $e->getMessage();
				}
			}
		}
		
		public function getNames($conn) {
			try {	
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
				if($output == "") {
					return "none";
				} else {
					return $output;
				}
			}
			catch(PDOException $e) {
				if (strpos($e, 'table or view not found') !== false) {
					// $this->createBase($conn);
					return $e;
				} else {
					echo "Error:" . $e->getMessage();
				}
			}
		}
		
		public function getVotes($conn, $tName) { // return votes based on name of table, $conn is the pdo connection, $tName is the table name
			try {	
				$stmt = $conn->prepare("SELECT * FROM brVotes WHERE tableName = ?");		
				$stmt->bindParam(1,$tName);
				$stmt->execute();
				$result = $stmt->fetchAll();
				return json_encode($result); 
			}
			catch(PDOExceptation $e) {
				echo "Error:" . $e->getMessage();
			}
		
		}
		
		public function createTable($conn, $tName, $html) {
			if((strpos($html, 'class="ratingC"')) !== false) { // votes was found in html, add the votes to votesTable
				// create SQL table, add values in application best is if filled in 
				try {
					$this->createBase($conn);
					$this->insertTableCode($conn, $tName, $html);
					$this->insertVotesCode($conn, $tName, $html);
					return "<p class='status'>The table was saved</p>";
				}
				catch(PDOExceptation $e) {
					return  "Error:" . $e->getMessage();
				}
			 } else {
				 // create SQL table, add values in application best is if filled in 
				try {
					$this->createBase($conn);
					$this->insertTableCode($conn, $tName, $html);
					return "<p class='status'>The table was saved</p>";
				}
				catch(PDOExceptation $e) {
					return  "Error:" . $e->getMessage();
				}
			}
		}
		
		public function updateTable($conn, $tName, $html) {
			try {
				$stmt = $conn->prepare("UPDATE brTables SET tableCode=? WHERE tableName=?");
				$stmt->bindParam(1,$html, PDO::PARAM_STR);
				$stmt->bindParam(2,$tName,PDO::PARAM_STR);
				$stmt->execute();
				echo "<p class='status'>The table was updated</p>";
			}
			catch(PDOExceptation $e) {
				echo  "Error:" . $e->getMessage();
			}
		}
		
		public function updateVotes($conn, $vote, $tName, $tRow) {
			// escape input
			
			
			if($vote == "0") { // downvote, add no upvote but add vote to total number of votes
				try {	
					$stmt = $conn->prepare("UPDATE brVotes SET numVotes=numVotes+1 WHERE tableName=? AND columnNumber=?");
					$stmt->bindParam(1,$tName, PDO::PARAM_STR);
					$stmt->bindParam(2,$tRow,PDO::PARAM_STR);
					$stmt->execute();
				}
				catch(PDOExceptation $e) {
					echo "Error:" . $e->getMessage();
				}
			} else if($vote == "1") { // uovote, add both to upvotes and total number of votes
				try {	
					$stmt = $conn->prepare("UPDATE brVotes SET upVotes=upVotes+1 WHERE tableName=? AND columnNumber=?");
					$stmt->bindParam(1,$tName, PDO::PARAM_STR);
					$stmt->bindParam(2,$tRow,PDO::PARAM_STR);
					$stmt->execute();
					$stmt2 = $conn->prepare("UPDATE brVotes SET numVotes=numVotes+1 WHERE tableName=? AND columnNumber=?");
					$stmt2->bindParam(1,$tName, PDO::PARAM_STR);
					$stmt2->bindParam(2,$tRow,PDO::PARAM_STR);
					$stmt2->execute();
				}
				catch(PDOExceptation $e) {
					echo "Error:" . $e->getMessage();
				}
			}
		}
		
		public function wilsonScore($tName, $conn) {
			try {	
				$stmt = $conn->prepare("
					SELECT columnNumber, ((upVotes + 1.9208) / (upVotes + (numVotes - upVotes)) - 
					1.96 * SQRT((upVotes * (numVotes - upVotes)) / (upVotes + (numVotes - upVotes)) + 0.9604) / 
                          (upVotes + (numVotes - upVotes))) / (1 + 3.8416 / (upVotes + (numVotes - upVotes))) 
					AS ci_lower_bound FROM brVotes WHERE upVotes + (numVotes - upVotes) > 0 AND tableName=?
				ORDER BY ci_lower_bound DESC;");		
				$stmt->bindParam(1,$tName);
				$stmt->execute();
				$result = $stmt->fetchAll();
				if($result != false) {
					return json_encode($result);
				} else {
					return "false";
				}
			}
			catch(PDOException $e) {
				if (strpos($e, 'table or view not found') !== false) {
					$this->createBase($conn);
					checkTableCode($tName, $conn);
				} else {
					echo "Error:" . $e->getMessage();
				}
			}
		}
	}
