export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Campo requerido',
            //'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Ingrese un correo electronico valido',
            //'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Longitud minima ${validatorValue.requiredLength}`,
            'maxlength': `Longitud maxima ${validatorValue.requiredLength}`,
            'solonumeros': 'Ingrese solo numeros',
            'validarurl': "Ingrese una url correcta",
            'rfc': "Ingrese un RFC valido",
            'curp': "Ingrese un CURP valido",
            'numeroFlotantes': 'Número sin formato adecuado'
        };

        return config[validatorName];
    }


    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static validarNumeros(control) {
        if (control.value !== null) {
            if (control.value.match(/[^-0-9\.]/)) {
                return { 'solonumeros': true };
            } else {
                return null;

            }
        } else {
            return null;
        }
    }

    static validarFlotantes(control) {
        if (control.value !== null) {
            if (control.value.match(/[0-9]+([.][0-9]+)?$/) === null) {
                return { 'numeroFlotantes': true };
            } else {
                return null;
            }
        }
    }

    static urlValidator(control) {
        var urlregex = /^((http|https):\/\/)?((([a-zA-Z]\w*)(\.\w+)+(\/\w*(\.\w+)*)*(\?.+)*)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\:\d{1,4})?(\/[a-zA-Z]\w*(\/)?)+))$/;
        if (!urlregex.test(control.value)) {
            return { 'validarurl': true };
        } else {
            return null;
        }
    }
    static validarRFC(control) {
        if (!control.value.match(/^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))/)) {
            return { 'rfc': true };
        } else {
            return null;
        }
    }
    static validarRFCMoral(control) {
        if (!control.value.match(/^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){2})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))/)) {
            return { 'rfc': true };
        } else {
            return null;
        }
    }
    static validarCURP(control) {
        if (control.value.match(/^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{2}$/)) {
            return { 'curp': true };
        } else {
            return null;
        }
    }
}
