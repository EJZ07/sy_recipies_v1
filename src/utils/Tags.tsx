import { ColorValue } from "react-native"

export function useDarkTextColor(bgColor : ColorValue) {

    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
        return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);

    return L > 0.179
    
}

class Tag {
    #name : string
    #backgroundColor : ColorValue
    #textColor : ColorValue
    #id : number

    get name(){return this.#name}
    get id(){return this.#id}
    get textColor(){return this.#textColor}
    get backgroundColor(){return this.#backgroundColor}



    constructor(name : string, color : ColorValue, textColor? : ColorValue) {
        this.#name = name
        this.#textColor = textColor || useDarkTextColor(color) ? "#000000" : "#FFFFFF"
        this.#backgroundColor = color
        this.#id = Math.random() * 9999
    }
}

const tags = [
    new Tag("American Cuisine", "#FF00FF"),
    new Tag("Japanese Cuisine", "#4938FF"),
    new Tag("Bad Food", "#28400F"),
    new Tag("Even Worse Food", "#289000"),
    new Tag("good food", "#489834"),
    new Tag("i lied the food sucks", "#FF40EE")
]

export default tags