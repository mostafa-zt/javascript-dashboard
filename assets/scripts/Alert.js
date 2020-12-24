export class AlertType {
    static Success = 'success';
    static Warning = 'warning';
}
let timeoutHandle;
export class Alert {
    constructor(alertType, msg) {
        this.alert = document.getElementById('alert-msg');
        this.alertType = alertType;
        this.message = msg;

        this.clearAlert();
    }

    show() {
        this.alert.classList.add('alert', 'visible', 'fadeIn', this.alertType);
        this.alert.textContent = this.message;
        this.alert.classList.add(this.alertType);
        timeoutHandle = window.setTimeout(function () {
            const alert = document.getElementById('alert-msg');
            alert.classList.remove('fadeIn');
            alert.classList.add('fadeOut');
            window.setTimeout(function () {
                alert.className = '';
                alert.innerHTML = '';
            }, 200)
        }, 5000)
    }

    clearAlert() {
        this.alert.className = '';
        this.alert.innerHTML = '';
        window.clearTimeout(timeoutHandle);
    }
}