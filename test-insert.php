<?php
$dbname = 'cc50985_maya';
$dbuser = 'cc50985_maya';
$dbpass = '1GmHsZV';

try {
    $pdo = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("INSERT INTO form_submissions (name, email, form_subject, date) VALUES ('Тест', 'test@test.ru', 'Тестовая вставка', NOW())");
    $stmt->execute();
    
    echo '✅ Вставка сработала!';
} catch(PDOException $e) {
    echo '❌ Ошибка: ' . $e->getMessage();
}
?>