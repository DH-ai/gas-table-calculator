// src/main.ts

let insentropic_val:string[] = ['Mach Number (M)','Mach Angle θ','P-M angle φ', 'Pressure Ratio (P/P0)', 'Temperature Ratio (T/T0)', 'Density Ratio (ρ/ρ0)', 'Area Ratio (A/A*)',];
let normal_shock_val:string[] = ['Mach Number (M1)','Mach Number (M2)', 'Total Pressure Ratio (P02/P01)','Pressure Ratio (P1/P02)','Pressure Ratio (P2/P1)', 'Temperature Ratio (T2/T1)', 'Density Ratio (ρ2/ρ1)'];
let oblique_shock_val:string[] = ['Mach Number (M2)', 'Turn Angle (θ)', 'Wave Angle (β)', 'Pressure Ratio (P2/P1)', 'Density Ratio (ρ2/ρ1)', 'Temperature Ratio (T2/T1)', 'Total Pressure Ratio (P02/P01)', 'Normal Mach Number (M2)'];

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

const calculateGasTables = (gamma: number, relation: string, inputVal: string[]) => {
    
    console.log(`γ: ${gamma}, Relation: ${relation}, Input Value: ${inputVal}`);
    const relationInstance = new relationClass(gamma, relation, inputVal);
    const result = relationInstance.calculate();
    console.log(result);


}

class relationClass {
    gamma: number;
    relation: string;
    inputVal: string[];
    constructor(gamma: number, relation: string, inputVal: string[]) {
        this.gamma = gamma;
        this.relation = relation;
        this.inputVal = inputVal;
    }

    calculate() {
        checkInputs(this.gamma, this.relation, this.inputVal);

        function checkInputs(gamma: number, relation: string, inputVal: string[]) {
            
            if (isNaN(gamma) || gamma <= 1) {
                alert("Invalid value for gamma. It should be a number greater than 1.");
                throw new Error('Invalid value for gamma. It should be a number greater than 1.');
            }
            
            
            if (inputVal.length === 0 || inputVal.some(val => val === '')) {
                alert("Input values cannot be empty.");
                throw new Error('Input values cannot be empty.');
            }


            if (inputVal.some(val => isNaN(parseFloat(val)))) {
                alert("All input values must be valid numbers.");
                throw new Error('All input values must be valid numbers.');
            }
        }
        if (this.relation === 'isentropic') {

            return this.isentropicCalc();
        } else if (this.relation === 'normal') {
            return this.normalShockCalc();
        } else if (this.relation === 'oblique') {
            return this.obliqueShockCalc();
        } else {
            throw new Error('Invalid relation type');
        }
        
    }
    private isentropicCalc() {
        const inputParam = this.inputVal[0];
        const inputValue = parseFloat(this.inputVal[1] || '0');
        let mach:number = 0;



        if (inputParam !== 'mach_number') {
            // Need to find Mach number from other parameters
            mach = this.reverseIsentropicCalc_mach(this.gamma, inputParam, inputValue);

        }else{
            mach = inputValue;
        }
        return this.isentropicCalc_mach(this.gamma, mach);
    }


    private isentropicCalc_mach(gamma:number, M: number) {
        let theta: number, phi: number, P_P0: number, T_T0: number, rho_rho0: number, A_Astar: number;
        // Critical Values
        let Pc:number, // p/p* 
        Tc:number, // T/T*
        rhoc:number; // rho/rho*
       
       
        P_P0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -this.gamma / (this.gamma - 1));
        T_T0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -1);
        rho_rho0 = Math.pow(1 + (this.gamma - 1) / 2 * M * M, -1 / (this.gamma - 1));
        A_Astar = (1 / M) * Math.pow((2 / (this.gamma + 1)) * (1 + (this.gamma - 1) / 2 * M * M), (this.gamma + 1) / (2 * (this.gamma - 1)));

        theta = Math.asin(1 / M) * (180 / Math.PI); // in degrees
        phi = (Math.sqrt((this.gamma+1)/(this.gamma-1)) * Math.atan(Math.sqrt((this.gamma-1)/(this.gamma+1)*(M*M-1))) - Math.atan(Math.sqrt(M*M-1))) * (180/Math.PI); // in degrees

        // Critical Values
        let gamma_critical: number = (this.gamma + 1) / 2; // It is constant to help in calculations not actually gamma critical
        
        Pc = Math.pow(gamma_critical, this.gamma / (this.gamma - 1)) * P_P0;
        Tc = T_T0 * gamma_critical;
        rhoc = Math.pow(gamma_critical, 1 / (this.gamma - 1))* rho_rho0;

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
    private reverseIsentropicCalc_mach(gamma:number, iPram: string | undefined, iVal: number) {
        let M: number = 0;

        if (iPram === 'mach_number') {
            M = iVal; // just to avoid errors, redundant
        } else if (iPram === 'mach_angle') {
            M = 1 / Math.sin(iVal * (Math.PI / 180)); 
        } else if (iPram === 'p_m_angle') {
            // need to find Mach number from phi


            // using numerical methods or iterative approach, I reverse engineered this apporach using the provieded sample calculator 
            let func = (M: number) => (Math.sqrt((gamma+1)/(gamma-1)) * Math.atan(Math.sqrt((gamma-1)/(gamma+1)*(M*M-1))) - Math.atan(Math.sqrt(M*M-1))) * (180/Math.PI) - iVal;
            
            
            let lower = 1.0001; // Mach number must be greater than 1 for oblique shocks
            let upper = 10; // Arbitrary upper limit
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
                } else {
                    lower = mid;
                }
                iter++;
            }
        } else if (iPram === 'pressure_ratio') {
            M = Math.sqrt((Math.pow(iVal, -(gamma - 1) / gamma) - 1) * (2 / (gamma - 1)));
        } else if (iPram === 'temperature_ratio') {
            M = Math.sqrt((Math.pow(iVal, -(gamma - 1) / gamma) - 1) * (2 / (gamma - 1)));
        } else if (iPram === 'density_ratio') {
            M = Math.sqrt((Math.pow(iVal, -(gamma - 1) / gamma) - 1) * (2 / (gamma - 1)));
        } else if (iPram === 'area_ratio') {
            // Need to find Mach number from Area ratio

            let func = (M: number) => (1 / M) * Math.pow((2 / (gamma + 1)) * (1 + (gamma - 1) / 2 * M * M), (gamma + 1) / (2 * (gamma - 1))) - iVal;
            let lower = 0.01; // Subsonic limit
            let upper = 10; // Arbitrary upper limit
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
                } else {
                    lower = mid;
                }
                iter++;
            }
        }
        return M;
    
    
    }
    private normalShockCalc() {
        const inputParam = this.inputVal[0];
        const inputValue = parseFloat(this.inputVal[1] || '0');
        
        if (inputParam !== 'mach_number_m1') {
            // Need to find Mach number from other parameters
            // return this.reverseNormalShockCalc_mach(this.gamma, inputParam, inputValue);
            alert("Currently only Mach Number (M1) as input is supported for Normal Shock calculations.");
            return {};

        }else{
            return this.normalShockCalc_mach(this.gamma, inputValue);
        }
        
    }

    private normalShockCalc_mach(gamma:number, M1: number) {
        let M2: number, P02_P01: number, P1_P02: number, P2_P1: number, T2_T1: number, rho2_rho1: number;
        

        let a = 
        M2 = Math.sqrt((1 + ((gamma - 1) / 2) * M1 * M1) / (gamma * M1 * M1 - (gamma - 1) / 2));
        
        
        
        
        P02_P01 = Math.pow(((gamma+1)*M1*M1)/(2+(gamma-1)*M1*M1),gamma / (gamma - 1)) * Math.pow((2*gamma*(M1*M1)-(gamma-1))/(gamma+1), (gamma / (gamma - 1)));
        
        
        // P1_P02 = Math.pow(( ( (gamma + 1) * M1 * M1 ) / ( (gamma - 1) * M1 * M1 + 2 ) ), (gamma / (gamma - 1))) * Math.pow(( (gamma + 1) / (2 * gamma * M1 * M1 - (gamma - 1)) ), (1 / (gamma - 1)));
        P1_P02 = (1+(M1*M1 - 1) * (2*gamma/(gamma+1)))/Math.pow(1+0.5*(gamma-1)*(M2*M2),gamma/ (gamma - 1));
        
        
        
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

    private reverseNormalShockCalc_mach(gamma:number, iPram: string | undefined, iVal: number) {
        let M1: number = 0;

        if (iPram === 'mach_number_m1') {
            M1 = iVal; // just to avoid errors, redundant
        } else if (iPram === 'mach_number_m2') {
            // Need to find M1 from M2
            let func = (M1: number) => Math.sqrt((1 + (gamma - 1) / 2 * M1 * M1) / (gamma * M1 * M1 - (gamma - 1) / 2)) - iVal;
            let lower = 1.0001; // Mach number must be greater than 1 for normal shocks
            let upper = 10; // Arbitrary upper limit
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
                } else {
                    lower = mid;
                }
                iter++;
            }
        } else if (iPram === 'total_pressure_ratio') {
            // Need to find M1 from P02/P01
            let func = (M1: number) => 1 / (Math.pow(( ( (gamma + 1) * M1 * M1 ) / ( (gamma - 1) * M1 * M1 + 2 ) ), (gamma / (gamma - 1))) * Math.pow(( (gamma + 1) / (2 * gamma * M1 * M1 - (gamma - 1)) ), (1 / (gamma - 1)))) - iVal;
            let lower = 1.0001; // Mach number must be greater than 1 for normal shocks
            let upper = 10; // Arbitrary upper limit
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
                } else {
                    lower = mid;
                }
                iter++;
            }
        }
    }

    private obliqueShockCalc() {
        const M1 = parseFloat(this.inputVal[0] || '0');
        const inputParam = this.inputVal[1];
        const inputValue = parseFloat(this.inputVal[2] || '0');
        let M2: number, theta: number, beta: number, P2_P1: number, rho2_rho1: number, T2_T1: number, P02_P01: number, M1n: number;
    }
 
}

