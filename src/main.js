// src/main.ts
var _a, _b;
let insentropic_val = ['Mach Number (M)', 'Mach Angle θ', 'P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val = ['Mach Number (M1)', 'Mach Number (M2)', 'Total Pressure Ratio (P02/P01)', 'Pressure Ratio (P1/P02)', 'Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val = ['Mach Number (M2)', 'Turn Angle (θ)', 'Wave Angle (β)', 'Pressure Ratio (P2/P1)', 'Density Ratio (ρ2/ρ1)', 'Temperature Ratio (T2/T1)', 'Total Pressure Ratio (P02/P01)', 'Normal Mach Number (M2)'];
// Giving two Inputs for Oblique Shocks
(_a = document.getElementById('relation')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
    const relation = document.getElementById('relation').value;
    const inputSection = document.getElementById('inputValspan');
    console.log(relation);
    if (relation === 'oblique') {
        if (inputSection) {
            // inputSection.innerHTML = Modified_INPUT_SECTION_HTML;
            let optionsHTML = '';
            oblique_shock_val.forEach(val => {
                let value = val.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
                optionsHTML += `<option value="${value}">${val}</option>`;
            });
            inputSection.innerHTML = `<div>

                    <label for="mach_no">Mach Number (M1) =</label> 
                    <input class="inputVal"  type="number" id="mach_no" name="mach_no" style = "width: 24%;margin: 5px;" placeholder="e.g., 2.0"> 
                    
                    <br>

                    <select class="inputVal" id="inputVal" name="inputVal">${optionsHTML}</select>
                    <input class="inputVal" type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">
                </div>`;
        }
    }
    else {
        if (inputSection) {
            // inputSection.innerHTML = INPUT_SECTION_HTML;
            if (relation === 'isentropic') {
                let optionsHTML = '';
                insentropic_val.forEach(val => {
                    let value = val.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
                    optionsHTML += `<option value="${value}">${val}</option>`;
                });
                inputSection.innerHTML = `<select class="inputVal"  id="inputVal" name="inputVal">${optionsHTML}</select>
                <input type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">`;
            }
            else if (relation === 'normal') {
                let optionsHTML = '';
                normal_shock_val.forEach(val => {
                    let value = val.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
                    optionsHTML += `<option value="${value}">${val}</option>`;
                });
                inputSection.innerHTML = `<select class="inputVal"  id="inputVal" name="inputVal">${optionsHTML}</select>
                <input type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">`;
            }
        }
    }
});
// Getting the values from the html elements
(_b = document.getElementById('calculateBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    const gamma = parseFloat(document.getElementById('gamma').value);
    const relation = document.getElementById('relation').value;
    const inputVal = document.querySelectorAll('.inputVal');
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal.forEach(input => console.log(input.value))}`);
    // calculateGasTables(gamma, relation, inputVal);
});
export {};
// const calculateGasTables = (gamma: number, relation: string, inputVal: string) => {
//     // Perform calculations based on the inputs
//     console.log(`Calculating gas tables with γ=${gamma}, relation=${relation}, inputVal=${inputVal}`);
// };
// calculateGasTables(1.4, 'mach_no', '0.5');
//# sourceMappingURL=main.js.map