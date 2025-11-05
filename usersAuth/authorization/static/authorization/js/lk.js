const csrfTokenInput = document.querySelector('[name="csrfmiddlewaretoken"]');

const changeName = document.getElementById('change_name_btn');
const changeEmail = document.getElementById('change_email_btn');
const changePassword = document.getElementById('change_password_btn');


changeName.addEventListener('click', async function () {
    const newName = document.getElementById('newName');
    const password = document.getElementById('namePassword');

    if (newName.value === '' || password.value === '') {
        showNotification("danger", "Не все поля заполнены.");
        return;
    }

    if (validatePasswordLength(newName)){ return; }
    if (validatePasswordLength(password)){ return; }

    try {
        let bodyContext = JSON.stringify({ new_name: newName.value, password: password.value });
        changeData(bodyContext);
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        showNotification("danger",'Произошла ошибка при смене данных');
    }
});

changeEmail.addEventListener('click', async function () {
    const newEmail = document.getElementById('newEmail');
    const password = document.getElementById('emailPassword');

    if (newEmail.value === '' || password.value === '') {
        showNotification("danger", "Не все поля заполнены.");
        return;
    }

    if (validatePasswordLength(newEmail)){ return; }
    if (validatePasswordLength(password)){ return; }

    try {
        let bodyContext = JSON.stringify({ new_email: newEmail.value, password: password.value });
        changeData(bodyContext);
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        showNotification("danger",'Произошла ошибка при смене данных');
    }
});

changePassword.addEventListener('click', async function () {
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const password = document.getElementById('oldPassword');

    if (newPassword.value === '' || confirmPassword.value === '' ||password.value === '') {
        showNotification("danger", "Не все поля заполнены.");
        return;
    }

    if (validatePasswordLength(newPassword)){ return; }
    if (validatePasswordLength(confirmPassword)){ return; }
    if (validatePasswordLength(password)){ return; }

    if (confirmPassword.value != newPassword.value) {
        showNotification("danger", "Пароли не совпадают!");
        return;
    }

    try {
        let bodyContext = JSON.stringify({ new_password: newPassword.value, password: password.value });
        changeData(bodyContext);
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        showNotification("danger",'Произошла ошибка при смене данных');
    }
});

async function changeData(bodyContext) {
    const response = await fetch(update_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfTokenInput.value
            },
            body: bodyContext
        });

        const data = await response.json();
        let message = data.message;

        if (data.success) {
            showNotification("success", data.message);
            setTimeout(() => {
                showNotification("warning", 'Страница будет перезагружена');
            }, 1000);
            setTimeout(() => {
                window.location.href = lk_url;
            }, 2000);
        } else {
            showNotification("danger", data.message);
        }
}

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

function validatePasswordLength(input) {
    if (input.value.length < 8 && input.value !== '') {
        showNotification('danger', 'Пароль должен быть не менее 8 символов');
        return true }
    return false
}
