const csrfTokenInput = document.querySelector('[name="csrfmiddlewaretoken"]');
const editBtn = document.getElementById('edit_goods');
const delbtn = document.getElementById('delete_goods');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(check_permission_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfTokenInput.value
            },
            body: JSON.stringify({
                codename: 'select_goods'
            })
        });

        const data = await response.json();
        const tbody = document.querySelector('table tbody');

        if (!data.access) {
            if (tbody) {
                tbody.remove();
            }

            showNotification('danger', 'Вы не имейте прав для просмотра данных таблицы товаров');
        } else {
            tbody.style.display = 'block';
        }

    } catch (error) {
        console.error('Ошибка при проверке прав:', error);
    }
});



function showNotification(type, message) {
            const notificationContainer = document.getElementById('notification-container');
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade-in`;
            notification.role = 'alert';
            notification.innerHTML = `
                ${message}
            `;
            notificationContainer.appendChild(notification);

            // Удаляем уведомление через 3 секунды
            setTimeout(() => {
                notification.classList.remove('fade-in'); // Убираем класс для запуска исчезновения
                notification.classList.add('fade-out'); // Добавляем класс для анимации исчезновения

                // Удаляем элемент после завершения анимации
                notification.addEventListener('animationend', () => {
                    notification.remove();
                });
            }, 3000); // 3 секунды
        }

async function checkPermission(codename) {
        try {
            const response = await fetch(check_permission_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfTokenInput.value
                },
                body: JSON.stringify({ codename: codename })
            });

            const data = await response.json();
            if (data.access) { showNotification('success', 'Вы имеете данное право!'); }
            else { showNotification('danger', 'Вы не можете выполнять данное действие...'); }

        } catch (error) {
            console.error('Ошибка проверки прав:', error);
            return false;
        }
    }