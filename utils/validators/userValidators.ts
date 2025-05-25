import { RegisterUserInput, LoginUserInput } from "../../types/user";
import { ErrorObject } from "../../types/general";

export function userRegistrationValidator(
  data: RegisterUserInput
): [boolean, ErrorObject] {
  
  let errors: ErrorObject = {};

  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.firstName) {
    errors.firstName = "Firstname is required";
  }
  if (!data.lastName) {
    errors.lastName = "Lastname is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }

  const hasErrors: boolean = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}

export function userLoginValidator(
  data: LoginUserInput
): [boolean, ErrorObject] {

  let errors: ErrorObject = {};

  if (!data.email) {
    errors.email = "Email is required";
    //TODO: Add email validation
  }
  if (!data.password) {
    errors.password = "Password is required";
  }
  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}
