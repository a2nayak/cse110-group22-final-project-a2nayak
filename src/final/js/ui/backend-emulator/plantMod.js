

let loadScreenCallback = null;
let updateScreenCallback = null;
let plants = [];

function addPlantGrowthLevel() {
    if(plants.length == 0 || plants[plants.length - 1].growthLevel >= 2) {
        plants.push({ growthLevel: 0 });
        return "add-new-plant";
    } else {
        plants[plants.length - 1].growthLevel++;
        return "grow-last-plant";
    }
}

export function register(_loadScreenCallback, _updateScreenCallback) {
    loadScreenCallback = _loadScreenCallback;
    updateScreenCallback = _updateScreenCallback;
}

export function correctAnswer() {
    console.log('Correct answer!');
    const result = addPlantGrowthLevel();
    updateScreenCallback('plant::set-plants', { plants, result });
}