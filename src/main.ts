// src/main.ts

let insentropic_val:string[] = ['Mach Number (M)','Mach Angle θ','P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val:string[] = ['Mach Number (M1)','Mach Number (M2)', 'Total Pressure Ratio (P02/P01)','Pressure Ratio (P1/P02)','Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val:string[] = ['Mach Number (M2)', 'Turn Angle (θ)', 'Wave Angle (β)', 'Pressure Ratio (P2/P1)', 'Density Ratio (ρ2/ρ1)', 'Temperature Ratio (T2/T1)', 'Total Pressure Ratio (P02/P01)', 'Normal Mach Number (M2)'];


// Giving two Inputs for Oblique Shocks

document.getElementById('relation')?.addEventListener('change', () => {
    const relation = (document.getElementById('relation') as HTMLSelectElement).value;
    const inputSection = document.getElementById('inputValspan');

    console.log(relation);
    if (relation === 'oblique') {
        if (inputSection) {
            // inputSection.innerHTML = Modified_INPUT_SECTION_HTML;
            let optionsHTML = '';
            oblique_shock_val.forEach(val => {
                let value = val.toLowerCase()
                .match(/.+?(?=\()/g)?.[0]
                .replace(/\s+\S*$/, "")
                .replace(/ /g, '_');
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
    } else {
        if (inputSection) {
            // inputSection.innerHTML = INPUT_SECTION_HTML;
            if (relation === 'isentropic') {
                let optionsHTML = '';
                insentropic_val.forEach(val => {
                    let value = val.toLowerCase()
                    .match(/.+?(?=\()/g)?.[0]
                    .replace(/\s+\S*$/, "")
                    .replace(/ /g, '_');
                    optionsHTML += `<option value="${value}">${val}</option>`;

                });
                inputSection.innerHTML = `<select class="inputVal"  id="inputVal" name="inputVal">${optionsHTML}</select>
                <input type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">`;
            } else if (relation === 'normal') {
                let optionsHTML = '';
                normal_shock_val.forEach(val => {
                    let value = val.toLowerCase()
                    .match(/.+?(?=\()/g)?.[0]
                    .replace(/\s+\S*$/, "")
                    .replace(/ /g, '_');
                    optionsHTML += `<option value="${value}">${val}</option>`;
                });
                inputSection.innerHTML = `<select class="inputVal"  id="inputVal" name="inputVal">${optionsHTML}</select>
                <input type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">`;
            }
        }
    }
    
});




// Getting the values from the html elements

document.getElementById('calculateBtn')?.addEventListener('click', () => {
    const gamma = parseFloat((document.getElementById('gamma') as HTMLSelectElement).value);
    const relation = (document.getElementById('relation') as HTMLSelectElement).value;
    const inputVal = Array.from(document.querySelectorAll('.inputVal')).map(input => (input as HTMLInputElement).value);
    console.log(inputVal)
    calculateGasTables(gamma, relation, inputVal);
}
);

const calculateGasTables = (gamma: number, relation: string, inputVal: string[]) => {
    
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal}`);

}

