window.numberToEnglish = (function () {
    let firstFewThousandsTerm = [
        'thousand',
        'milli',
        'billi',
        'trilli',
        'quadrilli',
        'quintilli',
        'sextilli',
        'septilli',
        'octilli',
        'nonilli',
        'decilli',
    ]
    let thousandsUnitTerms = [
        'un',
        'duo',
        'tre',
        'quattuor',
        'quin',
        'se',
        'septe',
        'octo',
        'nove',
    ]
    let thousandsUnitTermsN = [
        'un',
        'duo',
        'tre',
        'quattuor',
        'quin',
        'se',
        'septen',
        'octo',
        'noven',
    ]
    let thousandsUnitTermsM = [
        'un',
        'duo',
        'tre',
        'quattuor',
        'quin',
        'se',
        'septem',
        'octo',
        'novem',
    ]
    let thousandsUnitTermsS = [
        'un',
        'duo',
        'tres',
        'quattuor',
        'quin',
        'ses',
        'septe',
        'octo',
        'nove',
    ]
    let thousandsUnitTermsX = [
        'un',
        'duo',
        'tre',
        'quattuor',
        'quin',
        'sex',
        'septe',
        'octo',
        'nove',
    ]
    let thousandsUnitInSXLookup = [
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
    ]
    let thousandsTensTerm = [
        'deci',
        'viginti',
        'triginta',
        'quadraginta',
        'quinquaginta',
        'sexaginta',
        'septuaginta',
        'octoginta',
        'nonaginta',
    ]
    let thousandsTensTermTi = [
        'deci',
        'viginti',
        'triginti',
        'quadraginti',
        'quinquaginti',
        'sexaginti',
        'septuaginti',
        'octoginti',
        'nonaginti',
    ]
    let thousandsTensNMLookup = [1, 2, 1, 1, 1, 1, 1, 2, 0]
    let thousandsTensSXLookup = [0, 1, 1, 1, 1, 0, 0, 2, 0]
    let thousandsHundredsTerm = [
        'centi',
        'ducenti',
        'trecenti',
        'quadringenti',
        'quingenti',
        'sescenti',
        'septingenti',
        'octingenti',
        'nongenti',
    ]
    let thousandsHundredsNMLookup = [1, 1, 1, 1, 1, 1, 1, 2, 0]
    let thousandsHundredsSXLookup = [2, 0, 1, 1, 1, 0, 0, 2, 0]

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

    /**
     * @param {string} input
     */
    function getEnglishWord(input) {
        if (typeof input !== 'string') {
            input = input + ''
        }
        // Empty string
        if (input.length === 0) {
            throw {
                error: 'string_empty',
                message: 'Input number string is empty',
            }
        }
        // Err if string length is over 3 quadrillion
        if (input.length > 3_000_000_000_000_000) {
            throw {
                error: 'input_too_big',
                message: 'Input number is too large',
            }
        }
        // Err if not all characters are numbers
        for (let i = input.length - 1; i >= 0; i--) {
            if (!isValidDigit(input, i)) {
                throw {
                    error: 'invalid_input',
                    message: 'Input number contains non-numerical characters',
                }
            }
        }
        // Err if input has leading zeroes
        if (toDigit(input, 0) === 0) {
            if (input.length === 1) {
                return 'zero'
            } else {
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
        let i = ((input.length % 3) - 3) % 3
        let hundredsDigit = i >= 0 ? toDigit(input, i) : 0
        let tensDigit = i >= -1 ? toDigit(input, i + 1) : 0
        let onesDigit = toDigit(input, i + 2)
        resultString = _appendWithSpace(
            _getEnglishWordForHundreds(hundredsDigit, tensDigit, onesDigit),
            getThousandTerm(thousandsIndex--)
        )

        for (i += 3; i < input.length; i += 3, thousandsIndex--) {
            let hundredsDigit = toDigit(input, i)
            let tensDigit = toDigit(input, i + 1)
            let onesDigit = toDigit(input, i + 2)
            let hundredsString = _getEnglishWordForHundreds(
                hundredsDigit,
                tensDigit,
                onesDigit
            )
            if (hundredsString.length !== 0) {
                let thousandsTerm = getThousandTerm(thousandsIndex)
                resultString = _appendWithSpace(
                    resultString,
                    _appendWithSpace(
                        _getEnglishWordForHundreds(
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
     * 0 is for thousands, 1 is for million, 2 is for billion, 3 is for trillion,
     * 10 for decillion, etc.
     * @param {number} thousandsIndex - number of zeroes/3 minus 3
     * @returns {string}
     */
    function getThousandTerm(thousandsIndex = -1) {
        // Edge cases
        if (thousandsIndex < 0) return ''
        if (thousandsIndex == 0) return firstFewThousandsTerm[thousandsIndex]
        if (thousandsIndex <= 10) {
            return firstFewThousandsTerm[thousandsIndex] + 'on'
        }
        if (thousandsIndex === 16) {
            return 'sexdecillion'
        }
        if (thousandsIndex >= Infinity) {
            throw {
                error: 'too_big',
                message: 'Thousands index is too big',
            }
        }

        // Even the thousands term needs thousands index!
        // But this time, we won't subtract 1 from the
        // number of commas after the number
        let commasThousandsIndex = Math.floor(Math.log10(thousandsIndex) / 3)
        let result = ''

        while (commasThousandsIndex >= 0) {
            let thousandsThousandsGroup =
                Math.floor(
                    thousandsIndex / Math.pow(10, commasThousandsIndex-- * 3)
                ) % 1000
            let hundreds = (Math.floor(thousandsThousandsGroup / 100) % 10) - 1
            let tens = (Math.floor(thousandsThousandsGroup / 10) % 10) - 1
            let unit = (thousandsThousandsGroup % 10) - 1

            // Edge case: all zeros
            if (thousandsThousandsGroup === 0) {
                result += 'nilli'
                continue
            }

            let hundredsString = ''
            let tensString = ''
            let unitString = ''

            if (unit !== -1) {
                if (tens === -1 && hundreds === -1) {
                    // Use the firstFewThousands array
                    result += firstFewThousandsTerm[unit + 1]
                    continue
                } else {
                    let valueForNMXSLookup, NMXSLookup
                    let term1, term2
                    if (tens !== -1) {
                        valueForNMXSLookup = tens
                        if (thousandsUnitInSXLookup[unit]) {
                            NMXSLookup = thousandsTensSXLookup
                        } else {
                            NMXSLookup = thousandsTensNMLookup
                        }
                    } else {
                        // There should be a hundreds in this group
                        valueForNMXSLookup = hundreds
                        if (thousandsUnitInSXLookup[unit]) {
                            NMXSLookup = thousandsHundredsSXLookup
                        } else {
                            NMXSLookup = thousandsHundredsNMLookup
                        }
                    }
                    if (thousandsUnitInSXLookup[unit]) {
                        term1 = thousandsUnitTermsS
                        term2 = thousandsUnitTermsX
                    } else {
                        term1 = thousandsUnitTermsN
                        term2 = thousandsUnitTermsM
                    }
                    switch (NMXSLookup[valueForNMXSLookup]) {
                        case 0:
                            unitString = thousandsUnitTerms[unit]
                            break
                        case 1:
                            unitString = term1[unit]
                            break
                        case 2:
                            unitString = term2[unit]
                            break
                    }
                }
            }
            if (tens !== -1) {
                tensString = (
                    hundreds !== -1 ? thousandsTensTerm : thousandsTensTermTi
                )[tens]
            }
            if (hundreds !== -1) {
                hundredsString = thousandsHundredsTerm[hundreds]
            }
            result += unitString + tensString + hundredsString + 'lli'
        }

        return result + 'on'
    }

    /**
     * @param {string} num - single character string
     */
    function toDigit(num, index = 0) {
        return num.charCodeAt(index) - 48
    }
    /**
     * @param {string} num - single character string
     */
    function isValidDigit(num, index = 0) {
        let digit = toDigit(num, index)
        return digit >= 0 && digit < 10
    }
    /**
     * @param {number} hundredsDigit - digit of hundreds
     * @param {number} tensDigit - digit of tens
     * @param {number} onesDigit - digit of ones
     * @returns {string} the english word up to 999
     */
    function _getEnglishWordForHundreds(hundredsDigit, tensDigit, onesDigit) {
        let result = ''

        if (hundredsDigit !== 0) {
            result = _appendWithSpace(
                result,
                numberTerm[hundredsDigit] + ' hundred'
            )
        }

        if (tensDigit != 0) {
            // The input string has a non-zero tens digit
            if (tensDigit === 1) {
                // Accomodate 10, 11, 12, up to 19
                // These are irregulars and doesn't follow the common pattern
                result = _appendWithSpace(result, irregularTensTerm[onesDigit])
            } else if (onesDigit !== 0) {
                // Accomodate 21, 22 ... 29, 31, 32, those with hyphens
                result = _appendWithSpace(
                    result,
                    tensTerm[tensDigit] + '-' + numberTerm[onesDigit]
                )
            } else {
                // Will only reach this part if ones is 0 and tens is non-zero
                // like 20, 30, 40, 50, 60 (not 10 and 00)
                result = _appendWithSpace(result, tensTerm[tensDigit])
            }
        } else {
            // Will only reach this part if there's no tens digit
            if (onesDigit !== 0) {
                result = _appendWithSpace(result, numberTerm[onesDigit])
            }
        }

        return result
    }
    /**
     *
     * @param {string} inputString
     * @param {string} toAppend
     * @returns {string}
     */
    function _appendWithSpace(inputString, toAppend) {
        if (inputString.length === 0) {
            return toAppend
        }
        if (toAppend.length === 0) {
            return inputString
        }
        return inputString + ' ' + toAppend
    }

    return { getEnglishWord, getThousandTerm, toDigit, isValidDigit }
})()
