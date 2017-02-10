$(document).ready(function () {
    $("#scientific").hide();
    //$("#simple").hide();
    $("#advanced").hide();
    $("#alpha").hide();

    /* Reference to the calculator 
    button(s) of selected calculator
    interface */
    var index = 0;
    var $keys = $(".selected td.key");
    var $current = $keys[index];
    var dataValue = "";

    /* Reference to the DOM suggestions
    elements */
    var $suggestions = $(".selected .suggestions td");
    var suggIndex = 0;
    var suggRepetitions = 0;
    var isSuggestionMoving = false;
    var isFirstSuggestionLeftClick = true;
    var isFirstSuggestionRightClick = true;

    /* Reference to the DOM letter suggestions
    elements */
    var $letters = $("#alphaLetters td");

    /* Letter suggestion variables */
    var isLetterRow = false;
    var isFirstLetterRow = true;
    var letterIndex = 0;
    var letterRepetitions = 0;
    var isLetterMoving = false;
    var isFirstLeftClick = true;
    var isFirstLetterLeftClick = true;

    /* Word suggestion variables */
    var $words = [];
    var wordSuggestions = [];
    var letter = "";
    var word = "";
    var wordTemp = "";
    var isCapsEnabled = false;
    var isShiftEnabled = false;
    var isAlphabetInput = false;

    /* Selection variables */
    var numRows = 5; // Initial number of rows
    var numColumns = 5; // Initial number of columns 
    var rowRepetitions = 0;
    var isChangingRows = true;
    var isSelectionPaused = false;
    var isInnerLocked = false;

    /* Array containing references to 
    all calculator interfaces on the DOM */
    var divArr = [$("#simple"), $("#advanced"), $("#alpha"), $("#scientific")];
    var indexArr = 0;

    /* The far right numerical output
    on the calculator monitor. */
    var currentValue = "";
    var operator = false;
    var advancedFunction = false;
    var lastAdvanced = "";
    var currentAdvanced = "";
    var advancedArr = [];
    var advancedArrTemp = false;
    var pressedEqual = false;
    var output = "";
    var lastIndex = 2;

    /* Miscellaneous variables */
    var isConstantRepeated = false;
    var isFunctionRepeated = false;
    var arithmeticIndex = 0;
    var specialCharacters = ".,;:?!@#&$()\\/<>\[\]\{\}~";

    /* Clears the calculator screen */
    function clearOutput() {
        output = "";
        currentValue = "";
        operator = false;
        restoreDefaults();
        updateOutput();
    }

    /* Resets calculator */
    function restoreDefaults() {
        index = 0;
        suggIndex = 0;
        suggRepetitions = 0;
        isSelectionPaused = false;
        advancedFunction = false;
        currentAdvanced = "";
        advancedArr = [];
        advancedArrTemp = false;
        isConstantRepeated = false;
        isFunctionRepeated = false;
        lastAdvanced = "";
        lastIndex = 2;
        arithmeticIndex = 0;
        pressedEqual = false;
        currentValue = "";
        $($suggestions).html("");
        $keys = $(".selected td.key");
        $letters = $("#alphaLetters td");
        $($current).css({
            boxShadow: "0px 0px 0px 0px #CBCBBE"
        });
        $current = $keys[index];
        rowRepetitions = 0;
        isChangingRows = true;
        isSuggestionMoving = false;
        isFirstLetterLeftClick = true;
        isFirstSuggestionRightClick = true;
        isFirstSuggestionLeftClick = true;
        isLetterRow = false;
        isFirstLetterRow = true;
        letterIndex = 0;
        letterRepetitions = 0;
        isLetterMoving = false;
        isFirstLeftClick = true;
        letter = "";
        word = "";
        wordTemp = "";
        isCapsEnabled = false;
        isShiftEnabled = false;
        isAlphabetInput = false;
        isInnerLocked = false;
        getNumRows();
        getNumCols();
        changeSelection();
    }

    /* Gets the number of rows of the
    selected calculator interface */
    function getNumRows() {
        numRows = $(".selected .table tr").length;
        return numRows;
    }

    /* Gets the number of columns of
    the selected calculator interface */
    function getNumCols() {
        numColumns = $(".selected .table tr>td").length / getNumRows();
        return numColumns;
    }

    /* Updates the calculator screen */
    function updateOutput() {
        $(".selected .output").html(output);
    }

    /* Changes key selection */
    function changeSelection() {
        // After the letter suggestions area is left,
        // highlight the first row
        if (isLetterRow === false) {
            // Add highlight to first row
            $($keys[index]).parent().css({
                boxShadow: "0px 0px 0px 4px #3A3A35",
                borderRadius: "15px"
            });
        }
        /* Changes selection of suggestions */
        if (isSelectionPaused) {
            if (isSuggestionMoving) {
                $($suggestions[suggIndex]).css({
                    border: "2px solid #D7D9DA"
                });
                suggIndex++;
                if (suggIndex === $suggestions.length) {
                    suggRepetitions++;
                    suggIndex = 0;
                    $($suggestions[suggIndex]).css({
                        border: "2px solid #3A3A35"
                    });
                    if (suggRepetitions === 2) {
                        setTimeout(function () {
                            $(".letters td").css({
                                border: "2px solid #AAAFAF"
                            });
                            index = 0;
                            $current = $keys[index];
                            $($current).css({
                                boxShadow: "0px 0px 0px 3px gold"
                            });

                            $($keys[0]).parent().css({
                                boxShadow: "0px 0px 0px 4px #3A3A35",
                                borderRadius: "15px"
                            });

                            $($keys[0]).css({
                                boxShadow: "none"
                            });
                        }, 50);
                        if ($(".selected").attr("id") === "alpha") {
                            isLetterRow = true;
                        }
                        isSuggestionMoving = false;
                        isSelectionPaused = false;
                        suggRepetitions = 0;
                        suggIndex = 0;
                        index = 0;
                        isFirstSuggestionLeftClick = true;
                        isFirstSuggestionRightClick = true;
                        $($suggestions).css({
                            border: "2px solid #D7D9DA"
                        });
                        changeSelection();
                    }
                } else {
                    $($suggestions[suggIndex]).css({
                        border: "2px solid #3A3A35"
                    });
                }
                /* After the cursor leaves the suggestions
                bar area */
            } else {
                $($suggestions).css({
                    border: "2px solid #D7D9DA"
                });
                if (!isLetterRow) {
                    // Add highlight to first row
                    $($keys[index]).parent().css({
                        boxShadow: "0px 0px 0px 4px #3A3A35",
                        borderRadius: "15px"
                    });
                }
                isSelectionPaused = false;
                isFirstSuggestionRightClick = true;
                isFirstSuggestionLeftClick = true;
                isFirstLetterRow = true;
                changeSelection();
                // Remove the box shadow from the first index
                // after the cursor leaves the suggestions area. 
                $($keys[index]).css({
                    boxShadow: "none"
                })
            }
            return;
        }

        /* Changes selection of a letter */
        if (isFirstLetterRow) {
            if (isLetterRow) {
                $($letters[letterIndex]).css({
                    border: "2px solid #3A3A35"
                });
                isLetterRow = false;
                isFirstLetterRow = false;
                return;
            }
        }

        if (isChangingRows) {
            $($current).css({
                boxShadow: "none"
            });
            $current = $keys[index];
            $($current).css({
                boxShadow: "none"
            });
        } else {
            $($current).css({
                boxShadow: "0px 0px 0px 0px #CBCBBE"
            });
            $current = $keys[index];
            $($current).css({
                boxShadow: "0px 0px 0px 3px gold"
            });
        }
    }
    changeSelection();
    $($keys[index]).parent().css({
        boxShadow: "0px 0px 0px 4px #3A3A35",
        borderRadius: "15px"
    });

    /* Checks if value is numerical */
    function isNumerical(dV) {
        if (!isNaN(parseFloat(dV))) {
            return true;
        } else {
            return false
        };
    }

    /* Gets the index of operator that
    occurs the last in the output */
    function getLastIndexOfOperator() {
        var arith = "+-*/%";
        var temp = output + " + ";
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < arith.length; j++) {
                if (temp[i] === arith[j]) {
                    lastIndex = i;
                }
            }
        }
    }

    /* Stores most commonly used words
    in an array while page loads */
    (function () {
        jQuery.get("words.txt", function (data) {
            var t = "";
            for (var i = 0; i < data.length; i++) {
                t += data[i];
                if (data[i] === "\n") {
                    $words.push(t);
                    t = "";
                }
            }
        });
    })();

    /* Obtains word completion from the
    array that contains all the words */
    function getWord() {
        /* Return if the input is a special 
        character */
        for (var x = 0; x < specialCharacters.length; x++) {
            for (var y = 0; y < word.length; y++) {
                if (word[y] === specialCharacters[x]) {
                    return;
                }
            }
        }

        var regExp = new RegExp("^" + word.toLowerCase());
        for (var i = 0; i < $words.length; i++) {
            if ($words[i].match(regExp) != null) {
                wordSuggestions.push($words[i]);
            }
        }

        for (var i = 0; i < 3; i++) {
            var $temp = $(".selected .suggestions td");
            $($temp[i]).html(wordSuggestions[i]);

            if (wordSuggestions[0] != null) {
                if (isCapsEnabled) {
                    $($letters[0]).html(wordSuggestions[0].charAt(word.length).toUpperCase())
                } else {
                    $($letters[0]).html(wordSuggestions[0].charAt(word.length));
                }
            }
            if (wordSuggestions[1] != null) {
                if (isCapsEnabled) {
                    $($letters[1]).html(wordSuggestions[1].charAt(word.length).toUpperCase())
                } else {
                    $($letters[1]).html(wordSuggestions[1].charAt(word.length));
                }
            }
            if (wordSuggestions[2] != null) {
                if (isCapsEnabled) {
                    $($letters[2]).html(wordSuggestions[2].charAt(word.length).toUpperCase())
                } else {
                    $($letters[2]).html(wordSuggestions[2].charAt(word.length));
                }
            }
        }
        wordSuggestions = [];
    }

    /* Finds the initial index
    of an arithmetic expression */
    function indexRange() {
        var init = 0;
        var bool = true;
        var isContinue = false;

        /* Finds the initial index */
        for (var i = 0; i < output.length; i++) {
            if (isNumerical(output[i]) && bool) {
                bool = false;
                init = i;
            }

            /* If operator is found, go to the
            next iteration */
            var op = "+-*/%";
            for (var j = 0; j < op.length; j++) {
                if (output[i].indexOf(op[j]) > -1) {
                    isContinue = true;
                    break;
                }
            }

            if (isContinue) {
                isContinue = false;
                continue;
            } else {
                try {
                    $($suggestions).html("");
                    $($suggestions[0]).html("= " + math.eval(output.substring(init, output.length)).toFixed(4) / 1);
                } catch (e) {}
            }

        }
        return init;
    }

    /* Adds keyboard event handler */
    $(document).keydown(function (e) {
        handleEvent(e, "keyboard");
    });

    /* Add click handler */
    $(document).click(function (e) {
        handleEvent(e, "click");
    });

    /* Add click handler for all suggestions
    and letter suggestions during startup */
    (function () {
        $(".suggestions td").click(function (e) {
            var mode = $(".selected").attr("id");
            var target = e.currentTarget;
            if (mode === "simple" || mode === "advanced") {
                output = $($suggestions[0]).text().replace("= ", "");
            } else if (mode === "alpha") {
                output = output.substring(0, output.lastIndexOf(" "));
                output += " ";
                output += $(target).text();
                output = output.replace(/\n/g, " ");
                word = "";
            } else if (mode === "scientific") {
                output += " ";
                // Find space 
                var ind;
                for (var i = output.length - 1; i >= 0; i--) {
                    if (output[i] == " ") {
                        ind = i + 1;
                        break;
                    }
                }

                var suboutput;
                if (ind != undefined) {
                    var lower_output = output.substring(0, ind);
                    var upper_output = output.substring(ind, output.length);

                    // Delete end of output 
                    output = output.replace(upper_output, "");

                    // Math
                    var returnValue;
                    try {
                        returnValue = math.eval(upper_output);
                        output += returnValue;
                    } catch (e) {
                        console.log(e.message);
                    }

                    // Strings
                    output = lower_output + $(target).text();
                } else {
                    suboutput = output;
                    output = "";
                    // Math
                    try {
                        output = math.eval(suboutput).toFixed(4) / 1;
                    } catch (e) {
                        console.log(e.message);
                    }

                    if (output == "") {
                        // Strings
                        output += $(target).text();
                    }
                }
                word = "";
            }
            updateOutput();
        });

        $("#alphaLetters td").click(function (e) {
            var target = e.currentTarget;
            output += $(target).text();
            word += $(target).text();
            getWord();
        });
    })();

    /* Click event handler */
    function handleClick(e) {
        var dv;
        var alt;
        // MathJAX issue where target object is
        // not the key, but the MathJAX object 
        // instaed. 
        if ($(e.target).parents("td").data("value") == undefined) {
            dv = $(e.target).data("value");
            alt = $(e.target);
        } else {
            dv = $(e.target).parents("td").data("value");
            alt = $(e.target).parents("td");
        }

        /* Flashing effect for the key */
        if ($(alt).data("value") != undefined) {
            if (dv != "caps" && dv != "shift") {
                $(alt).effect("highlight", {
                    color: "gold"
                }, 100);
            }
        }

        /* If input is pi or e */
        if (dv === "pi" || dv === "e") {
            output += dv;
            currentValue += dv;
        }

        /* If input is numerical */
        if (isNumerical(dv)) {
            output += dv;
            currentValue += dv;
        }

        /* If input is an operator */
        var op = "+-%";
        if (op.indexOf(dv) > -1 || dv === "divide" || dv === "x") {
            var mode = $(".selected").attr("id");
            if (mode === "simple" || mode === "advanced") {
                if (dv === "divide") {
                    output += "/";
                } else if (dv === "x") {
                    output += "*";
                } else if (dv == "+") {
                    output += "+";
                } else if (dv == "-") {
                    output += "-";
                } else if (dv == "%") {
                    output += "%";
                }
            } else {
                /* Need to decide whether to output a . or
                a x. We need to dynamically find out whether or 
                not the subexpression is mathematical or is a string
                of words in the scientific mode */
                if (mode == "scientific") {
                    if (dv == "x") {
                        if (isNumerical(output[output.length - 1])) {
                            output += "*";
                        } else if (output == "") {
                            output += "*";
                        } else {
                            output += "x";
                        }
                    }

                    if (dv == "divide") {
                        output += "/";
                    } else if (dv == "+") {
                        output += dv;
                    } else if (dv == "-") {
                        output += dv;
                    } else if (dv == "%") {
                        output += dv;
                    }
                }
            }
            currentValue = "";
            try {
                $($suggestions[0]).html("= " + math.eval(output).toFixed(4) / 1);
            } catch (e) {}
        }

        /* If input is a special character */
        if (specialCharacters.indexOf(dv) > -1) {
            if (dv.indexOf(".") == -1) {
                output += dv;
                word += dv;
            }
        }

        /* If input is an alphabetical letter */
        var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
        if (alphabet.indexOf(dv) > -1) {
            if (isShiftEnabled) {
                output += dv;
                word += dv;
                isShiftEnabled = false;
                for (var i = 0; i < $keys.length; i++) {
                    if ($($keys[i]).data("value") == "shift") {
                        $($keys[i]).css({
                            backgroundColor: "#CBCBBE"
                        });
                    }
                }
            } else if (isCapsEnabled) {
                output += dv.toUpperCase();
                word += dv.toUpperCase();
            } else {
                output += dv.toLowerCase();
                word += dv.toLowerCase();
            }
        }

        /* Advanced functions */
        switch (dv) {
        case "squared":
            output += "^2";
            break;
        case "root":
            output += "sqrt(";
            break;
        case "log":
            output += "log(";
            break;
        case "ln":
            output += "ln(";
            break;
        case "xPow":
            output += "^";
            break;
        case "sine":
            output += "sin(";
            break;
        case "cosine":
            output += "cos(";
            break;
        case "tangent":
            output += "tan(";
            break;
        case "invSine":
            output += "csc(";
            break;
        case "invCosine":
            output += "sec(";
            break;
        case "invTangent":
            output += "cot(";
            break;
        case "absValue":
            output += "abs(";
            break;
        }

        /* Special keys */
        switch (dv) {
        case "plusMinus":
            output += "-";
            break;
        case ".":
            output += ".";
            break;
        case "clear":
            output = "";
            word = "";
            $($suggestions).html("");
            updateOutput();
            return;
            break;
        case "space":
            word = "";
            currentValue = "";
            output += " ";
            break;
        case "back":
            output = output.substring(0, output.length - 1);
            word = word.substring(0, word.length - 1);
            break;
        case "backword":
            output = output.substring(0, output.lastIndexOf(" "));
            updateOutput();
            word = "";
            break;
        case "shift":
            isShiftEnabled = !isShiftEnabled;
            if (isShiftEnabled) {
                $(alt).css({
                    backgroundColor: "gold"
                });
            } else {
                $(alt).css({
                    backgroundColor: "#CBCBBE"
                });
            }
            break;
        case "caps":
            isCapsEnabled = !isCapsEnabled;
            if (isCapsEnabled === false) {
                $(alt).css({
                    backgroundColor: "#CBCBBE"
                });
            } else {
                $(alt).css({
                    backgroundColor: "gold"
                });
            }
            break;
        }

        /* Changing modes */
        if (dv === "mode") {
            var temp = $current;
            clearOutput();
            $(".selected").hide();
            $(".selected").removeClass("selected");

            indexArr++;
            if (indexArr === divArr.length) {
                indexArr = 0;
            }
            divArr[indexArr].addClass("selected");
            restoreDefaults();
            // Remove highlight from the mode key
            // after the mode changes
            setTimeout(function () {
                $(temp).css({
                    boxShadow: "0px 0px 0px 0px #CBCBBE"
                });
            }, 100);

            $suggestions = $(".selected .suggestions td");
            $(".selected").show();
            // Add highlight to first row once the 
            // mode is changed 
            $($keys[index]).parent().css({
                boxShadow: "0px 0px 0px 4px #3A3A35",
                borderRadius: "15px"
            });
            return;
        }

        /* Update suggestions */
        if ($(".selected").attr("id") === "simple" ||
            $(".selected").attr("id") === "advanced") {
            try {
                $($suggestions[0]).html("= " + math.eval(output).toFixed(4) / 1);
            } catch (e) {};
        } else if ($(".selected").attr("id") === "alpha" && dv != undefined) {
            getWord();
        } else if ($(".selected").attr("id") === "scientific") {
            getWord();
            try {
                $($suggestions[0]).html(math.eval(output).toFixed(4) / 1);
            } catch (e) {}
        }
        updateOutput();
    }

    /* Handles keyboard and forwards click 
    events to appropriate function */
    function handleEvent(e, str) {
        /* If click event, forward to the 
        click handler function */
        if (str === "click") {
            handleClick(e);
            return;
        }

        dataValue = $($current).data("value");

        /* If the key value is null, then
        do nothing */
        if (dataValue === null) {
            switch (e.which) {
            case 37:
                return;
                break;
            }
        }

        /* Letter suggestions keyboard */
        if (isInnerLocked) {
            if ($(".selected").attr("id") === "alpha") {
                switch (e.which) {
                case 37:
                    if (isFirstLetterLeftClick) {
                        isFirstLetterLeftClick = false;
                        isLetterMoving = true;
                    } else {
                        $(".selected .output").html($(".selected .output").text() + $($letters[letterIndex]).text());
                        word += $($letters[letterIndex]).text();
                        getWord();

                    }
                    return;
                case 39:
                    if (isLetterMoving) {
                        if (letterIndex === 2) {
                            isFirstLetterLeftClick = true;
                            $($letters[letterIndex]).css({
                                border: "2px solid #AAAFAF"
                            });
                            letterIndex = 0;
                            $($letters[letterIndex]).css({
                                border: "2px solid #3A3A35"
                            });
                            letterRepetitions++;
                            if (letterRepetitions === 2) {
                                letterRepetitions = 0;
                                isInnerLocked = false;
                                isLetterMoving = false;
                                letterIndex = 0;
                                isFirstLeftClick = true;
                                $($letters[letterIndex]).css({
                                    border: "2px solid #AAAFAF"
                                });
                                changeSelection();
                                return;
                            }
                            break;
                        }
                        $($letters[letterIndex]).css({
                            border: "2px solid #AAAFAF"
                        });
                        letterIndex++;
                        $($letters[letterIndex]).css({
                            border: "2px solid #3A3A35"
                        });
                    } else {
                        isInnerLocked = false;
                        isSelectionPaused = false;
                        index = 0;
                        $($letters).css({
                            border: "2px solid #AAAFAF"
                        });
                        changeSelection();
                        return;
                    }
                }
            }
        }

        /* Suggestions keyboard */
        if (isSelectionPaused) {
            switch (e.which) {
            case 37:
                if ($(".selected").attr("id") === "simple" ||
                    $(".selected").attr("id") === "advanced") {
                    $(".selected .output").html($($suggestions[0]).text().replace("= ", ""));
                    output = $($suggestions[0]).text().replace("= ", "");
                    currentValue = output;
                    index = 0;
                    $current = $keys[index];
                    isSelectionPaused = false;
                    // Highlight the suggestion.
                    $($suggestions[suggIndex]).effect("highlight", {
                        color: "gold"
                    }, 50);
                    setTimeout(function () {
                        $($suggestions[0]).css({
                            border: "2px solid #D7D9DA"
                        });
                        // Add highlight to first row
                        $($keys[index]).parent().css({
                            boxShadow: "0px 0px 0px 4px #3A3A35",
                            borderRadius: "15px"
                        });

                        // Remove box shadow from the first key
                        $($keys[index]).css({
                            boxShadow: "none"
                        });
                    }, 55);

                    /* Puts cursor back on first key and takes
                    away black border from suggestions when the
                    user selects a suggestion */
                    $($current).css({
                        boxShadow: "0px 0px 0px 3px gold"
                    });
                    return;
                }

                if ($(".selected").attr("id") === "scientific") {
                    if (currentValue === $($suggestions[suggIndex]).text().replace("= ", "")) {
                        return;
                    } else {
                        var subset = output.substring(arithmeticIndex, output.length);
                        output = output.replace(subset, "");
                        output += " " + $($suggestions[suggIndex]).text().replace("= ", "");
                        updateOutput();
                    }
                }

                if (isFirstSuggestionLeftClick) {
                    isFirstSuggestionRightClick = false;
                    isFirstLeftClick = false;
                    isSuggestionMoving = true;
                    isFirstSuggestionLeftClick = false;
                    return;
                }

                output = output.replace(word, "");
                word = $($suggestions[suggIndex]).text().replace("= ", "");
                // The variable wordTemp holds the value of the word
                // to replace the output with the word after bk key 
                // is pressed. 
                wordTemp = word;
                output += word;
                word = "";
                // Highlights the suggestion once the left click 
                // is pressed.
                $($suggestions[suggIndex]).effect("highlight", {
                    color: "gold"
                }, 10);
                $(".selected .output").html(output);

                if (suggRepetitions != 2) {
                    return;
                }
                isSelectionPaused = false;
                changeSelection();
                index = 0;
                $($suggestions).css({
                    border: "2px solid #D7D9DA"
                });
                $($current).css({
                    boxShadow: "0px 0px 0px 0px #CBCBBE"
                });
                $current = $keys[index];
                $($current).css({
                    boxShadow: "0px 0px 0px 3px gold"
                });
                changeSelection();
                suggIndex = 0;
            case 39:
                if (suggRepetitions === 2) {
                    isSuggestionMoving = false;
                    changeSelection();
                    return;
                }

                if (isFirstSuggestionRightClick) {
                    isFirstSuggestionRightClick = false;
                    if ($(".selected").attr("id") === "alpha") {
                        isInnerLocked = true;
                        isLetterRow = true;
                    }

                    if ($(".selected").attr("id") !== "alpha") {
                        // Highlight the first row 
                        setTimeout(function () {
                            $($keys[0]).parent().css({
                                boxShadow: "0px 0px 0px 4px #3A3A35",
                                borderRadius: "15px"
                            });
                        }, 50);
                    }
                }

                if (isFirstSuggestionRightClick === false) {
                    index = 0;
                }

                if ($(".selected").attr("id") !== "alpha") {
                    index = 0;
                    $current = $keys[index];
                    $($current).css({
                        boxShadow: "0px 0px 0px 3px gold"
                    });
                }

                changeSelection();
                $($keys[0]).parent().css({
                    boxShadow: "none",
                    borderRadius: "15px"
                });

                // Remove border from first key
                $($keys[0]).css({
                    boxShadow: "none"
                });
            }
            return;
        }

        /* Main keyboard */
        switch (e.which) {
            //Left
        case 37:
            // If the row is being selected
            if (isChangingRows) {
                isChangingRows = false;
                // Add border to first key of the
                // row once the row is selected 
                $($keys[index]).css({
                    boxShadow: "0px 0px 0px 3px gold"
                });
            } else {
                // Adds flashing effect when a key is
                // pressed on the calculator 
                $($keys[index]).effect("highlight", {
                    color: "gold"
                }, 10);

                // Prevents keyboard input if 
                // boolean is true.
                if (isSelectionPaused) {
                    return;
                }

                /* Changes calculator interface */
                if ($($current).text().toUpperCase() === "MODE") {
                    var temp = $current;
                    clearOutput();
                    $(".selected").hide();
                    $(".selected").removeClass("selected");

                    indexArr++;
                    if (indexArr === divArr.length) {
                        indexArr = 0;
                    }
                    divArr[indexArr].addClass("selected");
                    restoreDefaults();
                    // Remove highlight from the mode key
                    // after the mode changes
                    setTimeout(function () {
                        $(temp).css({
                            boxShadow: "0px 0px 0px 0px #CBCBBE"
                        });
                    }, 100);

                    $suggestions = $(".selected .suggestions td");
                    $(".selected").show();
                    // Add highlight to first row once the 
                    // mode is changed 
                    $($keys[index]).parent().css({
                        boxShadow: "0px 0px 0px 4px #3A3A35",
                        borderRadius: "15px"
                    });
                }

                /* Clears monitor */
                if (dataValue === "clear") {
                    clearOutput();
                }
                /*~~~~~~~                ALPHABET SECTION                ~~~~~~~*/

                /* Checks if a letter is inputted */
                (function () {
                    /* There should be no letter input
                    following a operator */
                    if (operator) {
                        return;
                    }

                    /* If the current value is a number,
                    then there should be no letter input */
                    if (isNumerical(currentValue)) {
                        return;
                    }

                    /* Monitor overflow handler for letters */
                    if ($(".selected").attr("id") === "alpha") {
                        if (word.length > 22) {
                            return;
                        }
                        if (output.length > 66) {
                            return;
                        }
                    }
                    if ($(".selected").attr("id") === "scientific") {
                        if (word.length > 25) {
                            return;
                        }
                        if (output.length > 100) {
                            return;
                        }
                    }
                    /* End monitor overflow handler */

                    /* "e" is also for letter input, so 
                    we must find out the context */
                    if (dataValue === "e") {
                        function assist() {
                            output += "e";
                            currentValue = "e";
                            isConstantRepeated = true;
                            updateOutput();
                        }
                        if ($(".selected").attr("id") === "advanced") {
                            if (isConstantRepeated) {
                                return;
                            } else {
                                assist();
                            }
                            return;
                        }
                        if (operator === true) {
                            assist();
                            return;
                        }
                    }

                    /* "x" is also for multiplication,
                    so we must find out the context */
                    if (dataValue === "x") {
                        var id = $(".selected").attr("id");
                        if (id === "simple" || id === "advanced") {
                            return;
                        }
                        for (var h = 0; h < output.length; h++) {
                            if (isNumerical(output[h])) {
                                return;
                            }
                        }
                    }
                    var alphabet = "abcdefghijklmnopqrstuvwxyz";
                    for (var i = 0; i < alphabet.length; i++) {
                        try {
                            if (isNumerical(dataValue)) {
                                return;
                            }

                            if (alphabet[i] === dataValue.toLowerCase()) {
                                isAlphabetInput = true;
                                if (isCapsEnabled) {
                                    letter = alphabet[i].toUpperCase();
                                } else {
                                    letter = alphabet[i];
                                }

                                if (isShiftEnabled) {
                                    for (var i = 0; i < $keys.length; i++) {
                                        if ($($keys[i]).data("value") === "shift") {
                                            $($keys[i]).css({
                                                backgroundColor: "#CBCBBE"
                                            });
                                            break;
                                        }
                                    }
                                    letter = letter.toUpperCase();
                                    isShiftEnabled = false;
                                }
                                word += letter;
                                getWord();
                                output += letter;
                                $(".selected .output").html($(".selected .output").text() + letter);
                                break;
                            }
                        } catch (e) {
                            console.log(e.message);
                            break;
                        }
                    }

                })();

                /* If mode is simple or advanced, add
                parenthesis */
                if ($(".selected").attr("id") === "simple" ||
                    $(".selected").attr("id") === "advanced") {
                    if (dataValue === "(") {
                        output += "(";
                    } else if (dataValue === ")") {
                        output += ")";
                    }
                    updateOutput();
                }

                /* Checks for special characters */
                (function () {
                    var mode = $(".selected").attr("id");
                    for (var i = 0; i < specialCharacters.length; i++) {
                        if (dataValue === ".") {
                            if (mode === "alpha") {
                                word += dataValue;
                                output += dataValue;
                                updateOutput();
                            }
                            break;
                        }
                        if (specialCharacters.charAt(i) === dataValue) {
                            if (mode === "alpha") {
                                /* Overflow handler for special characters */
                                if (word.length > 22) {
                                    return;
                                }
                                if (output.length > 66) {
                                    return;
                                }
                                word += dataValue;
                                output += dataValue;
                                updateOutput();
                            } else if (mode === "advanced") {
                                /* Arithmetic parenthesis support in the 
                                advanced calculator mode */
                                if (dataValue === "(" || dataValue === ")") {
                                    output += dataValue;
                                    currentValue += dataValue;
                                    try {
                                        $($suggestions[0]).html("= " + math.eval(output).toFixed(4) / 1);
                                    } catch (e) {

                                    }
                                    updateOutput();
                                }
                            } else if (mode === "scientific") {
                                /* If there is a number before
                                the special character 
                                */
                                if (currentValue != "") {
                                    return;
                                } else if (operator) {
                                    return;
                                } else {
                                    /* Overflow handler for special characters */
                                    if (word.length > 25) {
                                        return;
                                    }
                                    if (output.length > 100) {
                                        return;
                                    }
                                    word += dataValue;
                                    output += dataValue;
                                    updateOutput();
                                }
                            } else {
                                return;
                            }
                            break;
                        } else if (dataValue === "quotes") {
                            word += "\"";
                            output += "\"";
                            updateOutput();
                            return;
                        }
                    }
                }());

                /* Backspace */
                if (dataValue === "back") {
                    var mode = $(".selected").attr("id");
                    if (!(mode === "simple" || mode === "advanced")) {
                        if (word !== "") {
                            $($current).effect("highlight", {
                                color: "gold"
                            }, 10);

                            output = output.substring(0, output.length - 1);
                            word = word.substring(0, word.length - 1);
                            getWord();
                            updateOutput();
                        }
                    }
                }

                /* Deletes a word */
                if (dataValue === "backword") {
                    $($current).effect("highlight", {
                        color: "gold"
                    }, 10);

                    output = output.replace(/\s/g, " ");
                    output = output.substring(0, output.lastIndexOf(" "));
                    updateOutput();
                    word = "";
                    return;
                }

                /* CAPs */
                if (dataValue === "caps") {
                    isCapsEnabled = !isCapsEnabled;
                    if (isCapsEnabled === false) {
                        $($current).css({
                            backgroundColor: "#CBCBBE"
                        });
                    } else {
                        $($current).css({
                            backgroundColor: "gold"
                        });
                    }
                }

                /* Shift */
                if (dataValue === "shift") {
                    if (isShiftEnabled === false) {
                        isShiftEnabled = true;
                        $($current).css({
                            backgroundColor: "gold"
                        });
                    } else {
                        isShiftEnabled = false;
                        $($current).css({
                            backgroundColor: "#CBCBBE"
                        });
                    }
                }

                if (dataValue === "space") {
                    /* We don't want a spacebar if
                    the output string is empty */
                    if (output === "") {
                        return;
                    }
                    /* We don't want a spacebar
                    just after an operator is
                    inputted */
                    if (operator) {
                        return;
                    }
                    $($current).effect("highlight", {
                        color: "gold"
                    }, 10);

                    word = "";
                    output += " ";
                    currentValue = "";
                    arithmeticIndex = output.length - 1;
                    updateOutput();
                }

                /*~~~~~~~                MATH SECTION                     ~~~~~~~*/
                /* Adds decimal */
                if (dataValue === ".") {
                    var mode = $(".selected").attr("id");
                    if (mode === "alpha") {
                        return;
                    }

                    if (mode === "scientific") {
                        /* If there is a letter or special character,
                        then user can insert as many dots */
                        var chars = "abcdefghijklmnopqrstuvwxyz.,;:?!@#&$()\\/<>\[\]\{\}";
                        for (var i = 0; i < word.length; i++) {
                            for (var j = 0; j < chars.length; j++) {
                                if (word.charAt(i) === chars.charAt(j)) {
                                    output += ".";
                                    word += ".";
                                    updateOutput();
                                    return;
                                }
                            }
                        }
                        /* Assume mathematical expression if
                        dot is inserted when the output is
                        empty */
                        if (output === "") {
                            output += "0.";
                            currentValue += "0.";
                            updateOutput();
                        }
                    }

                    if (!(currentValue.toString().indexOf(".") > -1)) {
                        if (output === "") {
                            output += "0";
                        }
                        currentValue += ".";
                        output += ".";
                        updateOutput();
                    }
                    return;
                }

                /* Checks if current key value is 
                a number */
                if (isNumerical(dataValue) || dataValue === "e" || dataValue === "pi") {
                    /* If there is a word, there should be
                    no mathematical input */
                    if (word != "") {
                        return;
                    }
                    if (output != "" && pressedEqual) {
                        output = "";
                        currentValue = "";
                        pressedEqual = false;
                    }

                    if (!(output === "" && dataValue.toString() === "0")) {
                        /* Monitor overflow handler for numbers */
                        var selectedIDAttribute = $(".selected").attr("id");
                        if (selectedIDAttribute === "simple") {
                            if (currentValue.length > 14) {
                                return;
                            }
                            if (output.length > 50) {
                                return;
                            }
                        } else if (selectedIDAttribute === "advanced") {
                            if (currentValue.length > 20) {
                                return;
                            }
                            if (output.length > 60) {
                                return;
                            }
                        } else if (selectedIDAttribute === "scientific") {
                            if (currentValue.length > 14) {
                                return;
                            }
                            if (output.length > 100) {
                                return;
                            }
                        }
                        /* End monitor overflow handler */

                        if (advancedFunction && lastAdvanced != "xPow") {
                            output = "";
                            currentValue = "";
                            advancedFunction = false;
                            advancedArr = [];
                        }

                        if (dataValue === "e" || dataValue === "pi") {
                            if (currentValue.indexOf(".") > -1) {
                                return;
                            }
                            if (isConstantRepeated === false) {
                                isAlphabetInput = false;
                                isConstantRepeated = true;
                                currentValue += dataValue;

                                if (dataValue != "e") {
                                    output += dataValue;
                                }
                                indexRange();
                            }
                        } else {
                            isAlphabetInput = false;
                            currentValue += parseFloat(dataValue);
                            output += parseFloat(dataValue);
                            indexRange();
                        }
                        operator = false;
                        /* Updates suggestions bar without
                        moving the selection */
                        try {
                            $($suggestions[0]).html("= " + math.eval(output.substring(arithmeticIndex, output.length)).toFixed(4) / 1);
                        } catch (e) {
                            console.log(e.message);
                        }
                        updateOutput();
                    }
                }

                /* Negates numerical output */
                if (dataValue === "plusMinus") {
                    /* If trying to negate, say.
                    5^2, then return */
                    if (advancedFunction) {
                        return;
                    }
                    /* If there is a word or
                    a special character, then
                    return */
                    if (word != "") {
                        return;
                    }
                    if (currentValue === "" && !(currentValue.indexOf("-") > -1)) {
                        currentValue += "-";
                        output += "-";
                        updateOutput();
                    }
                    return;
                }

                /* Basic arithmetic */
                if (dataValue === "+" || dataValue === "-" ||
                    dataValue === "x" || dataValue === "divide" ||
                    dataValue === "%") {
                    /* There should be no operator after
                    a word */
                    if (word != "") {
                        return;
                    }
                    if (operator === false && (output != "" || pressedEqual) && isAlphabetInput === false) {
                        if (dataValue === "+") {
                            output += " + ";
                        } else if (dataValue === "-") {
                            output += " - ";
                        } else if (dataValue === "x") {
                            output += " * ";
                        } else if (dataValue === "divide") {
                            output += " / ";
                        } else if (dataValue === "%") {
                            output += " % ";
                        }
                        lastAdvanced = "";
                        isConstantRepeated = false;
                        getLastIndexOfOperator();
                        advancedFunction = false;
                        pressedEqual = false;
                        operator = true;
                        updateOutput();
                        currentValue = "";
                    }
                }

                /* Advanced arithmetic */
                if (dataValue === "root" || dataValue === "squared" ||
                    dataValue === "xPow" || dataValue === "log" ||
                    dataValue === "ln" || dataValue === "sine" ||
                    dataValue === "cosine" || dataValue === "tangent" ||
                    dataValue === "invSine" || dataValue === "invCosine" ||
                    dataValue === "invTangent" || dataValue === "absValue") {
                    // Prevents repeat function from
                    // firing.
                    if (lastAdvanced === dataValue) {
                        return;
                    }

                    /* If there is a word, there should
                    mathematics should be disabled */
                    if (word != "") {
                        return;
                    }

                    /* There should be no advanced function
                    entered if there is a negative sign before
                    it */
                    if (currentValue.charAt(0) === "-") {
                        return;
                    }

                    // Displays an error if negative number is 
                    // inputted in certain functions.
                    if ((dataValue === "root" || dataValue === "log" ||
                            dataValue === "ln") && currentValue.indexOf("-") > -1) {
                        $($suggestions[suggIndex]).html("Error");
                        return;
                    }

                    // Advanced functions, such as square root,
                    // logarithmic are implemented. 
                    if (output != "" && operator === false) {
                        /* Don't add an advanced function if
                        an error is output */
                        if ($($suggestions[0]).text() === "Error") {
                            return;
                        }

                        currentAdvanced = dataValue;
                        advancedArr.push(dataValue);
                        advancedArr.push(currentValue);
                        if (dataValue === "squared") {
                            output += "^2";
                            updateOutput();
                        } else if (dataValue === "root") {
                            if (lastIndex === 2 && output != "") {
                                output = "sqrt(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "sqrt(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "log") {
                            if (lastIndex === 2 && output != "") {
                                $(".selected .output").html("log(" + output + ")");
                                output = "log(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                $(".selected .output").html(output + "log(" + currentValue + ")");
                                output += "log(" + currentValue + ") / log(10)";
                            }
                        } else if (dataValue === "ln") {
                            if (lastIndex === 2 && output != "") {
                                $(".selected .output").html("ln(" + output + ")");
                                output = "log(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                $(".selected .output").html(output + "ln(" + currentValue + ")");
                                output += "log(" + currentValue + ")";
                            }
                        } else if (dataValue === "xPow") {
                            output += "^";
                            updateOutput();
                        } else if (dataValue === "sine") {
                            if (lastIndex === 2 && output != "") {
                                output = "sin(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "sin(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "cosine") {
                            if (lastIndex === 2 && output != "") {
                                output = "cos(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "cos(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "tangent") {
                            if (lastIndex === 2 && output != "") {
                                output = "tan(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "tan(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "invSine") {
                            if (lastIndex === 2 && output != "") {
                                output = "csc(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "csc(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "invCosine") {
                            if (lastIndex === 2 && output != "") {
                                output = "sec(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "sec(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "invTangent") {
                            if (lastIndex === 2 && output != "") {
                                output = "cot(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "cot(" + currentValue + ")";
                            }
                            updateOutput();
                        } else if (dataValue === "absValue") {
                            if (lastIndex === 2 && output != "") {
                                output = "abs(" + output + ")";
                            } else {
                                output = output.substring(0, lastIndex - 1);
                                output += "abs(" + currentValue + ")";
                            }
                            updateOutput();
                        }
                        indexRange();
                        try {
                            $($suggestions[0]).html(math.eval(output.substring(arithmeticIndex, output.length)).toFixed(4) / 1);
                        } catch (e) {
                            console.log(e.message);
                        }
                        isConstantRepeated = false;
                        lastAdvanced = dataValue;
                        advancedFunction = true;
                    }
                }

                /* Equals */
                if (dataValue === "=") {
                    if (output === "") {
                        return;
                    }
                    try {
                        pressedEqual = true;
                        output = math.eval(output).toFixed(4) / 1;
                        updateOutput();
                    } catch (e) {
                        console.log(e.message);
                    }
                    return;
                }
            }
            break;
            // Right
        case 39:
            if (isInnerLocked) {
                return;
            }

            // Reached the end of the table
            if ((isChangingRows && index >= ((((numColumns * numRows) - 1) - numColumns)))) {
                isSelectionPaused = true;
                $($current).css({
                    boxShadow: "0px 0px 0px 0px #CBCBBE"
                });
                $($suggestions[0]).css({
                    border: "2px solid #3A3A35"
                });
                // Remove highlight from row
                $($keys[index]).parent().css({
                    boxShadow: "none",
                    borderRadius: "15px"
                });
                break;
            }
            // Selecting the row
            if (isChangingRows) {
                // Remove highlight from previous row
                $($keys[index]).parent().css({
                    boxShadow: "none",
                    borderRadius: "15px"
                });
                index += numColumns;
                // Highlight the new row 
                $($keys[index]).parent().css({
                    boxShadow: "0px 0px 0px 4px #3A3A35",
                    borderRadius: "15px"
                });
                changeSelection();
            } else if (isChangingRows == false && rowRepetitions < 2) {
                if ((index + 1) % numColumns == 0) {
                    index -= (numColumns - 1);
                    rowRepetitions++;
                    changeSelection();
                    if (rowRepetitions === 2) {
                        // Remove border from index
                        // on the row
                        $($keys[index]).css({
                            boxShadow: "none"
                        });
                    }
                } else {
                    index++;
                    changeSelection();
                }
            } else {
                isChangingRows = true;
                // Remove highlight from previous row
                $($keys[index]).parent().css({
                    boxShadow: "none",
                    borderRadius: "15px"
                });
                index += numColumns;
                // Add highlight to new row 
                $($keys[index]).parent().css({
                    boxShadow: "0px 0px 0px 4px #3A3A35",
                    borderRadius: "15px"
                });
                rowRepetitions = 0;
                changeSelection();
            }
            break;
        }
    }
});