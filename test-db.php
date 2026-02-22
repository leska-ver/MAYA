<?php
$dbname = 'cc50985_maya';
$dbuser = 'cc50985_maya';
$dbpass = '1GmHsZV';

try {
    $pdo = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpass);
    echo '✅ Подключение к БД успешно!';
} catch(PDOException $e) {
    echo '❌ Ошибка БД: ' . $e->getMessage();
}
?>