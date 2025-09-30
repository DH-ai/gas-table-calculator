// src/main.ts
var _a, _b;
let insentropic_val = ['Mach Number (M)', 'Mach Angle θ', 'P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val = ['Mach Number (M1)', 'Mach Number (M2)', 'Total Pressure Ratio (P02/P01)', 'Pressure Ratio (P1/P02)', 'Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val = [
    // 'Mach Number (M2)',
    'Turn Angle (θ)',
    // 'Wave Angle (β)',
    // 'Pressure Ratio (P2/P1)',
    // 'Density Ratio (ρ2/ρ1)',
    // 'Temperature Ratio (T2/T1)',
    // 'Total Pressure Ratio (P02/P01)'
];
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
// object mapping for naming of keys
const mapping_isen = {
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
const mapping_normal = {
    M1: 'M1',
    M2: 'M2',
    P02_P01: 'P02/P01',
    P1_P02: 'P1/P02',
    P2_P1: 'P2/P1',
    T2_T1: 'T2/T1',
    rho2_rho1: 'ρ2/ρ1'
};
const mapping_oblique = {
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
const calculateGasTables = (gamma, relation, inputVal) => {
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal}`);
    const relationInstance = new relationClass(gamma, relation, inputVal);
    const result = relationInstance.calculate() || {};
    // Display the result
    console.log(result);
    let mapping = {};
    if (relation === 'isentropic') {
        // return isentropicCalc();
        mapping = mapping_isen;
    }
    else if (relation === 'normal') {
        mapping = mapping_normal;
        // return this.normalShockCalc();
    }
    else if (relation === 'oblique') {
        mapping = mapping_oblique;
        // return this.obliqueShockCalc();
    }
    else {
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
                if (keys[i + t]) {
                    // console.log(`Header ${i+t}: ${keys[i+t]}`);
                    tableHTML += `<th>${mapping[String(keys[i + t])]}</th>`;
                }
            }
            tableHTML += '</tr>';
            tableHTML += '<tr>';
            for (let i = 0; i < numCols; i++) {
                if (keys[i + t]) {
                    tableHTML += `<td>${parseFloat(String(values[i + t])).toFixed(4)}</td>`;
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
};
class relationClass {
    constructor(gamma, relation, inputVal) {
        this.gamma = gamma;
        this.relation = relation;
        this.inputVal = inputVal;
    }
    calculate() {
        checkInputs(this.gamma, this.relation, this.inputVal);
        function checkInputs(gamma, relation, inputVal) {
            if (isNaN(gamma) || gamma <= 1) {
                alert("Invalid value for gamma. It should be a number greater than 1.");
                throw new Error('Invalid value for gamma. It should be a number greater than 1.');
            }
        }
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
        let mach = 0;
        if (inputParam !== 'mach_number') {
            mach = this.reverseIsentropicCalc_mach(this.gamma, inputParam, inputValue);
        }
        else {
            mach = inputValue;
        }
        return this.isentropicCalc_mach(this.gamma, mach);
    }
    isentropicCalc_mach(gamma, M) {
        let theta, phi, P_P0, T_T0, rho_rho0, A_Astar;
        let Pc, Tc, rhoc;
        P_P0 = Math.pow(1 + (gamma - 1) / 2 * M * M, -gamma / (gamma - 1));
        T_T0 = Math.pow(1 + (gamma - 1) / 2 * M * M, -1);
        rho_rho0 = Math.pow(1 + (gamma - 1) / 2 * M * M, -1 / (gamma - 1));
        A_Astar = (1 / M) * Math.pow((2 / (gamma + 1)) * (1 + (gamma - 1) / 2 * M * M), (gamma + 1) / (2 * (gamma - 1)));
        theta = Math.asin(1 / M) * (180 / Math.PI);
        phi = (Math.sqrt((gamma + 1) / (gamma - 1)) * Math.atan(Math.sqrt((gamma - 1) / (gamma + 1) * (M * M - 1))) - Math.atan(Math.sqrt(M * M - 1))) * (180 / Math.PI);
        let gamma_critical = (gamma + 1) / 2;
        Pc = Math.pow(gamma_critical, gamma / (gamma - 1)) * P_P0;
        Tc = T_T0 * gamma_critical;
        rhoc = Math.pow(gamma_critical, 1 / (gamma - 1)) * rho_rho0;
        return { M, theta, phi, P_P0, T_T0, rho_rho0, A_Astar, Pc, Tc, rhoc };
    }
    reverseIsentropicCalc_mach(gamma, iPram, iVal) {
        let M = 0;
        if (iPram === 'mach_number') {
            M = iVal;
        }
        else if (iPram === 'mach_angle') {
            M = 1 / Math.sin(iVal * (Math.PI / 180));
        }
        else if (iPram === 'p_m_angle') {
            let func = (M) => (Math.sqrt((gamma + 1) / (gamma - 1)) * Math.atan(Math.sqrt((gamma - 1) / (gamma + 1) * (M * M - 1))) - Math.atan(Math.sqrt(M * M - 1))) * (180 / Math.PI) - iVal;
            let lower = 1.0001;
            let upper = 10;
            let tol = 1e-6;
            let maxIter = 100;
            let iter = 0;
            while (iter < maxIter) {
                let mid = (lower + upper) / 2;
                let fMid = func(mid);
                if (Math.abs(fMid) < tol) {
                    M = mid;
                    break;
                }
                if (fMid > 0) {
                    upper = mid;
                }
                else {
                    lower = mid;
                }
                iter++;
            }
        }
        else if (iPram === 'pressure_ratio') {
            M = Math.sqrt((Math.pow(iVal, -(gamma - 1) / gamma) - 1) * (2 / (gamma - 1)));
        }
        else if (iPram === 'temperature_ratio') {
            M = Math.sqrt((Math.pow(iVal, -1) - 1) * (2 / (gamma - 1)));
        }
        else if (iPram === 'density_ratio') {
            M = Math.sqrt((Math.pow(iVal, -1) - 1) * (2 / (gamma - 1)));
        }
        else if (iPram === 'area_ratio') {
            let func = (M) => (1 / M) * Math.pow((2 / (gamma + 1)) * (1 + (gamma - 1) / 2 * M * M), (gamma + 1) / (2 * (gamma - 1))) - iVal;
            let lower = 0.01;
            let upper = 10;
            let tol = 1e-6;
            let maxIter = 100;
            let iter = 0;
            while (iter < maxIter) {
                let mid = (lower + upper) / 2;
                let fMid = func(mid);
                if (Math.abs(fMid) < tol) {
                    M = mid;
                    break;
                }
                if (fMid > 0) {
                    upper = mid;
                }
                else {
                    lower = mid;
                }
                iter++;
            }
        }
        return M;
    }
    // normal Shock Calculations
    normalShockCalc() {
        const inputParam = this.inputVal[0];
        const inputValue = parseFloat(this.inputVal[1] || '0');
        let M1 = 0;
        if (inputParam !== 'mach_number_m1') {
            // Find M1 from other parameters
            M1 = this.reverseNormalShockCalc_mach(this.gamma, inputParam, inputValue);
        }
        else {
            M1 = inputValue;
        }
        return this.normalShockCalc_mach(this.gamma, M1);
    }
    normalShockCalc_mach(gamma, M1) {
        let M2, P02_P01, P1_P02, P2_P1, T2_T1, rho2_rho1;
        let a = M2 = Math.sqrt((1 + ((gamma - 1) / 2) * M1 * M1) / (gamma * M1 * M1 - (gamma - 1) / 2));
        P02_P01 = Math.pow(((gamma + 1) * M1 * M1) / (2 + (gamma - 1) * M1 * M1), gamma / (gamma - 1)) * Math.pow((2 * gamma * (M1 * M1) - (gamma - 1)) / (gamma + 1), (gamma / (gamma - 1)));
        // P1_P02 = Math.pow(( ( (gamma + 1) * M1 * M1 ) / ( (gamma - 1) * M1 * M1 + 2 ) ), (gamma / (gamma - 1))) * Math.pow(( (gamma + 1) / (2 * gamma * M1 * M1 - (gamma - 1)) ), (1 / (gamma - 1)));
        P1_P02 = (1 + (M1 * M1 - 1) * (2 * gamma / (gamma + 1))) / Math.pow(1 + 0.5 * (gamma - 1) * (M2 * M2), gamma / (gamma - 1));
        // P2_P1 = 1 + (2 * gamma / (gamma + 1)) * (M1 * M1 - 1);
        P2_P1 = 2 * gamma / (gamma + 1) * M1 * M1 - (gamma - 1) / (gamma + 1);
        rho2_rho1 = ((gamma + 1) * M1 * M1) / ((gamma - 1) * M1 * M1 + 2);
        T2_T1 = P2_P1 / rho2_rho1;
        return {
            M1,
            M2,
            P02_P01,
            P1_P02,
            P2_P1,
            T2_T1,
            rho2_rho1
        };
    }
    reverseNormalShockCalc_mach(gamma, iPram, iVal) {
        let M1 = 0;
        if (iPram === 'mach_number_m1') {
            M1 = iVal;
        }
        else if (iPram === 'mach_number_m2') {
            // Find M1 from M2
            let func = (M1) => Math.sqrt((1 + (gamma - 1) / 2 * M1 * M1) / (gamma * M1 * M1 - (gamma - 1) / 2)) - iVal;
            let lower = 1.0001;
            let upper = 10;
            let tol = 1e-6;
            let maxIter = 100;
            let iter = 0;
            while (iter < maxIter) {
                let mid = (lower + upper) / 2;
                let fMid = func(mid);
                if (Math.abs(fMid) < tol) {
                    M1 = mid;
                    break;
                }
                if (fMid > 0) {
                    lower = mid;
                }
                else {
                    upper = mid;
                }
                iter++;
            }
        }
        else if (iPram === 'total_pressure_ratio') {
            // Find M1 from P02/P01
            let func = (M1) => Math.pow(((gamma + 1) * M1 * M1) / (2 + (gamma - 1) * M1 * M1), gamma / (gamma - 1)) *
                Math.pow((gamma + 1) / (2 * gamma * M1 * M1 - (gamma - 1)), 1 / (gamma - 1)) - iVal;
            let lower = 1.0001;
            let upper = 10;
            let tol = 1e-6;
            let maxIter = 100;
            let iter = 0;
            while (iter < maxIter) {
                let mid = (lower + upper) / 2;
                let fMid = func(mid);
                if (Math.abs(fMid) < tol) {
                    M1 = mid;
                    break;
                }
                if (fMid > 0) {
                    upper = mid;
                }
                else {
                    lower = mid;
                }
                iter++;
            }
        }
        else if (iPram === 'pressure_ratio') {
            // Find M1 from P2/P1
            M1 = Math.sqrt(((iVal - 1) * (gamma + 1) / (2 * gamma)) + 1);
        }
        else if (iPram === 'density_ratio') {
            // Find M1 from rho2/rho1
            M1 = Math.sqrt((2 * iVal) / ((gamma + 1) - (gamma - 1) * iVal));
        }
        else if (iPram === 'temperature_ratio') {
            // Find M1 from T2/T1 (requires iterative approach)
            let func = (M1) => {
                let P2_P1 = 1 + (2 * gamma / (gamma + 1)) * (M1 * M1 - 1);
                let rho2_rho1 = ((gamma + 1) * M1 * M1) / ((gamma - 1) * M1 * M1 + 2);
                return P2_P1 / rho2_rho1 - iVal;
            };
            let lower = 1.0001;
            let upper = 10;
            let tol = 1e-6;
            let maxIter = 100;
            let iter = 0;
            while (iter < maxIter) {
                let mid = (lower + upper) / 2;
                let fMid = func(mid);
                if (Math.abs(fMid) < tol) {
                    M1 = mid;
                    break;
                }
                if (fMid > 0) {
                    lower = mid;
                }
                else {
                    upper = mid;
                }
                iter++;
            }
        }
        return M1;
    }
    obliqueShockCalc() {
        const M1 = parseFloat(this.inputVal[0] || '0');
        const inputParam = this.inputVal[1];
        const inputValue = parseFloat(this.inputVal[2] || '0');
        let theta = 0;
        if (inputParam === 'turn_angle') {
            theta = inputValue;
        }
        else if (inputParam === 'wave_angle') {
            // If wave angle (beta) is given, calculate theta from it
            const beta = inputValue * (Math.PI / 180);
            theta = Math.atan((2 / Math.tan(beta)) *
                ((M1 * M1 * Math.sin(beta) * Math.sin(beta) - 1) /
                    (M1 * M1 * (this.gamma + Math.cos(2 * beta)) + 2))) * (180 / Math.PI);
        }
        return this.obliqueShockCalc_mach(this.gamma, M1, theta);
    }
    obliqueShockCalc_mach(gamma, M1, theta) {
        let M2, beta, P2_P1, rho2_rho1, T2_T1, P02_P01, Mn1, Mn2;
        // Convert theta to radians
        const thetaRad = theta * (Math.PI / 180);
        // Find beta using theta-beta-M relation (iterative)
        // tan(theta) = 2*cot(beta) * (M1^2*sin^2(beta) - 1) / (M1^2*(gamma + cos(2*beta)) + 2)
        let func = (betaRad) => {
            return Math.atan((2 / Math.tan(betaRad)) *
                ((M1 * M1 * Math.sin(betaRad) * Math.sin(betaRad) - 1) /
                    (M1 * M1 * (gamma + Math.cos(2 * betaRad)) + 2))) - thetaRad;
        };
        // Use bisection to find beta (weak shock solution)
        let lower = Math.asin(1 / M1); // Mach angle
        let upper = Math.PI / 2; // 90 degrees
        let tol = 1e-6;
        let maxIter = 100;
        let iter = 0;
        let betaRad = 0;
        while (iter < maxIter) {
            let mid = (lower + upper) / 2;
            let fMid = func(mid);
            if (Math.abs(fMid) < tol) {
                betaRad = mid;
                break;
            }
            if (fMid > 0) {
                upper = mid;
            }
            else {
                lower = mid;
            }
            iter++;
        }
        beta = betaRad * (180 / Math.PI);
        // Normal components of Mach number
        Mn1 = M1 * Math.sin(betaRad);
        // Use normal shock relations for normal component
        Mn2 = Math.sqrt((1 + ((gamma - 1) / 2) * Mn1 * Mn1) / (gamma * Mn1 * Mn1 - (gamma - 1) / 2));
        // Downstream Mach number
        M2 = Mn2 / Math.sin(betaRad - thetaRad);
        // Pressure ratio
        P2_P1 = 1 + (2 * gamma / (gamma + 1)) * (Mn1 * Mn1 - 1);
        // Density ratio
        rho2_rho1 = ((gamma + 1) * Mn1 * Mn1) / ((gamma - 1) * Mn1 * Mn1 + 2);
        // Temperature ratio
        T2_T1 = P2_P1 / rho2_rho1;
        // Total pressure ratio
        P02_P01 = Math.pow(((gamma + 1) * Mn1 * Mn1) / (2 + (gamma - 1) * Mn1 * Mn1), gamma / (gamma - 1)) *
            Math.pow((gamma + 1) / (2 * gamma * Mn1 * Mn1 - (gamma - 1)), 1 / (gamma - 1));
        return { M1, M2, theta, beta, P2_P1, rho2_rho1, T2_T1, P02_P01, Mn1, Mn2 };
    }
}
export {};
//# sourceMappingURL=main.js.map