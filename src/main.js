// src/main.ts
var _a, _b;
let insentropic_val = ['Mach Number (M)', 'Mach Angle θ', 'P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val = ['Mach Number (M1)', 'Mach Number (M2)', 'Total Pressure Ratio (P02/P01)', 'Pressure Ratio (P1/P02)', 'Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val = ['Mach Number (M2)', 'Turn Angle (θ)', 'Wave Angle (β)', 'Pressure Ratio (P2/P1)', 'Density Ratio (ρ2/ρ1)', 'Temperature Ratio (T2/T1)', 'Total Pressure Ratio (P02/P01)', 'Normal Mach Number (M2)'];
// To Do
// 1. Add Error Handling
// 2. Add Output Table
// 3. Add CSS
// 4. Add Comments and Documentation
// 5. Value range check for inputs
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
                var _a;
                let value = (_a = val.toLowerCase()
                    .match(/.+?(?=\()/g)) === null || _a === void 0 ? void 0 : _a[0].replace(/\s+\S*$/, "").replace(/ /g, '_');
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
                    var _a;
                    let value = (_a = val.toLowerCase()
                        .match(/.+?(?=\()/g)) === null || _a === void 0 ? void 0 : _a[0].replace(/\s+\S*$/, "").replace(/ /g, '_');
                    optionsHTML += `<option value="${value}">${val}</option>`;
                });
                inputSection.innerHTML = `<select class="inputVal"  id="inputVal" name="inputVal">${optionsHTML}</select>
                <input type="number" id="inputVal" name="inputVal" placeholder="e.g., 0.5">`;
            }
            else if (relation === 'normal') {
                let optionsHTML = '';
                normal_shock_val.forEach(val => {
                    var _a;
                    let value = (_a = val.toLowerCase()
                        .match(/.+?(?=\()/g)) === null || _a === void 0 ? void 0 : _a[0].replace(/\s+\S*$/, "").replace(/ /g, '_');
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
    const inputVal = Array.from(document.querySelectorAll('.inputVal')).map(input => input.value);
    console.log(inputVal);
    calculateGasTables(gamma, relation, inputVal);
});
const calculateGasTables = (gamma, relation, inputVal) => {
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal}`);
    const relationInstance = new relationClass(gamma, relation, inputVal);
    const result = relationInstance.calculate();
    console.log(result);
};
class relationClass {
    constructor(gamma, relation, inputVal) {
        this.gamma = gamma;
        this.relation = relation;
        this.inputVal = inputVal;
    }
    calculate() {
        if (this.relation === 'isentropic') {
            return this.isentropicCalc();
        }
        else if (this.relation === 'normal') {
            return this.normalShockCalc();
        }
        else if (this.relation === 'oblique') {
            return this.obliqueShockCalc();
        }
        else {
            throw new Error('Invalid relation type');
        }
    }
    isentropicCalc() {
        const inputParam = this.inputVal[0];
        const inputValue = parseFloat(this.inputVal[1] || '0');
        if (inputParam !== 'mach_number') {
        }
        else {
            return this.isentropicCalc_mach(this.gamma, inputValue);
        }
    }
    isentropicCalc_mach(gamma, M) {
        let theta, phi, P_P0, T_T0, rho_rho0, A_Astar;
        // Critical Values
        let Pc, // p/p* 
        Tc, // T/T*
        rhoc; // rho/rho*
        P_P0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -this.gamma / (this.gamma - 1));
        T_T0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -1);
        rho_rho0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -1 / (this.gamma - 1));
        A_Astar = (1 / M) * Math.pow((2 / (this.gamma + 1)) * (1 + (this.gamma - 1) / 2 * M * M), (this.gamma + 1) / (2 * (this.gamma - 1)));
        theta = Math.asin(1 / M) * (180 / Math.PI); // in degrees
        phi = (Math.sqrt((this.gamma + 1) / (this.gamma - 1)) * Math.atan(Math.sqrt((this.gamma - 1) / (this.gamma + 1) * (M * M - 1))) - Math.atan(Math.sqrt(M * M - 1))) * (180 / Math.PI); // in degrees
        // Critical Values
        let gamma_critical = (this.gamma + 1) / 2; // It is constant to help in calculations not actually gamma critical
        Pc = Math.pow(gamma_critical, this.gamma / (this.gamma - 1)) * P_P0;
        Tc = T_T0 * gamma_critical;
        rhoc = Math.pow(gamma_critical, 1 / (this.gamma - 1)) * rho_rho0;
        return {
            M,
            theta,
            phi,
            P_P0,
            T_T0,
            rho_rho0,
            A_Astar,
            Pc,
            Tc,
            rhoc
        };
    }
    normalShockCalc() {
        const inputParam = this.inputVal[0];
        const inputValue = parseFloat(this.inputVal[1] || '0');
        let M1, M2, P02_P01, P1_P02, P2_P1, T2_T1, rho2_rho1;
    }
    obliqueShockCalc() {
        const M1 = parseFloat(this.inputVal[0] || '0');
        const inputParam = this.inputVal[1];
        const inputValue = parseFloat(this.inputVal[2] || '0');
        let M2, theta, beta, P2_P1, rho2_rho1, T2_T1, P02_P01, M1n;
    }
}
export {};
//# sourceMappingURL=main.js.map