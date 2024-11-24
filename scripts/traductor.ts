import {json, LanguageCode, word} from "@/index"

import fr from "@/assets/langs/français.json"
import st from "@/assets/langs/swatiskanois.json"
import {types} from "node:util";


export default class Translator {

    langs =  [{code:"FR", json: fr}, {code: "ST", json: st}]




    matchInfo(fromInfo: Array<number>, toInfo: Array<number>) {
        return fromInfo.filter(value => toInfo.includes(value));

    }

    matchWordFromType(types: Array<{type: number, info: Array<number>}>, words: Array<word>) {
        let match
        let highestMatchedInfoCount = -1;


        words.forEach(w => {
            types.forEach(type => {
                w.types.forEach(type1 => {
                    const matchedInfosLength = this.matchInfo(type.info, type1.info).length;
                    if (matchedInfosLength > highestMatchedInfoCount) {
                        highestMatchedInfoCount = matchedInfosLength;
                        match = w;
                    }
                })
            })
        })


        return match;
    }

    matchWordsFromTypes(firstWords: Array<word>, secondWords: Array<word>): Array<word> {
        let match: Array<word> = [];



        firstWords.forEach(word => {
            const bestMatch = this.matchWordFromType((word.types as any), secondWords);
            if (bestMatch) {
                match.push(bestMatch);
            }
        })


        return match;
    }


    matchWords(words: Array<string>, json: json): Array<word>{
        const match = words.map(word => {
            return this.matchWord(word, json)
        })

        return match
    }
    matchWord(word: string, json: json): {word: string, types: Array<{type: number, info: Array<number>}>} {

        const match = json.words.find((w) => {if(w.word.toLowerCase() == word.toLowerCase()) return word})

        if(!match) {
            throw new Error("ERRUnknown_word:" + word.toLowerCase())
        }


        return match
    }

    matchJson(code: LanguageCode): {code: string, json: json } {
        const json = this.langs.find((v) => v.code == code)
        if(!json) {
            throw new Error("ERRUnknown_language:" + code)
        }
        return json
    }

    translate(from: LanguageCode, to: LanguageCode, text: string): string {


        const fromTextWords = text.split(" ")
        const fromLang = this.matchJson(from).json;
        const toLang = this.matchJson(to).json;

        if(!fromLang || !toLang) {return  "ERRUnknown_language:" + fromLang + "," + toLang}

        const fromWords = fromLang.words
        const toWords = toLang.words

        const fromCorrespondingWords = this.matchWords(fromTextWords, fromLang)

        const toCorrespondingWords = this.matchWordsFromTypes(fromCorrespondingWords, toWords)



        const toTextWords = toCorrespondingWords.map((word) => word.word)

        return  toTextWords.join(" ")

    }



}