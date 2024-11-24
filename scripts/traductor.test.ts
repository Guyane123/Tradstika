import Translator from "@/assets/script/traductor";
import st from "../langs/swatiskanois.json"
import fr from "../langs/français.json"


describe("Translator", () => {
    const translator = new Translator();

    describe("#matchInfo", () => {
        it("should match the common info", () => {
            expect(translator.matchInfo([0,1,2], [0])).toEqual([0])
        })
        it("should handle empy match", () => {
            expect(translator.matchInfo([0,1,2], [3])).toEqual([])
        })
    })

    describe("#matchWordFromType", () => {
        it("should match word from type", () => {
            expect(translator.matchWordFromType([{type: 0, info: [0, 0,0]}], st.words)!).toEqual({"types": [{"info": [0, 0, 0], "type": 0}], "word": "pi"}
            )
        })
        it("should match word from type", () => {
            expect(translator.matchWordFromType([{type: 0, info: [0, 0,0]}], fr.words)!).toEqual({"types": [{"info": [0, 0, 0], "type": 0}], "word": "je"}
            )
        })
    })
    it("Should translate FR to ST", () => {
        expect(translator.translate("FR", "ST", "je tu")).toBe("pi te");
    });

    it("Should translate ST to FR", () => {
        const translator = new Translator();
        expect(translator.translate("ST", "FR", "te pi")).toBe("tu je");
    });

})
