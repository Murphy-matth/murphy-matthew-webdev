/**
 * User Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("KnowYourRep")
        .factory("passwordService", passwordService);

    function passwordService() {

        var api = {
            "validate"   : validate,
        };
        return api;

        var minPasswordLength = 7;

        /**
         * Validates the given password. Returns an object with one mandatory field called result.
         * If result is true, then the password is valid.
         * If result is false then there is an additional field that contains the error message.
         */
        function validate(password) {
            result = {
                result: true,
                message: ""
            };

            // Check the password length.
            if (password.length < minPasswordLength) {
                result.result = false;
                result.message = "Passwords must be longer than " + minPasswordLength + " characters."
                return result;
            }
            // Make sure it contains at least one digit.
            if (!(/(?=.*\d)/).test(password)) {
                result.result = false;
                result.message = "Passwords must contain at least one digit."
                return result;
            }
            // Make sure it contains at least one lowercase character.
            if (!(/(?=.*[a-z])/).test(password)) {
                result.result = false;
                result.message = "Passwords must contain at least one lowercase character."
                return result;
            }
            // Make sure it contains at least one uppercase character.
            if (!(/(?=.*[A-Z])/).test(password)) {
                result.result = false;
                result.message = "Passwords must contain at least one uppercase character."
                return result;
            }
            return result;
        }
    }
})();
