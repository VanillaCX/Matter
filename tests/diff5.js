function text_diff(v1, v2) {
    const changes = [];
    let i = 0;
    let j = 0;

    while (i < v1.length || j < v2.length) {
        if (i < v1.length && j < v2.length && v1[i] === v2[j]) {
            // Characters match, move to the next characters
            i++;
            j++;
        } else {
            // Characters don't match, handle insertions or deletions
            if (i < v1.length && (j === v2.length || v1[i] !== v2[j])) {
                changes.push({ index: i, type: 'delete', char: v1[i] });
                i++;
            }
            if (j < v2.length && (i === v1.length || v1[i] !== v2[j])) {
                changes.push({ index: i, type: 'insert', char: v2[j] });
                j++;
            }
        }
    }

    return { changes };
}

const v1 = "So this is my main text";
const v2 = "So this is my hey";

const text_diff_changes = text_diff(v1, v2);
console.log("text_diff_changes:", text_diff_changes);
