<?php
	class Database
	{
		private $servername = ""; // enter host here
		private $dbname = ""; // enter database name here
		private $username = ""; // enter database username here
		private $password = ""; // enter database password here
		private $dbh;
		private $error;

		public function __construct() {
			$dsn = 'mysql:host=' . $this->servername . ';dbname=' . $this->dbname;
			$options = array(
				PDO::ATTR_PERSISTENT => true,
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
			);
			try{
				$this->dbh = new PDO($dsn, $this->username, $this->password, $options);
			}
			catch(PDOException $e){
				$this->error = $e->getMessage();
			}
		}
		
		public function getDb() {
			return $this->dbh;
		}
	}
