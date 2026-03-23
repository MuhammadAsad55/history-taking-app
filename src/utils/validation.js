import { isValidDate, isValidMonthYear, MAX_VALID_YEAR } from './helpers';

export function validateStep(step, data) {
  const errors = {};

  switch (step) {
    case 1: {
      if (!data.name?.trim()) errors.name = 'Name is required';
      else if (!/^[a-zA-Z\s\-']+$/.test(data.name)) errors.name = 'Only letters, dashes, and apostrophes allowed';
      if (!data.dob) errors.dob = 'Date of birth is required';
      else if (!isValidDate(data.dob)) errors.dob = `Year must be 1900-${MAX_VALID_YEAR} and not in the future`;
      if (!data.gender) errors.gender = 'Gender is required';
      break;
    }
    case 2: {
      if (!data.presentingComplaint?.trim()) errors.presentingComplaint = 'Presenting complaint is required';
      break;
    }
    case 3: {
      // Site
      if (!data.site?.option) errors['site.option'] = 'Site selection is required';
      if (data.site?.option && data.site.option !== 'N/A' && !data.site?.value) errors['site.value'] = 'Please specify site';
      // Onset
      if (!data.onset?.type) errors['onset.type'] = 'Onset is required';
      if (data.onset?.type && !data.onset?.description?.trim()) errors['onset.description'] = 'Please describe onset';
      if (data.onset?.date && !isValidDate(data.onset.date)) errors['onset.date'] = `Invalid date (1900-${MAX_VALID_YEAR})`;
      // Character
      if (!data.character?.option) errors['character.option'] = 'Character selection is required';
      if (data.character?.option && data.character.option !== 'N/A' && !data.character?.value) errors['character.value'] = 'Please specify character';
      // Radiation
      if (!data.radiation?.option) errors['radiation.option'] = 'Radiation selection is required';
      if (data.radiation?.option === 'Yes' && !data.radiation?.description?.trim()) errors['radiation.description'] = 'Please specify radiation';
      // Alleviating
      if (!data.alleviating?.option) errors['alleviating.option'] = 'Alleviating factors selection is required';
      if (data.alleviating?.option === 'Yes' && (!data.alleviating?.entries || data.alleviating.entries.length === 0)) errors['alleviating.entries'] = 'Add at least one alleviating factor';
      // Timing
      if (!data.timing?.option) errors['timing.option'] = 'Timing selection is required';
      // Exacerbating
      if (!data.exacerbating?.option) errors['exacerbating.option'] = 'Exacerbating factors selection is required';
      if (data.exacerbating?.option === 'Yes' && (!data.exacerbating?.entries || data.exacerbating.entries.length === 0)) errors['exacerbating.entries'] = 'Add at least one exacerbating factor';
      // Severity
      if (!data.severity?.option) errors['severity.option'] = 'Severity selection is required';
      if (data.severity?.option && data.severity.option !== 'N/A' && !data.severity?.scale) errors['severity.scale'] = 'Please select a scale';
      if (data.severity?.option && data.severity.option !== 'N/A' && data.severity?.scale && !data.severity?.value && data.severity?.value !== 0) errors['severity.value'] = 'Please rate severity';
      break;
    }
    case 4: {
      // Medical conditions
      if (!data.medicalConditions?.hasConditions) errors['medicalConditions.hasConditions'] = 'Please select Yes or No';
      if (data.medicalConditions?.hasConditions === 'Yes') {
        if (!data.medicalConditions?.entries || data.medicalConditions.entries.length === 0)
          errors['medicalConditions.entries'] = 'Add at least one condition';
        else if (data.medicalConditions.entries.some(e => !isValidDate(e.date)))
          errors['medicalConditions.entries'] = `One or more dates are invalid (1900-${MAX_VALID_YEAR})`
      }
      // Surgical history
      if (!data.surgicalHistory?.hasSurgery) errors['surgicalHistory.hasSurgery'] = 'Please select Yes or No';
      if (data.surgicalHistory?.hasSurgery === 'Yes') {
        if (!data.surgicalHistory?.entries || data.surgicalHistory.entries.length === 0)
          errors['surgicalHistory.entries'] = 'Add at least one procedure';
        else if (data.surgicalHistory.entries.some(e => !isValidDate(e.date)))
          errors['surgicalHistory.entries'] = `One or more dates are invalid (1900-${MAX_VALID_YEAR})`
      }
      // Hospitalisations
      if (!data.hospitalisations?.hasHospitalisations) errors['hospitalisations.hasHospitalisations'] = 'Please select Yes or No';
      if (data.hospitalisations?.hasHospitalisations === 'Yes') {
        if (!data.hospitalisations?.entries || data.hospitalisations.entries.length === 0)
          errors['hospitalisations.entries'] = 'Add at least one hospitalisation';
        else if (data.hospitalisations.entries.some(e => !isValidDate(e.date)))
          errors['hospitalisations.entries'] = `One or more dates are invalid (1900-${MAX_VALID_YEAR})`
      }
      // Psychiatric
      if (!data.psychiatricHistory?.hasPsychiatric) errors['psychiatricHistory.hasPsychiatric'] = 'Please select Yes or No';
      if (data.psychiatricHistory?.hasPsychiatric === 'Yes' && (!data.psychiatricHistory?.entries || data.psychiatricHistory.entries.length === 0))
        errors['psychiatricHistory.entries'] = 'Add at least one entry';
      // Obs/Gynae (Female only)
      if (data.gender === 'Female') {
        if (!data.obsGynae?.hasObsGynae) errors['obsGynae.hasObsGynae'] = 'Please select Yes or No';
        if (data.obsGynae?.hasObsGynae === 'Yes') {
          if (!data.obsGynae?.menopausalStatus) errors['obsGynae.menopausalStatus'] = 'Menopausal status is required';
          if (data.obsGynae?.menopausalStatus && data.obsGynae.menopausalStatus !== 'Post') {
            if (!data.obsGynae?.lmp) errors['obsGynae.lmp'] = 'LMP is required';
            else if (!isValidDate(data.obsGynae.lmp)) errors['obsGynae.lmp'] = `Invalid date (1900-${MAX_VALID_YEAR})`;
          }
          if (data.obsGynae?.gravida === undefined || data.obsGynae?.gravida === '') errors['obsGynae.gravida'] = 'Gravida is required';
          if (data.obsGynae?.para === undefined || data.obsGynae?.para === '') errors['obsGynae.para'] = 'Para is required';
          if (!data.obsGynae?.complications) errors['obsGynae.complications'] = 'Complications selection is required';
          if (data.obsGynae?.complications === 'Yes' && !data.obsGynae?.complicationsDetail?.trim()) errors['obsGynae.complicationsDetail'] = 'Please describe complications';
        }
      }
      break;
    }
    case 5: {
      if (!data.hasDrugs) errors.hasDrugs = 'Please select Yes or No';
      if (data.hasDrugs === 'Yes' && (!data.entries || data.entries.length === 0))
        errors.entries = 'Add at least one medication';
      break;
    }
    case 6: {
      if (!data.hasAllergies) errors.hasAllergies = 'Please select Yes or No';
      if (data.hasAllergies === 'Yes' && (!data.entries || data.entries.length === 0))
        errors.entries = 'Add at least one allergy';
      break;
    }
    case 7: {
      if (!data.hasFamilyHistory) errors.hasFamilyHistory = 'Please select Yes, No, or Unknown';
      if (data.hasFamilyHistory === 'Yes' && (!data.entries || data.entries.length === 0))
        errors.entries = 'Add at least one family history entry';
      break;
    }
    case 8: {
      if (!data.smoker) errors.smoker = 'Smoking status is required';
      if ((data.smoker === 'Yes' || data.smoker === 'Ex-Smoker')) {
        if (!data.smokerSince) errors.smokerSince = 'Since date is required';
        else if (!isValidMonthYear(data.smokerSince)) errors.smokerSince = `Invalid date (1900-${MAX_VALID_YEAR})`
      }
      if (data.smoker === 'Ex-Smoker') {
        if (!data.smokerTill) errors.smokerTill = 'Till date is required';
        else if (!isValidMonthYear(data.smokerTill)) errors.smokerTill = `Invalid date (1900-${MAX_VALID_YEAR})`
      }
      if (data.smoker === 'Yes' && !data.smokerFrequency?.trim()) errors.smokerFrequency = 'Frequency is required';
      if (!data.alcohol) errors.alcohol = 'Alcohol status is required';
      if (data.alcohol === 'Yes') {
        if (!data.alcoholSince) errors.alcoholSince = 'Since date is required';
        else if (!isValidMonthYear(data.alcoholSince)) errors.alcoholSince = `Invalid date (1900-${MAX_VALID_YEAR})`
      }
      if (data.alcohol === 'Yes' && !data.alcoholFrequency?.trim()) errors.alcoholFrequency = 'Frequency is required';
      if (!data.occupation) errors.occupation = 'Occupation is required';
      if (data.occupation === 'Employed' && !data.employment?.trim()) errors.employment = 'Employment details required';
      if (!data.livingSituation) errors.livingSituation = 'Living situation is required';
      if (!data.exercise) errors.exercise = 'Exercise status is required';
      if (data.exercise === 'Yes' && !data.exerciseType) errors.exerciseType = 'Exercise type is required';
      if (data.exercise === 'Yes' && !data.exerciseFrequency) errors.exerciseFrequency = 'Exercise frequency is required';
      if (!data.diet) errors.diet = 'Diet status is required';
      if (data.diet === 'Yes' && !data.dietWhat?.trim()) errors.dietWhat = 'Please describe diet';
      if (!data.travelHistory) errors.travelHistory = 'Travel history status is required';
      if (data.travelHistory === 'Yes') {
        if (!data.travelEntries || data.travelEntries.length === 0) errors.travelEntries = 'Add at least one travel entry';
        else if (data.travelEntries.some(e => !isValidMonthYear(e.when))) errors.travelEntries = `One or more dates are invalid (1900-${MAX_VALID_YEAR})`
      }
      break;
    }
    case 9:
      // No hard block on systems review
      break;
    default:
      break;
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
