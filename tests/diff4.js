


class DifferentialMatter {
    constructor(old_matter, new_matter){
        this.old_matter = JSON.stringify(old_matter).split("")
        this.new_matter = JSON.stringify(new_matter).split("")
    }
    reconstruct(){
        const reconstructed = [...this.old_matter]
        let offset = 0

        for (const change of this.changes){
            reconstructed.splice(Number(change.start_index) - offset, 0, change.string);
            offset += change.string.length - 1
        }

        return {
            reconstructed: reconstructed.join(""),
            seed: [...this.old_matter].join(""),
            diff: this.changes
        }
    }

    generate(){
        const changes = []
        let previous_changed_index = -1;
        let word = null
        const old_matter = [...this.old_matter]

        for (const i in old_matter) {

            if (old_matter[i] != this.new_matter[i]) {
                if (previous_changed_index + 1  == i) {
                    // Same 'word'
                    word.string += this.new_matter[i]
                } else {
                    word = {
                        start_index: i,
                        string: this.new_matter[i]
                    }
                }


                old_matter.splice(i, 0, "+");
                previous_changed_index = Number(i)
            } else {
                if (word != null) {
                    changes.push({...word})
                    word = null
                    previous_changed_index = -1
                }
            }
        }

        this.changes = changes

        return {changes}
    }
}




const old_matter = {
    name: "Lee",
    last: "bo",
    age: 24,
    sex: "ma",
    phone: "00000000"
}

const new_matter = {
    name: "Lee",
    lastname: "bowyer",
    age: 24,
    sex: "male",
    phone: "00000000"
}
const diff_1 = new DifferentialMatter(old_matter, new_matter)

const diff_1_changes = diff_1.generate()
const diff_1_reconstruct = diff_1.reconstruct()

console.log("diff_1_changes:", diff_1_changes);
console.log("diff_1_reconstruct:", diff_1_reconstruct);

const another_update = {
    name: "Lee",
    lastname: "bowyer",
    age: 24,
    sex: "female",
    phone: "00000000"
}

const diff_2 = new DifferentialMatter(JSON.parse(diff_1_reconstruct.reconstructed), another_update)

const diff_2_changes = diff_2.generate()
const diff_2_reconstruct = diff_2.reconstruct()

console.log("diff_2_changes:", diff_2_changes);
console.log("diff_2_reconstruct:", diff_2_reconstruct);


