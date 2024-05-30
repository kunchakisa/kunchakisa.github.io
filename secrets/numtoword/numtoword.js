const NumberToEnglishWord = (() => {
    let firstFewThousandsTerm = ['thousand', 'million']
    let irregularTensTerm = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ]
    let tensTerm = [
        '_',
        '_',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ]
    let numberTerm = [
        '_',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
    ]
    return class {
        /**
         * Convert the number into english word.
         *
         * Example
         * - 77 -> seventy-seven
         * - 13 -> thirteen
         * @param {string} input - number consisting of just numerical characters
         * @returns - number in english form
         */
        static getEnglishWord(input) {
            // Convert to string if not a string
            if (typeof input !== 'string') {
                input = input + ''
            }
            // Step 1: Check if the input string is valid.
            // Err if not all characters are numbers
            for (let i = input.length - 1; i >= 0; i--) {
                if (!this.isValidDigit(input, i)) {
                    throw {
                        error: 'invalid_input',
                        message:
                            'Input number contains non-numerical characters',
                    }
                }
            }
            // Edge case: Err if empty string
            if (input.length === 0) {
                throw {
                    error: 'string_empty',
                    message: 'Input number string is empty',
                }
            }
            if (this.toDigit(input, 0) === 0) {
                if (input.length === 1) {
                    // Edge case: input is just 0 (output "zero")
                    return 'zero'
                } else {
                    // Edge case: Err if input has leading zeroes
                    throw {
                        error: 'has_leading_zeroes',
                        message: 'Input number contains leading zeroes',
                    }
                }
            }

            let resultString = ''

            // Calculate starting thousands index
            // 1-3 has starting -1 thousands index
            // 4-6 has starting 0 thousands index
            // 7-9 has starting 1 thousands index
            let thousandsIndex = Math.floor((input.length - 1) / 3) - 1

            // i should start where the leftmost thousand separator
            // of number starts
            // - 1,000 index -2 (len%3 == 1)
            // - 100 index 0 (len%3 == 0)
            // - 10 index -1 (len%3 == 2)
            // - 1 index -2 (len%3 == 1)
            let i = input.length - (thousandsIndex + 2) * 3

            // Parse the first thousand groups, while digits outside the string
            // is set to 0 by default
            let hundredsDigit = i >= 0 ? this.toDigit(input, i) : 0
            let tensDigit = i >= -1 ? this.toDigit(input, i + 1) : 0
            let onesDigit = this.toDigit(input, i + 2)
            resultString = this._appendWithSpace(
                this._getEnglishWordForHundreds(
                    hundredsDigit,
                    tensDigit,
                    onesDigit
                ),
                this.getThousandTerm(thousandsIndex--)
            )

            for (i += 3; i < input.length; i += 3, thousandsIndex--) {
                let hundredsDigit = this.toDigit(input, i)
                let tensDigit = this.toDigit(input, i + 1)
                let onesDigit = this.toDigit(input, i + 2)
                let hundredsString = this._getEnglishWordForHundreds(
                    hundredsDigit,
                    tensDigit,
                    onesDigit
                )
                if (hundredsString.length !== 0) {
                    let thousandsTerm = this.getThousandTerm(thousandsIndex)
                    resultString = this._appendWithSpace(
                        resultString,
                        this._appendWithSpace(
                            this._getEnglishWordForHundreds(
                                hundredsDigit,
                                tensDigit,
                                onesDigit
                            ),
                            thousandsTerm
                        )
                    )
                }
            }

            return resultString
        }

        /**
         * Get the term for the thousands number for the specified thousands index.
         *
         * Examples:
         * - 0 is for thousands
         * - 1 is for million
         * - -1 is blank
         * @param {number} thousandsIndex - number of commas after the thousands group minus 1
         * @returns {string}
         */
        static getThousandTerm(thousandsIndex) {
            // Edge cases
            if (thousandsIndex < 0) return ''
            if (thousandsIndex >= firstFewThousandsTerm.length) {
                throw {
                    error: 'thousands_index_too_big',
                    message: 'Thousands index is too big',
                }
            }
            // Return from array
            return firstFewThousandsTerm[thousandsIndex]
        }

        /**
         * @param {string} num - string
         * @param {int} index - position of the character
         */
        static toDigit(num, index = 0) {
            return num.charCodeAt(index) - 48
        }
        /**
         * Test if a character is a valid number
         * @param {string} num - string
         * @param {int} index - position of the character
         */
        static isValidDigit(num, index = 0) {
            let digit = this.toDigit(num, index)
            return digit >= 0 && digit < 10
        }
        /**
         * Parse a string in CSV format. This function converts
         * number value in a CSV to english words. Other values that
         * are not numbers will remain untouched.
         *
         * The input CSV data should be modified directly
         * @param {string} csvData - 2-dimensional array of values. Also serves as the output
         */
        static parseCSV(csvData) {
            for (let row = 0; row < csvData.length; row++) {
                for (let col = 0; col < csvData[row].length; col++) {
                    try {
                        csvData[row][col] = NumberToEnglishWord.getEnglishWord(
                            csvData[row][col]
                        )
                    } catch (e) {}
                }
            }
        }
        /**
         * @param {number} hundredsDigit - digit of hundreds
         * @param {number} tensDigit - digit of tens
         * @param {number} onesDigit - digit of ones
         * @returns {string} the english word up to 999
         */
        static _getEnglishWordForHundreds(hundredsDigit, tensDigit, onesDigit) {
            let result = ''

            if (hundredsDigit !== 0) {
                result = this._appendWithSpace(
                    result,
                    numberTerm[hundredsDigit] + ' hundred'
                )
            }

            if (tensDigit != 0) {
                // The input string has a non-zero tens digit
                if (tensDigit === 1) {
                    // Accomodate 10, 11, 12, up to 19
                    // These are irregulars and doesn't follow the common pattern
                    result = this._appendWithSpace(
                        result,
                        irregularTensTerm[onesDigit]
                    )
                } else if (onesDigit !== 0) {
                    // Accomodate 21, 22 ... 29, 31, 32, those with hyphens
                    result = this._appendWithSpace(
                        result,
                        tensTerm[tensDigit] + '-' + numberTerm[onesDigit]
                    )
                } else {
                    // Will only reach this part if ones is 0 and tens is non-zero
                    // like 20, 30, 40, 50, 60 (not 10 and 00)
                    result = this._appendWithSpace(result, tensTerm[tensDigit])
                }
            } else {
                // Will only reach this part if there's no tens digit
                if (onesDigit !== 0) {
                    result = this._appendWithSpace(
                        result,
                        numberTerm[onesDigit]
                    )
                }
            }

            return result
        }

        /**
         * Append a string to another, putting a space if both of them aren't empty.
         * @param {string} inputString
         * @param {string} toAppend
         * @returns {string}
         */
        static _appendWithSpace(inputString, toAppend) {
            if (inputString.length === 0) {
                return toAppend
            }
            if (toAppend.length === 0) {
                return inputString
            }
            return inputString + ' ' + toAppend
        }
    }
})()

window.NumberToEnglishWord = NumberToEnglishWord
