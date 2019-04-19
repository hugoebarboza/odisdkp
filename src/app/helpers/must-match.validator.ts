import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName].value;
        const matchingControl = formGroup.controls[matchingControlName].value;


        // set error on matchingControl if validation fails
        if (control === matchingControl) {
            return null;
        } 

        return {            
            equal: true
        };
    }
}
