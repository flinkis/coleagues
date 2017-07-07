import _ from 'lodash';

class Validate {
    constructor(valid = true, errors = []) {
        this.valid = valid;
        this.errors = errors;
    }

    reset() {
        this.valid = true;
        this.errors = [];
    }

    length(array, errorMsg = 'need more in array') {
        this.valid = this.valid && array.length > 0;
        if (array.length <= 0) {
            this.errors.push(errorMsg);
        }

        return this;
    }

    isset(string, errorMsg = 'string is empty') {
        this.valid = this.valid && !_.isEmpty(string);
        if (_.isEmpty(string)) {
            this.errors.push(errorMsg);
        }

        return this;
    }

    validate(callback) {
        if (this.valid && _.isFunction(callback)) {
            callback();
        } else if (!this.valid && _.isFunction(callback)) {
            callback(this.errors);
        }

        this.reset();
    }
}

export default Validate;
