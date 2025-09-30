// src/main.ts

let insentropic_val:string[] = ['Mach Number (M)','Mach Angle θ','P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val:string[] = ['Mach Number (M1)','Mach Number (M2)', 'Total Pressure Ratio (P02/P01)','Pressure Ratio (P1/P02)','Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val:string[] = ['Mach Number (M2)', 'Turn Angle (θ)', 'Wave Angle (β)', 'Pressure Ratio (P2/P1)', 'Density Ratio (ρ2/ρ1)', 'Temperature Ratio (T2/T1)', 'Total Pressure Ratio (P02/P01)'];

// To Do
// 1. Add Error Handling
// 2. Add Output Table
// 3. Add CSS
// 4. Add Comments and Documentation
// 5. Value range check for inputs

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

// object mapping for naming of keys

const mapping_isen: Record<string, string> = {
  M: 'Mach Number (M)',
  theta: 'Mach Angle θ',
  phi: 'P-M angle φ',
  P_P0: 'P/P0',
  T_T0: 'T/T0',
  rho_rho0: 'ρ/ρ0',
  A_Astar: 'A/A*',
  Pc: 'P/P*',
  Tc: 'T/T*',
  rhoc: 'ρ/ρ*',
};





const mapping_normal: Record<string, string> = {

    M1: 'M1',
    M2: 'M2',
    P02_P01: 'P02/P01',
    P1_P02: 'P1/P02',
    P2_P1: 'P2/P1',
    T2_T1: 'T2/T1',
    rho2_rho1: 'ρ2/ρ1'
};  

const mapping_oblique: Record<string, string> = {
    M1: 'M1',
    M2: 'M2',
    theta: 'Turn Angle θ',
    beta: 'Wave Angle β',
    P2_P1: 'P02/P01',
    rho2_rho1: 'ρ2/ρ1',

    T2_T1: 'T2/T1',
    P02_P01: 'P02/P01',
    Mn2: 'Mn2',
};

const calculateGasTables = (gamma: number, relation: string, inputVal: string[]) => {
    
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal}`);
    const relationInstance = new relationClass(gamma, relation, inputVal);
    const result: Record<string, number | string> = relationInstance.calculate() || {};


    // Display the result
    console.log(result);


    let mapping: Record<string, string> = {};
    if (relation === 'isentropic') {

            // return isentropicCalc();
        mapping = mapping_isen;

    } else if (relation === 'normal') {
        // mapping = mapping_normal;
        // return this.normalShockCalc();
    } else if (relation === 'oblique') {
        // mapping = mapping_oblique;
        // return this.obliqueShockCalc();
    } else {
        throw new Error('Invalid relation type');
    }
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
        // alert("Calculation Successful! Check the output section.");

        const keys = Object.keys(result);
        const values = keys.map(key => result[key]);
        const numCols = 5;
        let tableHTML = '<table>';
        let count = keys.length;
        if (count === 0) {
            resultSection.innerHTML = "<p>No results to display.</p>";
            return;
        }

        // Header row
        let t = 0;
        while (t < count) {
            tableHTML += '<tr>';
            for (let i = 0; i < numCols; i++) {



                if (keys[i+t]) {
                    // console.log(`Header ${i+t}: ${keys[i+t]}`);
                    tableHTML += `<th>${mapping[String(keys[i+t])]}</th>`;
                }
            }
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            for (let i = 0; i < numCols; i++) {



                if (keys[i+t]) {
                tableHTML += `<td>${parseFloat(String(values[i+t])).toFixed(4)}</td>`;

                }
                
                
            }
            tableHTML += '</tr>';
            t = t + numCols;

                

        }
        // Data rows
        // for (let row = 0; row < Math.ceil(keys.length / numCols); row++) {
        //     tableHTML += '<tr>';
        //     for (let col = 0; col < numCols; col++) {
        //     const idx = row * numCols + col;
        //     if (values[idx] !== undefined) {
        //         tableHTML += `<td>${}</td>`;
        //     } else {
        //         tableHTML += '<td></td>';
        //     }
        //     }
        //     tableHTML += '</tr>';
        // }

        tableHTML += '</table>';
        resultSection.innerHTML = tableHTML;
    }


}

