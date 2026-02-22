<?php
$to = 'darki@yandex.ru'; // ваш тестовый адрес
$subject = 'Тест почты Timeweb';
$message = 'Если вы это видите — mail() работает!';
$headers = 'From: noreply@тест333.рф';

if (mail($to, $subject, $message, $headers)) {
    echo '✅ mail() РАБОТАЕТ';
} else {
    echo '❌ mail() НЕ РАБОТАЕТ';
}
?>