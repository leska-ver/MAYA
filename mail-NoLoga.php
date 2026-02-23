<?php
// Проверяем на ошибку 500
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// Подключаем PHPMailer		
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP; // Настройки для продакшена (раскомментировать при необходимости)
// ============================================================================
// ФАЙЛ: mail-NoLoga.php - ВЕРСИЯ БЕЗ ЛОГОВ
// НАЗНАЧЕНИЕ: Обработка заказов из карточки товара и подписки на email
// ВЕРСИЯ: 2.0 (без логирования)
// ============================================================================

	ob_start(); // ← Старт БУФЕРА - для полной защиты от ошибок с заголовками

	// ======== РАБОТА С БАЗОЙ ДАННЫХ ========

	// Подключение "Базы данных", тот же код. ПРОФИ КОД. Скопировали и закинули в файл list.php
	$dbname = 'cc50985_maya';//Из сайта имя "Базы данных MySQL"/
	$dbuser = 'cc50985_maya';//Из сайта имя "Базы данных MySQL"/
	$dbpass = 'yaStore20';//Пароль из сайта "Базы данных"/

	try {
		$pdo = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpass);//для подключения к базе данных MySQL
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);// С EXCEPTION - защищённый код
		$pdo->exec("SET NAMES utf8");

		// Определяем тип формы (заказ или подписка)
		$form_subject = isset($_POST['form_subject']) ? trim($_POST['form_subject']) : 'Заказ товара';
		$form_type = '';
		
		// Определяем тип формы по содержимому
		if (stripos($form_subject, 'подписк') !== false || stripos($form_subject, 'новост') !== false) {
			$form_type = 'подписка';
		} elseif (stripos($form_subject, 'отзыв') !== false) {
			$form_type = 'отзыв';
		} elseif (isset($_POST['size']) || isset($_POST['color'])) {
			$form_type = 'заказ_товара';
		} else {
			$form_type = 'сообщение';
		}
		
		// Подготавливаем запрос для вставки данных. list.php читает эти поля
		$stmt = $pdo->prepare('INSERT INTO form_submissions (name, email, message, size, color, form_type, form_subject, ip_address, user_agent, page_url, date
		) VALUES (:name, :email, :message, :size, :color, :form_type, :form_subject, :ip_address, :user_agent, page_url, NOW()
		)');

		// Привязываем значения
		$stmt->bindValue(':name', $_POST['name'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':email', $_POST['email'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':message', $_POST['message'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':size', $_POST['size'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':color', $_POST['color'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':form_type', $form_type, PDO::PARAM_STR);
		$stmt->bindValue(':page_url', $_POST['page_url'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':form_subject', $form_subject, PDO::PARAM_STR);
		$stmt->bindValue(':ip_address', $_SERVER['REMOTE_ADDR'] ?? '', PDO::PARAM_STR);
		$stmt->bindValue(':user_agent', $_SERVER['HTTP_USER_AGENT'] ?? '', PDO::PARAM_STR);
		
		// Выполняем запрос
		$stmt->execute();
			
	} catch(PDOException $e) {
			// Если база данных недоступна, продолжаем отправку email
	}

	// ======== ОТПРАВКА НА EMAIL ========

	// Подключаем PHPMailer
	$phpmailer_path = __DIR__ . '/PHPMailer';
	if (file_exists($phpmailer_path)) {
		require_once $phpmailer_path . '/src/Exception.php';
		require_once $phpmailer_path . '/src/PHPMailer.php';
		require_once $phpmailer_path . '/src/SMTP.php';
	}

	// Получаем email админов
	$admin_emails = [];
	if (isset($_POST['admin_email'])) {
		if (is_array($_POST['admin_email'])) {
			foreach ($_POST['admin_email'] as $email) {
				$email = trim($email);
				if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
					$admin_emails[] = $email;
				}
			}
		} elseif (is_string($_POST['admin_email'])) {
				$emails = explode(',', $_POST['admin_email']);
				foreach ($emails as $email) {
					$email = trim($email);
					if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
						$admin_emails[] = $email;
					}
				}
		}
	}

	// Если админы не указаны, используем дефолтные
	if (empty($admin_emails)) {
		$admin_emails = ['darki@yandex.ru', 'darki@mail.ru'];
	}

	// Определяем тему письма
	$form_subject = isset($_POST['form_subject']) ? trim($_POST['form_subject']) : 'Новое сообщение с сайта MAYA';

	// Добавляем префикс для заказов товара
	if (isset($_POST['size']) || isset($_POST['color'])) {
		// Проверяем, что префикса ещё нет в начале строки
    if (stripos($form_subject, 'Заказ товара:') !== 0) {
			$form_subject = 'Заказ товара: ' . $form_subject;
		}
	}

	// Формируем тело письма
	$message_body = '';
	$current_time = date('d.m.Y H:i:s');

	// Человекочитаемые названия полей
	$field_names = [
		'name' => 'Имя',
		'email' => 'Email',
		'message' => 'Сообщение',
		'size' => 'Размер',
		'color' => 'Цвет',
		'phone' => 'Телефон',
		'address' => 'Адрес',
		'product' => 'Товар',
		'quantity' => 'Количество'
	];

	// Обрабатываем данные формы
	foreach ($_POST as $key => $value) {
		// Пропускаем технические поля
		if (in_array($key, ['admin_email', 'form_subject'])) {
			continue;
		}
		
		// Если значение пустое, пропускаем
		if (empty($value) && $value !== '0') {
			continue;
		}
		
		// Обрабатываем массивы
		if (is_array($value)) {
			$value = implode(', ', array_filter($value));
		}
		
		// Безопасное экранирование
		$value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

		// Получаем читаемое название поля
		$field_name = $field_names[$key] ?? ucfirst(str_replace('_', ' ', $key));
		
		$message_body .= "<tr><td style='padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 200px;'>$field_name:</td>" . "<td style='padding: 10px; border: 1px solid #ddd;'>$value</td></tr>";
	}

	// Добавляем email пользователя (гарантированно)
if (!empty($_POST['email'])) {
	$message_body .= "<tr><td style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>Email пользователя:</td>" . 
									 "<td style='padding: 10px; border: 1px solid #ddd;'>" . htmlspecialchars($_POST['email']) . "</td></tr>";
}

// Добавляем системную информацию
$message_body .= "<tr><td style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>Дата и время:</td>" . 
							 "<td style='padding: 10px; border: 1px solid #ddd;'>$current_time</td></tr>";
$message_body .= "<tr><td style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>IP-адрес:</td>" . 
							 "<td style='padding: 10px; border: 1px solid #ddd;'>" . ($_SERVER['REMOTE_ADDR'] ?? 'неизвестен') . "</td></tr>";

	// HTML версия письма
	$html_message = "
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset='UTF-8'>
			<title>$form_subject</title>
			<style>
				body { font-family: Arial, sans-serif; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background-color: #BF7691; color: white; padding: 20px; text-align: center; }
				.content { background-color: #f9f9f9; padding: 20px; }
				table { width: 100%; border-collapse: collapse; margin-top: 20px; }
				th { background-color: #f2f2f2; text-align: left; }
				.footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
			</style>
		</head>
		<body>
			<div class='container'>
				<div class='header'>
					<h1>$form_subject</h1>
				</div>
				<div class='content'>
					<p>Новое сообщение с сайта MAYA:</p>
					<table>
						$message_body
					</table>
				</div>
				<div class='footer'>
					<p>Это автоматическое сообщение с сайта <a href='http://maya-store.ru'>MAYA Store</a>.</p>
					<p>Не отвечайте на это письмо.</p>
				</div>    
			</div>
		</body>
	</html>
	";

	// Текстовая версия письма (для почтовых клиентов без HTML) 
	$text_message = "$form_subject\n\n";
	foreach ($_POST as $key => $value) {
		if (in_array($key, ['admin_email', 'form_subject'])) continue;
		if (!empty($value) || $value === '0') {
			if (is_array($value)) {
				$value = implode(', ', array_filter($value));
			}
			$field_name = $field_names[$key] ?? ucfirst(str_replace('_', ' ', $key));
			$text_message .= "$field_name: $value\n";
		}
	}
	$text_message .= "\nДата и время: $current_time\n";
	$text_message .= "IP-адрес: " . ($_SERVER['REMOTE_ADDR'] ?? 'неизвестен') . "\n";
	$text_message .= "\n---\nСообщение отправлено с сайта MAYA Store\n";

	try {
		if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
			// Используем PHPMailer
			$mail = new PHPMailer(true);
			$mail->CharSet = 'UTF-8';
			$mail->Encoding = 'base64';

			// --- Начало --- Настройки для локального тестирования ---
			//$mail->isMail(); //Используем стандартную функцию mail() PHP
			// От кого 
			// $mail->setFrom('noreply@' . $_SERVER['HTTP_HOST'], 'Магазин MAYA');
			// $reply_email = $_POST['email'] ?? ($admin_emails[0] ?? 'noreply@' . $_SERVER['HTTP_HOST']);
			// $mail->addReplyTo($reply_email, $_POST['name'] ?? '');
			// --- Настройки для локального тестирования --- Конец ---			

			// --- Начало --- Настройки для продакшена (раскомментировать при необходимости). SMTP вы сможете настроить позже, когда получите правильный пароль от ящика darki@rambler.ru. Это если пользователь присылает свой пароль на нашу почту.   
			$mail->isSMTP();
			$mail->Host = 'smtp.timeweb.ru';        
			$mail->SMTPAuth = true;
			$mail->Username = 'darki@rambler.ru'; // Почта в тимвебе(cc50985). Спам-фильтр
			$mail->Password = 'G7K8p0Y!Eb'; // ВАШ ПАРОЛЬ от почты darki@rambler.ru
			$mail->SMTPSecure = 'ssl';
			$mail->Port = 465;
			$mail->From = 'darki@rambler.ru';
			$mail->FromName = 'Магазин MAYA';
			$mail->SMTPDebug = 2; // 0 = отключить, 2 = включить отладку. Увидели ошибку → исправили → вернули 0
				
			// От кого 
			$mail->setFrom('darki@rambler.ru', 'Магазин MAYA');
			// --- Настройки для продакшена --- Конец ---
			
			// Кому — админы
			foreach ($admin_emails as $email) {
				$mail->addAddress($email);
			}
			
			// Тема(form_subject)
			// $mail->Subject = $form_subject;
			$mail->Subject = '=?UTF-8?B?' . base64_encode($form_subject) . '?='; //Для кириллицы
			
			// Тело письма
			$mail->isHTML(true);
			$mail->Body = $html_message;
			$mail->AltBody = $text_message;
			
			$mail->send();
			
		} else {
			// Используем стандартную функцию mail()
			$headers = "MIME-Version: 1.0\r\n";
			$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
			$headers .= "From: Магазин MAYA <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
			$headers .= "Reply-To: " . ($_POST['email'] ?? 'noreply@' . $_SERVER['HTTP_HOST']) . "\r\n";
			$headers .= "X-Mailer: PHP/" . phpversion();
			
			foreach ($admin_emails as $email) {
				mail($email, $form_subject, $html_message, $headers);
			}
		}
			
	} catch (Exception $e) {
		// Если ошибка отправки - просто продолжаем
	}

	// ======== ФОРМИРОВАНИЕ ОТВЕТА ========

	// Проверяем, это AJAX запрос или обычная форма
	$is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
						strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

	if ($is_ajax) {
		// Отправляем JSON ответ для AJAX
		header('Content-Type: application/json; charset=utf-8');
		
		$response = [
			'success' => true,
			'message' => 'Ваше сообщение успешно отправлено!',
			'type' => $form_type ?? 'unknown',
			'timestamp' => $current_time
		];
		
		echo json_encode($response, JSON_UNESCAPED_UNICODE);

	} else {
		// Редирект для обычной формы
		$referer = $_SERVER['HTTP_REFERER'] ?? 'index.html';
		
		// Удаляем старые параметры из URL
		$referer = preg_replace('/[?&](success|error)=[^&]*/', '', $referer);
		
		// Добавляем параметр успеха
		$separator = (strpos($referer, '?') === false) ? '?' : '&';
		$redirect_url = $referer . $separator . 'success=1';
		
		// Перенаправляем пользователя
		ob_end_clean(); // ← ОЧИСТКА БУФЕРА перед редиректом
		header("Location: $redirect_url");
		exit;
	}

	ob_end_flush(); // ← ОТПРАВКА БУФЕРА (если что-то осталось)
	
	
?>